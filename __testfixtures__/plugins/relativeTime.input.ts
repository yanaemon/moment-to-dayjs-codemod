import moment from 'moment';

const main = () => {
  moment().from(moment('1990-01-01'));
  moment().from(moment('1990-01-01'), true);
  moment().fromNow();
  moment().to(moment('1990-01-01'));
  moment().toNow();
};

main();
