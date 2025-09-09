# Component Documentation

This document provides detailed information about each component in the e-commerce platform.

## 📱 Pages

### HomePage (`src/pages/HomePage.jsx`)

**Purpose**: Main application wrapper that manages the overall layout and navigation.

**Features**:
- Manages sidebar menu state
- Provides consistent layout structure
- Handles navigation between pages

**Props**: None

**State**:
- `showSideMenu`: Boolean - Controls sidebar visibility

**Components Used**:
- `Header` - Top navigation
- `SideMenu` - Mobile navigation drawer
- `HomePageContent` - Main content
- `Footer` - Page footer

**Usage**:
```jsx
<HomePage />
```

---

### LoginPage (`src/pages/LoginPage.jsx`)

**Purpose**: Handles user authentication including login, registration, and password reset.

**Features**:
- Toggle between login and registration forms
- Forgot password flow (2-step process)
- Form validation and error handling
- Responsive mobile/desktop layouts
- Social login options (UI only)
- Success/error message handling

**Props**: None

**State**:
- `isLogin`: Boolean - Form mode (login/register)
- `isLoading`: Boolean - Loading state
- `isLoginSuccess`: Boolean - Success state for button
- `message`: Object - Alert messages
- `loginData`: Object - Login form data
- `registerData`: Object - Registration form data
- `forgotPasswordData`: Object - Password reset data
- `forgotPasswordStep`: String - Reset flow step
- `resetToken`: String - Password reset token

**Methods**:
- `handleFormSwitch()` - Switch between forms
- `handleLogin()` - Process login
- `handleRegister()` - Process registration
- `handleForgotPasswordRequest()` - Send reset code
- `handlePasswordReset()` - Reset password
- `handleBackToLogin()` - Return to login

**Usage**:
```jsx
<LoginPage />
```

---

## 🧩 Components

### Common Components (`src/components/common/`)

#### ProductCard (`src/components/common/ProductCard.jsx`)

**Purpose**: Reusable product card component with consistent styling and behavior.

**Features**:
- Uniform card dimensions (220px × 320px)
- Image with proper aspect ratio and cover fit
- Product name with text truncation (2 lines max)
- Price formatting with Indian currency
- Click handling for product selection
- Customizable styling through props

**Props**:
- `product`: Object - Product data (name, price, image)
- `onClick`: Function - Click handler (optional)
- `className`: String - Additional CSS classes
- `showPrice`: Boolean - Show/hide price (default: true)
- `imageHeight`: String - Custom image height
- `textHeight`: String - Custom text area height

**State**: None

**Styling**:
- Uses constants from `APP_CONFIG` and `CARD_SIZES`
- Consistent typography (Playfair Display for names, Inter for prices)
- Responsive design with fixed dimensions
- Hover effects and cursor changes

**Usage**:
```jsx
<ProductCard 
  product={productData}
  onClick={handleProductClick}
  showPrice={true}
/>
```

---

#### CategoryCard (`src/components/common/CategoryCard.jsx`)

**Purpose**: Reusable category card component for category and occasion displays.

**Features**:
- Square aspect ratio (1:1)
- Image overlay with gradient effect
- Category name display with overlay
- Click handling for category selection
- Consistent styling across all category cards

**Props**:
- `category`: Object - Category data (name, image)
- `onClick`: Function - Click handler (optional)
- `className`: String - Additional CSS classes

**State**: None

**Styling**:
- Uses constants from `APP_CONFIG` and `CARD_SIZES`
- Gradient overlay for text readability
- Playfair Display font for category names
- Absolute positioning for image and text overlay

**Usage**:
```jsx
<CategoryCard 
  category={categoryData}
  onClick={handleCategoryClick}
/>
```

---

#### FeatureIcon (`src/components/common/FeatureIcon.jsx`)

**Purpose**: Reusable feature icon component for the homepage features section.

**Features**:
- Circular icon background
- Icon and text display
- Consistent sizing and spacing
- Centered alignment
- Responsive design

**Props**:
- `icon`: Component - React Bootstrap icon component
- `title`: String - Feature title text
- `className`: String - Additional CSS classes

**State**: None

**Styling**:
- Circular background with light gray color
- Consistent icon size (20px)
- Inter font for text
- Responsive sizing

**Usage**:
```jsx
<FeatureIcon 
  icon={Search}
  title="Browse & Select"
/>
```

---

#### HorizontalScroll (`src/components/common/HorizontalScroll.jsx`)

