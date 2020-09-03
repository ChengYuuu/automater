const puppeteer = require('puppeteer');

const BASE_URL = "http://localhost:3000/singleblock"

const singleBlock = {
  browser: null,
  page: null,

  initialize: async () => {
    singleBlock.browser = await puppeteer.launch({ headless: false });
    singleBlock.page = await singleBlock.browser.newPage();
  },
  run: async() => {
    await singleBlock.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
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
    let addPostingRestrictButton = await postingRestrictContainer[0].$('button[id=plus]');
    await addPostingRestrictButton.click();
    for (let i = 0; i < postingRestrictContainer.length; i++) {
      let postingRestrictTextBox = await postingRestrictContainer[i].$('input[id=posting-restrict-value]');
      currentBlockCodes.push(await singleBlock.page.evaluate(x => x.value, postingRestrictTextBox));
    }
    let updatedPostingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
    for (let i = 1; i < updatedPostingRestrictContainer.length; i++) {
      let updatedPostingRestrictTextBox = await updatedPostingRestrictContainer[i].$('input[id=posting-restrict-value]');
      await updatedPostingRestrictTextBox.click({ clickCount: 3 })
      await updatedPostingRestrictTextBox.press('Backspace');  
      let code = currentBlockCodes[i-1];
      await updatedPostingRestrictTextBox.type(code);
    }
    let updatedFirstPostingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]')
    let updatedFirstPostingRestrictTextBox = await updatedFirstPostingRestrictContainer[0].$('input[id=posting-restrict-value]');
    await updatedFirstPostingRestrictTextBox.click({ clickCount: 3 })
    await updatedFirstPostingRestrictTextBox.press('Backspace');
    await updatedFirstPostingRestrictTextBox.type(blockCode);

  },
  blockRemark: async(remarks) => {
    const currentRemarks = [];
    await singleBlock.page.waitFor('span[id=remark-group]');
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
  blockEightyOne: async () => {

  }
}

module.exports = singleBlock;