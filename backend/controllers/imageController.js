const Image = require('../models/Image');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;

/**
 * Image Controller
 * Handles all image-related operations for the admin panel
 */
class ImageController {
  /**
   * Get active images for public frontend display
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getPublicImages(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        category,
        search,
        tags,
        sortBy = 'displayOrder',
        sortOrder = 'asc'
      } = req.query;

      // Build filter object - only active images for public
      const filter = { isActive: true };
      
      if (category && category !== 'all') {
        filter.category = category;
      }
      
      if (search && search.trim()) {
        filter.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { altText: { $regex: search.trim(), $options: 'i' } },
          { tags: { $in: [new RegExp(search.trim(), 'i')] } }
        ];
      }

      if (tags && tags.trim()) {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        if (tagArray.length > 0) {
          filter.tags = { $in: tagArray.map(tag => new RegExp(tag, 'i')) };
        }
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [images, totalCount] = await Promise.all([
        Image.find(filter)
          .select('-__v') // Exclude version field
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Image.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          images,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1
          }
        },
        message: `Retrieved ${images.length} active images successfully`
      });

    } catch (error) {
      console.error('Get public images error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get all images with optional filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getAllImages(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (category && category !== 'all') {
        filter.category = category;
      }
      
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
      
      if (search && search.trim()) {
        filter.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { tags: { $in: [new RegExp(search.trim(), 'i')] } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [images, totalCount] = await Promise.all([
        Image.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Image.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          images,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1
          }
        },
        message: `Retrieved ${images.length} images successfully`
      });

    } catch (error) {
      console.error('Get all images error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get single image by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getImageById(req, res) {
    try {
      const { id } = req.params;

      const image = await Image.findById(id);
      
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      res.status(200).json({
        success: true,
        data: image,
        message: 'Image retrieved successfully'
      });

    } catch (error) {
      console.error('Get image by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Upload and create new image with file processing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async uploadImage(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      // Check if image was processed by middleware
      if (!req.processedImage) {
        return res.status(400).json({
          success: false,
          message: 'No processed image data found'
        });
      }

      const {
        title,
        description,
        altText,
        seoTitle,
        seoDescription,
        focusKeyword,
        category,
        tags,
        isActive = true,
        displayOrder = 0
      } = req.body;

      const { processedImage } = req;

      // Use processed image data
      const imageUrl = `${req.protocol}://${req.get('host')}${processedImage.primaryImage.url}`;
      
      // Use suggested SEO data if not provided
      const finalAltText = altText || processedImage.seoMetadata.suggestedAltText;
      const finalSEOTitle = seoTitle || processedImage.seoMetadata.suggestedSEOTitle;

      // Process tags
      const processedTags = tags 
        ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
        : [];

      const imageData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        altText: finalAltText,
        seoTitle: finalSEOTitle,
        seoDescription: seoDescription || '',
        focusKeyword: focusKeyword || '',
        category,
        tags: processedTags,
        isActive,
        displayOrder: parseInt(displayOrder) || 0,
        metadata: {
          ...processedImage.metadata,
          originalFilename: processedImage.originalFile.originalname,
          uploadPath: processedImage.primaryImage.path,
          fallbackUrl: `${req.protocol}://${req.get('host')}${processedImage.processed.jpeg.url}`,
          technicalSEO: processedImage.seoMetadata.technicalSEO
        },
        uploadedBy: req.user?.email || 'admin'
      };

      const newImage = new Image(imageData);
      await newImage.save();

      // Add SEO analysis to response
      const response = {
        success: true,
        data: {
          ...newImage.toObject(),
          seoAnalysis: {
            score: newImage.seoScore,
            recommendations: newImage.seoRecommendations,
            uploadAnalysis: {
              originalScore: processedImage.seoMetadata.seoScore,
              improvements: processedImage.seoMetadata.recommendations
            }
          },
          processingInfo: {
            originalSize: processedImage.original.size,
            optimizedSize: processedImage.metadata.fileSize,
            compressionRatio: ((processedImage.original.size - processedImage.metadata.fileSize) / processedImage.original.size * 100).toFixed(1) + '%',
            formats: Object.keys(processedImage.processed)
          }
        },
        message: 'Image uploaded and optimized successfully'
      };

      res.status(201).json(response);

    } catch (error) {
      console.error('Upload image error:', error);
      
      // Clean up uploaded files on error
      if (req.processedImage) {
        const filesToCleanup = Object.values(req.processedImage.processed).map(p => p.path);
        try {
          await Promise.all(filesToCleanup.map(filePath => fs.unlink(filePath).catch(() => {})));
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Create new image (legacy method for URL-based images)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createImage(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        title,
        description,
        imageUrl,
        altText,
        category,
        tags,
        isActive = true,
        displayOrder = 0,
        metadata
      } = req.body;

      // Process tags
      const processedTags = tags 
        ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
        : [];

      const imageData = {
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        altText: altText.trim(),
        category,
        tags: processedTags,
        isActive,
        displayOrder: parseInt(displayOrder) || 0,
        uploadedBy: req.user?.email || 'admin'
      };

      // Add metadata if provided
      if (metadata) {
        imageData.metadata = metadata;
      }

      const newImage = new Image(imageData);
      await newImage.save();

      res.status(201).json({
        success: true,
        data: newImage,
        message: 'Image created successfully'
      });

    } catch (error) {
      console.error('Create image error:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update existing image
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async updateImage(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = { ...req.body };

      // Process tags if provided
      if (updateData.tags && typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 0);
      }

      // Ensure displayOrder is a number
      if (updateData.displayOrder !== undefined) {
        updateData.displayOrder = parseInt(updateData.displayOrder) || 0;
      }

      const updatedImage = await Image.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedImage) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedImage,
        message: 'Image updated successfully'
      });

    } catch (error) {
      console.error('Update image error:', error);
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete image
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async deleteImage(req, res) {
    try {
      const { id } = req.params;

      const deletedImage = await Image.findByIdAndDelete(id);

      if (!deletedImage) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
        data: { deletedId: id }
      });

    } catch (error) {
      console.error('Delete image error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get image categories with counts
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getImageCategories(req, res) {
    try {
      const categories = await Image.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      const formattedCategories = categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }));

      res.status(200).json({
        success: true,
        data: formattedCategories,
        message: 'Categories retrieved successfully'
      });

    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Toggle image active status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async toggleImageStatus(req, res) {
    try {
      const { id } = req.params;

      const image = await Image.findById(id);
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      image.isActive = !image.isActive;
      await image.save();

      res.status(200).json({
        success: true,
        data: image,
        message: `Image ${image.isActive ? 'activated' : 'deactivated'} successfully`
      });

    } catch (error) {
      console.error('Toggle image status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle image status',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

module.exports = ImageController;
