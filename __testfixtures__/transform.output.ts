import dayjs from 'dayjs';

const main = () => {
  // parameters
  dayjs().add(1, 'day').toDate();
  dayjs().add(1, 'day').toDate();
  dayjs().add(1, 'day').toDate();
  dayjs().add(1, 'day').toDate();
  const num = 1;
  dayjs().add(num, 'day').toDate();
  const days = 1;
  dayjs().add(days, 'day').toDate();

  // set
  dayjs().set('day', 1);
  dayjs().set('day', 1);
  dayjs().set('day', 1);
  dayjs().set('day', 1);

  // units
  dayjs().add(1, 'year').toDate();
  dayjs().add(1, 'year').toDate();
  dayjs().add(1, 'month').toDate();
  dayjs().add(1, 'month').toDate();
  dayjs().add(1, 'week').toDate();
  dayjs().add(1, 'week').toDate();
  dayjs().add(1, 'day').toDate();
  dayjs().add(1, 'day').toDate();
  dayjs().add(1, 'hour').toDate();
  dayjs().add(1, 'hour').toDate();
  dayjs().add(1, 'minute').toDate();
  dayjs().add(1, 'minute').toDate();
  dayjs().add(1, 'second').toDate();
  dayjs().add(1, 'second').toDate();
};

main();
