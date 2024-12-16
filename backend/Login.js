const crypto = require('crypto');
const db = require('./DatabaseQueryer');
const { passwordSalt } = require('../settings.json');

module.exports = class Login {

  static addLoginRoutes(app) {
    this.app = app;
    this.addLogin();
    this.addCheckLogin();
    this.addLogout();
  }

  static addLogin() {
    this.app.post('/api/login', async (req, res) => {
      if (req.session.user) {
        res.status(403);
        res.json({ error: 'A user is already logged in!' });
        return;
      }
      const user = (await db.query(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [req.body.email, this._encrypt(req.body.password)]
      ))[0];
      if (!user) {
        res.status(404);
        res.json({ error: 'No such user + password' });
        return;
      }
      delete user.password;
      req.session.user = user;
      res.json(user);
    });
  }

  static addCheckLogin() {
    this.app.get('/api/login', (req, res) => {
      const user = req.session.user;
      if (!user) {
        res.json({ status: 'User not logged in!' });
        return;
      }
      res.json(user);
    });
  }

  static addLogout() {
    this.app.delete('/api/login', (req, res) => {
      const user = req.session.user;
      if (!user) {
        res.status(404);
        res.json({ error: 'User not logged in!' });
        return;
      }
      delete req.session.user;
      res.json({ status: 'User logged out!' });
    });
  }

  static _encrypt(password) {
    return crypto
      .createHmac('sha256', passwordSalt) // choose algorithm and salt
      .update(password)  // send the string to encrypt
      .digest('hex'); // decide on output format (in our case hexadecimal)
  }

}