# Additional Resources & Tips

## 🔑 Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-proj-...` or `sk-...`)
6. Add to backend `.env` file

**Important:** 
- Keep your API key secret
- Never commit it to GitHub
- Monitor usage at https://platform.openai.com/usage
- Free tier includes $5 credit
- Each code generation costs ~$0.002

## 🗄️ Database Setup Options

### Option 1: Local PostgreSQL

**Windows:**
```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use installer
winget install PostgreSQL.PostgreSQL

# Create database
createdb code_copilot

# Test connection
psql -U postgres -d code_copilot
```

**Mac:**
```bash
# Install via Homebrew
brew install postgresql@14

# Start service
brew services start postgresql@14

# Create database
createdb code_copilot
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb code_copilot
```

### Option 2: Docker PostgreSQL

```bash
# Pull PostgreSQL image
docker pull postgres:14

# Run container
docker run --name code_copilot_db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=code_copilot -p 5432:5432 -d postgres:14

# Connection string
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/code_copilot
```

### Option 3: Cloud PostgreSQL (Free Tier)

**Supabase (Recommended):**
- 500MB database
- 2GB data transfer
- No credit card required
- Link: https://supabase.com

**Neon.tech:**
- 3GB storage
- Serverless
- Link: https://neon.tech

**ElephantSQL:**
- 20MB storage (tiny)
- Good for testing
- Link: https://www.elephantsql.com

## 📦 Node.js Installation

### Windows
```powershell
# Option 1: Official installer
# Download from https://nodejs.org/

# Option 2: winget
winget install OpenJS.NodeJS.LTS

# Verify installation
node --version
npm --version
```

### Mac
```bash
# Option 1: Homebrew
brew install node@18

# Option 2: nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

## 🔧 VS Code Extensions (Recommended)

Install these for better development experience:

1. **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
2. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
3. **Prettier - Code formatter** (esbenp.prettier-vscode)
4. **ESLint** (dbaeumer.vscode-eslint)
5. **Thunder Client** (rangav.vscode-thunder-client) - API testing
6. **PostgreSQL** (ckolkman.vscode-postgres) - Database management
7. **Markdown Preview Enhanced** (shd101wyy.markdown-preview-enhanced)

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
```

### Issue: "Port 5000 is already in use"

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or change port in backend/.env
PORT=5001
```

### Issue: "ECONNREFUSED - Cannot connect to database"

**Solution:**
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Test connection:
```bash
psql "postgresql://username:password@localhost:5432/code_copilot"
```

### Issue: "OpenAI API Error: 401 Unauthorized"

**Solution:**
- Verify API key is correct
- Check for extra spaces in .env
- Ensure key format: `OPENAI_API_KEY=sk-proj-...` (no quotes)

### Issue: "CORS blocked"

**Solution:**
- Ensure backend CORS_ORIGIN matches frontend URL exactly
- No trailing slash in URL
- Restart backend after changing .env

### Issue: "Module not found" in React

**Solution:**
```bash
cd frontend
npm install
# If still fails, delete node_modules and reinstall
rm -rf node_modules
npm install
```

## 📊 Testing the Application

### Manual Testing Checklist

Frontend:
- [ ] Page loads without errors
- [ ] Can enter prompt (min 10 chars)
- [ ] Language dropdown works
- [ ] Generate button triggers API call
- [ ] Loading spinner appears
- [ ] Code displays with syntax highlighting
- [ ] Copy button works
- [ ] History tab shows generations
- [ ] Pagination works (if >10 items)
- [ ] Responsive on mobile

Backend:
- [ ] Server starts successfully
- [ ] Can access /health endpoint
- [ ] Can access /api/languages
- [ ] Can POST to /api/generate
- [ ] Can GET /api/history
- [ ] Validation errors return 400
- [ ] Database connection works

### API Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get languages
curl http://localhost:5000/api/languages

# Generate code
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"Sort array in Python\",\"language\":\"Python\"}"

# Get history
curl http://localhost:5000/api/history?page=1&limit=5
```

## 🎨 Customizing the App

