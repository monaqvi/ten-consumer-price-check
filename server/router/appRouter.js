const express = require('express');
const router = new express.Router();

const saveToGoogle = require('./../google-sheets/index.js');

router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.post('/save', (req, res) => {
  saveToGoogle(req.body, res);
});

module.exports = router;
