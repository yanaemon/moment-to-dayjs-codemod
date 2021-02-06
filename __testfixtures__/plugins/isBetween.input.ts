import moment from 'moment';

const main = () => {
  moment('2010-10-20').isBetween('2010-10-19', moment('2010-10-25'), 'year');
  moment('2016-10-30').isBetween('2016-01-01', '2016-10-30', null, '[)');
};

main();
