# Nectar - Online Grocery Delivery Platform

A modern, full-featured grocery delivery web application built with Next.js 16, TypeScript, Tailwind CSS v4, Zustand, and Zod. Features a complete e-commerce experience with authentication, product browsing, shopping cart, and order management.

## 🚀 Features

### Authentication & Onboarding
- **Splash Screen** - Initial loading screen with smooth transitions
- **Onboarding** - Welcome screen with brand introduction
- **Phone Number Authentication** - OTP-based verification with country selector
- **Email/Password Login** - Traditional authentication flow
- **Social Login** - Google and Facebook integration (simulated)
- **User Registration** - Complete sign-up with validation

### Shopping Experience
- **Home Page** - Featured products, categories, and deals
- **Product Catalog** - Browse products by category
- **Product Details** - Detailed product pages with images, descriptions, and reviews
- **Search & Filter** - Find products quickly
- **Favorites** - Save favorite products for quick access
- **Shopping Cart** - Add, remove, and manage cart items
- **Quantity Management** - Increment/decrement product quantities

### Order Management
- **Checkout Flow** - Delivery and payment method selection
- **Payment Gateway** - Simulated payment processing
- **Order Success** - Confirmation page with order tracking
- **Order Failure** - Error handling with retry options

### User Features
- **Account Management** - User profile and settings
- **Location Selection** - Choose delivery zone and area
- **Order History** - Track past orders

### UI/UX Features
- **Responsive Design** - Mobile-first, desktop-optimized
- **Cursor Pointer** - All interactive elements have proper cursor styling
- **Loading States** - Smooth loading indicators
- **Toast Notifications** - User feedback with react-hot-toast
- **Form Validation** - Real-time validation with Zod schemas
- **Accessibility** - ARIA labels and keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand 5.0.9
- **Form Validation**: Zod 4.3.5 + React Hook Form 7.70.0
- **Notifications**: React Hot Toast 2.6.0
- **Fonts**: Custom Gilroy font family (Light & ExtraBold)
- **No UI Libraries**: Pure Tailwind CSS implementation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🏃 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── account/                  # User account page
│   ├── cart/                     # Shopping cart page
│   ├── explore/                  # Product exploration page
│   ├── favorites/                # Favorite products page
│   ├── home/                     # Home page with products
│   ├── location/                  # Location selection
│   ├── login/                    # Email/password login
│   ├── onboarding/               # Welcome/onboarding screen
│   ├── order-failure/            # Order failure page
│   ├── order-success/            # Order success confirmation
│   ├── otp/                      # OTP verification
│   ├── payment-gateway/           # Payment processing
│   ├── phone-number/              # Phone number input
│   ├── product/[id]/             # Dynamic product detail page
│   ├── sign-in/                  # Sign in with phone/social
│   ├── sign-up/                  # User registration
│   ├── splash/                   # Splash screen
│   ├── layout.tsx                # Root layout with SEO metadata
│   ├── page.tsx                  # Root page (redirects to splash)
│   └── globals.css               # Global styles and theme
├── components/                   # Reusable components
│   ├── icons/                    # Icon components
│   │   └── NavigationIcons.tsx
│   ├── layout/                   # Layout components
│   │   ├── BottomNav.tsx         # Mobile bottom navigation
│   │   ├── DesktopNav.tsx        # Desktop navigation
│   │   └── Navbar.tsx            # Main navbar
│   ├── shop/                     # Shopping components
│   │   ├── CategoryCard.tsx      # Category display card
│   │   └── ProductCard.tsx       # Product display card
│   └── ui/                       # UI components
│       ├── Button.tsx            # Primary button component
│       ├── CountrySelector.tsx   # Country selection dropdown
│       ├── Input.tsx             # Form input component
│       ├── NumericKeypad.tsx     # Numeric keypad for OTP
│       ├── OTPInput.tsx          # OTP input component
│       ├── QuantityButton.tsx    # Quantity increment/decrement
│       ├── Select.tsx            # Select dropdown component
│       └── Skeleton.tsx          # Loading skeleton component
├── store/                        # Zustand state stores
│   ├── authStore.ts              # Authentication state
│   ├── cartStore.ts              # Shopping cart state
│   ├── locationStore.ts          # Location state
│   ├── otpStore.ts               # OTP verification state
│   └── productStore.ts           # Product state
├── data/                         # Static data
│   └── products.ts               # Product data
├── lib/                          # Utility functions
│   └── zod-schemas.ts            # Zod validation schemas
├── types/                        # TypeScript type definitions
│   └── index.ts
└── public/                       # Static assets
    └── assets/                   # Images and icons
