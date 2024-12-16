const { chromium } = require( '@playwright/test' );
const crypto = require( 'crypto' );

module.exports = {
  runValidUserCreationTest: async () => {
    const { expect } = await import( 'chai' );
    const browser = await chromium.launch( { headless: true } );

    try {
      const validData = {
        email: `user_${ crypto.randomUUID() }@example.com`,
        password: 'ValidPassword123!',
        firstName: 'ValidName',
        lastName: 'ValidSurname',
        phoneNumber: '123-456-7890',
      };

      // Measure time for POST request
      const startPostTime = Date.now();

      // Send a POST request to create the user
      const postResponse = await fetch( 'http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( validData ),
      } );

      const postResponseBody = await postResponse.json();
      const endPostTime = Date.now();
      const postRequestDuration = endPostTime - startPostTime; // Response time for POST request

      console.log( `POST request duration (valid data): ${ postRequestDuration }ms` );

      // Check that the response is successful
      expect( postResponse.status ).to.equal( 200 ); // Expect a successful response
      expect( postResponseBody ).to.have.property( 'insertId' ); // Check that the response contains insertId

      // Extract the inserted ID from POST response
      const insertedId = postResponseBody.insertId;
      expect( insertedId ).to.be.a( 'number' );

      // Measure time for DELETE request
      const startDeleteTime = Date.now();

      //DELETE created user
      const deleteResponse = await fetch( `http://localhost:4000/api/users/${ insertedId }`, {
        method: 'DELETE',
      } );

      const endDeleteTime = Date.now();
      const deleteRequestDuration = endDeleteTime - startDeleteTime; // Response time for DELETE request

      console.log( `DELETE request duration (valid data): ${ deleteRequestDuration }ms` );

      // Check if the response status for DELETE is OK
      expect( deleteResponse.status ).to.equal( 200 );
    } catch ( error ) {
      console.error( 'Error in valid user creation test:', error ); 
    } finally {
      await browser.close(); 
    }
  },

  

  runInvalidUserCreationTest: async () => {
    const browser = await chromium.launch( { headless: true } );

    try {
      // List of invalid data for testing different fields
      const invalidData = [
        {
          field: 'email',
          value: null,
        },
        {
          field: 'password',
          value: '{}'.repeat( 25600 ),
        },
        {
          field: 'firstName',
          value: null,
        },
        {
          field: 'lastName',
          value: 'A'.repeat( 25600 ),
        },
        {
          field: 'phoneNumber',
          value: '123ABC456'.repeat( 1000 ), 
        },
      ];

      // Loop through each invalid data case
      for ( const { field, value } of invalidData ) {
        const requestData = {
          email: `${ crypto.randomUUID() }@example.com`, 
          password: 'ValidPassword123!',
          firstName: 'ValidName', 
          lastName: 'ValidSurname', 
          phoneNumber: '123-456-7890', 
          [ field ]: value, 
        };

        const startPostTime = Date.now();

        // Send a POST request with the invalid data
        const postResponse = await fetch( 'http://localhost:4000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( requestData ),
        } );

        const postResponseBody = await postResponse.json();
        const endPostTime = Date.now();
        const postRequestDuration = endPostTime - startPostTime; 

        // Print time for invalid request
        console.log( `POST request duration (invalid data - ${ field }): ${ postRequestDuration }ms` );

      }
    } catch ( error ) {
      console.error( 'Error in invalid user creation test:', error ); 
    } finally {
      await browser.close(); 
    }
  },


  runInvalidJsonTest: async () => {
    const browser = await chromium.launch( { headless: true } );
    try {
      const invalidJsonBodies = [
        '{email: "missing quotes around key"}', // Invalid JSON: Missing quotes for key
        '{"email": user@example.com}', // Invalid JSON: Missing quotes for value
        '{"email": "test@example.com",}', // Invalid JSON: Trailing comma
        '', 
        'null', 
      ];

      for ( const invalidJson of invalidJsonBodies ) {
        // console.log( `Testing with invalid JSON: ${ invalidJson }` );

        const startPostTime = Date.now();

        const postResponse = await fetch( 'http://localhost:4000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: invalidJson,
        } );

        const endPostTime = Date.now();
        const postRequestDuration = endPostTime - startPostTime;

        console.log( `POST request duration (invalid JSON): ${ postRequestDuration }ms` );

        if ( postResponse.status !== 400 ) {
          console.warn( `Unexpected response status: ${ postResponse.status } for invalid JSON` );
        } else {
          console.log( `Server correctly returned status 400 for invalid JSON` );
        }

        // try {
        //   const responseBody = await postResponse.json();
        //   console.log( `Response body:`, responseBody );
        // } catch ( error ) {
        //   console.error( `Error parsing response body for invalid JSON:`, error );
        // }
      }
    } catch ( error ) {
      console.error( 'Error in invalid JSON test:', error );
    } finally {
      await browser.close();
    }
  },
};
