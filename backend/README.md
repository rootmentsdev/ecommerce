# E-commerce Backend API

A clean, enterprise-grade Node.js backend API built with Express.js following industry best practices.

## Features

- ✅ **Security**: Helmet.js, CORS, Rate Limiting
- ✅ **Performance**: Compression, Morgan logging
- ✅ **Clean Architecture**: Modular structure, separation of concerns
- ✅ **Error Handling**: Centralized error management
- ✅ **Environment Configuration**: Centralized config management
- ✅ **Graceful Shutdown**: Proper process handling

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
FRONTEND_URL=http://localhost:3000
```

### 3. Run the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API information and available endpoints

## Project Structure

```
backend/
├── config/
│   └── index.js          # Environment configuration
├── middleware/
│   └── errorHandler.js   # Centralized error handling
├── routes/
│   └── index.js          # Route definitions
├── server.js             # Main server file
└── package.json          # Dependencies and scripts
```

## Clean Code Principles Applied

1. **Single Responsibility**: Each module has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Reusable middleware and utilities
3. **Separation of Concerns**: Config, routes, middleware separated
4. **Error Handling**: Centralized and consistent error management
5. **Environment Configuration**: Centralized config management
6. **Security First**: Multiple security layers implemented
7. **Performance**: Compression and rate limiting
8. **Maintainability**: Clear structure and documentation

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
