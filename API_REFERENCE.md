# API Reference

This document provides a comprehensive reference for all API endpoints in the e-commerce platform.

## 🔗 Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

All authentication endpoints are prefixed with `/auth`.

### Register User

**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### Login User

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "emailOrPhone": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

**GET** `/auth/me`

Returns the current authenticated user's information.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### Forgot Password

**POST** `/auth/forgot-password`

Sends a verification code to reset password.

**Request Body:**
```json
{
  "emailOrPhone": "john@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verification code sent",
  "data": {
    "resetToken": "reset_token_here",
    "verificationCode": "123456"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### Reset Password

**POST** `/auth/reset-password`

Resets password using verification code.

**Request Body:**
```json
{
  "resetToken": "reset_token_here",
  "verificationCode": "123456",
  "newPassword": "newSecurePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid verification code"
}
```

---

## 📦 Products (Future Implementation)

### Get All Products

**GET** `/products`

Returns a list of all products.

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of products per page
- `category` (optional): Filter by category
- `search` (optional): Search term

**Example:**
```
GET /products?page=1&limit=10&category=suits
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_id",
        "name": "Premium Suit",
        "price": 1400,
        "category": "suits",
        "image": "image_url",
        "description": "Product description",
        "available": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalProducts": 50
    }
  }
}
```

---

### Get Single Product

**GET** `/products/:id`

Returns details of a specific product.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product_id",
      "name": "Premium Suit",
      "price": 1400,
      "category": "suits",
      "images": ["image1_url", "image2_url"],
      "description": "Detailed product description",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "Navy", "Gray"],
      "available": true,
      "rentalPeriod": "3 days",
      "deposit": 500
    }
  }
}
```

---

## 🛒 Cart & Orders (Future Implementation)

### Add to Cart

**POST** `/cart/add`

Adds a product to the user's cart.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1,
  "rentalPeriod": "3 days",
  "size": "M",
  "color": "Black"
}
```

---

### Get Cart

**GET** `/cart`

Returns the user's cart items.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

---

### Create Order

**POST** `/orders`

Creates a new order from cart items.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 1,
      "rentalPeriod": "3 days",
      "size": "M",
      "color": "Black"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "rentalStartDate": "2024-01-15",
  "rentalEndDate": "2024-01-18"
}
```

---

## 📊 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Resource already exists
- `SERVER_ERROR`: Internal server error

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `500`: Internal Server Error

---

## 🔧 Authentication Flow

### 1. Registration Flow
```
1. POST /auth/register
2. Store JWT token
3. Redirect to dashboard
```

### 2. Login Flow
```
1. POST /auth/login
2. Store JWT token
3. Redirect to dashboard
```

### 3. Password Reset Flow
```
1. POST /auth/forgot-password
2. User receives verification code
3. POST /auth/reset-password
4. Password updated
```

### 4. Protected Route Access
```
1. Include JWT token in Authorization header
2. GET /auth/me (optional - verify token)
3. Access protected endpoints
```

---

## 📝 Request/Response Examples

### Frontend Implementation

```javascript
// Login example
const loginUser = async (credentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Protected request example
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
};
```

---

## 🧪 Testing API Endpoints

### Using Postman

1. **Set Base URL**: `http://localhost:5000/api`
2. **Create Collection**: "E-Commerce API"
3. **Add Environment Variables**:
   - `base_url`: `http://localhost:5000/api`
   - `token`: JWT token (set after login)

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","phone":"+1234567890","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"john@example.com","password":"password123"}'

# Get Current User
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📚 Additional Resources

- **Swagger Documentation**: `http://localhost:5000/api-docs`
- **Postman Collection**: Import from repository
- **API Testing**: Use provided examples
- **Error Handling**: Follow standard patterns

---

This API reference provides all the information needed to integrate with the e-commerce platform's backend services.
