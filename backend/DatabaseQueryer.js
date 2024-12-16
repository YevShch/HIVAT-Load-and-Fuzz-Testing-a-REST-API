// © Thomas Frank, Node Hill 
// MIT licensed
// A thin wrapper with error handling
// around our DB driver

const mysql = require('mysql2');

module.exports = class DatabaseQueryer {

  static verbose = false;

  static connect() {
    // read settings
    const {
      mySqlHost: host,
      mySqlPort: port,
      mySqlUser: user,
      mySqlPassword: password,
      database
    } = require('../settings.json');

    this.dbConnection = mysql.createPool({ host, port, user, password, database });
    return this.dbConnection;
  }

  static query(sql, params = []) { // call using await!
    this.dbConnection || this.connect();
    return new Promise((resolve, reject) => {
      this.verbose && this.log(sql, params);
      let driverMethod = params.length ? 'execute' : 'query';
      this.dbConnection[driverMethod](sql, params, (error, results) => {
        return error ? reject(error) : resolve(results)
      }
      );
    });
  }

  static log(sql, params) {
    sql = sql.replace(/ {1,}/g, ' ');
    params ? console.log(sql, '? ->', params) : console.log(sql);
    console.log('\n' + '-'.repeat(60) + '\n');
  }

}