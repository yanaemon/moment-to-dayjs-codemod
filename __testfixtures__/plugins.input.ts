import moment from 'moment'

const main = () => {
  // isoWeek
  moment().isoWeek();
  moment().isoWeekday();
  moment().isoWeekYear();

  // minMax
  moment.max(moment(), moment('2018-01-01'), moment('2019-01-01'));
  moment.min([moment(), moment('2018-01-01'), moment('2019-01-01')]);
}

main();