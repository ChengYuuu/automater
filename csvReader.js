const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('./input/account_reason.txt')
  .pipe(csv({ separator: '|' }))
  .on('data', (row) => {
    console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });