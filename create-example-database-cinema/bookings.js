const queries = [];

const bookingNumbersMem = {}

function generateBookingNumber() {
  let no = '';
  while (no.length < 3) {
    no += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  }
  while (no.length < 6) {
    no += Math.floor(Math.random() * 10);
  }
  if (bookingNumbersMem[no]) { return generateBookingNumber() }
  bookingNumbersMem[no] = true;
  return no;
}

let screeningId = 1, bookingId = 1, occupiedSeatsPerScreening = {};
for (let screening of screenings) {
  let totalSeats = screening.auditoriumId === 1 ? 81 : 55;
  let percentToBook = Math.floor(Math.random() * 50) + 30;
  occupiedSeatsPerScreening[screening.id] = occupiedSeatsPerScreening[screening.id] || {};
  let occupiedSeats = occupiedSeatsPerScreening[screening.id];
  while (Object.keys(occupiedSeats).length < percentToBook / 100 * totalSeats) {
    let userId = Math.floor(Math.random() * 100) + 1;
    let seatsToBook = Math.floor(Math.random() * 5) + 1;
    let bookedSeats = [];
    while (bookedSeats.length < seatsToBook) {
      let nextSeat = bookedSeats.length && bookedSeats.slice().pop() + 1;
      let seat = (nextSeat && !occupiedSeats[nextSeat]) ?
        nextSeat : Math.floor(Math.random() * totalSeats) + 1;
      if (occupiedSeats[seat]) { continue; }
      bookedSeats.push(seat);
      occupiedSeats[seat] = true;
    }
    queries.push(`
      INSERT INTO bookings (id, bookingNumber, screeningId, userId)
      VALUES (${bookingId}, "${generateBookingNumber()}", ${screeningId}, ${userId} )
    `);
    for (let seat of bookedSeats) {
      let ticketTypeId = Math.floor(Math.random() * 3) + 1;
      queries.push(`
        INSERT INTO bookingsXseats (bookingId, seatId, ticketTypeId)
        VALUES (${bookingId}, ${seat}, ${ticketTypeId})
      `);
    }
    bookingId++;
  }
  screeningId++;
}

export default queries;