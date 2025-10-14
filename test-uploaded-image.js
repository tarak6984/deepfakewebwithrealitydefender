// Direct Reality Defender API Test with Uploaded Image
// This will test the actual API response for the horse mask image

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_RD_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_RD_API_URL || 'https://api.prd.realitydefender.xyz';

console.log('🧪 Testing Reality Defender API with uploaded image...\n');
console.log('Configuration:');
console.log('  API Key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('  Base URL:', API_URL);
console.log('');

async function testImageAnalysis() {
  try {
    // First, let's get a signed URL for upload
    console.log('📤 Step 1: Getting signed URL for image upload...');
    const signedUrlResponse = await fetch(`${API_URL}/api/files/aws-presigned`, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'horse-mask-test.jpg'
      }),
    });

    if (!signedUrlResponse.ok) {
      throw new Error(`Failed to get signed URL: ${signedUrlResponse.status}`);
    }

    const signedUrlData = await signedUrlResponse.json();
    console.log('✅ Signed URL obtained:', {
      requestId: signedUrlData.requestId || signedUrlData.mediaId,
      hasSignedUrl: !!signedUrlData.response?.signedUrl
    });

    // For this test, we'll simulate the upload since we can't directly upload the browser image
    // Instead, let's check if we can get results for a recent upload
    const requestId = signedUrlData.requestId || signedUrlData.mediaId;
    
    console.log(`\n🔄 Step 2: Checking analysis results for ID: ${requestId}`);
    
    // Try multiple times to get results (since it might be processing)
    for (let attempt = 1; attempt <= 10; attempt++) {
      console.log(`\n--- Polling attempt ${attempt} ---`);
      
      const resultResponse = await fetch(`${API_URL}/api/media/users/${requestId}`, {
        method: 'GET',
        headers: {
          'X-API-KEY': API_KEY,
        },
      });

      if (resultResponse.ok) {
        const resultData = await resultResponse.json();
        console.log('📊 Raw API Response:');
        console.log(JSON.stringify(resultData, null, 2));
        
        // Analyze the response structure
        console.log('\n🔍 Response Analysis:');
        console.log('- Status:', resultData.status || resultData.resultsSummary?.status || 'unknown');
        console.log('- Overall Score:', resultData.overallScore || resultData.resultsSummary?.overallScore || 'not found');
        console.log('- Confidence:', resultData.confidence || resultData.resultsSummary?.confidence || 'not found');
        console.log('- Prediction:', resultData.prediction || resultData.resultsSummary?.prediction || 'not found');
        
        // Look for any score fields
        const allKeys = Object.keys(resultData);
        console.log('- Available fields:', allKeys);
        
        // Check if analysis is complete
        const status = resultData.status || resultData.resultsSummary?.status || 'unknown';
        if (status !== 'ANALYZING' && status !== 'PROCESSING' && status !== 'QUEUED') {
          console.log('\n✅ Analysis complete!');
          break;
        } else {
          console.log(`⏳ Still processing (status: ${status}), waiting 3 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } else {
        console.log(`❌ Polling failed with status ${resultResponse.status}`);
        const errorText = await resultResponse.text();
        console.log('Error details:', errorText);
      }
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.message);
    console.log('Stack:', error.stack);
  }
}

// Also let's check what happens when we call our app's API endpoints
async function testAppEndpoints() {
  console.log('\n🌐 Testing app\'s internal API endpoints...');
  
  try {
    // Test the signed URL endpoint through our Next.js API
    const response = await fetch('http://localhost:3001/api/rd/signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'horse-mask-test.jpg'
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ App API working:', {
        requestId: data.requestId || data.mediaId,
        hasSignedUrl: !!data.response?.signedUrl
      });
    } else {
      console.log('❌ App API failed:', response.status);
    }
  } catch (error) {
    console.log('❌ App API test failed:', error.message);
    console.log('ℹ️  Make sure the dev server is running on localhost:3001');
  }
}

// Run both tests
async function runAllTests() {
  await testImageAnalysis();
  await testAppEndpoints();
}

runAllTests();