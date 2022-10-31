import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const main = () => {
  dayjs().from(dayjs('1990-01-01'));
  dayjs().from(dayjs('1990-01-01'), true);
  dayjs().fromNow();
  dayjs().to(dayjs('1990-01-01'));
  dayjs().toNow();
};

main();
