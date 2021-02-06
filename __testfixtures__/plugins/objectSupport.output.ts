import * as dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);

const main = () => {
  dayjs({
    year: 2010,
    month: 1,
    day: 12,
  });
};

main();
