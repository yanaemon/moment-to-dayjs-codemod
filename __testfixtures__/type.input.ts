import moment, { Moment, MomentInput } from 'moment';

const main = () => {
  const d: MomentInput = moment().add(1, 'day');
  const d2: moment.MomentInput = moment().add(1, 'day');
  const d3: Moment = moment().add(1, 'day');
  const d4: moment.Moment = moment().add(1, 'day');
};

main();
