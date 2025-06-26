# Search Feature Implementation

## Overview

This document describes the implementation of the search feature in the UNIFY application, which allows users to search for other users by username, first name, or last name.

## Backend Implementation

### 1. UserController

- **File**: `springboot/UNIFY/src/main/java/com/app/unify/controllers/UserController.java`
- **Endpoint**: `GET /api/users/search?query={searchTerm}`
- **Functionality**: Handles user search requests with query parameter validation

### 2. UserService

- **File**: `springboot/UNIFY/src/main/java/com/app/unify/services/UserService.java`
- **Method**: `searchUsers(String query)`
- **Functionality**: Performs the actual search logic and maps results to DTOs

### 3. UserRepository

- **File**: `springboot/UNIFY/src/main/java/com/app/unify/repositories/UserRepository.java`
- **Method**: `findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase()`
- **Functionality**: Database query to find users matching the search criteria

### 4. UserMapper

- **File**: `springboot/UNIFY/src/main/java/com/app/unify/mapper/UserMapper.java`
- **Functionality**: Maps User entities to UserDTO objects for API responses

## Frontend Implementation

### 1. Search Service

- **File**: `frontend/app/api/services/searchService.js`
- **Functionality**: Handles API calls to the backend search endpoint

### 2. Search Hook

- **File**: `frontend/hooks/useSearch.js`
- **Functionality**: Custom React hook providing search state management, debouncing, and search history

### 3. Search Component

- **File**: `frontend/components/global/SearchHorizontalToggle.jsx`
- **Functionality**: Main search UI component with real-time search, results display, and search history

## Features

### Search Functionality

- Real-time search as user types (with 300ms debouncing)
- Search by username, first name, or last name (case-insensitive)
- Displays user avatars, usernames, and full names
- Click on user to navigate to their profile (`/othersProfiles/{username}`)

### Search History

- Automatically saves search queries to localStorage
- Displays recent searches with clock icon
- Click on history item to re-execute search
- Remove individual history items or clear all history
- Limits history to last 10 searches

### UI/UX Features

- Loading spinner during search
- Error handling with user-friendly messages
- Responsive design with hover effects
- Dark mode support
- Smooth animations and transitions

## API Endpoints

### Search Users

```
GET /api/users/search?query={searchTerm}
```

**Parameters:**

- `query` (required): Search term to find users

**Response:**

```json
[
  {
    "id": "user-id",
    "username": "username",
    "firstName": "First",
    "lastName": "Last",
    "avatar": {
      "url": "avatar-url"
    }
  }
]
```

## Error Handling

### Backend

- Validates query parameter (non-empty)
- Returns appropriate HTTP status codes
- Handles exceptions gracefully

### Frontend

- Network error handling
- API error response handling
- User-friendly error messages
- Graceful fallbacks for missing data

## Dependencies

### Backend

- Spring Boot
- Spring Data JPA
- MapStruct (for object mapping)
- Lombok

### Frontend

- React
- Next.js
- Axios (for API calls)
- js-cookie (for token management)
- Lucide React (for icons)

## Usage

1. Open the search sidebar by clicking the search icon
2. Type a username, first name, or last name in the search input
3. View real-time search results
4. Click on a user to navigate to their profile
5. Access search history when the search input is empty
6. Manage search history using the clear and remove options

## Notes

- The search is case-insensitive
- Search results include user avatars and full names
- Search history is persisted in browser localStorage
- The component supports both light and dark themes
- All API calls include authentication tokens
