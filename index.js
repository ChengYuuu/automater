const singleBlock = require('./singleBlock');
const csv = require('csv-parser');
const fs = require('fs');
const blockdict = require('./blockDict1')
const util = require('util')
// console.log(blockdict.reason_code_dict)
const reason_split_array = [];
const code_split_array = [];
const portfolioNumber_array = [];



var success = true;
fs.createReadStream('./input/account_reason.csv')
  .pipe(csv({ separator: '|' }))
  .on('data', (row) => {
    // console.log(util.inspect(row, {depth: null}));
    portfolioNumber = row.acc_no;
    portfolioNumber_array.push(portfolioNumber);
    reason = row.block_reason;
    reason_object = blockdict.reason_code_dict[reason];
    reason_split = reason_object.reason_split;
    // console.log(reason_split);
    reason_split_array.push(reason_split);
    code_split = reason_object.codes_split;
    // console.log(code_split)
    code_split_array.push(code_split);

    // console.log(util.inspect(blockdict.reason_code_dict[reason], {depth: null}));
    // console.log(portfolioNumber)

  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    // console.log(reason_split_array[0]);
    // console.log(code_split_array[0]);
    console.log(portfolioNumber_array);
    (async () => {
      await singleBlock.initialize();
      await singleBlock.page.waitFor(1000);
      await singleBlock.run();

        for (i = 0; i < portfolioNumber_array.length ;i++){
          await console.log(code_split_array[i]);
          await singleBlock.block(code_split_array[i], reason_split_array[i], portfolioNumber_array[i]);

        }
    })();
  });



// console.log(portfolioNumber_array);
//
// (async () => {
//   await singleBlock.initialize();
//   await singleBlock.page.waitFor(1000);
//   await singleBlock.run();
//
//     for (i = 0; i < portfolioNumber_array.length ;i++){
//       console.log(code_split_array[i], reason_split_array[i], portfolioNumber_array[i]);
//       await singleBlock.block(code_split_array[i], reason_split_array[i], portfolioNumber_array[i]);
//     }
//   // await singleBlock.block('3', 'block all deposits', '3');
//   // await singleBlock.block('5', 'blocking fx spot', '3');
//   // await singleBlock.block('81', 'block all', '3');
// })();
