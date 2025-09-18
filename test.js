/**
 * Comprehensive Test Script for Admin Image Integration
 * Run this with: node test.js
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE = 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:5173';

// Test results storage
const testResults = {
  backendServer: false,
  frontendServer: false,
  apiEndpoints: {},
  imageData: {},
  errors: []
};

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (err) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Test backend server availability
 */
async function testBackendServer() {
  console.log('\n🔍 Testing Backend Server...');
  
  try {
    const response = await makeRequest(`${API_BASE}/`);
    
    if (response.statusCode === 200) {
      console.log('✅ Backend server is running');
      console.log('📊 Response:', response.data);
      testResults.backendServer = true;
      return true;
    } else {
      console.log('❌ Backend server returned status:', response.statusCode);
      testResults.errors.push(`Backend server status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend server not accessible:', error.message);
    testResults.errors.push(`Backend server error: ${error.message}`);
    return false;
  }
}

/**
 * Test frontend server availability
 */
async function testFrontendServer() {
  console.log('\n🔍 Testing Frontend Server...');
  
  try {
    const response = await makeRequest(FRONTEND_BASE);
    
    if (response.statusCode === 200) {
      console.log('✅ Frontend server is running');
      testResults.frontendServer = true;
      return true;
    } else {
      console.log('❌ Frontend server returned status:', response.statusCode);
      testResults.errors.push(`Frontend server status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend server not accessible:', error.message);
    testResults.errors.push(`Frontend server error: ${error.message}`);
    return false;
  }
}

/**
 * Test image API endpoints
 */
async function testImageEndpoints() {
  console.log('\n🔍 Testing Image API Endpoints...');
  
  const endpoints = [
    { name: 'Public Images', url: `${API_BASE}/images/public` },
    { name: 'Product Images', url: `${API_BASE}/images/public?category=product` },
    { name: 'All Categories', url: `${API_BASE}/images/public?category=all` },
    { name: 'Hero Images', url: `${API_BASE}/images/public?category=hero` },
    { name: 'Banner Images', url: `${API_BASE}/images/public?category=banner` }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing: ${endpoint.name}`);
      const response = await makeRequest(endpoint.url);
      
      if (response.statusCode === 200) {
        const imageCount = response.data?.data?.images?.length || 0;
        console.log(`✅ ${endpoint.name}: ${imageCount} images found`);
        
        testResults.apiEndpoints[endpoint.name] = {
          working: true,
          imageCount,
          data: response.data
        };

        // Store detailed image data for analysis
        if (endpoint.name === 'Product Images' && imageCount > 0) {
          testResults.imageData.productImages = response.data.data.images;
          console.log('📋 Product Image Details:');
          response.data.data.images.forEach((img, index) => {
            console.log(`   ${index + 1}. ${img.title} (${img.category}) - ${img.isActive ? 'Active' : 'Inactive'}`);
            console.log(`      URL: ${img.imageUrl}`);
            console.log(`      Alt: ${img.altText}`);
            console.log('');
          });
        }
      } else {
        console.log(`❌ ${endpoint.name}: Status ${response.statusCode}`);
        testResults.apiEndpoints[endpoint.name] = {
          working: false,
          statusCode: response.statusCode,
          error: response.data
        };
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
      testResults.apiEndpoints[endpoint.name] = {
        working: false,
        error: error.message
      };
    }
  }
}

/**
 * Test database connection
 */
async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...');
  
  try {
    const response = await makeRequest(`${API_BASE}/images/public?limit=1`);
    
    if (response.statusCode === 200) {
      console.log('✅ Database connection working');
      console.log('📊 Database response structure:', {
        success: response.data?.success,
        hasData: !!response.data?.data,
        hasImages: !!response.data?.data?.images,
        imageCount: response.data?.data?.images?.length || 0,
        hasPagination: !!response.data?.data?.pagination
      });
      return true;
    } else {
      console.log('❌ Database connection issue - Status:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Analyze image data quality
 */
function analyzeImageData() {
  console.log('\n🔍 Analyzing Image Data Quality...');
  
  if (!testResults.imageData.productImages || testResults.imageData.productImages.length === 0) {
    console.log('❌ No product images found to analyze');
    return;
  }

  console.log('📊 Image Analysis:');
  testResults.imageData.productImages.forEach((img, index) => {
    console.log(`\n📷 Image ${index + 1}: ${img.title}`);
    console.log(`   ✅ ID: ${img._id}`);
    console.log(`   ✅ Category: ${img.category}`);
    console.log(`   ✅ Active: ${img.isActive}`);
    console.log(`   ✅ URL: ${img.imageUrl ? 'Present' : 'Missing'}`);
    console.log(`   ✅ Alt Text: ${img.altText ? 'Present' : 'Missing'} (${img.altText?.length || 0} chars)`);
    console.log(`   ✅ SEO Title: ${img.seoTitle || 'Not set'}`);
    console.log(`   ✅ Tags: ${img.tags?.length || 0} tags`);
    console.log(`   ✅ Display Order: ${img.displayOrder || 0}`);
    
    // Check for potential issues
    const issues = [];
    if (!img.imageUrl) issues.push('Missing image URL');
    if (!img.altText || img.altText.length < 10) issues.push('Alt text too short');
    if (!img.isActive) issues.push('Image not active');
    if (img.category !== 'product') issues.push('Wrong category');
    
    if (issues.length > 0) {
      console.log(`   ⚠️  Issues: ${issues.join(', ')}`);
    } else {
      console.log('   ✅ No issues found');
    }
  });
}

/**
 * Test specific frontend integration
 */
async function testFrontendIntegration() {
  console.log('\n🔍 Testing Frontend Integration...');
  
  // Test if the public endpoint works as expected
  try {
    console.log('📡 Testing public API call...');
    const response = await makeRequest(`${API_BASE}/images/public?category=product&isActive=true&sortBy=displayOrder&sortOrder=asc&limit=8`);
    
    if (response.statusCode === 200) {
      const images = response.data?.data?.images || [];
      console.log(`✅ Frontend API call successful: ${images.length} images`);
      
      if (images.length > 0) {
        console.log('📋 Images that should appear on frontend:');
        images.forEach((img, index) => {
          console.log(`   ${index + 1}. "${img.title}" - ${img.imageUrl}`);
        });
      } else {
        console.log('⚠️  No images returned - check image category and active status');
      }
      
      return images;
    } else {
      console.log('❌ Frontend API call failed:', response.statusCode);
      return [];
    }
  } catch (error) {
    console.log('❌ Frontend integration test failed:', error.message);
    return [];
  }
}

/**
 * Generate troubleshooting recommendations
 */
function generateRecommendations() {
  console.log('\n💡 Troubleshooting Recommendations:');
  
  if (!testResults.backendServer) {
    console.log('🔧 1. Start backend server: cd backend && npm start');
  }
  
  if (!testResults.frontendServer) {
    console.log('🔧 2. Start frontend server: cd frontend && npm run dev');
  }
  
  const productImageCount = testResults.apiEndpoints['Product Images']?.imageCount || 0;
  
  if (productImageCount === 0) {
    console.log('🔧 3. Add product images:');
    console.log('   - Go to /admin/images');
    console.log('   - Click "Add New Image"');
    console.log('   - Set Category to "product"');
    console.log('   - Make sure "Active" is checked');
  }
  
  if (productImageCount > 0) {
    console.log('🔧 4. Check frontend console:');
    console.log('   - Go to /products page');
    console.log('   - Open browser console (F12)');
    console.log('   - Look for ProductImageGallery debug messages');
    console.log('   - Check for any JavaScript errors');
  }
  
  console.log('🔧 5. Clear browser cache and refresh');
  console.log('🔧 6. Check if "Featured Images" section appears above products');
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🧪 Starting Comprehensive Image Integration Tests...');
  console.log('=' .repeat(60));
  
  // Test 1: Server availability
  const backendRunning = await testBackendServer();
  const frontendRunning = await testFrontendServer();
  
  if (!backendRunning) {
    console.log('\n❌ Cannot continue tests - Backend server not running');
    console.log('💡 Start backend with: cd backend && npm start');
    return;
  }
  
  // Test 2: Database connection
  await testDatabaseConnection();
  
  // Test 3: API endpoints
  await testImageEndpoints();
  
  // Test 4: Image data analysis
  analyzeImageData();
  
  // Test 5: Frontend integration
  await testFrontendIntegration();
  
  // Generate recommendations
  generateRecommendations();
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('=' .repeat(60));
  console.log(`Backend Server: ${testResults.backendServer ? '✅ Running' : '❌ Not Running'}`);
  console.log(`Frontend Server: ${testResults.frontendServer ? '✅ Running' : '❌ Not Running'}`);
  
  Object.entries(testResults.apiEndpoints).forEach(([name, result]) => {
    console.log(`${name}: ${result.working ? '✅' : '❌'} ${result.imageCount || 0} images`);
  });
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ Errors Found:');
    testResults.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  console.log('\n🎯 Next Steps:');
  if (testResults.apiEndpoints['Product Images']?.imageCount > 0) {
    console.log('✅ Product images exist in database');
    console.log('🔍 Check frontend console on /products page for component rendering issues');
  } else {
    console.log('⚠️  No product images found');
    console.log('📝 Add images in admin panel with category="product" and active=true');
  }
  
  console.log('\n🏁 Test completed!');
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run tests
runAllTests().catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
