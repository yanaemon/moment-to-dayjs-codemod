import {
  API,
  ASTPath,
  FileInfo,
  Transform,
} from 'jscodeshift'
import * as K from 'ast-types/gen/kinds'

/**
 * @param str unit string
 * @return single unit (e.g. days => day)
 */
const toSingle = (str: string) => str.replace(/s$/, '')

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
]

const multipleUnits = [
  'years',
  'months',
  'weeks',
  'dates',
  'days',
  'hours',
  'minutes',
  'seconds',
]

const units = [ ...singleUnits, ...multipleUnits ]

const plugins = [
  {
    name: 'minMax',
    find: (path: ASTPath<any>) => {
      const propertyName = path.node?.callee?.property?.name
      return ['max', 'min'].includes(propertyName)
    },
  },
]

const transform: Transform = (file: FileInfo, api: API) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const dayjsImportDeclaration = j.importDeclaration.from({
    source: j.literal('dayjs'),
    specifiers: [
      j.importNamespaceSpecifier.from({
        local: j.identifier('dayjs')
      })
    ],
  })

  const foundPlugins = new Set<string>()

  // before : import moment from 'moment'
  // after  : import * as dayjs from 'dayjs
  const mImport = root.find(
    j.ImportDeclaration,
    {
      source: {
        value: 'moment',
      }
    }
  )
  mImport.replaceWith(() => dayjsImportDeclaration)

  // before : const moment = require('moment')
  // after  : import * as dayjs from 'dayjs'
  const mRequire = root.find(
    j.VariableDeclaration
  ).filter((path: ASTPath<any>) => {
    const d = path?.node?.declarations?.[0]
    return d?.init?.callee?.name === 'require' && d?.id?.name === 'moment'
  })
  mRequire.replaceWith(() => dayjsImportDeclaration)

  // before : moment.xxx()
  // after  : dayjs.xxx()
  const momentStatics = root.find(j.CallExpression, {
    callee: {
      object: { name: 'moment' },
    },
  })
  momentStatics.replaceWith((path: ASTPath<any>) => {
    plugins.forEach(plugin => {
      if (plugin.find(path)) {
        foundPlugins.add(plugin.name)
      }
    })
    return j.callExpression.from({
      ...path.node,
      callee: j.memberExpression.from({
        ...path.node.callee,
        object: j.identifier('dayjs'),
      }),
    })
  })

  // before : moment().xxx({ days: 1 })]
  // after  : dayjs().xxx(1, 'day')
  const momentVars = root.find(j.CallExpression, {
    callee: {
      name: 'moment',
    },
  })
  const replaceParents = (path: ASTPath<any>) => {
    const type = path?.value?.type?.toString()
    if (type === j.CallExpression.toString()) {
      plugins.forEach(plugin => {
        if (plugin.find(path)) {
          foundPlugins.add(plugin.name)
        }
      })

      const callee = path.node?.callee
      const args = path.node?.arguments
      if (args[0]?.properties?.length > 0) {
        const key = args[0].properties[0].key.name
        const value = args[0].properties[0].value
        if (units.includes(key)) {
          path.replace(j.callExpression.from({
            ...path.node,
            callee,
            arguments: [
              value,
              j.literal(toSingle(key)),
            ]
          }))
        }
      } else {
        const newArgs: K.ExpressionKind[] = []
        let needReplace = false
        args.forEach((a: any) => {
          const includeUnit = units.includes(a.value)
          if (includeUnit) {
            needReplace = true
          }
          newArgs.push(includeUnit ? j.literal(toSingle(a.value)) : a)
        })
        if (needReplace) {
          path.replace(j.callExpression.from({
            ...path.node,
            callee,
            arguments: newArgs,
          }))
        }
      }
    }
    if (path?.parentPath) {
      replaceParents(path.parentPath)
    }
  }
  momentVars.replaceWith(path => {
    replaceParents(path)
    return j.callExpression.from({
      ...path.node,
      callee: j.identifier('dayjs'),
    })
  })

  // plugins
  const dImport = root.find(j.ImportDeclaration,
    {
      source: {
        value: 'dayjs',
      }
    }
  ).at(-1).get()
  Array.from(foundPlugins).reverse().forEach(p => {
    dImport.insertAfter(j.expressionStatement.from({
      expression: j.callExpression.from({
        callee: j.memberExpression.from({
          object: j.identifier('dayjs'),
          property: j.identifier('extend'),
        }),
        arguments: [j.identifier(p)],
      }),
    }))
    dImport.insertAfter(j.importDeclaration.from({
      source: j.literal(`dayjs/plugin/${p}`),
      specifiers: [
        j.importDefaultSpecifier.from({
          local: j.identifier(p)
        })
      ],
    }))
  })

  return root.toSource({quote: 'single'})
}

export default transform