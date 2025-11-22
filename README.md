# Code Generation Copilot - Full-Stack Application

A minimal full-stack web application that allows users to generate code using AI, view syntax-highlighted results, and browse their generation history with pagination.

## 🎯 Project Overview

This application provides a code generation service powered by OpenAI's API, featuring:
- Natural language code generation for multiple programming languages
- Syntax-highlighted code display
- Paginated history of all generations
- Relational database with proper normalization
- RESTful API backend
- Responsive React frontend

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Prism.js** for syntax highlighting
- **Axios** for API calls
- **React Icons** for UI elements

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** for relational database
- **Sequelize ORM** for database management
- **OpenAI API** for code generation
- **Express Validator** for input validation
- **CORS** enabled

### Database
- **PostgreSQL** (production)
- **SQLite** (optional for local development)

## 📁 Project Structure

```
AutomationEdge_Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── codeController.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── Language.js
│   │   │   └── Generation.js
│   │   ├── routes/
│   │   │   └── api.js
│   │   ├── services/
│   │   │   └── aiService.js
│   │   ├── migrations/
│   │   │   ├── 001-create-users.js
│   │   │   ├── 002-create-languages.js
│   │   │   └── 003-create-generations.js
│   │   └── middleware/
│   │       └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeGenerator.jsx
│   │   │   ├── CodeDisplay.jsx
│   │   │   ├── HistoryList.jsx
│   │   │   └── Pagination.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
├── ER_DIAGRAM.md
├── VIDEO_SCRIPT.md
└── DEPLOYMENT.md
```

## 🗄️ Database Schema

### ER Diagram

See [ER_DIAGRAM.md](./ER_DIAGRAM.md) for the complete entity-relationship diagram.

### Tables

#### 1. **users** (Optional - for multi-user support)
- `id` (Primary Key, Auto-increment)
- `username` (Unique, Not Null)
- `email` (Unique, Not Null)
- `created_at` (Timestamp)

#### 2. **languages** (Lookup/Reference Table)
- `id` (Primary Key, Auto-increment)
- `name` (Unique, e.g., "Python", "JavaScript")
- `extension` (e.g., ".py", ".js")
- `created_at` (Timestamp)

#### 3. **generations** (Main Data Table)
- `id` (Primary Key, Auto-increment)
- `prompt` (Text, Not Null)
- `language_id` (Foreign Key → languages.id)
- `user_id` (Foreign Key → users.id, Nullable)
- `code` (Text, Not Null)
- `created_at` (Timestamp, Indexed)

### Schema Decisions

**Normalization:**
- The database follows **3NF (Third Normal Form)**
- Languages are stored in a separate table to avoid redundancy and ensure data integrity
- Each generation references a language via foreign key rather than storing language name repeatedly
- This reduces storage space and ensures consistency (e.g., can't have "python", "Python", "PYTHON" as separate entries)

**Foreign Keys:**
- `generations.language_id` → `languages.id` (CASCADE on delete to remove generations if language is removed)
- `generations.user_id` → `users.id` (SET NULL on delete to preserve generations even if user is deleted)

**Constraints:**
- Languages have unique names to prevent duplicates
- Prompts and code fields are NOT NULL (required for meaningful data)
- Timestamps are auto-generated and indexed for efficient sorting

**Why a `users` table?**
- Supports future multi-user scenarios
- Allows tracking which user created which generation
- Enables user-specific history filtering
- Nullable foreign key means the app works without user authentication initially

**Why a `languages` table?**
- Centralizes language configuration (name, file extensions, syntax highlighting info)
- Enables easy addition of new languages without code changes
- Provides referential integrity
- Allows aggregation queries (e.g., "most popular language")

## ⚡ Complexity Analysis

### Paginated Retrieval Time Complexity

**Query:** `SELECT * FROM generations ORDER BY created_at DESC LIMIT 10 OFFSET 20`

- **Without Index:** O(n log n) where n = total rows (due to sorting)
- **With Index on `created_at`:** O(log n + k) where k = page size
  - Index lookup: O(log n)
  - Fetching k rows: O(k)
  - OFFSET performance degrades with large offsets: O(offset + k)

**Optimization Strategy:**
- Created index on `created_at` column
- For very large datasets (>1M rows), cursor-based pagination would be better (using `WHERE created_at < last_timestamp`)

### Schema Impact on Performance

**Positive Impacts:**
- **Join Performance:** Normalized schema with proper indexes allows efficient JOINs
- **Storage Efficiency:** Languages table reduces redundant string storage by ~90%
- **Cache Friendly:** Small languages table fits in memory
- **Flexibility:** Easy to add language metadata without touching generations table

**Potential Bottlenecks:**
- Each query requires a JOIN with languages table (mitigated by DB query optimizer)
- Deep pagination with OFFSET becomes slower (use cursor-based for >10K rows)

### Indexes Created

1. **`generations.created_at` (DESC):** 
   - Speeds up ORDER BY in history queries
   - Critical for pagination performance
   
2. **`generations.language_id`:**
   - Optimizes JOINs with languages table
   - Enables fast filtering by language
   
3. **`languages.name` (UNIQUE):**
   - Enforces uniqueness constraint
   - Speeds up language lookup by name

4. **Primary Keys (Clustered Indexes):**
   - Auto-indexed on all `id` columns
   - Enables O(1) lookups

**When are indexes useful?**
- Columns used in WHERE clauses
- Columns used in ORDER BY
- Foreign key columns used in JOINs
- Columns used frequently in queries

**Trade-offs:**
- Indexes speed up reads but slow down writes
- Each index uses additional storage
- Too many indexes can confuse query optimizer

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or SQLite for local testing)
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/code_copilot
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

