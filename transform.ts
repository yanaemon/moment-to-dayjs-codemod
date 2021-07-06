import { API, ASTPath, FileInfo, JSCodeshift, Transform } from 'jscodeshift';
import * as K from 'ast-types/gen/kinds';

/**
 * @param str unit string
 * @return single unit (e.g. days => day)
 */
const toSingle = (str: string) => str.replace(/s$/, '');

// see: https://day.js.org/
const singleUnits = [
  'year',
  'month',
  'week',
  'date',
  'day',
  'hour',
  'minute',
  'second',
];

const multipleUnits = [
  'years',
  'months',
  'weeks',
  'dates',
  'days',
  'hours',
  'minutes',
  'seconds',
];

const units = [...singleUnits, ...multipleUnits];

const getPropertyName = (path: ASTPath<any>) =>
  path.node?.callee?.property?.name;
const includesProperties = (path: ASTPath<any>, properties: string[]) => {
  const propertyName = getPropertyName(path);
  return properties.includes(propertyName);
};

const replaceObjectArgument = (j: JSCodeshift, path: ASTPath<any>) => {
  const callee = path.node?.callee;
  const args = path.node?.arguments;
  if (!args?.length) {
    return null;
  }

  const needReplace = args.some((a: any) =>
    units.includes(a.properties[0].key.name)
  );
  if (!needReplace) {
    return null;
  }

  const newArgs = args.map((a: any) => {
    return {
      ...a,
      properties: a.properties.map((p: any) => {
        return {
          ...p,
          key: j.identifier(toSingle(p.key.name)),
        };
      }),
    };
  });

  return j.callExpression.from({
    ...path.node,
    callee,
    arguments: newArgs,
  });
};

type Plugin = {
  name: string;
  properties?: string[];
  find?: (path: ASTPath<any>) => boolean;
  notImplemented?: boolean;
};
const plugins: Plugin[] = [
  {
    name: 'arraySupport',
    find: (path: ASTPath<any>) => {
      const callee = path.node?.callee;
      const args = path.node?.arguments;
      return (
        callee?.type?.toString() === 'Identifier' &&
        callee?.name === 'moment' &&
        args?.[0]?.type?.toString() === 'ArrayExpression'
      );
    },
  },
  {
    name: 'isBetween',
    properties: ['isBetween'],
  },
  {
    name: 'isSameOrAfter',
    properties: ['isSameOrAfter'],
  },
  {
    name: 'isSameOrBefore',
    properties: ['isSameOrBefore'],
  },
  {
    name: 'isoWeek',
    properties: ['isoWeek', 'isoWeekday', 'isoWeekYear'],
  },
  {
    name: 'minMax',
    properties: ['max', 'min'],
  },
  {
    name: 'objectSupport',
    find: (path: ASTPath<any>) => {
      const callee = path.node?.callee;
      const args = path.node?.arguments;
      const isMomentConstructor =
        callee?.type?.toString() === 'Identifier' && callee?.name === 'moment';
      const isObjectSupportFunction = [
        'utc',
        'set',
        'add',
        'subtract',
      ].includes(getPropertyName(path));
      return (
        (isMomentConstructor || isObjectSupportFunction) &&
        args?.[0]?.type?.toString() === 'ObjectExpression'
      );
    },
  },
  {
    name: 'updateLocale',
    properties: ['updateLocale'],
    notImplemented: true,
  },
  {
    name: 'utc',
    properties: ['utc'],
  },
  {
    name: 'weekday',
    properties: ['weekday'],
    find: (path: ASTPath<any>) => {
      const propertyName = getPropertyName(path);
      const args = path.node?.arguments;
      return (
        ['get', 'set'].includes(propertyName) &&
        ['weekday', 'weekdays'].includes(args?.[0]?.value)
      );
    },
  },
];

