# Developer Setup Guide

This guide will help you set up the e-commerce platform for development.

## 🛠️ Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** - [Download](https://git-scm.com/)

## 📋 Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ECommerceSite
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Environment Variables** (`.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env` file

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 🔧 Development Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure Explained

```
ECommerceSite/
├── backend/                 # Node.js/Express API
│   ├── config/             # Configuration files
│   │   ├── config.js       # App settings
│   │   ├── database.js     # MongoDB connection
│   │   └── swagger.js      # API documentation
│   ├── controllers/        # Business logic
│   │   └── authController.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js   # Input validation
│   ├── models/             # Database schemas
│   │   └── User.js         # User model
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js   # Auth endpoints
│   │   └── index.js        # Route aggregator
│   └── server.js           # Main server file
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── common/      # Shared components
│   │   │   │   ├── ProductCard.jsx    # Reusable product card
│   │   │   │   ├── CategoryCard.jsx   # Reusable category card
│   │   │   │   ├── FeatureIcon.jsx    # Feature icon component
│   │   │   │   └── HorizontalScroll.jsx # Horizontal scroll wrapper
│   │   │   ├── Header.jsx  # Navigation header
│   │   │   ├── SideMenu.jsx # Mobile menu
│   │   │   ├── Footer.jsx  # Page footer
│   │   │   └── HomePageContent.jsx # Homepage
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.jsx # Main page
│   │   │   ├── LoginPage.jsx # Auth page
│   │   │   └── LoginPage.css # Login page styles
│   │   ├── services/       # API services
│   │   │   └── authService.js # Auth API calls
│   │   ├── constants/      # Application constants
│   │   │   └── index.js    # App config, colors, fonts, sizes
│   │   ├── utils/          # Utility functions
│   │   │   └── index.js    # Helper functions, validators
│   │   ├── assets/         # Images and media
│   │   ├── App.jsx         # Main app component
│   │   ├── fonts.css       # Typography
│   │   └── main.jsx        # Entry point
│   └── vite.config.js      # Vite configuration
```

## 🎨 Design System

### Typography
- **Headings**: Playfair Display (Google Fonts)
- **Body Text**: Inter (Google Fonts)
- **Implementation**: `src/fonts.css`

### Colors
- **Primary**: Black (#000)
- **Secondary**: Gray (#666, #999)
- **Background**: White (#fff)
- **Success**: Green (#28a745)
- **Danger**: Red (#dc3545)

### Common Components
- **ProductCard**: Reusable product card with consistent sizing
- **CategoryCard**: Category/occasion card with image overlay
- **FeatureIcon**: Feature icon component for homepage
- **HorizontalScroll**: Horizontal scrolling wrapper

### Constants & Utils
- **Constants**: Centralized configuration (fonts, colors, sizes)
- **Utils**: Helper functions (validation, formatting, performance)

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
POST /api/auth/forgot-password  # Request password reset
POST /api/auth/reset-password   # Reset password
```

### Example API Calls
```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ emailOrPhone, password })
});

// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Heroku)
1. Create Heroku app
2. Set environment variables
3. Connect MongoDB Atlas
4. Deploy

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret
```

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Check connection string
echo $MONGODB_URI
```

#### 2. Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=3001
```

#### 3. Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Font Loading Issues
- Check Google Fonts CDN connection
- Verify font imports in `fonts.css`
- Clear browser cache

### Debug Mode

#### Backend Debug
```bash
# Enable debug logging
DEBUG=* npm run dev
```

#### Frontend Debug
```bash
# Enable React DevTools
# Install browser extension
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

### Tools
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Postman](https://www.postman.com/) - API testing

### Learning Resources
- [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
- [Node.js Tutorial](https://nodejs.org/en/docs/guides/)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📞 Support

For development support:
- Create an issue in the repository
- Check existing documentation
- Review component documentation
- Test with provided examples

---

**Happy Coding! 🚀**
