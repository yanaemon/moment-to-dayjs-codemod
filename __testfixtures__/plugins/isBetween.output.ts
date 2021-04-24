import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const main = () => {
  dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25'), 'year');
  dayjs('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '[)');
};

main();
