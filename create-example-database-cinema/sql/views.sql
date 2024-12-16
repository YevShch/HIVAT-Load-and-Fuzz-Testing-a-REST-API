CREATE VIEW tables_and_views AS SELECT 
	TABLE_NAME AS name, 
	REPLACE(LOWER(TABLE_TYPE), "base ", "") AS type
FROM
	information_schema.tables 
WHERE
	table_schema = (SELECT DATABASE() as db);


CREATE VIEW seats_per_auditorium AS SELECT 
	auditoriums.*,
	COUNT(seats.id) AS numberOfSeats
FROM 
  auditoriums, seats
WHERE seats.auditoriumId = auditoriums.id
GROUP BY auditoriums.id;

CREATE VIEW movies_by_category AS SELECT 
	categories.title AS category,
	movies.title AS movie
FROM 
	categories,
	movies,
	moviesXcategories
WHERE 
  movies.id = moviesXcategories.movieId
	&& categories.id = moviesXcategories.categoryId; 


CREATE VIEW screenings_overview AS SELECT 
	screenings.id AS screeningId,
	screenings.time AS screeningTime,
	movies.title AS movie, 
	auditoriums.name AS auditorium 
FROM screenings, movies, auditoriums
WHERE 
	movieId = movies.id 
	&& auditoriumId = auditoriums.id 
ORDER BY screenings.id;


CREATE VIEW bookings_overview AS SELECT 
  users.email,
	bookings.bookingNumber,
	GROUP_CONCAT(seats.seatNumber ORDER BY seats.seatNumber SEPARATOR ", ") AS seats,
	GROUP_CONCAT(ticketTypes.name ORDER BY ticketTypes.name SEPARATOR ", ") AS ticketTypes,
	screenings_overview.*
FROM 
	bookings,
	users,
	bookingsXseats,
	screenings_overview,
	ticketTypes,
	seats
WHERE 
  bookings.screeningId = screenings_overview.screeningId
  && bookings.userId = users.id
  && bookingsXseats.bookingId = bookings.id
  && seats.id = bookingsXseats.seatId
  && ticketTypes.id = bookingsXseats.ticketTypeId
GROUP BY bookingId;


CREATE VIEW occupied_seats AS SELECT
  screenings_overview.*,
	GROUP_CONCAT(seats.seatNumber ORDER BY seats.seatNumber SEPARATOR ", ") AS occupiedSeats,
	COUNT(seats.seatNumber) AS occupied, 
  seats_per_auditorium.numberOfSeats AS total,
	ROUND(100 * COUNT(seats.seatNumber)/seats_per_auditorium.numberOfSeats) AS occupiedPercent
FROM 
	screenings_overview,
	seats,
	bookingsXseats,
	bookings,
	seats_per_auditorium
WHERE
	seats.id = bookingsXseats.seatId
	&& bookings.id = bookingsXseats.bookingId
	&& bookings.screeningId = screenings_overview.screeningId
	&& seats_per_auditorium.name = screenings_overview.auditorium
GROUP BY screenings_overview.screeningId;


CREATE VIEW totals AS SELECT 
   ticketTypes.name,
	COUNT(*) AS totalPeople,
	SUM(ticketTypes.price) AS totalSales
  FROM 
    bookingsXseats,
  	ticketTypes
  WHERE 
     bookingsXseats.ticketTypeId = ticketTypes.id
  GROUP BY ticketTypes.id
UNION 
SELECT 
  'TOTALS',
	COUNT(*),
	SUM(ticketTypes.price) 
  FROM 
    bookingsXseats,
  	ticketTypes
  WHERE 
     bookingsXseats.ticketTypeId = ticketTypes.id
