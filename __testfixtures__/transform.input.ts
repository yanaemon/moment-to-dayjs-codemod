import moment from 'moment';

const main = () => {
  // parameters
  moment().add({ day: 1 }).toDate();
  moment().add({ days: 1}).toDate();
  moment().add(1, 'day').toDate();
  moment().add(1, 'days').toDate();
  const num = 1
  moment().add({ day: num }).toDate();
  const days = 1
  moment().add({ days }).toDate();

  // units
  moment().add(1, 'year').toDate();
  moment().add(1, 'years').toDate();
  moment().add(1, 'month').toDate();
  moment().add(1, 'months').toDate();
  moment().add(1, 'week').toDate();
  moment().add(1, 'weeks').toDate();
  moment().add(1, 'day').toDate();
  moment().add(1, 'days').toDate();
  moment().add(1, 'hour').toDate();
  moment().add(1, 'hours').toDate();
  moment().add(1, 'minute').toDate();
  moment().add(1, 'minutes').toDate();
  moment().add(1, 'second').toDate();
  moment().add(1, 'seconds').toDate();
}

main();