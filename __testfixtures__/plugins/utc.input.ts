import moment from 'moment';

const main = () => {
  moment.max(moment(), moment('2018-01-01'), moment('2019-01-01'));
  moment.min([moment(), moment('2018-01-01'), moment('2019-01-01')]);
};

main();
