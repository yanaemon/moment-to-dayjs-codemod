import moment from 'moment';

const main = () => {
  moment({
    year: 2010,
    month: 1,
    day: 12,
  });

  moment().add({ day: 1 });
  moment().add({ days: 1 });
  const num = 1;
  moment().add({ day: num });
  const days = 1;
  moment().add({ days });

  moment().set({ day: 1 });
  moment().set({ days: 1 });
};

main();
