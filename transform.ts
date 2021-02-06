import { Transform, FileInfo, API } from 'jscodeshift'

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

const transform: Transform = (file: FileInfo, api: API) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const dayjsImportDeclaration = j.importDeclaration.from({
    source: j.literal('dayjs'),
    specifiers: [
      j.importNamespaceSpecifier.from({
        id: j.identifier('*'),
        local: j.identifier('dayjs')
      })
    ],
  })

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
  ).filter(path => {
    const d: any = path?.node?.declarations?.[0]
    return d?.init?.callee?.name === 'require' && d?.id?.name === 'moment'
  })
  mRequire.replaceWith(() => dayjsImportDeclaration)

  // before : add({ days: 1 }) / subtract({ day: 1 })
  // after  : add(1, 'day') / subtract(1, 'day')
  const moments = root.find(j.CallExpression, {
    callee: {
      name: 'moment',
    },
  })
  const replaceParents = (path: any): any => {
    const type = path?.value?.type?.toString()
    if (type === j.CallExpression.toString()) {
      const callee = path.node?.callee
      const args = path.node?.arguments
      if (args[0]?.properties?.length > 0) {
        const key = args[0].properties[0].key.name
        const value = args[0].properties[0].value
        if (units.includes(key)) {
          path.replace(j.callExpression.from({
            callee,
            arguments: [
              value,
              j.literal(toSingle(key)),
            ]
          }))
        }
      } else {
        const newArgs: any = []
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
  moments.replaceWith(path => {
    replaceParents(path)
    return j.callExpression.from({
      callee: j.identifier('dayjs'),
      arguments: path.node?.arguments,
    })
  })

  return root.toSource({quote: 'single'})
}

export default transform