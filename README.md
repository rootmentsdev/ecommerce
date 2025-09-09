# E-Commerce Rental Platform

A modern, responsive e-commerce platform for renting premium suits, ethnic wear, and accessories. Built with React, Bootstrap, and Node.js.

## 🚀 Features

- **Premium Typography**: Playfair Display (headings) + Inter (body text)
- **Responsive Design**: Mobile-first approach with Bootstrap
- **User Authentication**: Login/Register with JWT tokens
- **Product Showcase**: Horizontal scrolling product cards
- **Category Navigation**: Shop by category and occasion
- **Modern UI**: Clean, minimalist design with premium feel

## 📁 Project Structure

```
ECommerceSite/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files
│   │   ├── config.js       # App configuration
│   │   ├── database.js     # Database connection
│   │   ├── index.js        # Main config exports
│   │   └── swagger.js      # API documentation
│   ├── controllers/        # Route controllers
│   │   └── authController.js # Authentication logic
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js   # Input validation
│   ├── models/             # Database models
│   │   └── User.js         # User schema/model
│   ├── routes/             # API routes
│   │   ├── authRoutes.js   # Authentication routes
│   │   └── index.js        # Route aggregator
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
│
├── frontend/               # React frontend
│   ├── public/             # Static assets
│   │   └── vite.svg        # Vite logo
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   │   ├── common/      # Shared components
│   │   │   │   ├── ProductCard.jsx    # Reusable product card
│   │   │   │   ├── CategoryCard.jsx   # Reusable category card
│   │   │   │   ├── FeatureIcon.jsx    # Feature icon component
│   │   │   │   └── HorizontalScroll.jsx # Horizontal scroll wrapper
│   │   │   ├── Header.jsx  # Navigation header
│   │   │   ├── SideMenu.jsx # Mobile sidebar menu
│   │   │   ├── Footer.jsx  # Page footer
│   │   │   └── HomePageContent.jsx # Homepage content
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.jsx # Main homepage
│   │   │   ├── LoginPage.jsx # Authentication page
│   │   │   └── LoginPage.css # Login page styles
│   │   ├── services/       # API services
│   │   │   └── authService.js # Authentication API calls
│   │   ├── constants/      # Application constants
│   │   │   └── index.js    # App config, colors, fonts, sizes
│   │   ├── utils/          # Utility functions
│   │   │   └── index.js    # Helper functions, validators
│   │   ├── assets/         # Images and media
│   │   │   ├── demo1.png   # Product images
│   │   │   ├── demo2.png   # Product images
│   │   │   ├── demo3.png   # Product images
│   │   │   ├── HomePage.png # Hero banner image
│   │   │   ├── LoginImage.png # Login page image
│   │   │   └── react.svg   # React logo
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css         # Global styles
│   │   ├── fonts.css       # Typography styles
│   │   ├── index.css       # Base styles
│   │   └── main.jsx        # App entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
│
├── README.md               # This file
├── COMPONENT_DOCS.md       # Detailed component documentation
├── DEVELOPER_SETUP.md      # Developer setup guide
└── API_REFERENCE.md        # Complete API documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **React Bootstrap** - UI components
- **React Router** - Client-side routing
- **React Bootstrap Icons** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Swagger** - API documentation

### Styling
- **Bootstrap 5** - CSS framework
- **Custom CSS** - Additional styling
- **Google Fonts** - Typography (Playfair Display + Inter)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ECommerceSite
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   ```bash
   # Backend environment variables
   cd ../backend
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## 📱 Pages & Components

### Pages

#### HomePage (`/`)
- **Purpose**: Main landing page showcasing products
- **Features**: 
  - Hero banner with call-to-action
  - Feature icons (Browse, Choose, Book, Return)
  - New Arrivals horizontal scroll
  - Shop by Category grid
  - Shop by Occasion grid
- **Components Used**: Header, SideMenu, HomePageContent, Footer

