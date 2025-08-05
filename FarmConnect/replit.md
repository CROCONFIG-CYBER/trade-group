# Overview

FarmMarket is a modern e-commerce platform specifically designed for agricultural products, connecting farmers and sellers with customers. The application provides a comprehensive marketplace where users can browse, purchase, and sell farm products with real-time chat functionality for direct communication between buyers and sellers. The platform supports multiple user roles (customer, seller, admin) with role-specific dashboards and features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 using TypeScript and follows a modern component-based architecture:

- **Framework**: React with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack React Query for server state management

## Backend Architecture
The backend uses Express.js with TypeScript in a REST API architecture:

- **Framework**: Express.js with TypeScript
- **Real-time Communication**: WebSocket server for chat functionality
- **API Design**: RESTful endpoints with centralized route handling
- **Error Handling**: Centralized error middleware with standardized responses
- **Development**: Hot reloading with tsx for TypeScript execution

## Database Layer
The application uses a PostgreSQL database with Drizzle ORM:

- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions with automatic migrations
- **Connection**: Neon Database serverless driver for cloud deployment

## Authentication System
Authentication is handled through Firebase Auth:

- **Provider**: Firebase Authentication for user management
- **User Data**: Firebase Realtime Database for additional user profile data
- **Role Management**: Custom role-based access control (customer, seller, admin)
- **Session Management**: Firebase Auth state persistence

## Real-time Features
WebSocket integration provides real-time functionality:

- **Chat System**: Real-time messaging between users with connection management
- **Connection Handling**: Automatic reconnection and error recovery
- **Message Persistence**: Chat messages stored in PostgreSQL database

## Data Models
The schema includes comprehensive e-commerce entities:

- **Users**: Role-based user management with profiles
- **Products**: Inventory management with seller relationships
- **Orders**: Complete order lifecycle with status tracking
- **Cart**: Persistent shopping cart functionality
- **Chat**: Real-time messaging system
- **Discounts**: Promotional code system

## Component Organization
The frontend follows a structured component hierarchy:

- **Layout Components**: Navigation, sidebars, and modals
- **UI Components**: Reusable Shadcn/ui components
- **Page Components**: Route-specific views
- **Feature Components**: Domain-specific components (products, dashboard, etc.)

## Development Workflow
The project supports both development and production environments:

- **Development**: Vite dev server with HMR and TypeScript checking
- **Build Process**: Separate client and server builds with ESBuild
- **Asset Management**: Vite handles frontend assets, Express serves in production
- **Type Checking**: Shared TypeScript configuration across client/server/shared code

## Error Handling and Logging
Comprehensive error handling and monitoring:

- **API Logging**: Request/response logging with timing information
- **Error Boundaries**: Centralized error handling in Express middleware
- **Development Tools**: Runtime error overlays and debugging support

# External Dependencies

## Core Infrastructure
- **Neon Database**: PostgreSQL hosting with serverless architecture
- **Firebase**: Authentication and real-time database services
- **Replit**: Development environment with integrated deployment

## Frontend Libraries
- **TanStack React Query**: Server state management and caching
- **Radix UI**: Accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework
- **Wouter**: Lightweight React router
- **React Hook Form**: Form state management with validation

## Backend Libraries
- **Express.js**: Web framework for Node.js
- **WebSocket (ws)**: Real-time bidirectional communication
- **Drizzle ORM**: Type-safe database operations
- **Connect-pg-simple**: PostgreSQL session store

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: JavaScript bundler for production
- **Zod**: Runtime type validation
- **Date-fns**: Date manipulation utilities