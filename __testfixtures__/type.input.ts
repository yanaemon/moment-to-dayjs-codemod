import moment, { MomentInput } from 'moment';

const main = () => {
  const d: MomentInput = moment().add({ days: 1 });
  const d2: moment.MomentInput = moment().add({ days: 1 });
};

main();
