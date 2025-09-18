import React, { useState, useRef } from 'react';
import { Card, Button, Form, Alert, Spinner, Image, ProgressBar } from 'react-bootstrap';
import { Upload, X, CheckCircle, ExclamationTriangle } from 'react-bootstrap-icons';

/**
 * ImageUploader Component
 * Handles file selection, validation, and upload with preview
 */
const ImageUploader = ({ onUploadSuccess, onUploadError, maxFileSize = 5 * 1024 * 1024 }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Accepted file types (prioritizing formats that can be converted to WebP)
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  /**
   * Convert image to WebP format with optimization
   */
  const convertToWebP = (file, quality = 85) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate optimized dimensions (max 1920px width for web)
        let { width, height } = img;
        const maxWidth = 1920;
        const maxHeight = 1080;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with WebP format
              const webpFile = new File([blob], 
                file.name.replace(/\.[^/.]+$/, '.webp'), 
                { 
                  type: 'image/webp',
                  lastModified: Date.now()
                }
              );

              resolve({
                file: webpFile,
                originalFile: file,
                optimizedSize: blob.size,
                originalSize: file.size,
                compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
                dimensions: { width, height },
                originalDimensions: { width: img.width, height: img.height }
              });
            } else {
              reject(new Error('Failed to convert image to WebP'));
            }
          },
          'image/webp',
          quality / 100
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for conversion'));
      img.src = URL.createObjectURL(file);
    });
  };

  /**
   * Optimize image dimensions and quality
   */
  const optimizeImage = async (file) => {
    try {
      // Convert to WebP if not already
      if (file.type !== 'image/webp') {
        const optimized = await convertToWebP(file);
        return optimized;
      } else {
        // If already WebP, just optimize dimensions
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              file: file,
              originalFile: file,
              optimizedSize: file.size,
              originalSize: file.size,
              compressionRatio: 0,
              dimensions: { width: img.width, height: img.height },
              originalDimensions: { width: img.width, height: img.height }
            });
          };
          img.onerror = () => reject(new Error('Failed to analyze WebP image'));
          img.src = URL.createObjectURL(file);
        });
      }
    } catch (error) {
      throw new Error(`Optimization failed: ${error.message}`);
    }
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');
    setSuccess('');

    if (!file) {
      clearSelection();
      return;
    }

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      clearSelection();
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      setError(`File size must be less than ${maxSizeMB}MB`);
      clearSelection();
      return;
    }

    // Auto-optimize image to WebP
    setUploading(true);
    optimizeImage(file)
      .then((optimized) => {
        // Create preview from optimized file
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(optimized.file);

        // Store optimized file and metadata
        setSelectedFile({
          ...optimized.file,
          optimizationData: optimized
        });

        // Show optimization results
        if (optimized.compressionRatio > 0) {
          setSuccess(
            `Image optimized! Converted to WebP format. ` +
            `Size reduced by ${optimized.compressionRatio}% ` +
            `(${formatFileSize(optimized.originalSize)} → ${formatFileSize(optimized.optimizedSize)})`
          );
        } else {
          setSuccess('Image loaded and ready for upload (already optimized)');
        }
      })
      .catch((error) => {
        setError(`Optimization failed: ${error.message}`);
        // Fall back to original file
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  /**
   * Clear file selection
   */
  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle file upload
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // In a real implementation, you would:
      // 1. Create FormData with the file
      // 2. Make a POST request to your upload endpoint
      // 3. Handle the response and get the uploaded file URL
      
      // For now, we'll simulate the upload process
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear progress interval
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Simulate successful upload
      const mockImageUrl = URL.createObjectURL(selectedFile);
      
      // Get image dimensions and optimization data
      const img = new Image();
      img.onload = () => {
        const optimizationData = selectedFile.optimizationData;
        
        const imageData = {
          url: mockImageUrl,
          filename: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          dimensions: {
            width: img.width,
            height: img.height
          },
          // Include optimization metadata
          optimization: optimizationData ? {
            originalSize: optimizationData.originalSize,
            optimizedSize: optimizationData.optimizedSize,
            compressionRatio: optimizationData.compressionRatio,
            originalDimensions: optimizationData.originalDimensions,
            originalFormat: optimizationData.originalFile.type,
            isOptimized: true,
            format: 'webp',
            compressionQuality: 85
          } : {
            isOptimized: false,
            format: selectedFile.type.split('/')[1]
          }
        };

        setSuccess('WebP-optimized image uploaded successfully!');
        
        // Call success callback
        if (onUploadSuccess) {
          onUploadSuccess(imageData);
        }

        // Clear selection after successful upload
        setTimeout(() => {
          clearSelection();
          setSuccess('');
        }, 2000);
      };
      img.src = mockImageUrl;

    } catch (err) {
      setError(err.message || 'Failed to upload image');
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Simulate file input change
      const fakeEvent = {
        target: {
          files: [file]
        }
      };
      handleFileSelect(fakeEvent);
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title style={{ fontFamily: 'Century Gothic, sans-serif', marginBottom: '20px' }}>
          Upload Image
        </Card.Title>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-3">
            <ExclamationTriangle className="me-2" />
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert variant="success" className="mb-3">
            <CheckCircle className="me-2" />
            {success}
          </Alert>
        )}

        {/* Upload Area */}
        <div
          style={{
            border: '2px dashed #dee2e6',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: selectedFile ? '#f8f9fa' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {!selectedFile ? (
            <>
              <Upload size={48} color="#6c757d" className="mb-3" />
              <h5 style={{ fontFamily: 'Century Gothic, sans-serif', color: '#495057' }}>
                Choose an image or drag it here
              </h5>
              <p style={{ fontFamily: 'Poppins, sans-serif', color: '#6c757d', marginBottom: '20px' }}>
                Supports: JPEG, PNG, GIF, WebP (Max: {Math.round(maxFileSize / (1024 * 1024))}MB)
                <br />
                <small style={{ color: '#28a745' }}>
                  ✓ Auto-converts to WebP format for optimal SEO & performance
                </small>
              </p>
              <Button variant="outline-primary" disabled={uploading}>
                <Upload className="me-2" />
                Select Image
              </Button>
            </>
          ) : (
            <div>
              {/* Preview */}
              {previewUrl && (
                <div className="mb-3">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '150px',
                      objectFit: 'contain',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              )}

              {/* File Info */}
              <div className="text-start mb-3">
                <p style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
                  <strong>File:</strong> {selectedFile.name}
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
                  <strong>Size:</strong> {formatFileSize(selectedFile.size)}
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', margin: 0 }}>
                  <strong>Type:</strong> {selectedFile.type}
                </p>
                {selectedFile.optimizationData && (
                  <>
                    <p style={{ fontFamily: 'Poppins, sans-serif', margin: 0, color: '#28a745' }}>
                      <strong>✓ WebP Optimized:</strong> {selectedFile.optimizationData.compressionRatio}% smaller
                    </p>
                    <p style={{ fontFamily: 'Poppins, sans-serif', margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
                      Original: {formatFileSize(selectedFile.optimizationData.originalSize)} → 
                      Optimized: {formatFileSize(selectedFile.optimizationData.optimizedSize)}
                    </p>
                  </>
                )}
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-3">
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    animated={uploadProgress < 100}
                    variant={uploadProgress === 100 ? 'success' : 'primary'}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex justify-content-center gap-2">
                {!uploading ? (
                  <>
                    <Button variant="primary" onClick={handleUpload}>
                      <Upload className="me-2" />
                      Upload Image
                    </Button>
                    <Button variant="outline-secondary" onClick={clearSelection}>
                      <X className="me-2" />
                      Clear
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" disabled>
                    <Spinner size="sm" className="me-2" />
                    Uploading...
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <Form.Control
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Upload Instructions */}
        <div className="mt-3">
          <small style={{ fontFamily: 'Poppins, sans-serif', color: '#6c757d' }}>
            <strong>SEO & Performance Tips:</strong>
            <ul className="mt-2 mb-0" style={{ paddingLeft: '20px' }}>
              <li>✓ Images are auto-converted to WebP format for faster loading</li>
              <li>✓ Optimal dimensions are automatically calculated (max 1920px width)</li>
              <li>✓ File size is optimized while maintaining quality</li>
              <li>Remember to add descriptive alt text for accessibility</li>
              <li>Use relevant keywords in image titles and descriptions</li>
              <li>Keep file names descriptive (e.g., "red-summer-dress.jpg")</li>
            </ul>
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ImageUploader;
