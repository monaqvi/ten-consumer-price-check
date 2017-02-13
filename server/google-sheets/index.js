const GoogleSpreadsheet = require('google-spreadsheet');
const bookID = require('./google-book-id');
const sheetID = require('./google-sheet-id');
const creds = require('./google-generated-creds.json');

const doc = new GoogleSpreadsheet(bookID);

doc.getInfo((err, info) =>
  console.log(`Loaded doc: ${info.title} by ${info.author.email}`)
);

doc.getRows(sheetID, (err, row_data) =>
  console.log(`pulled in ${row_data.length} rows`)
);

module.exports = (data, res) => {
  doc.useServiceAccountAuth(creds, () => {
    doc.addRow(sheetID, data, r => res ? res.send(r) : null);
  });
};
