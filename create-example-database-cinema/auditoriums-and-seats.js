const auditoriums = require('./json/auditoriums.json');
const queries = [];

let auditoriumId = 0;
for (let { name, seatsPerRow } of auditoriums) {
  auditoriumId++;
  queries.push(`
    INSERT INTO auditoriums (id, name)
    VALUES (${auditoriumId}, "${name}")
  `);
  let rowNo = 0, seatNo = 1;
  for (let row of seatsPerRow) {
    rowNo++;
    for (let i = 0; i < row; i++) {
      queries.push(`
        INSERT INTO seats (rowNumber, seatNumber, auditoriumId)
        VALUES(${rowNo}, ${seatNo++}, ${auditoriumId})
      `);
    }
  }
}

export default queries;