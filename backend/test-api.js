const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000';

async function testHealthEndpoint() {
  try {
    console.log('Testing health endpoint...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('Health check response:', data);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

async function testAnalysisEndpoint() {
  try {
    console.log('\nTesting analysis endpoint with mock data...');
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0x00, 0x00,
      0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const formData = new FormData();
    
    // Add two test images
    formData.append('photos', testImageBuffer, {
      filename: 'test1.png',
      contentType: 'image/png'
    });
    formData.append('photoTypes', 'front');
    
    formData.append('photos', testImageBuffer, {
      filename: 'test2.png',
      contentType: 'image/png'
    });
    formData.append('photoTypes', 'side');

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Analysis request failed:', response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log('Analysis response:', JSON.stringify(result, null, 2));
    
    // Validate response structure
    const isValid = result.score && 
                   result.breakdown && 
                   result.suggestions &&
                   typeof result.score === 'number' &&
                   result.score >= 0 && 
                   result.score <= 100;
    
    console.log('Response validation:', isValid ? 'PASSED' : 'FAILED');
    return isValid;

  } catch (error) {
    console.error('Analysis test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('Starting API tests...\n');
  
  const healthOk = await testHealthEndpoint();
  const analysisOk = await testAnalysisEndpoint();
  
  console.log('\n=== Test Results ===');
  console.log('Health endpoint:', healthOk ? 'PASSED' : 'FAILED');
  console.log('Analysis endpoint:', analysisOk ? 'PASSED' : 'FAILED');
  
  if (healthOk && analysisOk) {
    console.log('\n✅ All tests passed! API is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Check the server logs.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testHealthEndpoint, testAnalysisEndpoint };