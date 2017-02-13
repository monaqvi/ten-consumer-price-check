const express = require('express');
const router = new express.Router();

const randomUuid = require('random-uuid');

const saveToGoogle = require('./../google-sheets/index.js');

router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.post('/save', (req, res) => {
  const rows = req.body;
  const date = new Date;

  const log = { request_id: randomUuid(), date: `${date.getMonth()}/${date.getDate()}/${date.getYear()}` , time: date.toString() };
  var len = rows.length - 1;
  rows.map((data, i) => saveToGoogle(Object.assign({}, log, data), (i === len) ? res : null));
});

module.exports = router;
