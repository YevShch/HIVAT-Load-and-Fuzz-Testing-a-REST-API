import { readFileSync } from 'fs';

// read table definitions and parse to query array
export default (
  (
    readFileSync('./sql/table-definitions.sql', 'utf-8') +
    readFileSync('./sql/views.sql', 'utf-8')
  ).split(';')
    .map(x => x.trim().replaceAll('\n', ' '))
    .filter(x => x && x[0] !== '#' && x[0] !== '/')
);