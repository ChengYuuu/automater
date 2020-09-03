const puppeteer = require('puppeteer');

const BASE_URL = "http://localhost:3000"

const singleBlock = {
  browser: null,
  page: null,

  initialize: async () => {
    singleBlock.browser = await puppeteer.launch({ headless: false });
    singleBlock.page = await singleBlock.browser.newPage();
  },
  run: async() => {
    await singleBlock.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    let singleBlockLink = await singleBlock.page.$('a[id=singleBlock]');
    await singleBlockLink.click();
    await singleBlock.page.waitFor('input[id=general-input');
    await singleBlock.page.type('input[id=general-input', '3');
    await singleBlock.page.keyboard.press('Enter');
  },
  block: async(blockCode, remarks) => {

    await singleBlock.blockRestrict(blockCode);
    await singleBlock.blockRemark(remarks);
  },
  blockRestrict: async(blockCode) => {
    const currentBlockCodes = [];
    await singleBlock.page.waitFor('span[id=posting-restrict-group]');
    let postingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
    for (let i = 0; i < postingRestrictContainer.length; i++) {
      let postingRestrictTextBox = await postingRestrictContainer[i].$('input[id=posting-restrict-value]');
      currentBlockCodes.push(parseInt(await singleBlock.page.evaluate(x => x.value, postingRestrictTextBox)));
    }
    if (currentBlockCodes.includes('81')) return;
    if (blockCode === '81' || currentBlockCodes.length === 0) {
      await singleBlock.addBlockCodeBelow(blockCode);
      await singleBlock.removeAllBlockCodeExceptLast();
    } else {
      currentBlockCodes.push(parseInt(blockCode));
      await singleBlock.page.waitFor(100);
      var unique = currentBlockCodes.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })
      await singleBlock.page.waitFor(200);
      unique.sort((a,b) => a-b);
      await singleBlock.page.waitFor(300);
      console.log(unique.sort((a,b) => a-b));
      console.log(currentBlockCodes);
      console.log(currentBlockCodes.length - 1);
      for (let i = 0; i < unique.length; i++) {
        await singleBlock.addBlockCodeBelow((unique[i]).toString());
      }
      await singleBlock.removeBlockCode(currentBlockCodes.length - 1);
    }
  },
  blockRemark: async(remarks) => {
    await singleBlock.page.waitFor('span[id=remark-group]');
    await singleBlock.moveRemarkDownAndAddTop(remarks);
  },
  addBlockCodeBelow: async (blockCode) => {
    let postingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
    let addPostingRestrictButton = await postingRestrictContainer[0].$('button[id=plus]');
    await addPostingRestrictButton.click();
    let updatedPostingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
    let updatedPostingRestrictTextBox = await updatedPostingRestrictContainer[updatedPostingRestrictContainer.length - 1].$('input[id=posting-restrict-value]');
    await updatedPostingRestrictTextBox.type(blockCode);
  },
  removeAllBlockCodeExceptLast: async () => {
    let postingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
    for (let i = 0; i < postingRestrictContainer.length -1; i++) {
      let removePostingRestrictButton = await postingRestrictContainer[0].$('button[id=minus]');
      await removePostingRestrictButton.click();
    }
  },
  removeBlockCode: async (amountToRemove) => {
    for (let i = 0; i < amountToRemove; i++) {
      let postingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
      let removePostingRestrictButton = await postingRestrictContainer[0].$('button[id=minus]');
      await removePostingRestrictButton.click();
    }
  },
  moveRemarkDownAndAddTop: async(remarks) => {
    const currentRemarks = [];
    let remarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    let addRemarkButton = await remarkContainer[0].$('button[id=plus]');
    await addRemarkButton.click();
    for (let i = 0; i < remarkContainer.length; i++) {
      let remarkTextBox = await remarkContainer[i].$('textarea[id=remark-value]');
      currentRemarks.push(await singleBlock.page.evaluate(x => x.value, remarkTextBox));
    }
    let updatedRemarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    for (let i = 1; i < updatedRemarkContainer.length; i++) {
      let updatedRemarkTextBox = await updatedRemarkContainer[i].$('textarea[id=remark-value]');
      await updatedRemarkTextBox.click({ clickCount: 3 })
      await updatedRemarkTextBox.press('Backspace');
      let rm = currentRemarks[i-1];
      await updatedRemarkTextBox.type(rm);
    }
    let updatedFirstRemarkContainer = await singleBlock.page.$$('span[id=remark-group]')
    let updatedFirstRemarkTextBox = await updatedFirstRemarkContainer[0].$('textarea[id=remark-value]');
    await updatedFirstRemarkTextBox.click({ clickCount: 3 })
    await updatedFirstRemarkTextBox.press('Backspace');
    await updatedFirstRemarkTextBox.type(remarks);
  },
  addRemarkBelow: async (remarks) => {
    let remarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    let addRemarkButton = await remarkContainer[0].$('button[id=plus]');
    await addRemarkButton.click();
    let updatedRemarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    let updatedRemarkTextBox = await updatedRemarkContainer[updatedRemarkContainer.length - 1].$('textarea[id=remark-value]');
    await updatedRemarkTextBox.type(remarks);
  }
}

module.exports = singleBlock;