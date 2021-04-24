import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const main = () => {
  dayjs().format();
  dayjs.utc().format();
  dayjs().utc().format();
  dayjs.utc().isUTC();
  dayjs.utc().local().format();
  dayjs.utc('2018-01-01', 'YYYY-MM-DD');
};

main();
