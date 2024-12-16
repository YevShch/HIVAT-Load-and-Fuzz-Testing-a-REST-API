const queries = [];
const types = {
  Child: 65,
  Senior: 75,
  Adult: 85
};

let id = 1;
for (let [type, price] of Object.entries(types)) {
  queries.push(`
    INSERT INTO ticketTypes (id, name, price)
    VALUES (${id++}, "${type}", ${price})
  `);
}

export default queries;