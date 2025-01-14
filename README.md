# Buffet Ordering System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technical Architecture](#technical-architecture)
3. [Core Features](#core-features)
4. [Development Setup](#development-setup)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Security Considerations](#security-considerations)
8. [Testing Strategy](#testing-strategy)
9. [Deployment](#deployment)

## System Overview
A modern React application built with TypeScript for managing buffet orders. The system provides three distinct interfaces:
- **Customer Interface**: Order placement and tracking
- **Admin Interface**: Menu and inventory management
- **Employee Interface**: Order processing and fulfillment

## Technical Architecture
### Frontend
- React 18 with TypeScript
- React Router 6 for navigation
- Context API for state management
- Axios for API communication

### Backend Integration
- REST API integration following BackEndSwaggerModel.json
- JWT-based authentication
- Role-based access control

## Core Features
### Customer Interface
- **Menu Browsing**: View available buffet items with details
- **Cart Management**: Add/remove items, adjust quantities
- **Order Placement**: Submit and track orders
- **Order History**: View past orders and status

### Admin Interface
- **Menu Management**: CRUD operations for buffet items
- **Inventory Control**: Update stock levels
- **Pricing Management**: Adjust item prices
- **Reporting**: View sales and order statistics

### Employee Interface
- **Order Queue**: View incoming orders
- **Order Status**: Update preparation status
- **Notifications**: Real-time order updates

## Development Setup
### Prerequisites
- Node.js v16+
- npm v8+

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

### Environment Variables
Create `.env` file with:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_AUTH_TOKEN_KEY=authToken
```

## API Integration
The application integrates with the backend API following the specifications in BackEndSwaggerModel.json. Key endpoints include:

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/items | GET | Get all menu items |
| /api/orders | POST | Create new order |
| /api/orders/{id} | GET | Get order details |
| /api/auth/login | POST | User authentication |

## State Management
The application uses React Context API for state management with the following contexts:
- **AppContext**: Global application state
- **AuthContext**: Authentication state
- **CartContext**: Shopping cart state

## Security Considerations
- JWT token storage in secure HTTP-only cookies
- Role-based access control
- Input validation on all forms
- API request sanitization

## Testing Strategy
- Unit tests with Jest
- Component tests with React Testing Library
- End-to-end tests with Cypress

## Deployment
### Production Build
```bash
npm run build
```

### Deployment Requirements
- Node.js server
- Reverse proxy (Nginx/Apache)
- SSL/TLS configuration
