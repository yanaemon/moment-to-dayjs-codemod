import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
dayjs.extend(weekday);

const main = () => {
  dayjs().weekday(-7);
  dayjs().weekday(7);
};

main();
