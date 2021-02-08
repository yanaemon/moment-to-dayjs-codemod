import moment from 'moment';

const main = () => {
  moment().format();
  moment.utc().format();
  moment().utc().format();
  moment.utc().isUTC();
  moment.utc().local().format();
  moment.utc('2018-01-01', 'YYYY-MM-DD');
};

main();
