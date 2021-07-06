import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
dayjs.extend(objectSupport);

const main = () => {
  dayjs({
    year: 2010,
    month: 1,
    day: 12,
  });

  dayjs().set({
    day: 1,
  });
  dayjs().set({
    day: 1,
  });
  dayjs().set({
    year: 2010,
    month: 1,
    day: 12,
  });
  const num = 1;
  dayjs().set({
    day: num,
  });
  const days = 1;
  dayjs().set({
    day: days,
  });

  dayjs().add({
    day: 1,
  });
  dayjs().add({
    day: 1,
  });
};

main();
