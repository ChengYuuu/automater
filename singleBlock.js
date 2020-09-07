const puppeteer = require('puppeteer');

const BASE_URL = "http://localhost:3000"

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


const singleBlock = {

  browser: null,
  page: null,

  initialize: async () => {
    singleBlock.browser = await puppeteer.launch({ headless: false, defaultViewport: null, args:['--start-maximized'] });
    singleBlock.page = await singleBlock.browser.newPage();
  },
  run: async() => {
    await singleBlock.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  },
  block: async(blockCodes, remarks, portfolioNumber) => {
    await singleBlock.page.waitFor('a[id=singleBlock]');
    let singleBlockLink = await singleBlock.page.$('a[id=singleBlock]');
    await singleBlockLink.click();
    await singleBlock.page.waitFor('input[id=general-input]');
    await singleBlock.page.type('input[id=general-input]', portfolioNumber);
    await singleBlock.page.keyboard.press('Enter');

    var existingBlock = await singleBlock.blockRestrict(blockCodes);
    await singleBlock.blockRemark(remarks);

    await singleBlock.selectReviewDate();

    if(blockCodes.includes('81')){
      singleBlock.selectDormantDate();
      var dormantBlock = "Yes";
    } else {
      var dormantBlock = "No";
    }

    console.log(dormantBlock);

    let submitButton = await singleBlock.page.$('button[id=submit]');
    await submitButton.click();

    await csvWriter.writeRecords([{
      portfolioNo: portfolioNumber,
      isDormantBlock: dormantBlock,
      maker: 'Dinah Aw',
      existingBlock: existingBlock,
      dateCompleted:'8 Sep 2020',
      updateSuccess:'Yes',

    }])
    await singleBlock.goBackHome();
  },
  blockRestrict: async(blockCodes) => {
    const currentBlockCodes = [];
    await singleBlock.page.waitFor('span[id=posting-restrict-group]');
    let postingRestrictContainer = await singleBlock.page.$$('span[id=posting-restrict-group]');
    for (let i = 0; i < postingRestrictContainer.length; i++) {
      let postingRestrictTextBox = await postingRestrictContainer[i].$('input[id=posting-restrict-value]');
      currentBlockCodes.push(parseInt(await singleBlock.page.evaluate(x => x.value, postingRestrictTextBox)));
    }

    if (currentBlockCodes.length > 0){
      var existingBlock = "Yes";
    } else {
      var existingBlock = "No";
    }
    if (currentBlockCodes.includes('81')) return existingBlock;
    if (blockCodes.includes('81')) {
      await singleBlock.addBlockCodeBelow('81');
      await singleBlock.removeAllBlockCodeExceptLast();
    } else {
      for (let i = 0; i < blockCodes.length; i++) {
        currentBlockCodes.push(parseInt(blockCodes[i]));
      }
      var temp = currentBlockCodes.map(x => x);
      console.log(temp);
      var unique = currentBlockCodes.filter(function(elem, index, self) {
        return index === self.indexOf(elem);
      })
      console.log(unique);
      console.log(temp.length - blockCodes.length);
      unique.sort((a,b) => a-b);
      for (let i = 0; i < unique.length; i++) {
        await singleBlock.addBlockCodeBelow((unique[i]).toString());
      }
      await singleBlock.removeBlockCode(temp.length - blockCodes.length);
    }

    return existingBlock;

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
    await updatedPostingRestrictTextBox.type(blockCode, { delay : 200});
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
    for (let i = 0; i < remarks.length; i++) {
      await addRemarkButton.click();
    }
    for (let i = 0; i < remarkContainer.length; i++) {
      let remarkTextBox = await remarkContainer[i].$('textarea[id=remark-value]');
      currentRemarks.push(await singleBlock.page.evaluate(x => x.value, remarkTextBox));
    }
    for (let i = remarks.length - 1; i >= 0; i--) {
      currentRemarks.unshift(remarks[i]);
    }
    let updatedRemarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    for (let i = 0; i < updatedRemarkContainer.length; i++) {
      let updatedRemarkTextBox = await updatedRemarkContainer[i].$('textarea[id=remark-value]');
      await updatedRemarkTextBox.click({ clickCount: 3 });
      await updatedRemarkTextBox.press('Backspace');
      let rm = currentRemarks[i];
      await updatedRemarkTextBox.type(rm);
    }
  },
  addRemarkBelow: async (remarks) => {
    let remarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    let addRemarkButton = await remarkContainer[0].$('button[id=plus]');
    for (let i = 0; i < remarks.length; i++) {
      await addRemarkButton.click();
    }
    let updatedRemarkContainer = await singleBlock.page.$$('span[id=remark-group]');
    for (let i = 0; i < remarks.length; i++) {
      let updatedRemarkTextBox = await updatedRemarkContainer[updatedRemarkContainer.length - 1 - i].$('textarea[id=remark-value]');
      await updatedRemarkTextBox.click({ clickCount: 3 });
      await updatedRemarkTextBox.press('Backspace');
      let rm = currentRemarks[remarks.length - 1 - i];
      await updatedRemarkTextBox.type(rm);
    }
  },
  goBackHome: async () => {
    let homeLink = await singleBlock.page.$('a[id=home]');
    await homeLink.click()
  },
  selectReviewDate: async () => {
    let reviewDatePicker = await singleBlock.page.$('input[id=review-datepicker');
    await reviewDatePicker.click();
    await singleBlock.page.waitFor(1000);
    let dates = await singleBlock.page.$$('table[class=ant-picker-content] td.ant-picker-cell.ant-picker-cell-in-view');
    for (let i = 0; i < dates.length; i++) {
      let day = await dates[i].evaluate(el => el.innerText);
      if (day == "8") {
        singleBlock.page.evaluate(el => el.click(), dates[i])
      }
    }
  },
  selectDormantDate: async () => {
    let reviewDatePicker = await singleBlock.page.$('input[id=dormant-datepicker');
    await reviewDatePicker.click();
    await singleBlock.page.waitFor(1000);
    let dates = await singleBlock.page.$$('table[class=ant-picker-content] td.ant-picker-cell.ant-picker-cell-in-view');
    for (let i = 0; i < dates.length; i++) {
      let day = await dates[i].evaluate(el => el.innerText);
      if (day == "8") {
        singleBlock.page.evaluate(el => el.click(), dates[i])
      }
    }
  }
}

module.exports = singleBlock;
