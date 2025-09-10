# E-Commerce Enquiry System Documentation

## Overview
This documentation covers the complete enquiry system implementation for the E-Commerce platform, including both backend API and frontend components.

## Table of Contents
1. [Backend API Documentation](#backend-api-documentation)
2. [Frontend Documentation](#frontend-documentation)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Validation Rules](#validation-rules)
6. [Error Handling](#error-handling)
7. [Usage Examples](#usage-examples)

---

## Backend API Documentation

### Architecture
The backend follows a clean, modular architecture with separation of concerns:

```
backend/
├── models/
│   └── Enquiry.js          # MongoDB schema definition
├── controllers/
│   └── enquiryController.js # Business logic and API handlers
├── routes/
│   └── enquiryRoutes.js    # Route definitions and validation
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── validation.js      # Custom validation middleware
│   └── errorHandler.js    # Global error handling
└── config/
    ├── database.js        # MongoDB connection
    └── config.js          # Application configuration
```

### Key Features
- **RESTful API Design**: Follows REST conventions
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Authentication**: JWT-based authentication for admin endpoints
- **Pagination**: Built-in pagination for listing endpoints
- **Filtering**: Advanced filtering and sorting capabilities
- **Statistics**: Dashboard-ready statistics endpoints

---

## Frontend Documentation

### Architecture
The frontend follows React best practices with clean component structure:

```
frontend/src/
├── pages/
│   └── EnquireNow.jsx     # Main enquiry form page
├── services/
│   └── enquiryService.js  # API service layer
├── components/
│   ├── Header.jsx         # Global header component
│   ├── Footer.jsx         # Global footer component
│   └── SideMenu.jsx       # Side navigation menu
├── constants/
│   └── index.js          # Application constants
└── fonts.css             # Global font definitions
```

### Key Features
- **Form Validation**: Real-time client-side validation
- **Auto-fill**: Automatic population of user data from login
- **Responsive Design**: Mobile-first design using React Bootstrap
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during form submission
- **Clean Code**: Modular, reusable components

---

## Database Schema

### Enquiry Model
```javascript
{
  // User Information
  fullName: String (required, max: 100)
  mobileNumber: String (required, pattern: /^[6-9]\d{9}$/)
  email: String (required, email format)
  
  // Booking Information
  preferredBookingDate: Date (required, future date)
  city: String (required, enum: predefined cities)
  specialNotes: String (optional, max: 500)
  
  // Product Information
  productId: ObjectId (optional, ref: Product)
  productName: String (optional, max: 200)
  
  // Status Management
  status: String (enum: ['pending', 'contacted', 'confirmed', 'cancelled'])
  priority: String (enum: ['low', 'medium', 'high'])
  adminNotes: String (optional, max: 1000)
  
  // Timestamps
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-updated)
  contactedAt: Date (optional)
  contactedBy: ObjectId (optional, ref: User)
}
```

### Indexes
- `{ status: 1, createdAt: -1 }` - For status-based queries
- `{ city: 1 }` - For city-based filtering
- `{ preferredBookingDate: 1 }` - For date-based queries
- `{ email: 1 }` - For email lookups

---

## API Endpoints

### Public Endpoints

#### POST /api/enquiries
**Description**: Submit a new enquiry
**Access**: Public
**Request Body**:
```json
{
  "fullName": "John Doe",
  "mobileNumber": "9876543210",
  "email": "john@example.com",
  "preferredBookingDate": "2024-02-15",
  "city": "Mumbai",
  "specialNotes": "Looking for premium suits",
  "productId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "productName": "Premium Black Tuxedo"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "data": {
    "enquiry": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "fullName": "John Doe",
      "mobileNumber": "9876543210",
      "email": "john@example.com",
      "preferredBookingDate": "2024-02-15T00:00:00.000Z",
      "city": "Mumbai",
      "status": "pending",
      "priority": "medium",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Admin Endpoints (Authentication Required)

#### GET /api/enquiries
**Description**: Get all enquiries with pagination and filtering
**Access**: Admin only
**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status
- `city` (optional): Filter by city
- `priority` (optional): Filter by priority
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): Sort direction (asc/desc)

#### GET /api/enquiries/stats
**Description**: Get enquiry statistics for dashboard
**Access**: Admin only
**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalEnquiries": 150,
      "pendingEnquiries": 45,
      "contactedEnquiries": 60,
      "confirmedEnquiries": 35,
      "cancelledEnquiries": 10
    },
    "cityStats": [
      { "_id": "Mumbai", "count": 45 },
      { "_id": "Delhi", "count": 38 }
    ],
    "monthlyStats": [
      { "_id": { "year": 2024, "month": 1 }, "count": 25 },
      { "_id": { "year": 2024, "month": 2 }, "count": 30 }
    ]
  }
}
```

#### GET /api/enquiries/:id
**Description**: Get enquiry by ID
**Access**: Admin only

#### PUT /api/enquiries/:id
**Description**: Update enquiry status and admin notes
**Access**: Admin only
**Request Body**:
```json
{
  "status": "contacted",
  "priority": "high",
  "adminNotes": "Customer prefers morning appointments"
}
```

#### DELETE /api/enquiries/:id
**Description**: Delete enquiry
**Access**: Admin only

---

## Validation Rules

### Frontend Validation
- **Full Name**: Required, max 100 characters
- **Mobile Number**: Required, 10-digit Indian mobile number (starts with 6-9)
- **Email**: Required, valid email format
- **Preferred Booking Date**: Required, must be future date
- **City**: Required, must be from predefined list
- **Special Notes**: Optional, max 500 characters

### Backend Validation
- **Server-side validation**: All frontend validations plus additional checks
- **Database constraints**: MongoDB schema validation
- **Business logic validation**: Custom validation rules
- **Security validation**: Input sanitization and XSS protection

---

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### Frontend Error Handling
- **Form Validation**: Real-time validation with visual feedback
- **API Errors**: User-friendly error messages
- **Network Errors**: Graceful handling of connection issues
- **Loading States**: Visual feedback during operations

---

## Usage Examples

### Frontend Usage

#### Basic Form Submission
```javascript
import EnquiryService from '../services/enquiryService';

const handleSubmit = async (formData) => {
  try {
    const response = await EnquiryService.submitEnquiry(formData);
    console.log('Enquiry submitted:', response.data.enquiry);
  } catch (error) {
    console.error('Submission failed:', error.message);
  }
};
```

#### Form Validation
```javascript
const validation = EnquiryService.validateEnquiryForm(formData);
if (!validation.isValid) {
  setErrors(validation.errors);
  return;
}
```

#### Admin Dashboard Integration
```javascript
// Get enquiry statistics
const stats = await EnquiryService.getEnquiryStats();

// Get filtered enquiries
const enquiries = await EnquiryService.getAllEnquiries({
  page: 1,
  limit: 20,
  status: 'pending',
  city: 'Mumbai'
});
```

### Backend Usage

#### Creating Enquiry Controller
```javascript
const EnquiryController = require('./controllers/enquiryController');

// In your route file
router.post('/', createEnquiryValidation, EnquiryController.createEnquiry);
```

#### Custom Validation Middleware
```javascript
const { body } = require('express-validator');

const customValidation = [
  body('mobileNumber').custom((value) => {
    if (!/^[6-9]\d{9}$/.test(value)) {
      throw new Error('Invalid mobile number format');
    }
    return true;
  })
];
```

---

## Security Considerations

### Backend Security
- **Input Sanitization**: All inputs are sanitized and validated
- **Authentication**: JWT-based authentication for admin endpoints
- **Rate Limiting**: Implement rate limiting for public endpoints
- **CORS**: Proper CORS configuration
- **Environment Variables**: Sensitive data stored in environment variables

### Frontend Security
- **XSS Protection**: React's built-in XSS protection
- **Input Validation**: Client-side validation with server-side verification
- **Secure Storage**: Sensitive data stored securely in localStorage
- **HTTPS**: All API calls over HTTPS in production

---

## Performance Optimization

### Backend Optimization
- **Database Indexing**: Optimized indexes for common queries
- **Pagination**: Efficient pagination to handle large datasets
- **Caching**: Implement Redis caching for frequently accessed data
- **Compression**: Response compression for better performance

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Optimized bundle size
- **Image Optimization**: Compressed and optimized images

---

## Testing

### Backend Testing
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints
- **Validation Tests**: Test input validation
- **Error Handling Tests**: Test error scenarios

### Frontend Testing
- **Component Tests**: Test React components
- **Form Validation Tests**: Test form validation logic
- **API Integration Tests**: Test service layer
- **User Interaction Tests**: Test user workflows

---

## Deployment

### Backend Deployment
1. Set up MongoDB database
2. Configure environment variables
3. Install dependencies: `npm install`
4. Start server: `npm start`
5. Set up reverse proxy (Nginx)
6. Configure SSL certificates

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to CDN or static hosting
3. Configure API endpoints
4. Set up monitoring and analytics

---

## Monitoring and Maintenance

### Backend Monitoring
- **Logging**: Comprehensive logging system
- **Error Tracking**: Error monitoring and alerting
- **Performance Monitoring**: API response time tracking
- **Database Monitoring**: MongoDB performance metrics

### Frontend Monitoring
- **Error Tracking**: Client-side error monitoring
- **Performance Monitoring**: Page load time tracking
- **User Analytics**: User behavior tracking
- **A/B Testing**: Feature testing capabilities

---

## Future Enhancements

### Planned Features
- **Email Notifications**: Automated email notifications
- **SMS Integration**: SMS notifications for enquiries
- **Calendar Integration**: Calendar booking system
- **Advanced Analytics**: Detailed analytics dashboard
- **Multi-language Support**: Internationalization
- **Mobile App**: Native mobile application

### Technical Improvements
- **Microservices**: Break down into microservices
- **GraphQL**: Implement GraphQL API
- **Real-time Updates**: WebSocket integration
- **Advanced Caching**: Redis caching implementation
- **CI/CD Pipeline**: Automated deployment pipeline

---

## Support and Contact

For technical support or questions about the enquiry system:
- **Documentation**: This comprehensive guide
- **Code Comments**: Inline code documentation
- **API Examples**: Postman collection available
- **Issue Tracking**: GitHub issues for bug reports

---

*Last Updated: January 2024*
*Version: 1.0.0*
