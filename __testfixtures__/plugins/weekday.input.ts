import moment from 'moment';

const main = () => {
  moment().weekday(-7);
  moment().weekday(7);
};

main();
