const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: './output/output.csv',
  header: [
    {id: 'portfolioNo', title: 'Portfolio #'},
    {id: 'isDormantBlock', title: 'To be blocked as dormant'},
    {id: 'maker', title: 'Maker'},
    {id: 'existingBlock', title: 'Existing block?'},
    {id: 'dateCompleted', title: 'Date Completed'},
    {id: 'updateSuccess',title:'Update successful?'}
  ]
});

const data = [
  {
    portfolioNo: '1',
    isDormantBlock: 'Yes',
    maker: 'Dinah Aw',
    existingBlock: 'Yes',
    dateCompleted:'2 Sep 2020',
    updateSuccess:'Yes',

  }, {
    portfolioNo: '2',
    isDormantBlock: 'Yes',
    maker: 'Dinah Aw',
    existingBlock: 'Yes',
    dateCompleted:'2 Sep 2020',
    updateSuccess:'Yes',
  }, {
    portfolioNo: '3',
    isDormantBlock: 'Yes',
    maker: 'Dinah Aw',
    existingBlock: 'Yes',
    dateCompleted:'2 Sep 2020',
    updateSuccess:'Yes',
  }
];

csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));