**Purpose**: Horizontal scrolling wrapper component for product carousels.

**Features**:
- Hidden scrollbar for clean appearance
- Smooth scrolling behavior
- Responsive design
- Customizable gap between items
- Cross-browser compatibility

**Props**:
- `children`: ReactNode - Child components to scroll
- `className`: String - Additional CSS classes

**State**: None

**Styling**:
- Flexbox layout with horizontal scrolling
- Hidden scrollbars across all browsers
- Consistent gap spacing
- Touch-friendly on mobile devices

**Usage**:
```jsx
<HorizontalScroll>
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</HorizontalScroll>
```

---

## 🔧 Services

### Header (`src/components/Header.jsx`)

**Purpose**: Top navigation bar with logo, search, and cart icons.

**Features**:
- Hamburger menu for mobile
- Centered logo
- Search icon
- Shopping cart with item count badge
- Hover effects and animations

**Props**:
- `onMenuClick`: Function - Opens sidebar menu

**State**: None

**Styling**:
- Premium fonts (Playfair Display for logo)
- Hover animations
- Touch-friendly on mobile

**Usage**:
```jsx
<Header onMenuClick={handleShowSideMenu} />
```

---

### SideMenu (`src/components/SideMenu.jsx`)

**Purpose**: Mobile navigation drawer with user profile and menu items.

**Features**:
- User profile section with avatar
- Navigation menu items
- Support/Help links
- Logout functionality
- Responsive sizing
- Touch-friendly interactions

**Props**:
- `show`: Boolean - Controls visibility
- `handleClose`: Function - Closes the menu

**State**:
- `isDesktop`: Boolean - Screen size detection

**Menu Items**:
- Home, Profile, Categories
- My Orders, Wishlist
- How it Works, Store Near Me
- Support/Help Center, Settings
- Log Out

**Usage**:
```jsx
<SideMenu show={showSideMenu} handleClose={handleCloseSideMenu} />
```

---

### HomePageContent (`src/components/HomePageContent.jsx`)

**Purpose**: Main homepage content with hero section, features, and product showcases.

**Features**:
- Hero banner with call-to-action
- Feature icons (4-step process)
- New Arrivals horizontal scroll
- Shop by Category grid (6 categories)
- Shop by Occasion grid (3 occasions)
- Responsive design
- Premium typography

**Props**: None

**State**: None (uses static data)

**Data Arrays**:
- `features`: Feature icons and descriptions
- `newArrivals`: Product cards (8 items)
- `categories`: Category cards (6 items)
- `occasions`: Occasion cards (3 items)

**Styling**:
- Bootstrap grid system
- Custom card styling
- Horizontal scrolling
- Premium fonts
- Responsive images

**Usage**:
```jsx
<HomePageContent />
```

---

### Footer (`src/components/Footer.jsx`)

**Purpose**: Page footer with links and company information.

**Features**:
- Company links
- Social media links
- Copyright information
- Responsive layout

**Props**: None

**Usage**:
```jsx
<Footer />
```

---

## 🔧 Services

### AuthService (`src/services/authService.js`)

**Purpose**: Handles all authentication-related API calls.

**Methods**:
- `register(userData)` - User registration
- `login(credentials)` - User login
- `getCurrentUser()` - Get current user info
- `logout()` - Clear stored tokens
- `isAuthenticated()` - Check auth status
- `getStoredUser()` - Get stored user data
- `forgotPassword(emailOrPhone)` - Request password reset
- `resetPassword(token, code, password)` - Reset password

**Features**:
- JWT token management
- Local storage handling
- Error handling
- Network error handling

**Usage**:
```javascript
import AuthService from '../services/authService';

// Login
const result = await AuthService.login({ emailOrPhone, password });

// Register
const result = await AuthService.register(userData);
```

---

## 📊 Constants (`src/constants/`)

### App Configuration (`src/constants/index.js`)

**Purpose**: Centralized configuration for fonts, colors, spacing, and component sizes.

**Features**:
- **Font Configuration**: Primary (Playfair Display) and Secondary (Inter) fonts
- **Color Palette**: Primary, Secondary, Muted, Light, White colors
- **Spacing System**: Consistent spacing values (Small, Medium, Large, XLarge)
- **Breakpoints**: Responsive breakpoints for mobile, tablet, desktop
- **Card Sizes**: Standardized dimensions for product and category cards
- **Product Types**: Constants for different product categories

