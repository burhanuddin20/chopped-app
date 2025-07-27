const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

async function testBackend() {
  console.log('🧪 Testing Chopped Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthData);
      return;
    }

    console.log('\n2. Testing analysis endpoint with mock data...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('images', testImageBuffer, {
      filename: 'test1.jpg',
      contentType: 'image/jpeg'
    });
    form.append('images', testImageBuffer, {
      filename: 'test2.jpg',
      contentType: 'image/jpeg'
    });
    form.append('imageTypes', 'front');
    form.append('imageTypes', 'side');

    const analysisResponse = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: form
    });

    if (analysisResponse.ok) {
      const analysisData = await analysisResponse.json();
      console.log('✅ Analysis endpoint working:');
      console.log('   Score:', analysisData.score);
      console.log('   Breakdown:', analysisData.breakdown);
      console.log('   Suggestions available:', Object.keys(analysisData.suggestions).length);
    } else {
      const errorData = await analysisResponse.text();
      console.log('❌ Analysis endpoint failed:', errorData);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - Backend server is running (npm run dev)');
    console.log('   - OpenAI API key is set in .env file');
    console.log('   - Port 3000 is available');
  }
}

// Run the test
testBackend();