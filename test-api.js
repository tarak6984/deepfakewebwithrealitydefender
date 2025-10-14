// Reality Defender API Test Script
// Run this with: node test-api.js

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_RD_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_RD_API_URL || 'https://api.realitydefender.com';

async function testAPIConnection() {
  console.log('🔍 Testing Reality Defender API Connection...\n');
  
  // Check if API key is configured
  if (!API_KEY || API_KEY === 'your_reality_defender_api_key_here') {
    console.log('❌ API Key not configured');
    console.log('📝 To use the app:');
    console.log('   1. Get free API key from: https://www.realitydefender.com/platform/api');
    console.log('   2. Update NEXT_PUBLIC_RD_API_KEY in .env.local');
    console.log('\n❌ App requires a valid API key to function\n');
    return;
  }
  
  console.log('✅ API Key configured:', API_KEY.substring(0, 8) + '...');
  console.log('🔗 API URL:', API_URL);
  
  try {
    // Test API signed URL endpoint (what the SDK actually uses)
    const response = await fetch(`${API_URL}/api/files/aws-presigned`, {
      method: 'POST',
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: 'test-connection.jpg'
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Connection successful!');
      console.log('📊 Status:', data);
    } else {
      console.log('❌ API Connection failed');
      console.log('📄 Status:', response.status, response.statusText);
      
      if (response.status === 401) {
        console.log('🔑 Check your API key - it might be invalid');
      } else if (response.status === 429) {
        console.log('⏱️ Rate limit reached - wait before retrying');
      }
    }
    
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    console.log('🌐 Check your internet connection and API URL');
  }
  
  console.log('\n📖 API Documentation: https://docs.realitydefender.com/');
  console.log('💬 Support: https://www.realitydefender.com/support');
}

// Run the test
testAPIConnection();