const crypto = require( 'crypto' );
const { chromium } = require( '@playwright/test' );

module.exports = {
  createUserAndFetchMovies: async () => {
    const { expect } = await import( 'chai' );
    const browser = await chromium.launch( { headless: true } );

    try {
      // Generate unique email for each test run
      const uniqueEmail = `user_${ crypto.randomUUID() }@example.com`;

      // Step 1: Send POST request to create a user
      const startTime = Date.now(); 
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
      const responseTime = Date.now() - startTime; 
      expect( postResponse.status ).to.equal( 200 );
      console.log( `User created with email: ${ uniqueEmail } | Response time: ${ responseTime }ms` );

      // Step 2: Send 100 GET requests to fetch movies
      for ( let i = 1; i <= 100; i++ ) {
        const startTime = Date.now(); 
        const response = await fetch( 'http://localhost:4000/api/movies', { method: 'GET' } );

        const responseTime = Date.now() - startTime;
        console.log( `GET /api/movies request ${ i } | Status: ${ response.status } | Response time: ${ responseTime }ms` );

        expect( response.status ).to.equal( 200 ); 
      }

      console.log( 'Completed 100 GET requests to /api/movies.' );
    } catch ( error ) {
      console.error( 'Error in Playwright test:', error );
    } finally {
      await browser.close();
    }
  },
};
