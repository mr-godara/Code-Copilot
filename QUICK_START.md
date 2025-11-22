# 🚀 Quick Start Guide - Code Generation Copilot

## ⚡ 5-Minute Setup

### Step 1: Prerequisites Check
```powershell
# Check Node.js (should be 18+)
node --version

# Check npm
npm --version

# Check PostgreSQL (optional - can use SQLite)
psql --version
```

### Step 2: Setup Backend
```powershell
cd c:\Users\91766\Downloads\AutomationEdge_Assignment\backend
npm install
copy .env.example .env
# Edit .env and add your OpenAI API key
npm run migrate
npm run seed
npm run dev
```

✅ Backend running at: **http://localhost:5000**

### Step 3: Setup Frontend (New Terminal)
```powershell
cd c:\Users\91766\Downloads\AutomationEdge_Assignment\frontend
npm install
copy .env.example .env
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## 🔑 Critical Environment Variables

### Backend `.env`
```env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE
DATABASE_URL=postgresql://postgres:password@localhost:5432/code_copilot
CORS_ORIGIN=http://localhost:5173
PORT=5000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000
```

---

## 📁 Project Structure at a Glance

```
AutomationEdge_Assignment/
├── 📄 Documentation (7 files)
│   ├── README.md              ⭐ Start here
│   ├── SETUP.md               ⚡ Quick setup
│   ├── PROJECT_SUMMARY.md     📋 Complete overview
│   ├── API_DOCUMENTATION.md   📡 API reference
│   ├── ER_DIAGRAM.md          🗄️ Database schema
│   ├── DEPLOYMENT.md          🚀 Deploy guide
│   ├── VIDEO_SCRIPT.md        🎥 Demo script
│   └── RESOURCES.md           🔧 Troubleshooting
│
├── backend/                    💻 Express.js API
│   ├── server.js              Entry point
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/            Database config
│       ├── models/            User, Language, Generation
│       ├── controllers/       API logic
│       ├── routes/            API routes
│       ├── services/          OpenAI integration
│       ├── middleware/        Error handling
│       └── migrations/        DB setup scripts
│
└── frontend/                   ⚛️ React + Vite
    ├── index.html
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            Main component
        ├── main.jsx           Entry point
        ├── components/        UI components
        │   ├── CodeGenerator  Input form
        │   ├── CodeDisplay    Syntax highlighting
        │   ├── HistoryList    Paginated list
        │   └── Pagination     Page controls
        └── services/
            └── api.js         API client
```

---

## 🎯 API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check API status |
| GET | `/api/languages` | Get supported languages |
| POST | `/api/generate` | Generate code from prompt |
| GET | `/api/history?page=1&limit=10` | Get generation history |

### Example API Call
```javascript
// Generate code
const response = await fetch('http://localhost:5000/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Write a Python function to reverse a string',
    language: 'Python'
  })
});
const data = await response.json();
```

---

## 🗄️ Database Schema Quick Reference

```
users                    languages               generations
---------                -----------             -------------
id (PK)                  id (PK)                 id (PK)
username (UNIQUE)        name (UNIQUE)           prompt
email (UNIQUE)           extension               language_id (FK) ──→ languages.id
created_at               created_at              user_id (FK) ──→ users.id
                                                 code
                                                 created_at (INDEXED)
```

**Relationships:**
- 1 Language → Many Generations (CASCADE delete)
- 1 User → Many Generations (SET NULL on delete)

---

## ✅ Testing Checklist

### Quick Functional Test
1. ✅ Open http://localhost:5173
2. ✅ Enter prompt: "Sort array in Python"
3. ✅ Select "Python"
4. ✅ Click "Generate Code"
5. ✅ See loading spinner
6. ✅ Code appears with syntax highlighting
7. ✅ Click "Copy" button
8. ✅ Switch to "History" tab
9. ✅ See generated code in list
10. ✅ Test pagination (if >10 items)

### Backend API Test
```powershell
# Test health
curl http://localhost:5000/api/health

# Test languages
curl http://localhost:5000/api/languages

