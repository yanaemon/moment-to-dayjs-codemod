// @ts-ignore
import { defineTest } from 'jscodeshift/dist/testUtils'

defineTest(__dirname, 'transform', null, 'transform',  { parser: "ts" })
defineTest(__dirname, 'transform', null, 'require',  { parser: "ts" })
describe('plugins', () => {
  defineTest(__dirname, 'transform', null, 'plugins/isoWeek',  { parser: "ts" })
  defineTest(__dirname, 'transform', null, 'plugins/minMax',  { parser: "ts" })
})
