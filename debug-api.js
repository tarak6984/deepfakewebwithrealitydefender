// Enhanced Reality Defender API Debug Script
// This will help us understand the actual API response structure

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_RD_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_RD_API_URL || 'https://api.prd.realitydefender.xyz';

console.log('🔍 Enhanced Reality Defender API Debug...\n');
console.log('Configuration:');
console.log('  API Key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('  Base URL:', API_URL);
console.log('  API Required: Reality Defender API key must be configured');
console.log('');

async function testRecentAnalysis() {
  try {
    // Let's test the endpoint that worked before but see the full response
    console.log('🧪 Testing file upload endpoint...');
    const uploadResponse = await fetch(`${API_URL}/api/files/aws-presigned`, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'debug-test.jpg'
      }),
    });

    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      console.log('✅ Upload endpoint response:');
      console.log(JSON.stringify(uploadData, null, 2));
      
      const requestId = uploadData.requestId || uploadData.mediaId;
      if (requestId) {
        console.log(`\n🔄 Testing result polling for ID: ${requestId}`);
        
        // Wait a moment then try to get results
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const resultResponse = await fetch(`${API_URL}/api/media/users/${requestId}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': API_KEY,
          },
        });
        
        if (resultResponse.ok) {
          const resultData = await resultResponse.json();
          console.log('📊 Result endpoint response:');
          console.log(JSON.stringify(resultData, null, 2));
          
          // Analyze the structure
          console.log('\n🔍 Response Structure Analysis:');
          console.log('- Status:', resultData.status || resultData.resultsSummary?.status || 'unknown');
          console.log('- Overall Score:', resultData.overallScore || resultData.resultsSummary?.overallScore || 'not found');
          console.log('- Confidence:', resultData.confidence || resultData.resultsSummary?.confidence || 'not found');
          console.log('- Predictions:', resultData.predictions ? 'available' : 'not found');
          console.log('- Results Summary:', resultData.resultsSummary ? 'available' : 'not found');
          
        } else {
          console.log('❌ Result endpoint failed:', resultResponse.status, resultResponse.statusText);
          const errorText = await resultResponse.text();
          console.log('Error details:', errorText);
        }
      }
    } else {
      console.log('❌ Upload endpoint failed:', uploadResponse.status, uploadResponse.statusText);
      const errorText = await uploadResponse.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.message);
  }
}

// Run the enhanced test
testRecentAnalysis();