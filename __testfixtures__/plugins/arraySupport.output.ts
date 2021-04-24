import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);

const main = () => {
  dayjs([2010, 1, 14, 15, 25, 50, 125]);
};

main();
