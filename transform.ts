import { API, ASTPath, FileInfo, Transform } from 'jscodeshift';
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

const findProperty = (path: ASTPath<any>, properties: string[]) => {
  const propertyName = path.node?.callee?.property?.name;
  return properties.includes(propertyName);
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
      return (
        callee?.type?.toString() === 'Identifier' &&
        callee?.name === 'moment' &&
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
      specifiers: [
        j.importNamespaceSpecifier.from({
          local: j.identifier('dayjs'),
        }),
      ],
    });
  };

  const foundPlugins = new Set<string>();
  const checkPlugins = (path: ASTPath<any>) => {
    plugins.forEach((plugin) => {
      if (
        (plugin.properties && findProperty(path, plugin.properties)) ||
        plugin?.find?.(path)
      ) {
        if (plugin.notImplemented) {
          throw new Error('Not implemented plugin found.');
        }
        foundPlugins.add(plugin.name);
      }
    });
  };

  // before : import moment from 'moment'
  // after  : import * as dayjs from 'dayjs
  root
    .find(j.ImportDeclaration, {
      source: {
        value: 'moment',
      },
    })
    .replaceWith(dayjsImportDeclaration);

  // before : const moment = require('moment')
  // after  : import * as dayjs from 'dayjs'
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
        const key = args[0].properties[0].key.name;
        const value = args[0].properties[0].value;
        if (units.includes(key)) {
          replacement = j.callExpression.from({
            ...path.node,
            callee,
            arguments: [value, j.literal(toSingle(key))],
          });
        }
      } else {
        const newArgs: K.ExpressionKind[] = [];
        let needReplace = false;
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
            callee,
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