#### LoginPage (`/login`)
- **Purpose**: User authentication
- **Features**:
  - Login form with email/phone + password
  - Registration form with validation
  - Forgot password flow (2-step process)
  - Social login options (UI only)
  - Responsive mobile/desktop layouts
- **Components Used**: Custom form components

### Components

#### Header
- **Purpose**: Top navigation bar
- **Features**:
  - Hamburger menu (mobile)
  - Logo (centered)
  - Search icon
  - Shopping cart with badge
- **Styling**: Premium fonts, hover effects

#### SideMenu
- **Purpose**: Mobile navigation drawer
- **Features**:
  - User profile section
  - Navigation links (Home, Profile, Categories, etc.)
  - Support/Help links
  - Logout functionality
- **Styling**: Slide-out animation, touch-friendly

#### HomePageContent
- **Purpose**: Main homepage content
- **Features**:
  - Hero section with background image
  - Feature icons grid
  - Horizontal scrolling product cards
  - Category and occasion grids
- **Styling**: Bootstrap grid, custom card styling

#### Footer
- **Purpose**: Page footer
- **Features**: Links, company info, social media
- **Styling**: Consistent with overall design

### Common Components (`src/components/common/`)

#### ProductCard
- **Purpose**: Reusable product card component
- **Features**:
  - Consistent sizing (220px × 320px)
  - Image with proper aspect ratio
  - Product name with text truncation
  - Price formatting
  - Click handling
- **Props**: `product`, `onClick`, `className`, `showPrice`
- **Styling**: Uses constants for consistent sizing

#### CategoryCard
- **Purpose**: Reusable category card component
- **Features**:
  - Square aspect ratio
  - Image overlay with gradient
  - Category name display
  - Click handling
- **Props**: `category`, `onClick`, `className`
- **Styling**: Uses constants for consistent design

#### FeatureIcon
- **Purpose**: Feature icon component
- **Features**:
  - Circular icon background
  - Icon and text display
  - Consistent sizing
- **Props**: `icon`, `title`, `className`

#### HorizontalScroll
- **Purpose**: Horizontal scrolling wrapper
- **Features**:
  - Hidden scrollbar
  - Smooth scrolling
  - Responsive design
- **Props**: `children`, `className`

### Constants (`src/constants/`)

#### App Configuration
- **Fonts**: Primary (Playfair Display), Secondary (Inter)
- **Colors**: Primary, Secondary, Muted, Light, White
- **Spacing**: Small, Medium, Large, XLarge
- **Breakpoints**: Mobile, Tablet, Desktop
- **Card Sizes**: Product and Category dimensions

### Utils (`src/utils/`)

#### Utility Functions
- **Style Helpers**: `createStyleObject`, `combineStyles`, `generateResponsiveStyles`
- **Text Helpers**: `truncateText`, `formatPrice`
- **Validators**: `validateEmail`, `validatePhone`
- **Performance**: `debounce` function

## 🎨 Design System

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body Text**: Inter (sans-serif, readable)
- **Font Weights**: 300-900 range
- **Letter Spacing**: Optimized for readability

### Colors
- **Primary**: Black (#000)
- **Secondary**: Gray (#666, #999)
- **Background**: White (#fff)
- **Accent**: Custom gradients for buttons

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Rounded, hover effects
- **Forms**: Clean inputs with validation
- **Icons**: Consistent sizing (24px)

## 🔧 Configuration

### Frontend Configuration
- **Vite**: Fast development server
- **React Router**: Client-side routing
- **Bootstrap**: Responsive grid system
- **Fonts**: Google Fonts integration

### Backend Configuration
- **Express**: RESTful API
- **MongoDB**: Database connection
- **JWT**: Token-based authentication
- **Swagger**: API documentation

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products (Future)
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy with MongoDB Atlas
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release with authentication and homepage
- **v1.1.0** - Added horizontal scrolling and premium fonts
- **v1.2.0** - Improved responsive design and UI consistency

---

**Built with ❤️ using React, Bootstrap, and Node.js**
