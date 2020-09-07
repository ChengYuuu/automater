const singleBlock = require('./singleBlock');
const csv = require('csv-parser');
const fs = require('fs');
const blockdict = require('./blockDict1')

const reason_split_array = [];
const code_split_array = [];
const portfolioNumber_array = [];



var success = true;
fs.createReadStream('./input/account_reason.csv')
  .pipe(csv({ separator: '|' }))
  .on('data', (row) => {
    portfolioNumber = row.acc_no;
    portfolioNumber_array.push(portfolioNumber);
    reason = row.block_reason;
    reason_object = blockdict.reason_code_dict[reason];
    reason_split = reason_object.reason_split;
    reason_split_array.push(reason_split);
    code_split = reason_object.codes_split;
    code_split_array.push(code_split);

  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    (async () => {
      await singleBlock.initialize();
      await singleBlock.page.waitFor(1000);
      await singleBlock.run();

        for (i = 0; i < portfolioNumber_array.length ;i++){
          await singleBlock.block(code_split_array[i], reason_split_array[i], portfolioNumber_array[i]);
        }
    })();
  });
