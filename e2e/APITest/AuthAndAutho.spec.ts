import { test, expect } from '@playwright/test';

test.describe('DummyJSON Dynamic Auth and Authorization Tests', () => {

  let testUsername = '';
  let testPassword = '';

  // Dynamically fetch a valid user from DummyJSON before running the tests
  test.beforeAll(async ({ request }) => {
    const usersResponse = await request.get('https://dummyjson.com/users?limit=1');
    expect(usersResponse.status()).toBe(200);
    
    const data = await usersResponse.json();
    const user = data.users[0];
    
    testUsername = user.username;
    testPassword = user.password; // DummyJSON includes the mock password in the user object
    
    console.log(`Dynamic User Fetched -> Username: ${testUsername} | Password: ${testPassword}`);
  });

  test('Step 1: Authenticate programmatically to get a token', async ({ request }) => {
    const loginResponse = await request.post('https://dummyjson.com/auth/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        username: testUsername,
        password: testPassword,
        expiresInMins: 30
      }
    });

    // If it still fails, print the exact server response message
    if (loginResponse.status() !== 200) {
      console.log('Error Response body:', await loginResponse.text());
    }

    expect(loginResponse.status()).toBe(200);
    
    const responseBody = await loginResponse.json();
    const accessToken = responseBody.token || responseBody.accessToken;
    
    expect(accessToken).toBeTruthy();
    console.log('Successfully Authenticated! Received Token:', accessToken.substring(0, 25) + '...');
  });

  test('Step 2: Use the token to access a protected resource (Authorization)', async ({ request }) => {
    const loginResponse = await request.post('https://dummyjson.com/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      data: { 
        username: testUsername, 
        password: testPassword 
      }
    });
    
    const responseBody = await loginResponse.json();
    const token = responseBody.token || responseBody.accessToken;

    const protectedResponse = await request.get('https://dummyjson.com/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    expect(protectedResponse.status()).toBe(200);
    const userData = await protectedResponse.json();
    
    console.log(`Authorized successfully for user: ${userData.firstName} ${userData.lastName}`);
    expect(userData.username).toBe(testUsername);
  });

  test('Step 3: Negative Test - Access protected route without a token', async ({ request }) => {
    const unauthResponse = await request.get('https://dummyjson.com/auth/me');

    expect(unauthResponse.status()).toBe(401);
    console.log('Successfully blocked unauthenticated request with status 401.');
  });

});