import 'dotenv/config'; // Load environment variables from .env

async function testShippingApi() {
  const API_URL = 'http://localhost:3000/api/calcShipping';
  const token = process.env.SHIPX_API_TOKEN;
  const organization_id = process.env.SHIPX_ORGANIZATION_ID;

  if (!token || !organization_id) {
    console.error('Error: SHIPX_API_TOKEN or SHIPX_ORGANIZATION_ID is missing in .env file.');
    console.error('Please ensure your .env file has these values set correctly.');
    return;
  }

  const samplePayload = {
    region: "Polska", // Changed from "PL" to "Polska" based on UI
    boxes: 1,
    postcode: "00-001",
    address: "Warsaw"
  };

  try {
    console.log(`Attempting to fetch from: ${API_URL}`);
    console.log(`Using token: ${token ? 'Loaded' : 'Missing'}`);
    console.log(`Using organization_id: ${organization_id ? 'Loaded' : 'Missing'}`);

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...samplePayload
      })
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log('API Test Successful! Response:', data);
    } else {
      const errorText = await resp.text();
      console.error(`API Test Failed! Status: ${resp.status}, Error: ${errorText}`);
    }
  } catch (error) {
    console.error('An error occurred during API test:', error);
  }
}

testShippingApi();
