/**
 * Test utility for image creation
 * This helps debug image creation issues
 */

export const createTestImageData = () => {
  return {
    title: "Test Product Image",
    description: "This is a test product image for debugging purposes. It contains all required fields to pass validation.",
    imageUrl: "https://via.placeholder.com/800x600/0066cc/ffffff?text=Test+Image",
    altText: "Test product image showing placeholder content for validation testing purposes",
    category: "product",
    tags: "test, placeholder, product",
    isActive: true,
    displayOrder: 0
    // Removed optional fields to test minimal case first
  };
};

export const validateImageData = (data) => {
  const errors = [];

  if (!data.title || data.title.length < 1) {
    errors.push("Title is required");
  }

  if (!data.description || data.description.length < 1) {
    errors.push("Description is required");
  }

  if (!data.imageUrl) {
    errors.push("Image URL is required");
  }

  if (!data.altText || data.altText.length < 10 || data.altText.length > 125) {
    errors.push("Alt text must be between 10 and 125 characters");
  }

  if (data.seoTitle && data.seoTitle.length > 60) {
    errors.push("SEO title cannot exceed 60 characters");
  }

  if (data.seoDescription && data.seoDescription.length > 160) {
    errors.push("SEO description cannot exceed 160 characters");
  }

  if (data.focusKeyword && data.focusKeyword.length > 50) {
    errors.push("Focus keyword cannot exceed 50 characters");
  }

  if (!data.category) {
    errors.push("Category is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
