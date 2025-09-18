/**
 * Debug Image Integration Utility
 * Run this in browser console to diagnose image integration issues
 */

import FrontendImageService from '../services/frontendImageService';
import API_CONFIG from '../config/api';

/**
 * Comprehensive debug function for image integration
 */
export const debugImageIntegration = async () => {
  console.log('🧪 Starting Image Integration Debug...');
  console.log('=' .repeat(50));

  const results = {
    apiConfig: {},
    apiTests: {},
    componentTests: {},
    recommendations: []
  };

  try {
    // Test 1: Check API Configuration
    console.log('\n🔧 1. Checking API Configuration...');
    results.apiConfig = {
      baseUrl: API_CONFIG.BASE_URL,
      environment: API_CONFIG.ENVIRONMENT,
      endpoints: API_CONFIG.ENDPOINTS
    };
    console.log('✅ API Base URL:', API_CONFIG.BASE_URL);
    console.log('✅ Environment:', API_CONFIG.ENVIRONMENT);

    // Test 2: Test API Endpoints
    console.log('\n📡 2. Testing API Endpoints...');
    
    // Test public images endpoint
    try {
      const publicImages = await FrontendImageService.getAllActiveImages({ limit: 5 });
      results.apiTests.allImages = {
        success: true,
        count: publicImages.length,
        images: publicImages
      };
      console.log(`✅ All Active Images: ${publicImages.length} found`);
    } catch (error) {
      results.apiTests.allImages = {
        success: false,
        error: error.message
      };
      console.log('❌ All Active Images failed:', error.message);
    }

    // Test product images specifically
    try {
      const productImages = await FrontendImageService.getProductImages();
      results.apiTests.productImages = {
        success: true,
        count: productImages.length,
        images: productImages
      };
      console.log(`✅ Product Images: ${productImages.length} found`);
      
      if (productImages.length > 0) {
        console.log('📋 Product Images Details:');
        productImages.forEach((img, index) => {
          console.log(`   ${index + 1}. "${img.title}" (${img.category}) - Active: ${img.isActive}`);
          console.log(`      URL: ${img.imageUrl}`);
          console.log(`      Alt: ${img.altText}`);
          if (img.tags && img.tags.length > 0) {
            console.log(`      Tags: ${img.tags.join(', ')}`);
          }
          console.log('');
        });
      }
    } catch (error) {
      results.apiTests.productImages = {
        success: false,
        error: error.message
      };
      console.log('❌ Product Images failed:', error.message);
    }

    // Test 3: Check Component Integration
    console.log('\n🎨 3. Checking Component Integration...');
    
    // Check if ProductImageGallery component exists
    const galleryExists = !!document.querySelector('[data-component="ProductImageGallery"]');
    results.componentTests.galleryExists = galleryExists;
    console.log(`${galleryExists ? '✅' : '❌'} ProductImageGallery component in DOM`);

    // Check for Featured Images section
    const featuredSection = document.querySelector('h3');
    const hasFeaturedSection = featuredSection && featuredSection.textContent.includes('Featured Images');
    results.componentTests.featuredSection = hasFeaturedSection;
    console.log(`${hasFeaturedSection ? '✅' : '❌'} Featured Images section found`);

    // Test 4: Check Current Page
    console.log('\n📄 4. Checking Current Page...');
    const currentPath = window.location.pathname;
    console.log('✅ Current Path:', currentPath);
    
    const isProductPage = currentPath.includes('/products') || currentPath.includes('/buy-now') || currentPath.includes('/rent-now');
    console.log(`${isProductPage ? '✅' : '⚠️'} On product-related page: ${isProductPage}`);

    // Test 5: Check for Errors
    console.log('\n🚨 5. Checking for JavaScript Errors...');
    const errorCount = window.console._errors?.length || 0;
    console.log(`${errorCount === 0 ? '✅' : '⚠️'} JavaScript errors: ${errorCount}`);

    // Generate Recommendations
    console.log('\n💡 Recommendations:');
    
    if (!results.apiTests.productImages?.success) {
      results.recommendations.push('Fix product images API endpoint');
      console.log('🔧 1. Check backend server and image routes');
    } else if (results.apiTests.productImages.count === 0) {
      results.recommendations.push('Add product images in admin panel');
      console.log('🔧 1. Go to /admin/images and add images with category="product"');
    } else if (!results.componentTests.featuredSection) {
      results.recommendations.push('Check ProductImageGallery component rendering');
      console.log('🔧 1. Check browser console for component errors');
      console.log('🔧 2. Verify ProductImageGallery is properly imported and used');
    } else {
      console.log('✅ Everything looks good! Images should be displaying.');
    }

    // Final Summary
    console.log('\n📊 Debug Summary:');
    console.log('=' .repeat(50));
    console.log('API Configuration:', results.apiConfig.baseUrl ? '✅' : '❌');
    console.log('Product Images API:', results.apiTests.productImages?.success ? '✅' : '❌');
    console.log('Product Image Count:', results.apiTests.productImages?.count || 0);
    console.log('Component Integration:', results.componentTests.featuredSection ? '✅' : '❌');
    
    return results;

  } catch (error) {
    console.error('❌ Debug failed:', error);
    return { error: error.message };
  }
};

/**
 * Quick test function for browser console
 */
export const quickImageTest = async () => {
  console.log('🚀 Quick Image Test...');
  
  try {
    const images = await FrontendImageService.getProductImages();
    console.log(`Found ${images.length} product images:`, images);
    
    if (images.length > 0) {
      console.log('✅ Images are available - check if ProductImageGallery component is rendering');
    } else {
      console.log('❌ No product images found - add images in admin panel');
    }
    
    return images;
  } catch (error) {
    console.error('❌ Quick test failed:', error);
    return [];
  }
};

/**
 * Test image URL accessibility
 */
export const testImageUrls = async () => {
  console.log('🔗 Testing Image URL Accessibility...');
  
  try {
    const images = await FrontendImageService.getProductImages();
    
    for (const image of images) {
      console.log(`Testing: ${image.title}`);
      
      // Test if image URL is accessible
      const img = new Image();
      img.onload = () => console.log(`✅ ${image.title}: Image loads successfully`);
      img.onerror = () => console.log(`❌ ${image.title}: Image failed to load - ${image.imageUrl}`);
      img.src = image.imageUrl;
    }
  } catch (error) {
    console.error('❌ URL test failed:', error);
  }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
  window.debugImageIntegration = debugImageIntegration;
  window.quickImageTest = quickImageTest;
  window.testImageUrls = testImageUrls;
}
