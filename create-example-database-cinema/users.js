const crypto = require('crypto');
const users = require('./json/users.json');
const { passwordSalt } = require('../settings.json');

const queries = [];

for (let { id, email, password, firstName, lastName, phoneNumber } of users) {

  let encryptedPassword = crypto
    .createHmac('sha256', passwordSalt) // choose algorithm and salt
    .update(password)  // send the string to encrypt
    .digest('hex'); // decide on output format (in our case hexadecimal)

  queries.push(`
    INSERT INTO users (id, email, password, firstName, lastName, phoneNumber)
    VALUES (${id}, "${email}", "${encryptedPassword}", 
      "${firstName}", "${lastName}", "${phoneNumber}")
  `);
}

// store globally so we can read the screenings later
globalThis.users = users;

export default queries;