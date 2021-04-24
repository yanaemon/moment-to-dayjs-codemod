import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const main = () => {
  dayjs('2010-10-20').isSameOrAfter('2010-10-19', 'year');
  dayjs('2010-10-20').isSameOrAfter('2010-10-19', 'year');
};

main();
