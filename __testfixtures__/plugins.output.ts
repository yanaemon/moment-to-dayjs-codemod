import * as dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);

const main = () => {
  // isoWeek
  dayjs().isoWeek();
  dayjs().isoWeekday();
  dayjs().isoWeekYear();

  // minMax
  dayjs.max(dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01'));
  dayjs.min([dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01')]);
}

main();