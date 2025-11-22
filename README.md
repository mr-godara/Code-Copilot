# Code Generation Copilot - Full-Stack Application

A powerful full-stack web application that allows users to generate code using AI, view syntax-highlighted results, and browse their generation history with pagination.

## 🎯 Project Overview

This application provides an intelligent code generation service powered by OpenAI's GPT API, featuring:
- Natural language to code conversion for 10+ programming languages
- Beautiful syntax-highlighted code display with Prism.js
- Complete generation history with pagination
- MySQL/PostgreSQL database with proper normalization
- RESTful API backend with validation
- Modern responsive React frontend

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern, responsive styling
- **Prism.js** for multi-language syntax highlighting
- **Axios** for API communication
- **React Icons** for beautiful UI elements

### Backend
- **Node.js** with **Express.js** framework
- **MySQL** / **PostgreSQL** for relational database
- **Sequelize ORM** for database management
- **OpenAI API** (GPT-3.5-turbo) for code generation
- **Express Validator** for robust input validation
- **CORS** enabled for cross-origin requests

### Database
- **MySQL** (default, production-ready)
- **PostgreSQL** (alternative option)
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

### Tables

#### 1. **users** (Optional - for multi-user support)
- `id` (Primary Key, Auto-increment)
- `username` (Unique, Not Null)
- `email` (Unique, Not Null)
- `created_at` (Timestamp)

#### 2. **languages** (Reference Table)
- `id` (Primary Key, Auto-increment)
- `name` (Unique, e.g., "Python", "JavaScript")
- `extension` (e.g., ".py", ".js")
- `created_at` (Timestamp)

#### 3. **generations** (Main Table)
- `id` (Primary Key, Auto-increment)
- `prompt` (Text, Not Null)
- `language_id` (Foreign Key → languages.id)
- `user_id` (Foreign Key → users.id, Nullable)
- `code` (Text, Not Null)
- `created_at` (Timestamp, Indexed)

### Key Design Decisions

**Normalization (3NF):**
- Languages stored separately to avoid redundancy
- Each generation references language via foreign key
- Reduces storage and ensures consistency

**Foreign Keys:**
- `language_id` → CASCADE delete (removes generations if language deleted)
- `user_id` → SET NULL delete (preserves generations if user deleted)

**Indexes:**
- `created_at` DESC for fast pagination
- `language_id` for efficient JOINs
- Primary keys for O(1) lookups

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
- MySQL 8.0+ or PostgreSQL 14+ (SQLite optional for development)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy example file
cp .env.example .env

# Or create manually with these variables
```

4. Configure environment variables in `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MySQL)
DATABASE_URL=mysql://root:password@localhost:3306/code_copilot

# Database (PostgreSQL alternative)
# DATABASE_URL=postgresql://username:password@localhost:5432/code_copilot

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

5. Create database:
```sql
-- For MySQL
CREATE DATABASE code_copilot;

-- For PostgreSQL
CREATE DATABASE code_copilot;
```

6. Run database migrations:
```bash
npm run migrate
```

7. Seed initial languages:
```bash
npm run seed
```

8. Start the server:
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

3. Create `.env` file (optional, uses localhost:5000 by default):
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
```

4. Start development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

### Verification

1. Check backend health: `http://localhost:5000/api/health`
2. Open frontend: `http://localhost:5173`
3. Try generating code with prompt: "Write a function to reverse a string"

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
- ✅ Clean, intuitive UI with natural language prompt input
- ✅ Language selection dropdown (Python, JavaScript, TypeScript, C++, Java, Go, Rust, C#, PHP, Ruby)
- ✅ Real-time code generation with smooth loading animations
- ✅ Professional syntax-highlighted code display (Prism.js with 10+ language support)
- ✅ One-click copy to clipboard functionality
- ✅ Paginated history view with detailed metadata
- ✅ Comprehensive error handling with user-friendly messages
- ✅ Fully responsive design (mobile, tablet, desktop optimized)
- ✅ Modern gradient UI with Tailwind CSS

### Backend Features
- ✅ RESTful API with Express.js framework
- ✅ Robust input validation and sanitization (Express Validator)
- ✅ OpenAI API integration (GPT-3.5-turbo model)
- ✅ Multi-database support (MySQL/PostgreSQL/SQLite)
- ✅ Automated database migrations and seeding
- ✅ Global error handling middleware
- ✅ CORS configuration with security
- ✅ Environment-based configuration
- ✅ Detailed API request/response logging

### Supported Languages
Python • JavaScript • TypeScript • C++ • Java • Go • Rust • C# • PHP • Ruby

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Backend:**
- Render.com (free tier with auto-deploy)
- Railway.app (easy database + backend)
- Heroku (classic platform)

**Frontend:**
- Vercel (recommended - zero config)
- Netlify (with SPA routing)
- GitHub Pages

**Database:**
- Railway.app MySQL/PostgreSQL
- PlanetScale (MySQL serverless)
- Supabase (PostgreSQL free tier)
- Neon.tech (PostgreSQL serverless)

## 👨‍💻 Author

Built by **Dhruv Godara** as part of Full-Stack Development Portfolio

**GitHub:** [mr-godara](https://github.com/mr-godara)  
**Repository:** [Code-Copilot](https://github.com/mr-godara/Code-Copilot)

## 📜 License

MIT License - Free to use for learning and portfolio purposes.

---

**Need Help?** Open an issue on GitHub or contact the repository owner.
