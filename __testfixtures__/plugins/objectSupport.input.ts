import moment from 'moment';

const main = () => {
  moment({
    year: 2010,
    month: 1,
    day: 12,
  });

  moment().set({ day: 1 });
  moment().set({ days: 1 });
  moment().set({
    years: 2010,
    months: 1,
    days: 12,
  });
  const num = 1;
  moment().set({ day: num });
  const days = 1;
  moment().set({ days });

  moment().add({ day: 1 });
  moment().add({ days: 1 });
};

main();
