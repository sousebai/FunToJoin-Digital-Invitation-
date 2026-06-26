// Scratch script to test registration and login endpoints via HTTP requests
const testHttpAuth = async () => {
  const registerUrl = 'http://localhost:5000/api/auth/register';
  const loginUrl = 'http://localhost:5000/api/auth/login';
  const testEmail = `http_test_${Date.now()}@test.com`;

  console.log('--- Testing Registration Endpoint ---');
  try {
    const registerResponse = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'HTTP Test User',
        email: testEmail,
        password: 'password123',
        bio: 'Just testing the server endpoints.',
      }),
    });

    console.log('Registration Status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Registration Response Body:', JSON.stringify(registerData, null, 2));

    if (registerResponse.ok) {
      console.log('\n--- Testing Login Endpoint ---');
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: 'password123',
        }),
      });

      console.log('Login Status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login Response Body:', JSON.stringify(loginData, null, 2));
    }
  } catch (err) {
    console.error('HTTP Auth Test Failed with exception:', err);
  }
};

testHttpAuth();
