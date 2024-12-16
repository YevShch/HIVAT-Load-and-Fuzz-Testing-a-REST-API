const movies = require('./json/movies.json');
const screenings = require('./json/screenings.json');
const queries = [];

let id = 1;
let converted = screenings.map(({ movie, auditorium, time }) => {
  return {
    id: id++,
    movieId: movies.findIndex(x => x.title === movie) + 1,
    auditoriumId: auditorium.includes('Stora') ? 1 : 2,
    time
  }
});

// store globally so we can read the screenings later
globalThis.screenings = converted;

for (let { id, movieId, auditoriumId, time } of converted) {
  queries.push(`
    INSERT INTO screenings (id, movieId, auditoriumId, time)
    VALUES (${id}, ${movieId}, ${auditoriumId}, "${time}")
  `)
}

export default queries;