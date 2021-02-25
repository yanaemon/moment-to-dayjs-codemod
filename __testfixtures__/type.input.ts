import moment, { Moment, MomentInput } from 'moment';

const main = () => {
  const d: MomentInput = moment().add({ days: 1 });
  const d2: moment.MomentInput = moment().add({ days: 1 });
  const d3: Moment = moment().add({ days: 1 });
  const d4: moment.Moment = moment().add({ days: 1 });
};

main();
