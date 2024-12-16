import 'require-from-es';
const mysql = require('mysql2');

// files with seeding logic, to import
const files = [
  './create-tables-and-views.js',
  './ticket-types.js',
  './auditoriums-and-seats.js',
  './movies-and-categories.js',
  './users.js',
  './screenings.js',
  './bookings.js'
];

const line = '\n' + '-'.repeat(80) + '\n';

console.log(line + 'Seed the DB...' + line);

// read settings
const {
  mySqlHost: host,
  mySqlPort: port,
  mySqlUser: user,
  mySqlPassword: password
} = require('../settings.json');

// create a connection pool and an async connection 'db
const dbPool = await mysql.createPool({ host, port, user, password });
const db = dbPool.promise();

// wrapper around db.query - so we can console log queries
// (but there are soooo many about bookings so let's no log all of them)
let queryCounter = 0, bookingsCounter = 0, startTime = Date.now();
async function dbQuery(query) {
  query = query.replace(/\s{2,}/g, ' ').trim();
  await db.query(query);
  queryCounter++;
  bookingsCounter += query.includes('bookings');
  if (bookingsCounter === 200) { console.log('etc... etc...'); return; }
  if (bookingsCounter > 200) { return; }
  console.log(query.slice(0, 75) + (query.length > 75 ? '...' : ''));

}

// run multiple queries from array
async function dbQueries(queries) {
  for (let query of queries) {
    await dbQuery(query);
  }
}

// drop, create and set database 'cinema'
await dbQuery('DROP DATABASE IF EXISTS cinema');
await dbQuery('CREATE DATABASE cinema CHARACTER SET utf8mb4 COLLATE utf8mb4_sv_0900_ai_ci');
await dbQuery('USE cinema');

// turn off foreign key checks
await dbQuery('SET foreign_key_checks = 0');

// import data from seeders and run queries
for (let file of files) {
  await dbQueries((await import(file)).default);
}

// turn on foreign key checks
await dbQuery('SET foreign_key_checks = 1');

// exit the process when all queries are done
dbPool.end(() => {
  console.log(line + `All done! (Ran ${queryCounter}` +
    ` queries in ${Date.now() - startTime} ms...)` + line);
  process.exit();
});