5. Run database migrations:
```bash
npm run migrate
```

6. Seed initial languages:
```bash
npm run seed
```

7. Start the server:
```bash
npm run dev
```

Backend will run at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure API URL in `.env`:
```env
VITE_API_URL=http://localhost:5000
```

5. Start development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Generate Code
**POST** `/api/generate`

Generate code from a natural language prompt.

**Request Body:**
```json
{
  "prompt": "Write a Python function to reverse a string",
  "language": "Python",
  "userId": 1  // Optional
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "prompt": "Write a Python function to reverse a string",
    "language": "Python",
    "code": "def reverse_string(s):\n    return s[::-1]",
    "createdAt": "2025-11-22T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Prompt is required"
}
```

#### 2. Get History
**GET** `/api/history`

Retrieve paginated list of previous code generations.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 50) - Items per page
- `language` (string, optional) - Filter by language name
- `userId` (number, optional) - Filter by user ID

**Example Request:**
```
GET /api/history?page=2&limit=15&language=Python
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "generations": [
      {
        "id": 123,
        "prompt": "Write a Python function to reverse a string",
        "language": "Python",
        "code": "def reverse_string(s):\n    return s[::-1]",
        "createdAt": "2025-11-22T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 2,
      "totalPages": 5,
      "totalItems": 73,
      "itemsPerPage": 15,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  }
}
```

#### 3. Get Supported Languages
**GET** `/api/languages`

Retrieve list of supported programming languages.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Python",
      "extension": ".py"
    },
    {
      "id": 2,
      "name": "JavaScript",
      "extension": ".js"
    }
  ]
}
```

#### 4. Health Check
**GET** `/api/health`

Check API status.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-22T10:30:00.000Z"
}
```

## 🎨 Features

### Frontend Features
- ✅ Natural language prompt input
- ✅ Language selection dropdown (Python, JavaScript, TypeScript, C++, Java, Go, Rust)
- ✅ Real-time code generation with loading states
- ✅ Syntax-highlighted code display (Prism.js)
- ✅ Copy to clipboard functionality
- ✅ Paginated history view (10 items per page)
- ✅ Error handling with user-friendly messages
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light mode toggle

### Backend Features
- ✅ RESTful API with Express.js
- ✅ Input validation and sanitization
- ✅ OpenAI API integration (GPT-3.5-turbo)
- ✅ PostgreSQL database with Sequelize ORM
- ✅ Database migrations and seeding
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Environment-based configuration
- ✅ API request logging

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Backend:**
- Render.com (free tier)
- Railway.app
- Heroku
- AWS Elastic Beanstalk

**Frontend:**
- Vercel (recommended)
- Netlify
- GitHub Pages (with routing config)

**Database:**
- Supabase (free PostgreSQL)
- Neon.tech (serverless PostgreSQL)
- Railway.app PostgreSQL

### Environment Variables for Production

**Backend `.env`:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
OPENAI_API_KEY=sk-...
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Frontend `.env`:**
```env
VITE_API_URL=https://your-backend.onrender.com
```

## 🎥 Video Demo

See [VIDEO_SCRIPT.md](./VIDEO_SCRIPT.md) for the complete demo walkthrough script.

**Demo Flow (2-3 minutes):**
1. Show landing page and UI
2. Enter prompt: "Write a Python function to calculate factorial"
3. Select language: Python
4. Click "Generate Code"
5. Show loading state
6. Display generated code with syntax highlighting
7. Copy code to clipboard
8. Navigate to history section
9. Show paginated list with previous generations
10. Test pagination controls
11. Show database entry (pgAdmin or SQL query)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Tests (Postman/Thunder Client)
Import the `api-tests.json` collection from the `tests/` directory.

## 🔒 Security Considerations

- API keys stored in environment variables (never committed)
- Input validation on all endpoints
- SQL injection prevention via Sequelize ORM
- CORS configuration for trusted origins
- Rate limiting on API endpoints (production)
- Prepared statements for all queries

## 📝 License

MIT License - feel free to use this project for learning and portfolio purposes.

## 👨‍💻 Author

Built as part of AutomationEdge Full-Stack Assignment

## 🙏 Acknowledgments

- OpenAI for GPT API
- React and Express communities
- Sequelize ORM documentation
- TailwindCSS for styling framework

---

**Demo Credentials (if users table is implemented):**
- Username: `demo@example.com`
- Password: `demo123` (if authentication is added)

For questions or issues, please open a GitHub issue or contact the repository owner.
