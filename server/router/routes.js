const appRouter = require('./appRouter');
const path = require('path');

module.exports = (app, express) => {
  app.use(express.static(__dirname + '/../../client'));

  app.get('/', (req, res) => res.redirect('/career/'));
  app.get('/thankyou/', (req, res) => res.sendFile(path.resolve(__dirname + '/../views/thankyou.html')));
  app.use('/app', appRouter);
};
