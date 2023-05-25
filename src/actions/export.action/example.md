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