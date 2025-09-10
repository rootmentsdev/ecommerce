const adminAuth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Simple admin token validation (in production, use JWT)
    if (token === 'admin-logged-in') {
      req.admin = { role: 'admin', email: 'admin@rootments.com' };
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token.'
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid admin token.'
    });
  }
};

module.exports = adminAuth;
