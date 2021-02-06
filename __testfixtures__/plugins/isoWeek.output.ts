import * as dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

const main = () => {
  dayjs().isoWeek();
  dayjs().isoWeekday();
  dayjs().isoWeekYear();
};

main();
