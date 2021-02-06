import moment from 'moment';

const main = () => {
  moment('2010-10-20').isSameOrAfter('2010-10-19', 'year')
};

main();