**Exports**:
```javascript
export const APP_CONFIG = {
  FONTS: { PRIMARY, SECONDARY },
  COLORS: { PRIMARY, SECONDARY, MUTED, LIGHT, WHITE },
  SPACING: { SMALL, MEDIUM, LARGE, XLARGE },
  BREAKPOINTS: { MOBILE, TABLET, DESKTOP }
};

export const PRODUCT_TYPES = {
  NEW_ARRIVALS: 'newArrivals',
  CATEGORIES: 'categories',
  OCCASIONS: 'occasions'
};

export const CARD_SIZES = {
  PRODUCT: { WIDTH, HEIGHT, IMAGE_HEIGHT, TEXT_HEIGHT },
  CATEGORY: { ASPECT_RATIO }
};
```

**Usage**:
```javascript
import { APP_CONFIG, CARD_SIZES } from '../constants';

// Use in components
const styles = {
  fontFamily: APP_CONFIG.FONTS.PRIMARY,
  color: APP_CONFIG.COLORS.PRIMARY,
  width: CARD_SIZES.PRODUCT.WIDTH
};
```

---

## 🛠️ Utils (`src/utils/`)

### Utility Functions (`src/utils/index.js`)

**Purpose**: Reusable utility functions for common operations.

**Features**:
- **Style Helpers**: Object manipulation for styles
- **Text Helpers**: Text formatting and truncation
- **Validators**: Email and phone validation
- **Performance**: Debounce function for optimization

**Functions**:

#### Style Helpers
- `createStyleObject(styles)` - Creates style object from styles
- `combineStyles(...styleObjects)` - Combines multiple style objects
- `generateResponsiveStyles(mobileStyles, desktopStyles)` - Generates responsive styles

#### Text Helpers
- `truncateText(text, maxLength)` - Truncates text with ellipsis
- `formatPrice(price)` - Formats price in Indian currency format

#### Validators
- `validateEmail(email)` - Validates email format
- `validatePhone(phone)` - Validates Indian phone number format

#### Performance
- `debounce(func, wait)` - Debounces function calls for performance

**Usage**:
```javascript
import { formatPrice, validateEmail, debounce } from '../utils';

// Format price
const formattedPrice = formatPrice(1400); // "₹1,400"

// Validate email
const isValidEmail = validateEmail('user@example.com'); // true

// Debounce function
const debouncedSearch = debounce(searchFunction, 300);
```

---

## 🎨 Styling Files

### fonts.css (`src/fonts.css`)

**Purpose**: Global typography and font settings.

**Features**:
- Google Fonts imports (Playfair Display + Inter)
- Font smoothing
- Typography hierarchy
- Component-specific font overrides

**Font Usage**:
- **Headings**: Playfair Display (serif, elegant)
- **Body Text**: Inter (sans-serif, readable)
- **Buttons**: Inter with proper weights
- **Navigation**: Playfair Display for menu items

### App.css (`src/App.css`)

**Purpose**: Global application styles.

**Features**:
- Base styles
- Global resets
- App-wide styling

### index.css (`src/index.css`)

**Purpose**: Base styles and CSS resets.

**Features**:
- CSS resets
- Base typography
- Global styles

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- All components designed mobile-first
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Optimized images and layouts

### Bootstrap Grid
- Uses Bootstrap's responsive grid system
- Consistent spacing and alignment
- Flexible layouts across devices

---

## 🔄 State Management

### Local State
- Each component manages its own state
- React hooks (useState, useEffect)
- No global state management library

### Data Flow
- Props down, events up
- Parent components manage shared state
- Services handle API communication

---

## 🎯 Best Practices

### Component Design
- Single responsibility principle
- Reusable and composable
- Props validation
- Clean, readable code

### Styling
- Bootstrap utility classes
- Custom CSS for specific needs
- Consistent naming conventions
- Mobile-first approach

### Performance
- Lazy loading where appropriate
- Optimized images
- Efficient re-renders
- Clean component structure

---

## 🚀 Future Enhancements

### Planned Features
- Product detail pages
- Shopping cart functionality
- User profile management
- Order tracking
- Payment integration
- Admin dashboard

### Technical Improvements
- State management (Redux/Zustand)
- Testing (Jest/React Testing Library)
- Performance optimization
- SEO improvements
- PWA features

---

This documentation provides a comprehensive overview of all components and their usage. For specific implementation details, refer to the source code and inline comments.
