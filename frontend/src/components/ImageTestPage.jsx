import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import FrontendImageService from '../services/frontendImageService';
import ProductImageGallery from './common/ProductImageGallery';
import AdminImage from './common/AdminImage';

/**
 * ImageTestPage Component
 * Test page to verify admin images are working on frontend
 */
const ImageTestPage = () => {
  const [testResults, setTestResults] = useState({
    loading: true,
    apiWorking: false,
    imagesFound: false,
    imageCount: 0,
    error: null,
    images: []
  });

  useEffect(() => {
    // Run tests only once when component mounts
    let isMounted = true;
    
    const runInitialTests = async () => {
      if (isMounted) {
        await runTests();
      }
    };
    
    runInitialTests();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  const runTests = async () => {
    // Prevent multiple simultaneous test runs
    if (testResults.loading) {
      console.log('⏳ Tests already running, skipping...');
      return;
    }

    setTestResults(prev => ({ ...prev, loading: true }));

    try {
      console.log('🔍 Testing Admin Image Integration...');

      // Test 1: Check if API is accessible
      console.log('📡 Testing API connection...');
      const allImages = await FrontendImageService.getAllActiveImages({ limit: 10 });
      
      const apiWorking = Array.isArray(allImages);
      console.log('✅ API Response:', apiWorking ? 'Working' : 'Failed');

      // Test 2: Check if product images exist
      console.log('🖼️ Testing product images...');
      const productImages = await FrontendImageService.getProductImages();
      
      const imagesFound = productImages && productImages.length > 0;
      console.log('✅ Product Images Found:', productImages.length);

      // Test 3: Test category filtering
      console.log('🏷️ Testing category filtering...');
      const heroImages = await FrontendImageService.getHeroImages();
      console.log('✅ Hero Images Found:', heroImages.length);

      // Test 4: Test search functionality
      console.log('🔍 Testing search functionality...');
      const searchResults = await FrontendImageService.searchImages('test');
      console.log('✅ Search Results:', searchResults.length);

      setTestResults({
        loading: false,
        apiWorking,
        imagesFound,
        imageCount: allImages.length,
        error: null,
        images: allImages,
        productImages,
        heroImages,
        searchResults
      });

      console.log('🎉 All tests completed!');

    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResults(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const renderTestResults = () => (
    <Card className="mb-4">
      <Card.Header>
        <h5 style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
          🧪 Admin Image Integration Test Results
        </h5>
      </Card.Header>
      <Card.Body>
        {testResults.loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p className="mt-2">Running tests...</p>
          </div>
        ) : (
          <>
            {testResults.error ? (
              <Alert variant="danger">
                <h6>❌ Test Failed</h6>
                <p>{testResults.error}</p>
                <small>Check browser console for detailed errors</small>
              </Alert>
            ) : (
              <div>
                <Alert variant={testResults.apiWorking ? 'success' : 'danger'}>
                  <h6>📡 API Connection: {testResults.apiWorking ? '✅ Working' : '❌ Failed'}</h6>
                </Alert>

                <Alert variant={testResults.imagesFound ? 'success' : 'warning'}>
                  <h6>🖼️ Images Found: {testResults.imageCount} total images</h6>
                  <p>Product Images: {testResults.productImages?.length || 0}</p>
                  <p>Hero Images: {testResults.heroImages?.length || 0}</p>
                  <p>Search Results: {testResults.searchResults?.length || 0}</p>
                </Alert>

                {!testResults.imagesFound && (
                  <Alert variant="info">
                    <h6>💡 To fix this:</h6>
                    <ol>
                      <li>Go to <code>/admin/images</code></li>
                      <li>Click "Test Create" or "Add New Image"</li>
                      <li>Set Category to "product"</li>
                      <li>Make sure "Active" is checked</li>
                      <li>Refresh this page</li>
                    </ol>
                  </Alert>
                )}
              </div>
            )}

            <Button variant="outline-primary" onClick={runTests} className="mt-2">
              🔄 Run Tests Again
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );

  const renderImagePreview = () => (
    <Card>
      <Card.Header>
        <h5 style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
          🖼️ Image Preview
        </h5>
      </Card.Header>
      <Card.Body>
        {testResults.images && testResults.images.length > 0 ? (
          <Row>
            {testResults.images.slice(0, 4).map((image) => (
              <Col key={image._id} md={3} className="mb-3">
                <AdminImage
                  image={image}
                  height="150px"
                  showTitle={true}
                  showDescription={false}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">No images to preview</p>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', marginBottom: '30px' }}>
            🧪 Admin Image Integration Test
          </h2>
          
          {renderTestResults()}
          
          {!testResults.loading && (
            <>
              {renderImagePreview()}
              
              <Card className="mt-4">
                <Card.Header>
                  <h5 style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
                    🎨 Product Image Gallery Component
                  </h5>
                </Card.Header>
                <Card.Body>
                  <ProductImageGallery
                    category="product"
                    limit={8}
                    columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
                    showTitle={true}
                    showDescription={true}
                    imageHeight="200px"
                    onImageClick={(image) => {
                      alert(`Clicked: ${image.title}`);
                    }}
                  />
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ImageTestPage;
