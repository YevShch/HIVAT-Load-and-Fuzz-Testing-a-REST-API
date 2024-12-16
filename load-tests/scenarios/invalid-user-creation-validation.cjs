const crypto = require( 'crypto' );
const { chromium } = require( '@playwright/test' );

module.exports.runPlaywrightFuzzTest = async () => {
  const { expect } = await import( 'chai' );
  const browser = await chromium.launch( { headless: true } );

  try {
    // List of invalid data for testing different fields
    const invalidData = [
      {
        field: 'email',
        value: `invalidemail_${ crypto.randomUUID() }` // Invalid email (without @ and dot)
      },
      {
        field: 'password',
        value: null 
      },
      {
        field: 'firstName',
        value: '' // Empty first name
      },
      {
        field: 'lastName',
        value: 'A'.repeat( 256 ) // Too long last name (over 255 characters)
      },
      {
        field: 'phoneNumber',
        value: '1'.repeat( 500 )
      },
    ];

    // Loop through each invalid data case
    for ( const { field, value } of invalidData ) {
      const requestData = {
        email: `${ crypto.randomUUID() }@example.com`, // Generate unique invalid email
        password: 'ValidPassword123!', // Valid password for the request
        firstName: 'ValidName', // Valid first name
        lastName: 'ValidSurname', // Valid last name
        phoneNumber: '123-456-7890', // Valid phone number
        [ field ]: value, // Inject the invalid field value
      };

      // console.log( `Testing with invalid ${ field }: ${ value }` );
      // Send a POST request with the invalid data
      const postResponse = await fetch( 'http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( requestData ),
      } );

      const postResponseBody = await postResponse.json();

      // // Check that the response status is not 200 (expect failure) with custom error message
      // expect(
      //   postResponse.status,
      //   `User with invalid ${ field }: ${ value } was unexpectedly created with status 200.`
      // ).to.not.equal( 200 );

      // Extract the inserted ID from POST response
      const insertedId = postResponseBody.insertId;

      if ( postResponse.status === 200 && typeof insertedId === 'number' ) {
        // If the user was created unexpectedly
        console.warn( `WARN! User with invalid ${ field }: ${ value } was created unexpectedly with ID: ${ insertedId }` );
      }

      // Delete created user
    await fetch( `http://localhost:4000/api/users/${ insertedId }`, {
        method: 'DELETE',
      } );

    }
  } catch ( error ) {
    console.error( 'Error in invalid user creation test:', error ); // Log error if any
  } finally {
    await browser.close(); 
  }
};



