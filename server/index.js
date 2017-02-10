const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router/routes');
const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router(app, express);

app.listen(port, err => {
  if (err) {
    console.log('Listen error: ', err);
    return err;
  }
  console.log(`Survey listening on port ${port}!`);
});
