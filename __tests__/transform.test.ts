// @ts-ignore
import { defineTest } from 'jscodeshift/dist/testUtils';

defineTest(__dirname, 'transform', null, 'transform', { parser: 'ts' });
defineTest(__dirname, 'transform', null, 'require', { parser: 'ts' });
describe('plugins', () => {
  defineTest(__dirname, 'transform', null, 'plugins/isBetween', {
    parser: 'ts',
  });
  defineTest(__dirname, 'transform', null, 'plugins/isSameOrAfter', {
    parser: 'ts',
  });
  defineTest(__dirname, 'transform', null, 'plugins/isSameOrBefore', {
    parser: 'ts',
  });
  defineTest(__dirname, 'transform', null, 'plugins/isoWeek', { parser: 'ts' });
  defineTest(__dirname, 'transform', null, 'plugins/minMax', { parser: 'ts' });
  defineTest(__dirname, 'transform', null, 'plugins/utc', { parser: 'ts' });
  defineTest(__dirname, 'transform', null, 'plugins/weekday', { parser: 'ts' });
});
