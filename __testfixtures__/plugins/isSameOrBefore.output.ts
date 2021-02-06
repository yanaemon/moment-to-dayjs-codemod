import * as dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

const main = () => {
  dayjs('2010-10-20').isSameOrBefore('2010-10-19', 'year');
};

main();
