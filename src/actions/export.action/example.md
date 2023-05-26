# Hyperlink Value
```js
// link to web
worksheet.getCell('A1').value = {
  text: 'www.link.com',
  hyperlink: 'http://www.link.com',
  tooltip: 'www.link.com'
};

// internal link
worksheet.getCell('A1').value = { text: 'Sheet2', hyperlink: '#\'Sheet2\'!A1' };
```

# Formula Value
```js
worksheet.getCell('A3').value = { formula: 'A1+A2', result: 7 };
```

# Rich Text Value
```js
worksheet.getCell('A1').value = {
  richText: [
    { text: 'This is '},
    {font: {italic: true}, text: 'italic'},
  ]
};
```

# Add a Worksheet
```js
const sheet = workbook.addWorksheet('My Sheet');

// create a sheet with red tab colour
const sheet = workbook.addWorksheet('My Sheet', {properties:{tabColor:{argb:'FFC0000'}}});

// create a sheet where the grid lines are hidden
const sheet = workbook.addWorksheet('My Sheet', {views: [{showGridLines: false}]});

// create a sheet with the first row and column frozen
const sheet = workbook.addWorksheet('My Sheet', {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});

// Create worksheets with headers and footers
const sheet = workbook.addWorksheet('My Sheet', {
  headerFooter:{firstHeader: "Hello Exceljs", firstFooter: "Hello World"}
});

// create new sheet with pageSetup settings for A4 - landscape
const worksheet =  workbook.addWorksheet('My Sheet', {
  pageSetup:{paperSize: 9, orientation:'landscape'}
});
```