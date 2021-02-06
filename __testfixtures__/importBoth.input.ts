import * as dayjs from 'dayjs';
import moment from 'moment';

const main = () => {
  dayjs('2021-01-01').toDate();
  moment('2021-01-01').toDate();
};

main();
