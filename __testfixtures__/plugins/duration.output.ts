import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const main = () => {
  dayjs.duration(100);
  dayjs.duration(100).humanize();
};

main();
