const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

/**
 * Image Upload and Processing Middleware
 * Handles file uploads with optimization and SEO features
 */

// Ensure uploads directory exists
const createUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.mkdir(imagesDir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
};

// Initialize uploads directory
createUploadsDir();

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Generate SEO-friendly filename
 * @param {string} originalName - Original filename
 * @param {string} title - Image title for SEO
 * @returns {string} SEO-friendly filename
 */
const generateSEOFilename = (originalName, title = '') => {
  const uuid = uuidv4().split('-')[0]; // Short UUID
  const ext = path.extname(originalName).toLowerCase();
  
  let seoName = '';
  if (title && title.trim()) {
    // Create SEO-friendly name from title
    seoName = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 50); // Limit length
  } else {
    // Fallback to original name processing
    const baseName = path.basename(originalName, ext);
    seoName = baseName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  }
  
  return `${seoName}-${uuid}`;
};

/**
 * Process and optimize image
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Target filename without extension
 * @param {Object} options - Processing options
 * @returns {Object} Processing results
 */
const processImage = async (buffer, filename, options = {}) => {
  const {
    quality = 85,
    width = null,
    height = null,
    format = 'webp'
  } = options;

  try {
    const uploadsPath = path.join(__dirname, '../uploads/images');
    
    // Get original image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Create sharp instance
    let sharpInstance = sharp(buffer);
    
    // Resize if dimensions specified
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Process for different formats
    const results = {};
    
    // Generate WebP version (primary - best for SEO and performance)
    const webpFilename = `${filename}.webp`;
    const webpPath = path.join(uploadsPath, webpFilename);
    const webpBuffer = await sharpInstance
      .clone()
      .webp({ quality: quality })
      .toBuffer();
    
    await fs.writeFile(webpPath, webpBuffer);
    
    results.webp = {
      filename: webpFilename,
      path: webpPath,
      size: webpBuffer.length,
      format: 'webp',
      url: `/uploads/images/${webpFilename}`
    };
    
    // Generate JPEG fallback for compatibility
    const jpegFilename = `${filename}.jpg`;
    const jpegPath = path.join(uploadsPath, jpegFilename);
    const jpegBuffer = await sharpInstance
      .clone()
      .jpeg({ quality: quality })
      .toBuffer();
    
    await fs.writeFile(jpegPath, jpegBuffer);
    
    results.jpeg = {
      filename: jpegFilename,
      path: jpegPath,
      size: jpegBuffer.length,
      format: 'jpeg',
      url: `/uploads/images/${jpegFilename}`
    };
    
    // Get final metadata from WebP version
    const finalMetadata = await sharp(webpBuffer).metadata();
    
    return {
      success: true,
      original: {
        size: buffer.length,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      },
      processed: results,
      metadata: {
        width: finalMetadata.width,
        height: finalMetadata.height,
        format: 'webp', // Primary format
        originalFormat: metadata.format,
        compressionQuality: quality,
        isOptimized: true,
        fileSize: results.webp.size
      },
      // Return WebP as primary
      primaryImage: results.webp
    };
    
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

/**
 * Generate SEO metadata from image
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Filename
 * @param {Object} formData - Form data from request
 * @returns {Object} SEO metadata
 */
const generateSEOMetadata = async (buffer, filename, formData = {}) => {
  try {
    const metadata = await sharp(buffer).metadata();
    
    // Extract colors for potential SEO use
    const { dominant } = await sharp(buffer)
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const seoData = {
      // Auto-generated alt text if not provided
      suggestedAltText: formData.title ? 
        `${formData.title} - ${formData.category || 'product'} image optimized for web` :
        `${path.basename(filename, path.extname(filename)).replace(/-/g, ' ')} image`,
      
      // SEO-friendly title
      suggestedSEOTitle: formData.title ?
        formData.title.substring(0, 60) :
        path.basename(filename, path.extname(filename)).replace(/-/g, ' '),
      
      // Technical SEO data
      technicalSEO: {
        aspectRatio: metadata.width && metadata.height ? 
          (metadata.width / metadata.height).toFixed(2) : null,
        isLandscape: metadata.width > metadata.height,
        isSquare: Math.abs(metadata.width - metadata.height) < 10,
        isPortrait: metadata.height > metadata.width,
        colorSpace: metadata.space,
        hasAlpha: metadata.channels === 4,
        density: metadata.density || null
      },
      
      // SEO recommendations
      seoScore: 0, // Will be calculated
      recommendations: []
    };
    
    // Calculate initial SEO score
    let score = 0;
    
    // Format optimization (WebP is best for SEO)
    if (metadata.format === 'webp') score += 25;
    else if (['jpeg', 'jpg'].includes(metadata.format)) score += 15;
    else if (metadata.format === 'png') score += 10;
    
    // Size optimization
    if (buffer.length < 100000) score += 20; // Under 100KB
    else if (buffer.length < 500000) score += 15; // Under 500KB
    else if (buffer.length < 1000000) score += 10; // Under 1MB
    
    // Dimension optimization
    if (metadata.width && metadata.height) {
      if (metadata.width <= 1920 && metadata.height <= 1080) score += 15;
      else if (metadata.width <= 2560 && metadata.height <= 1440) score += 10;
      
      // Responsive image considerations
      if (metadata.width >= 800) score += 10; // Good for desktop
      if (metadata.width <= 1200) score += 5; // Not too large
    }
    
    seoData.seoScore = Math.min(score, 100);
    
    // Generate recommendations
    if (buffer.length > 500000) {
      seoData.recommendations.push('Consider compressing image further - large files slow page loading');
    }
    
    if (metadata.width && metadata.width > 2560) {
      seoData.recommendations.push('Image width is very large - consider resizing for web use');
    }
    
    if (!formData.title || formData.title.length < 10) {
      seoData.recommendations.push('Add a descriptive title for better SEO');
    }
    
    if (metadata.format !== 'webp') {
      seoData.recommendations.push('WebP format provides better compression and SEO benefits');
    }
    
    return seoData;
    
  } catch (error) {
    console.error('SEO metadata generation error:', error);
    return {
      suggestedAltText: filename,
      suggestedSEOTitle: filename,
      technicalSEO: {},
      seoScore: 0,
      recommendations: ['Unable to analyze image for SEO optimization']
    };
  }
};

/**
 * Middleware to handle single image upload
 */
const uploadSingle = upload.single('image');

/**
 * Middleware to process uploaded image
 */
const processUploadedImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    // Get form data
    const formData = req.body;
    
    // Generate SEO-friendly filename
    const seoFilename = generateSEOFilename(req.file.originalname, formData.title);
    
    // Process image with optimization
    const processingResult = await processImage(
      req.file.buffer,
      seoFilename,
      {
        quality: parseInt(formData.quality) || 85,
        width: parseInt(formData.maxWidth) || null,
        height: parseInt(formData.maxHeight) || null,
        format: formData.preferredFormat || 'webp'
      }
    );
    
    // Generate SEO metadata
    const seoMetadata = await generateSEOMetadata(req.file.buffer, seoFilename, formData);
    
    // Attach processed data to request
    req.processedImage = {
      ...processingResult,
      seoMetadata,
      originalFile: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    };
    
    next();
    
  } catch (error) {
    console.error('Image processing middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Image processing failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Middleware to handle multiple image uploads
 */
const uploadMultiple = upload.array('images', 10); // Max 10 images

/**
 * Clean up uploaded files (utility function)
 */
const cleanupFiles = async (filePaths) => {
  try {
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn(`Failed to delete file ${filePath}:`, error.message);
        }
      })
    );
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  processUploadedImage,
  processImage,
  generateSEOMetadata,
  cleanupFiles,
  generateSEOFilename
};