### Change Theme Colors

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
        // ... etc
      }
    }
  }
}
```

### Add More Languages

1. Add to database:
```sql
INSERT INTO languages (name, extension) VALUES ('Ruby', '.rb');
```

2. Install Prism.js language support:
```bash
cd frontend
npm install prismjs
```

3. Import in `CodeDisplay.jsx`:
```javascript
import 'prismjs/components/prism-ruby';
```

### Change Pagination Limit

Backend (`codeController.js`):
```javascript
const limit = req.query.limit || 20; // Change from 10 to 20
```

Frontend (`HistoryList.jsx`):
```javascript
const response = await getHistory(page, 20); // Change from 10 to 20
```

## 📚 Learning Resources

### React
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Tutorial](https://react.dev/learn)

### Express.js
- [Express.js Guide](https://expressjs.com/en/starter/installing.html)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [Sequelize Docs](https://sequelize.org/docs/v6/)

### TailwindCSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/components)

### OpenAI API
- [OpenAI API Docs](https://platform.openai.com/docs/introduction)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)

## 🚀 Performance Optimization Tips

### Backend
1. **Add Caching:** Use Redis for frequently accessed data
2. **Connection Pooling:** Already configured in Sequelize
3. **Rate Limiting:** Add express-rate-limit
4. **Compression:** Add compression middleware

```bash
npm install compression express-rate-limit
```

### Frontend
1. **Code Splitting:** Vite handles this automatically
2. **Lazy Loading:** Load heavy components on demand
3. **Image Optimization:** Use WebP format
4. **CDN:** Deploy assets to CDN

### Database
1. **Index Optimization:** Already added on created_at
2. **Query Optimization:** Use EXPLAIN ANALYZE
3. **Vacuum:** Run VACUUM regularly
4. **Connection Pooling:** Already configured

## 🔒 Security Best Practices

✅ **Already Implemented:**
- Environment variables for secrets
- Input validation (express-validator)
- SQL injection prevention (Sequelize ORM)
- CORS configuration

**Additional Recommendations:**
1. **Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

2. **Helmet.js** (Security headers):
```bash
npm install helmet
```
```javascript
const helmet = require('helmet');
app.use(helmet());
```

3. **API Key Rotation:** Rotate OpenAI key every 90 days

4. **Database Backups:** Schedule daily backups

## 📞 Getting Help

### Official Documentation
- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [OpenAI API](https://platform.openai.com/docs)

### Community Resources
- [Stack Overflow](https://stackoverflow.com/)
- [Reddit: r/reactjs](https://www.reddit.com/r/reactjs/)
- [Reddit: r/node](https://www.reddit.com/r/node/)
- [Dev.to](https://dev.to/)

### Troubleshooting Steps
1. Check error messages in console
2. Review relevant documentation file
3. Search for error on Stack Overflow
4. Check GitHub issues in library repos
5. Ask in community forums

## 🎯 Interview Preparation

Be ready to explain:

1. **Why did you normalize the database?**
   - "To eliminate data redundancy and ensure data integrity. Storing language names repeatedly would waste space and risk inconsistency."

2. **What's the time complexity of your pagination?**
   - "O(log n + k) with the index on created_at, where k is the page size. The index enables fast sorting and retrieval."

3. **How would you scale this for 1M+ users?**
   - "Add caching (Redis), implement cursor-based pagination, use read replicas, partition the generations table by date, and consider async job queues for AI calls."

4. **Why did you choose these technologies?**
   - "React/Vite for fast development and builds, Express for flexibility, PostgreSQL for ACID compliance and complex queries, and OpenAI for reliable AI code generation."

5. **How do you handle errors?**
   - "Input validation on both frontend and backend, express-validator for API validation, user-friendly error messages, and centralized error handling middleware."

## ✅ Pre-Submission Checklist

Before submitting:

- [ ] All dependencies installed (backend & frontend)
- [ ] .env files created from examples
- [ ] OpenAI API key added and tested
- [ ] Database created and migrations run
- [ ] Backend starts without errors (npm run dev)
- [ ] Frontend starts without errors (npm run dev)
- [ ] Can generate code successfully
- [ ] History pagination works
- [ ] All documentation files reviewed
- [ ] ER diagram renders correctly
- [ ] Video demo recorded (2-3 minutes)
- [ ] Code committed to GitHub
- [ ] README.md has correct setup instructions
- [ ] .gitignore prevents .env from being committed

## 🎉 Final Tips

1. **Test Early:** Test each component as you build
2. **Read Error Messages:** They usually tell you exactly what's wrong
3. **Use Console Logs:** Debug with console.log() liberally
4. **Check Network Tab:** See actual API requests/responses
5. **Ask for Help:** Don't struggle alone - use resources above

**You've got this! 🚀**

---

**Last Updated:** November 22, 2025
