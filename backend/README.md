# Research Assistant Backend API

Backend server for the Research Assistant application providing authentication, notes management, text summarization, and citations management functionality.

## Features

- User authentication (signup, login, profile management)
- Notes management
- Text summarization
- Citations management
- MongoDB database integration
- TypeScript support
- JWT authentication
- Input validation using Zod
- Error handling
- Request logging

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## API Documentation

### Authentication

#### POST /api/auth/signup
Register a new user

#### POST /api/auth/login
Login user

#### GET /api/auth/profile
Get user profile

### Notes

#### GET /api/notes
Get all notes for authenticated user

#### POST /api/notes
Create a new note

#### PUT /api/notes/:id
Update a note

#### DELETE /api/notes/:id
Delete a note

### Summarization

#### POST /api/summarize
Summarize text content

### Citations

#### GET /api/citations
Get all citations

#### POST /api/citations
Create a new citation

#### PUT /api/citations/:id
Update a citation

#### DELETE /api/citations/:id
Delete a citation

## Error Handling

The API uses a centralized error handling mechanism. All errors are formatted consistently and include:

- Status code
- Error message
- Error details (in development)

## Security

- Password hashing using bcrypt
- JWT for authentication
- Input validation
- CORS protection
- Rate limiting
- Secure HTTP headers
