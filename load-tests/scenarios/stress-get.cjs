const { chromium } = require( '@playwright/test' );

module.exports = {
  runGetUsersTest: async () => {
    const browser = await chromium.launch( { headless: true } );
   
    const startTime = Date.now(); // Add startTime definition here

    try {
      // Send GET request to /api/users
      const response = await fetch( 'http://localhost:4000/api/users', { method: 'GET' } );

      // Measure response time
      const responseTime = Date.now() - startTime;
      console.log( "Response time for request is :", responseTime )

      // Check if the response status is 200 OK
      if ( response.status !== 200 ) {
        throw new Error( `Request failed with status: ${ response.status }` );
      }

      const jsonResponse = await response.json();

      // Validate the response structure
      if ( !Array.isArray( jsonResponse ) ) {
        console.error( `Invalid response: ${ JSON.stringify( jsonResponse, null, 2 ) }` );
        throw new Error( 'Invalid response structure' );
      }

      jsonResponse.forEach( ( item, index ) => {
        const validateField = ( field, type, allowEmpty = false ) => {
          if ( typeof item[ field ] !== type || ( !allowEmpty && type === 'string' && !item[ field ].trim() ) ) {
            console.error( `Invalid or missing '${ field }' at index ${ index }: ${ JSON.stringify( item ) }` );
            throw new Error( `Invalid or missing '${ field }' at index ${ index }` );
          }
        };

        // Validate fields
        validateField( 'id', 'number' );
        validateField( 'email', 'string' );
        validateField( 'password', 'string' );
        validateField( 'firstName', 'string' );
        validateField( 'lastName', 'string' );
        validateField( 'phoneNumber', 'string' );
      } );

      console.log( 'All items in the response are valid' );

      // Optionally: Save the response to a log file
      // fs.writeFileSync('response-log-users.json', JSON.stringify(jsonResponse, null, 2));

    } catch ( error ) {
      console.error( 'Error during test execution:', error.message );
    } finally {
      await browser.close();
    }
  },


  runBookingsXseatsTest: async () => {
    const browser = await chromium.launch( { headless: true } );
    const startTime = Date.now(); // Record the start time of the request

    try {
      const response = await fetch( 'http://localhost:4000/api/bookingsXseats', { method: 'GET' } );

      // Measure response time
      const responseTime = Date.now() - startTime;
      console.log("Response time for request is :", responseTime)

      if ( response.status !== 200 ) {
        throw new Error( `Request failed with status: ${ response.status }` );
      }

      const jsonResponse = await response.json();

      // Validate the response structure
      if ( !Array.isArray( jsonResponse ) ) {
        console.error( `Invalid response: ${ JSON.stringify( jsonResponse, null, 2 ) }` );
        throw new Error( 'Invalid response structure' );
      }

      jsonResponse.forEach( ( item, index ) => {
        const validateField = ( field, type, allowEmpty = false ) => {
          if ( typeof item[ field ] !== type || ( !allowEmpty && type === 'string' && !item[ field ].trim() ) ) {
            console.error( `Invalid or missing '${ field }' at index ${ index }: ${ JSON.stringify( item ) }` );
            throw new Error( `Invalid or missing '${ field }' at index ${ index }` );
          }
        };

        // Validate fields
        validateField( 'bookingId', 'number' );
        validateField( 'seatId', 'number' );
        validateField( 'ticketTypeId', 'number' );
      } );

      console.log( 'All items in the response are valid' );

      // Optionally: Save the response to a log file
      // fs.writeFileSync('response-log-bookingsXseats.json', JSON.stringify(jsonResponse, null, 2));

    } catch ( error ) {
      console.error( 'Error during test execution:', error.message );
    } finally {
      await browser.close();
    }
  }
};

