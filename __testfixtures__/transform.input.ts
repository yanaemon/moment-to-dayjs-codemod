import moment from 'moment';

const main = () => {
  // parameters
  moment().add(1, 'day').toDate();
  moment().add(1, 'days').toDate();
  const days = 1;
  moment().add(days, 'day').toDate();

  // get
  moment().year();
  moment().month();
  moment().day();
  moment().hour();
  moment().minute();
  moment().second();

  // get - plural
  moment().years();
  moment().months();
  moment().days();
  moment().hours();
  moment().minutes();
  moment().seconds();

  // set
  moment().set('day', 1);
  moment().set('days', 1);

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
};

main();
