const movies = require('./json/movies.json');
const queries = [];

let movieId = 1, allCategories = [];

for (let { title, length, file: posterImage, genres: categories } of movies) {
  allCategories = [...new Set([...allCategories, ...categories])];
  let desc = JSON.stringify(
    { length, categories, posterImage }
  ).replace(/"/g, '\\"');
  queries.push(`
    INSERT INTO movies (id, title, description)
    VALUES (${movieId}, "${title}", "${desc}")
  `);
  for (let category of categories) {
    queries.push(`
      INSERT INTO moviesXcategories (movieId, categoryId)
      VALUES(${movieId}, ${allCategories.findIndex(x => x === category) + 1})
    `);
  }
  movieId++;
}

let categoryId = 1;
for (let category of allCategories) {
  queries.push(`
    INSERT INTO categories (id, title, description)
    VALUES (${categoryId++}, "${category}", "${'This is the ' + category + ' category.'}")
  `);
}

export default queries;