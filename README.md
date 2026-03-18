# AI Research Assistant

A powerful research assistant application that helps researchers, students, and academics streamline their research process with AI-powered tools.

## Features

### 🤖 AI Integration
- **ChatGPT Integration**: Interactive AI chat for research assistance
  - Real-time chat with context-aware responses
  - Generate research insights on specific topics
  - Automatic citation and reference generation
  - Conversation history tracking

### 📝 Note Management
- Create, edit, and organize research notes
- Rich text formatting
- Automatic saving
- Search and filter capabilities

### 📚 Citation Management
- Store and organize citations
- Multiple citation formats support
- Source link management
- Citation export functionality

### 📊 Research Tools
- Text summarization
- Research insights generation
- Reference management
- Academic writing assistance

## Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **UI Components**: Custom components with shadcn/ui
- **API Integration**: Custom fetch wrapper with authentication

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI GPT-3.5 Turbo

## Project Structure

### Frontend Structure
```
frontend/
├── app/               # Next.js app directory
├── components/        # React components
│   ├── pages/        # Page components
│   └── ui/           # Reusable UI components
├── lib/              # Utilities and API functions
└── styles/           # Global styles
```

### Backend Structure
```
backend/
├── src/
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   └── index.ts      # Server entry point
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Notes
- GET `/api/notes` - Get all notes
- POST `/api/notes` - Create a note
- PUT `/api/notes/:id` - Update a note
- DELETE `/api/notes/:id` - Delete a note

### Citations
- GET `/api/citations` - Get all citations
- POST `/api/citations` - Create a citation
- PUT `/api/citations/:id` - Update a citation
- DELETE `/api/citations/:id` - Delete a citation

### ChatGPT Integration
- POST `/api/chat` - Send message to ChatGPT
- GET `/api/chat/history` - Get chat history
- POST `/api/chat/research` - Generate research insights
- POST `/api/chat/references` - Generate citations

### Summarizer
- POST `/api/summarize` - Summarize text

## Setup and Installation

1. Clone the repository
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install dependencies
\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
\`\`\`

3. Configure environment variables

Backend (.env):
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-research-assistant
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
\`\`\`

Frontend (.env.local):
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

4. Start the development servers

Backend:
\`\`\`bash
cd backend
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. All API endpoints except login and register require a valid JWT token in the Authorization header:

\`\`\`typescript
Authorization: Bearer <token>
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-3.5 API
- MongoDB for database
- Next.js team for the amazing framework
- shadcn/ui for beautiful UI components
