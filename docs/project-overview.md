# File Management System Documentation

## Overview
This project is a modern file management system built with React and TypeScript, providing a user-friendly interface for managing files and folders. The system includes features like file organization, navigation, and various file operations.

## Core Components

### 1. FileTable Component
The main component that serves as the central hub for file management. It handles:
- File/folder display
- State management
- User interactions
- API communications

### 2. Views System
The application provides three main views:

#### All Files
- Displays all non-trash files
- Shows file metadata (size, type, creation date)
- Supports folder navigation
- Enables file operations

#### Starred Files
- Shows files marked as important
- Maintains a separate count of starred items
- Allows quick access to frequently used files

#### Trash
- Contains deleted files
- Provides options to:
  - Restore files
  - Permanently delete files
  - Empty trash

### 3. File Operations
The system supports various file operations:

#### Star/Unstar
- Toggle file importance
- Updates file metadata
- Syncs with backend

#### Move to Trash
- Soft delete functionality
- Moves files to trash view
- Preserves file data

#### Download
- Supports multiple file types
- Uses ImageKit for image optimization
- Handles direct file downloads

#### Delete
- Permanent file removal
- Supports bulk deletion
- Includes confirmation dialogs

### 4. Navigation System
The navigation system includes:

#### Folder Navigation
- Hierarchical folder structure
- Breadcrumb navigation
- Parent/child relationship tracking

#### Path Navigation
- Current location tracking
- Quick navigation to parent folders
- Path history maintenance

#### Refresh
- Data synchronization
- State updates
- Cache invalidation

### 5. API Integration

#### File Operations API
- RESTful endpoints for file operations
- CRUD operations
- Error handling

#### ImageKit Integration
- Image optimization
- CDN delivery
- Image transformations

#### File Storage
- Secure file storage
- File metadata management
- Access control

## Technical Implementation

### State Management
- Uses React's useState for local state
- Implements useMemo for performance optimization
- Manages complex state interactions

### Data Flow
1. User interaction triggers state updates
2. State changes trigger API calls
3. API responses update the UI
4. Changes are reflected in the view

### Error Handling
- Toast notifications for user feedback
- Error boundaries for component safety
- Graceful fallbacks

### Performance Optimizations
- Memoized computations
- Lazy loading
- Optimized image delivery

## Security Features
- User authentication
- File access control
- Secure API communication
- Protected routes

## Future Enhancements
- Real-time updates
- Advanced search functionality
- File sharing capabilities
- Collaborative features

## Getting Started
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the development server

## Environment Variables
Required environment variables:
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- Database connection strings
- API keys

## API Endpoints
- `/api/files` - File operations
- `/api/files/{id}/star` - Star/unstar files
- `/api/files/{id}/trash` - Trash operations
- `/api/files/delete-all` - Bulk deletion
