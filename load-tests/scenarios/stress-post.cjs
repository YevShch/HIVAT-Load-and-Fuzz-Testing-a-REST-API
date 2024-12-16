const crypto = require( 'crypto' );
const { chromium } = require( '@playwright/test' );

module.exports = {
  runPostUsersTest: async () => {
    const { expect } = await import( 'chai' );
    const browser = await chromium.launch( { headless: true } );

    try {
      // Generate unique email for each test run
      const uniqueEmail = `user_${ crypto.randomUUID() }@example.com`;

      // Step 1: Visit the URL for POST
      await page.goto( 'http://localhost:4000/api/users' );
      console.log( 'Page loaded: /api/users' );

      // Step 2: Send POST request to create a user
      const postResponse = await fetch( 'http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          email: uniqueEmail,
          password: 'randomPassword123!',
          firstName: 'Test',
          lastName: 'User',
          phoneNumber: '123-456-7890',
        } ),
      } );

      const postResponseBody = await postResponse.json();
      expect( postResponse.status ).to.equal( 200 );

      // Extract the inserted ID from POST response
      const insertedId = postResponseBody.insertId;
      expect( insertedId ).to.be.a( 'number' );
      console.log( `User created with ID: ${ insertedId }` );

      // Step 3: Send GET request to fetch the created user by ID
      const getResponse = await fetch( `http://localhost:4000/api/users/${ insertedId }`, {
        method: 'GET',
      } );

      // Parse GET response
      const getResponseBody = await getResponse.json();

      // Check if the response status is OK
      expect( getResponse.status ).to.equal( 200 );

      // Verify the user details match the POST request
      expect( getResponseBody ).to.have.property( 'email', uniqueEmail );
      expect( getResponseBody ).to.have.property( 'firstName', 'Test' );
      expect( getResponseBody ).to.have.property( 'lastName', 'User' );
      expect( getResponseBody ).to.have.property( 'phoneNumber', '123-456-7890' );

      console.log( 'GET request successful and user details are valid!' );

      //DELETE created user
      const deleteResponse = await fetch( `http://localhost:4000/api/users/${ insertedId }`, {
        method: 'DELETE',
      } );

      // Check if the response status for DELETE is OK
      expect( deleteResponse.status ).to.equal( 200 );
      console.log( `User with ID: ${ insertedId } successfully deleted!` );

    } catch ( error ) {
      console.error( 'Error in Playwright test:', error );
    } finally {
      await browser.close();
    }
  },

  runPostMoviesTest: async () => {
    const { expect } = await import( 'chai' );
    const browser = await chromium.launch( { headless: true } );
    const context = await browser.newContext();
    // const page = await context.newPage();

    try {
      // Step 1: Generate a dynamic movie title
      const randomTitle = `Movie_${ crypto.randomUUID() }`;  // Generates a unique title using UUID
      console.log( `Generated movie title: ${ randomTitle }` );

      // Step 2: Send POST request to create a movie
      const postResponse = await fetch( 'http://localhost:4000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          title: randomTitle,  // Use dynamically generated title
          description: {
            length: 89,
            categories: [ 'Adventure', 'Comedy' ],
            posterImage: '/images/posters/tt0090555.jpg',
          },
        } ),
      } );

      const postResponseBody = await postResponse.json();

      expect( postResponse.status ).to.equal( 200 );

      const insertedId = postResponseBody.insertId;
      expect( insertedId ).to.be.a( 'number' );
      console.log( `Movie created with ID: ${ insertedId }` );

      // Step 3: Send GET request to fetch the created movie by ID
      const getResponse = await fetch( `http://localhost:4000/api/movies/${ insertedId }`, {
        method: 'GET',
      } );

      const getResponseBody = await getResponse.json();
      expect( getResponse.status ).to.equal( 200 );

      // Verify the movie details match the POST request
      expect( getResponseBody ).to.have.property( 'title', randomTitle );
      expect( getResponseBody.description ).to.have.property( 'length', 89 );
      expect( getResponseBody.description ).to.have.property( 'posterImage', '/images/posters/tt0090555.jpg' );
      expect( getResponseBody.description.categories ).to.include.members( [ 'Adventure', 'Comedy' ] );

      console.log( 'GET request successful and screening details are valid!' );

      // Step 4: Send DELETE request to delete the created screening by ID
      const deleteResponse = await fetch( `http://localhost:4000/api/movies/${ insertedId }`, {
        method: 'DELETE',
      } );

      // Check if the response status for DELETE is OK
      expect( deleteResponse.status ).to.equal( 200 );
      console.log( `Movie with ID: ${ insertedId } successfully deleted!` );

      // Optional: Verify that the screening no longer exists
      const verifyDeletionResponse = await fetch( `http://localhost:4000/api/movies/${ insertedId }`, {
        method: 'GET',
      } );

      expect( verifyDeletionResponse.status ).to.equal( 404 );
      console.log( `Verified: Movie with ID ${ insertedId } no longer exists.` );
    } catch ( error ) {
      console.error( 'Error in Playwright test:', error );
    } finally {
      await browser.close();
    }
  },


  runPostAndDeleteScreenings: async () => {
    const { chromium } = require( '@playwright/test' );
    const { expect } = await import( 'chai' );
    const browser = await chromium.launch( { headless: true } );

    try {

      const now = new Date();
      const dynamicTime = new Date( now.getTime() + Math.floor( Math.random() * 100000000 ) ); // Random future date
      const localFormattedTime = dynamicTime.toLocaleString(); // Convert to local time format ("MM/DD/YYYY, HH:mm:ss")
      console.log( `Generated dynamic time in local timezone: ${ localFormattedTime }` );

      // Step 2: Visit the URL for POST
      await page.goto( 'http://localhost:4000/api/screenings' );
      console.log( 'Page loaded: /api/screenings' );

      // Step 3: Send POST request to create a screening
      const postResponse = await fetch( 'http://localhost:4000/api/screenings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
          time: localFormattedTime, 
          movieId: 3,
          auditoriumId: 1,
        } ),
      } );

      const postResponseBody = await postResponse.json();
      expect( postResponse.status ).to.equal( 200 );

      const insertedId = postResponseBody.insertId;
      expect( insertedId ).to.be.a( 'number' );
      console.log( `Screening created with ID: ${ insertedId }` );

      // Step 4: Send GET request to fetch the created screening by ID
      const getResponse = await fetch( `http://localhost:4000/api/screenings/${ insertedId }`, {
        method: 'GET',
      } );

      const getResponseBody = await getResponse.json();
      expect( getResponse.status ).to.equal( 200 );

      // Verify the screening details match the POST request
      const responseTime = new Date( getResponseBody.time ).toLocaleString(); // Convert response time to local time
      expect( responseTime ).to.equal( localFormattedTime ); // Verify the time matches in local time zone
      expect( getResponseBody ).to.have.property( 'movieId', 3 );
      expect( getResponseBody ).to.have.property( 'auditoriumId', 1 );

      // console.log( 'GET request successful and screening details are valid!' );

      // Step 5: Send DELETE request to delete the created screening by ID
      const deleteResponse = await fetch( `http://localhost:4000/api/screenings/${ insertedId }`, {
        method: 'DELETE',
      } );

      expect( deleteResponse.status ).to.equal( 200 );
      // console.log( `Screening with ID: ${ insertedId } successfully deleted!` );

      // Verify that the screening no longer exists
      const verifyDeletionResponse = await fetch( `http://localhost:4000/api/screenings/${ insertedId }`, {
        method: 'GET',
      } );

      expect( verifyDeletionResponse.status ).to.equal( 404 );
      console.log( `Verified: Screening with ID ${ insertedId } no longer exists.` );
    } catch ( error ) {
      console.error( 'Error in Playwright test:', error );
    } finally {
      await browser.close();
    }
  },
};
