const express = require('express');
const router = new express.Router();

const randomUuid = require('random-uuid');
const moment = require('moment-timezone');

const saveToGoogle = require('./../google-sheets/index.js');

var timestamp = function() {;
  const date = new Date;
  return {
            date: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`,
            time: (moment().tz("America/Los_Angeles").format().split('T')[1]).replace('-08:00',""),
          };
};

router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.post('/consumer/new', (req, res) => {
  const rows = req.body;

  const len = rows.length - 1;
  const log = Object.assign({}, { expert_id: randomUuid() }, timestamp());
  rows.map((data, i) => saveToGoogle.saveConsumerResults(Object.assign(log, data), (i === len) ? res : null));
});

router.post('/expert/new', (req, res) => {
  const rows = req.body;

  const len = rows.length - 1;
  const log = Object.assign({}, { expert_id: randomUuid() }, timestamp());
  rows.map((data, i) => saveToGoogle.saveExpertInfo(Object.assign(log, data), (i === len) ? res : null));
});

module.exports = router;
