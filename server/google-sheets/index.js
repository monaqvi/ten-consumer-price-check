const GoogleSpreadsheet = require('google-spreadsheet');
const bookID = require('./google-book-id');
const consumer_results = require('./consumer-results-sheet-id');
const expert_results = require('./expert-results-sheet-id');
const creds = require('./google-generated-creds.json');

const doc = new GoogleSpreadsheet(bookID);

doc.getInfo((err, info) =>
  console.log(`Loaded doc: ${info.title} by ${info.author.email}`)
);

doc.getRows(consumer_results, (err, row_data) =>
  console.log(`pulled in ${row_data.length} rows`)
);

module.exports.saveConsumerResults = (data, res) => {
  doc.useServiceAccountAuth(creds, () => {
    doc.addRow(consumer_results, data, r => res ? res.send(r) : null);
  });
};

module.exports.saveExpertInfo = (data, res) => {
  doc.useServiceAccountAuth(creds, () => {
    doc.addRow(expert_results, data, r => res ? res.send(r) : null);
  });
};
