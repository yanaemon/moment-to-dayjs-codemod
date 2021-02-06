import * as dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);

const main = () => {
  dayjs.max(dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01'));
  dayjs.min([dayjs(), dayjs('2018-01-01'), dayjs('2019-01-01')]);
}

main();