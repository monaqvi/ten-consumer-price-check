const appRouter = require('./appRouter');
const path = require('path');

module.exports = (app, express) => {
  app.use(express.static(__dirname + '/../../client'));

  app.get('/', (req, res) => res.redirect('/career/'));
  app.get('/careers/', (req, res) => res.redirect('/career/'));
  app.get('/schools/', (req, res) => res.redirect('/school/'));
  app.use('/app', appRouter);
};
