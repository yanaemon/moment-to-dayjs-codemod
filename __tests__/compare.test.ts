import dayjs from 'dayjs';
import moment from 'moment';

const now = new Date();

test.each([
  [moment(now).add({ day: 1 }), dayjs(now).add(1, 'day')],
  [moment(now).add({ days: 1 }), dayjs(now).add(1, 'day')],
  [moment(now).add(1, 'day'), dayjs(now).add(1, 'day')],
  [moment(now).add(1, 'days'), dayjs(now).add(1, 'day')],
])('parameters %#', (m, d) => {
  expect(d.toDate()).toEqual(m.toDate());
});

test.each([
  [moment(now).add(1, 'year'), dayjs(now).add(1, 'year')],
  [moment(now).add(1, 'years'), dayjs(now).add(1, 'year')],
  [moment(now).add(1, 'month'), dayjs(now).add(1, 'month')],
  [moment(now).add(1, 'months'), dayjs(now).add(1, 'month')],
  [moment(now).add(1, 'week'), dayjs(now).add(1, 'week')],
  [moment(now).add(1, 'weeks'), dayjs(now).add(1, 'week')],
  [moment(now).add(1, 'day'), dayjs(now).add(1, 'day')],
  [moment(now).add(1, 'days'), dayjs(now).add(1, 'day')],
  [moment(now).add(1, 'hour'), dayjs(now).add(1, 'hour')],
  [moment(now).add(1, 'hours'), dayjs(now).add(1, 'hour')],
  [moment(now).add(1, 'minute'), dayjs(now).add(1, 'minute')],
  [moment(now).add(1, 'minutes'), dayjs(now).add(1, 'minute')],
  [moment(now).add(1, 'second'), dayjs(now).add(1, 'second')],
  [moment(now).add(1, 'seconds'), dayjs(now).add(1, 'second')],
])('units %#', (m, d) => {
  expect(d.toDate()).toEqual(m.toDate());
});

import arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);

test.each([[2010, 1, 14, 15, 25, 50, 125]])('arraySupport %#', (args) => {
  expect(dayjs(args).toDate()).toEqual(moment(args).toDate());
});

import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

test.each([
  [
    moment('2010-10-20').isBetween('2010-10-19', moment('2010-10-25'), 'year'),
    dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25'), 'year'),
  ],
  [
    moment('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '[)'),
    dayjs('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '[)'),
  ],
])('isBetween %#', (m, d) => {
  expect(d).toBe(m);
});

import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

test.each([
  [moment(now).isoWeek(), dayjs(now).isoWeek()],
  [moment(now).isoWeekday(), dayjs(now).isoWeekday()],
  [moment(now).isoWeekYear(), dayjs(now).isoWeekYear()],
])('isoWeek %#', (m, d) => {
  expect(d).toBe(m);
});

import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

test.each([
  [
    moment('2010-10-20').isSameOrAfter('2010-10-19', 'year'),
    dayjs('2010-10-20').isSameOrAfter('2010-10-19', 'year'),
  ],
  [
    moment('2010-10-20').isSameOrAfter('2010-10-19', 'years'),
    dayjs('2010-10-20').isSameOrAfter('2010-10-19', 'year'),
  ],
])('isSameOrAfter %#', (m, d) => {
  expect(d).toBe(m);
});

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

test.each([
  [
    moment('2010-10-20').isSameOrBefore('2010-10-19', 'year'),
    dayjs('2010-10-20').isSameOrBefore('2010-10-19', 'year'),
  ],
  [
    moment('2010-10-20').isSameOrBefore('2010-10-19', 'years'),
    dayjs('2010-10-20').isSameOrBefore('2010-10-19', 'year'),
  ],
])('isSameOrBefore %#', (m, d) => {
  expect(d).toBe(m);
});

import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);

test.each([
  [
    moment.max(moment(now), moment('2018-01-01'), moment('2019-01-01')),
    dayjs.max(dayjs(now), dayjs('2018-01-01'), dayjs('2019-01-01')),
  ],
  [
    moment.min([moment(now), moment('2018-01-01'), moment('2019-01-01')]),
    dayjs.min([dayjs(now), dayjs('2018-01-01'), dayjs('2019-01-01')]),
  ],
])('minMax %#', (m, d) => {
  expect(d.toDate()).toEqual(m.toDate());
});

import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);

test.each([[{ year: 2010, month: 1, day: 12 }]])('objectSupport %#', (args) => {
  // @ts-ignore: No overload matches this call.
  expect(dayjs(args).toDate()).toEqual(moment(args).toDate());
});

import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

test.each([
  [moment(now).format(), dayjs(now).format()],
  [moment.utc().format(), dayjs.utc().format()],
  [moment(now).utc().format(), dayjs(now).utc().format()],
  [moment.utc().isUTC(), dayjs.utc().isUTC()],
  [moment.utc().local().format(), dayjs.utc().local().format()],
  [
    moment.utc('2018-01-01', 'YYYY-MM-DD').format(),
    dayjs.utc('2018-01-01', 'YYYY-MM-DD').format(),
  ],
])('utc %#', (m, d) => {
  expect(d).toBe(m);
});

import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

test.each([
  [moment(now).weekday(-7), dayjs(now).weekday(-7)],
  [moment(now).weekday(7), dayjs(now).weekday(7)],
])('weekday', (m, d) => {
  expect(d.toDate()).toEqual(m.toDate());
});
