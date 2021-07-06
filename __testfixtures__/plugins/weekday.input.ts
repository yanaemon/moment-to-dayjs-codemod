import moment from 'moment';

const main = () => {
  moment().weekday(-7);
  moment().weekday(7);

  moment().get('weekday');
  moment().get('weekdays');

  moment().set('weekday', 1);
  moment().set('weekdays', 1);
};

main();