const transform: Transform = (file: FileInfo, api: API) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const dayjsImport = root.find(j.ImportDeclaration, {
    source: {
      value: 'dayjs',
    },
  });
  let hasDayjsImport = dayjsImport.nodes().length > 0;
  const dayjsImportDeclaration = () => {
    if (hasDayjsImport) return;
    hasDayjsImport = true;
    return j.importDeclaration.from({
      source: j.literal('dayjs'),
      specifiers: [j.importDefaultSpecifier(j.identifier('dayjs'))],
    });
  };

  const foundPlugins = new Set<string>();
  const checkPlugins = (path: ASTPath<any>) => {
    plugins.forEach((plugin) => {
      if (
        (plugin.properties && includesProperties(path, plugin.properties)) ||
        plugin?.find?.(path)
      ) {
        if (plugin.notImplemented) {
          throw new Error(`Not implemented plugin '${plugin.name}' found.`);
        }
        foundPlugins.add(plugin.name);
        return;
      }
    });
  };

  // before : import moment from 'moment'
  // after  : import dayjs from 'dayjs
  root
    .find(j.ImportDeclaration, {
      source: {
        value: 'moment',
      },
    })
    .replaceWith(dayjsImportDeclaration);

  // before : const moment = require('moment')
  // after  : import dayjs from 'dayjs'
  root
    .find(j.VariableDeclaration)
    .filter((path: ASTPath<any>) => {
      const d = path?.node?.declarations?.[0];
      return d?.init?.callee?.name === 'require' && d?.id?.name === 'moment';
    })
    .replaceWith(dayjsImportDeclaration);

  // before : moment.xxx()
  // after  : dayjs.xxx()
  root
    .find(j.CallExpression, {
      callee: {
        object: { name: 'moment' },
      },
    })
    .replaceWith((path: ASTPath<any>) => {
      checkPlugins(path);
      return j.callExpression.from({
        ...path.node,
        callee: j.memberExpression.from({
          ...path.node.callee,
          object: j.identifier('dayjs'),
        }),
      });
    });

  // before : moment().xxx({ days: 1 })
  // after  : dayjs().xxx(1, 'day')
  const replaceParents = (path: ASTPath<any>) => {
    const type = path?.value?.type?.toString();
    let replacement: any = null;
    if (type === j.CallExpression.toString()) {
      checkPlugins(path);

      const callee = path.node?.callee;
      const args = path.node?.arguments;
      if (args[0]?.properties?.length > 0) {
        replacement = replaceObjectArgument(j, path);
      } else {
        let needReplace = false;

        // property
        let newCallee = callee;
        const propertyName = getPropertyName(path);
        if (multipleUnits.includes(propertyName)) {
          needReplace = true;
          newCallee = j.memberExpression.from({
            ...path.node.callee,
            property: j.identifier(toSingle(propertyName)),
          });
        }

        // args
        const newArgs: K.ExpressionKind[] = [];
        args.forEach((a: any) => {
          const includeUnit = units.includes(a.value);
          if (includeUnit) {
            needReplace = true;
          }
          newArgs.push(includeUnit ? j.literal(toSingle(a.value)) : a);
        });

        if (needReplace) {
          replacement = j.callExpression.from({
            ...path.node,
            callee: newCallee,
            arguments: newArgs,
          });
        }
      }
    }
    if (path?.parentPath) {
      replaceParents(path.parentPath);
    }
    if (replacement) {
      path.replace(replacement);
    }
  };
  root
    .find(j.CallExpression, {
      callee: {
        name: 'moment',
      },
    })
    .replaceWith((path: ASTPath<any>) => {
      checkPlugins(path);
      replaceParents(path.parentPath);
      return j.callExpression.from({
        ...path.node,
        callee: j.identifier('dayjs'),
      });
    });
  // NOTE: replace again recursive replacement does not works is some cases.
  root
    .find(j.CallExpression, {
      callee: {
        name: 'moment',
      },
    })
    .replaceWith((path: ASTPath<any>) => {
      checkPlugins(path);
      return j.callExpression.from({
        ...path.node,
        callee: j.identifier('dayjs'),
      });
    });

  // plugins
  const dImports = root.find(j.ImportDeclaration, {
    source: {
      value: 'dayjs',
    },
  });
  const dImport = dImports.nodes().length > 0 && dImports.at(-1).get();
  Array.from(foundPlugins)
    .sort()
    .reverse()
    .forEach((p) => {
      dImport?.insertAfter(
        j.expressionStatement.from({
          expression: j.callExpression.from({
            callee: j.memberExpression.from({
              object: j.identifier('dayjs'),
              property: j.identifier('extend'),
            }),
            arguments: [j.identifier(p)],
          }),
        })
      );
      dImport.insertAfter(
        j.importDeclaration.from({
          source: j.literal(`dayjs/plugin/${p}`),
          specifiers: [
            j.importDefaultSpecifier.from({
              local: j.identifier(p),
            }),
          ],
        })
      );
    });

  // type
  root
    .find(j.TSTypeReference, (value) =>
      [value.typeName?.name || value.typeName?.right.name].some((name) =>
        ['Moment', 'MomentInput'].includes(name)
      )
    )
    .replaceWith(() => {
      return j.tsTypeReference.from({
        typeName: j.tsQualifiedName.from({
          left: j.identifier('dayjs'),
          right: j.identifier('Dayjs'),
        }),
      });
    });

  return root.toSource({ quote: 'single' });
};

export default transform;
