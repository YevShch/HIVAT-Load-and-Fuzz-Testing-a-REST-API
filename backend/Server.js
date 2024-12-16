const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const DatabaseQueryer = require('./DatabaseQueryer');
const RestApi = require('./RestApi');
const settings = require('../settings.json');

module.exports = class Server {

  port = settings.serverPort;

  app = express();

  constructor() {
    this.start();
  }

  start() {
    this.setupExpressSession();
    this.app.use(express.json());
    new RestApi(this.app);
    this.serveDist();
    let message = `Backend listening on port ${this.port}`;
    this.app.listen(this.port, () => console.log(message));
  }

  setupExpressSession() {
    const dbConnection = DatabaseQueryer.connect();
    const MySQLStore = require('express-mysql-session')(session);
    const { sessionSalt } = require('../settings.json');
    this.app.use(session({
      secret: sessionSalt,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: 'auto' },
      store: new MySQLStore({}, dbConnection.promise())
    }));
  }


  serveDist() {
    // serve built dist (production React created with npm run build)
    this.app.use(express.static(path.join(__dirname, '../', 'dist')));
    // make hard reload of frontend routes work
    // serve index.html if there is no matching backend route
    this.app.get('*', (req, res) => {
      let indexHtml = path.join(__dirname, '../', 'dist', 'index.html');
      if (!fs.existsSync(indexHtml)) {
        res.status(404);
        res.send('404: No dist built yet...');
        return;
      }
      res.sendFile(indexHtml);
    });
  }

}