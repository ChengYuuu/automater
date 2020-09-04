const singleBlock = require('./singleBlock');

(async () => {
  await singleBlock.initialize();
  await singleBlock.page.waitFor(1000);
  await singleBlock.run();
  await singleBlock.block('3', 'block all deposits', '3');
  await singleBlock.block('5', 'blocking fx spot', '3');
  await singleBlock.block('81', 'block all', '3');
})();