```

## 🎨 Design System

- **Primary Color**: `#53B175` (Green) - Used for buttons, links, and accents
- **Typography**: 
  - Gilroy Light (300) - Body text
  - Gilroy ExtraBold (800) - Headings
- **Border Radius**: `rounded-2xl` (16px) for inputs and buttons
- **Spacing**: Consistent Tailwind spacing scale
- **Interactive Elements**: All buttons have `cursor: pointer` for better UX
- **Color Palette**:
  - Background: White (`#ffffff`)
  - Text Primary: Dark gray (`#171717`)
  - Gray Scale: 50-900 for various UI elements

## ✅ Features Implemented

### Authentication & User Flow
- ✅ Splash screen with auto-redirect
- ✅ Onboarding/Welcome screen
- ✅ Phone number validation (Bangladesh format: +880)
- ✅ OTP input with 4-digit code verification
- ✅ Email validation with live feedback
- ✅ Password visibility toggle
- ✅ Social login simulation (Google & Facebook)
- ✅ Location selection with zones and areas
- ✅ User registration with comprehensive validation

### Shopping Features
- ✅ Product catalog with categories
- ✅ Product detail pages
- ✅ Shopping cart functionality
- ✅ Add to favorites
- ✅ Quantity management
- ✅ Search and filter products
- ✅ Checkout flow
- ✅ Payment gateway simulation
- ✅ Order success/failure pages

### Technical Features
- ✅ Form validation with Zod schemas
- ✅ TypeScript strict mode (no `any` types)
- ✅ Zustand state management with persistence
- ✅ Responsive design (mobile-first, desktop-optimized)
- ✅ SEO optimization with metadata
- ✅ Cursor pointer on all interactive elements
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback

## 🔐 User Flows

### Primary Authentication Flow
1. **Splash Screen** → Shows for 2 seconds, then redirects
2. **Onboarding** → Welcome screen with "Get Started" button
3. **Sign In** → Choose phone number or social login
4. **Phone Number** → Enter mobile number (+880 format)
5. **OTP Verification** → Enter 4-digit code
6. **Location Selection** → Select zone and area
7. **Home** → Main shopping application

### Alternative Flows
- **Login** → Direct email/password login
- **Sign Up** → Create new account with validation
- **Guest Mode** → Browse products without authentication

### Shopping Flow
1. **Home/Explore** → Browse products and categories
2. **Product Details** → View product information
3. **Add to Cart** → Add products with quantity
4. **Cart** → Review items and proceed to checkout
5. **Checkout** → Select delivery and payment methods
6. **Payment** → Process payment (simulated)
7. **Order Confirmation** → View order success/failure

## 📝 Important Notes

### Development & Demo
- All authentication is **simulated** (no backend required)
- OTP accepts any 4-digit code for demo purposes
- Social login simulates API calls with loading delays
- Location data is mocked with predefined zones and areas
- Payment processing is simulated for demonstration
- State persists in localStorage using Zustand persist middleware

### Code Quality
- **TypeScript Strict Mode**: All types are properly defined
- **No `any` types**: Full type safety throughout the application
- **Component-based**: Reusable, modular components
- **Form Validation**: Client-side validation with Zod
- **Error Handling**: Comprehensive error states and user feedback

### Performance
- **Image Optimization**: Next.js Image component for optimized loading
- **Font Optimization**: Local fonts with proper loading strategies
- **Code Splitting**: Automatic with Next.js App Router
- **SEO Optimized**: Metadata and Open Graph tags included

## 🚀 Deployment

This project is deployed on:
- **Vercel** (Recommended for Next.js) - One-click deployment

### Build Commands
```bash
npm run build    # Build for production
npm run dev      # Start production server
```