# Test generation (PowerShell)
Invoke-RestMethod -Uri "http://localhost:5000/api/generate" -Method POST -ContentType "application/json" -Body '{"prompt":"test","language":"Python"}'
```

---

## 🐛 Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| "Cannot find module" | `npm install` in that directory |
| "Port already in use" | Change PORT in .env or kill process |
| "Database connection failed" | Check DATABASE_URL, ensure PostgreSQL running |
| "OpenAI API error" | Verify API key, check credits |
| "CORS error" | Match CORS_ORIGIN to frontend URL exactly |
| Frontend won't start | Delete node_modules, run `npm install` |

---

## 📊 Features Implemented

### Frontend ⚛️
✅ Natural language prompt input  
✅ 7 language options (Python, JS, TS, C++, Java, Go, Rust)  
✅ Real-time code generation  
✅ Syntax highlighting (Prism.js)  
✅ Copy to clipboard  
✅ Paginated history (10/page)  
✅ Responsive design  
✅ Loading & error states  

### Backend 💻
✅ RESTful API (4 endpoints)  
✅ OpenAI GPT-3.5 integration  
✅ Input validation  
✅ Error handling  
✅ PostgreSQL + Sequelize ORM  
✅ Database migrations  
✅ CORS configured  

### Database 🗄️
✅ 3 normalized tables (3NF)  
✅ Foreign key relationships  
✅ Indexes for performance  
✅ Migration scripts  
✅ Seed data  

---

## 🎥 Video Demo Script (2-3 min)

**0:00-0:20** Introduction  
**0:20-0:50** Generate code (prompt + language + click)  
**0:50-1:10** Show syntax highlighting + copy  
**1:10-1:25** Generate another example  
**1:25-1:50** Navigate to history, show pagination  
**1:50-2:10** Test pagination controls  
**2:10-2:35** Show database (pgAdmin/SQL query)  
**2:35-2:50** Show responsive design (optional)  
**2:50-3:00** Conclusion  

---

## 🚀 Deployment Summary

**Free Tier Options:**
- **Database:** Supabase (PostgreSQL, 500MB)
- **Backend:** Render.com (750 hours/month)
- **Frontend:** Vercel (unlimited)

**Cost:** $0 infrastructure + ~$0.002 per code generation

**Deploy Steps:**
1. Create Supabase project → Get DATABASE_URL
2. Deploy backend to Render → Add env vars
3. Deploy frontend to Vercel → Add VITE_API_URL
4. Update CORS_ORIGIN in backend
5. Test end-to-end

See `DEPLOYMENT.md` for detailed steps.

---

## 📚 Documentation Guide

| File | When to Read |
|------|-------------|
| **README.md** | First - complete overview |
| **SETUP.md** | Setting up locally |
| **PROJECT_SUMMARY.md** | Understanding what's built |
| **API_DOCUMENTATION.md** | Testing API endpoints |
| **ER_DIAGRAM.md** | Understanding database |
| **DEPLOYMENT.md** | Deploying to production |
| **VIDEO_SCRIPT.md** | Recording demo |
| **RESOURCES.md** | Troubleshooting |

---

## 🎓 Key Concepts to Understand

### Normalization (3NF)
- No duplicate language names
- Languages in separate table
- Foreign keys link tables

### Indexes
- `created_at DESC` → Fast pagination
- `language_id` → Fast JOINs
- Trade-off: Slower writes, faster reads

### Pagination
- Time complexity: O(log n + k) with index
- OFFSET/LIMIT for small datasets
- Cursor-based for large (>1M rows)

### API Design
- RESTful endpoints
- JSON request/response
- Proper status codes (200, 201, 400, 500)
- Input validation

---

## 💡 Pro Tips

1. **Always check console logs** for errors
2. **Test API with curl/Postman** before frontend
3. **Read error messages carefully** - they're helpful
4. **Use .env files** - never hardcode secrets
5. **Commit often** to Git
6. **Test on mobile** - use DevTools responsive mode
7. **Monitor OpenAI costs** - check usage dashboard
8. **Backup database** before major changes

---

## 📞 Need Help?

1. Check error message in console
2. Review relevant .md file
3. Check `RESOURCES.md` troubleshooting
4. Search Stack Overflow
5. Read official docs

---

## ✨ You're Ready!

Everything is set up and documented. Just follow the setup steps and you'll have a working full-stack application in minutes.

**Good luck! 🚀**

---

**Quick Links:**
- [Main README](./README.md)
- [Setup Guide](./SETUP.md)
- [API Docs](./API_DOCUMENTATION.md)
- [Deployment](./DEPLOYMENT.md)
