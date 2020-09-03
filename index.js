const fs = require('fs');
const singleBlock = require('./singleBlock');

(async () => {
  await singleBlock.initialize();
  await singleBlock.page.waitFor(1000);
  await singleBlock.run();
  await singleBlock.block('81', 'remarks');
})();
