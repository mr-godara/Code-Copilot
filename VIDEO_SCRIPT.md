# Video Demo Script (2-3 Minutes)

## 🎬 Setup Before Recording

### Tools Needed:
- Screen recording software (OBS Studio, Loom, or Camtasia)
- Browser with demo app open
- Database management tool (pgAdmin, TablePlus, or DBeaver)
- Code editor showing project structure (optional)

### Pre-Recording Checklist:
- ✅ Backend server running
- ✅ Frontend dev server running
- ✅ Database connected and seeded
- ✅ Clear browser cookies/cache for clean demo
- ✅ Close unnecessary tabs/applications
- ✅ Set browser zoom to 100%
- ✅ Test microphone audio levels

---

## 📝 Script Outline

### [0:00 - 0:20] Introduction (20 seconds)

**Screen:** Landing page of the application

**Script:**
> "Hello! This is a demo of my Code Generation Copilot - a full-stack application built with React, Express.js, and PostgreSQL. The app allows users to generate code using AI, view syntax-highlighted results, and browse their generation history with pagination. Let me walk you through the key features."

**Actions:**
- Show clean landing page
- Briefly hover over the main sections (generator form and history)

---

### [0:20 - 0:50] Code Generation Flow (30 seconds)

**Screen:** Code generation form

**Script:**
> "First, I'll generate some code. Let me enter a prompt: 'Write a Python function to calculate the factorial of a number recursively.' I'll select Python as the language and click Generate Code."

**Actions:**
1. Click on prompt textarea (0:20)
2. Type: "Write a Python function to calculate factorial recursively" (0:25)
3. Open language dropdown (0:30)
4. Select "Python" (0:32)
5. Click "Generate Code" button (0:35)
6. **Show loading spinner** (0:36-0:48)
7. Code appears with syntax highlighting (0:50)

**Expected Output:**
```python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)
```

---

### [0:50 - 1:10] Code Display Features (20 seconds)

**Screen:** Generated code display area

**Script:**
> "The generated code appears with syntax highlighting for better readability. I can copy this code to my clipboard with a single click."

**Actions:**
1. Hover over the code block (0:50)
2. Click "Copy to Clipboard" button (0:55)
3. Show success notification: "Code copied!" (0:56)
4. Optionally paste into Notepad/IDE to prove it copied (1:00-1:05)
5. Return to the app (1:06)

---

### [1:10 - 1:25] Generate Another Example (15 seconds)

**Screen:** Code generation form

**Script:**
> "Let me generate one more example with a different language. I'll create a JavaScript function to reverse a string."

**Actions:**
1. Clear previous prompt (1:10)
2. Type: "Write a JavaScript function to reverse a string" (1:12)
3. Select "JavaScript" from dropdown (1:18)
4. Click "Generate Code" (1:20)
5. Brief loading state (1:21-1:24)
6. New code appears (1:25)

**Expected Output:**
```javascript
function reverseString(str) {
    return str.split('').reverse().join('');
}
```

---

### [1:25 - 1:50] History and Pagination (25 seconds)

**Screen:** Scroll to history section

**Script:**
> "Now let's look at the history section, which shows all previous generations. The history is paginated with 10 items per page, sorted by most recent first. You can see all the details: the prompt, language, generated code, and timestamp."

**Actions:**
1. Scroll down to history section (1:25-1:30)
2. Show the list of previous generations (1:30)
3. Hover over a history item to show details (1:35)
4. Expand/collapse a code snippet (if feature exists) (1:40)
5. Scroll through the list (1:42)
6. Show pagination controls at the bottom (1:48)

---

### [1:50 - 2:10] Pagination Navigation (20 seconds)

**Screen:** History pagination controls

**Script:**
> "Let me demonstrate the pagination. I'll navigate to the next page to see older generations, and then go back to the first page."

**Actions:**
1. Show current page indicator: "Page 1 of 3" (1:50)
2. Click "Next" button (1:55)
3. Page 2 loads with different items (1:57)
4. Show page indicator updated: "Page 2 of 3" (2:00)
5. Click "Previous" button (2:05)
6. Return to page 1 (2:07)

---

### [2:10 - 2:35] Database Verification (25 seconds)

**Screen:** Database management tool (pgAdmin/TablePlus)

**Script:**
> "Behind the scenes, all this data is stored in a PostgreSQL database. Let me show you the database structure. Here's the generations table with our entries, and you can see the related languages table with foreign key relationships. Each generation is properly stored with its prompt, language, code, and timestamp."

**Actions:**
1. Switch to database tool (2:10)
2. Show `generations` table structure (2:12)
3. Run query: `SELECT * FROM generations ORDER BY created_at DESC LIMIT 5;` (2:15)
4. Show the two generations we just created (2:20)
5. Briefly show `languages` table (2:25)
6. Highlight foreign key relationship (2:30)
7. Optionally show `users` table (2:32)

**SQL Query to Show:**
```sql
SELECT 
    g.id, 
    g.prompt, 
    l.name as language, 
    LEFT(g.code, 50) as code_preview,
    g.created_at
FROM generations g
JOIN languages l ON g.language_id = l.id
ORDER BY g.created_at DESC
LIMIT 5;
```

---

### [2:35 - 2:50] Responsive Design (Optional) (15 seconds)

**Screen:** Browser responsive mode

**Script:**
> "The application is fully responsive. Here's how it looks on mobile and tablet devices."

**Actions:**
1. Open browser DevTools (F12) (2:35)
2. Toggle device toolbar (Ctrl+Shift+M) (2:37)
3. Show mobile view (iPhone) (2:40)
4. Show tablet view (iPad) (2:45)
5. Return to desktop view (2:48)

---

### [2:50 - 3:00] Conclusion (10 seconds)

**Screen:** Return to main app view

**Script:**
> "That's the complete workflow! The app successfully generates code using OpenAI's API, stores everything in a relational database, and provides a clean, responsive interface for viewing history. Thank you for watching!"

**Actions:**
1. Show full page view (2:50)
2. Optionally show project structure in VS Code (2:55)
3. Fade out or end recording (3:00)

---

## 🎥 Recording Tips

### Technical Setup:
1. **Resolution:** Record in 1080p (1920x1080) or 720p minimum
2. **Frame Rate:** 30 fps is sufficient
3. **Audio:** Use external microphone or headset for clear audio
4. **Browser Window:** Full screen or at least 1280x720

### Best Practices:
- **Speak Clearly:** Enunciate and maintain steady pace
- **Mouse Movement:** Move cursor smoothly, not erratically
- **Timing:** Pause briefly after each action so viewers can follow
- **No Rush:** It's okay to go to 3:15-3:30 if needed
- **Mistakes:** If you make a mistake, pause, redo that section, and edit later

### Editing (Optional):
- Remove long loading times (speed up 2x)
- Add text annotations for key features
- Add zoom effects on important UI elements
- Background music at low volume (optional)

---

## 🎬 Alternative Script (Without Database View)

If you prefer not to show database:

**Replace Database Section (2:10-2:35) with:**

### [2:10 - 2:30] Error Handling Demo

**Script:**
> "Let me show you the error handling. If I try to generate code without entering a prompt..."

**Actions:**
1. Clear prompt field (2:10)
2. Click "Generate Code" (2:15)
3. Show validation error: "Please enter a prompt" (2:17)
4. Fill in prompt but leave language unselected (2:20)
5. Show error: "Please select a language" (2:22)
6. Optionally simulate network error (disconnect internet briefly) (2:25)
7. Show error message: "Failed to generate code. Please try again." (2:28)

---

## 📤 Publishing the Video

### Recommended Platforms:
1. **Unlisted YouTube Video** (best for assignments)
2. **Loom** (easy sharing via link)
3. **Google Drive** (upload MP4 with view permissions)
4. **Vimeo** (professional presentation)

### Video File:
- **Format:** MP4 (H.264 codec)
- **Size:** Compress to under 100MB if needed
- **Length:** 2:00 - 3:30 minutes
- **Filename:** `Code_Copilot_Demo_[YourName].mp4`

### Submission:
Include video link in:
- README.md under "Video Demo" section
- Separate DEMO_LINK.txt file
- Assignment submission form

---

## 📋 Pre-Demo Database Seeding

To make the demo more impressive, seed some sample data:

```sql
-- Run this before recording to have ~25 sample generations
INSERT INTO generations (prompt, language_id, code, created_at) VALUES
  ('Create a REST API endpoint', 1, 'def api_endpoint():\n    return {"status": "ok"}', NOW() - INTERVAL '10 minutes'),
  ('Implement binary search', 2, 'function binarySearch(arr, target) {...}', NOW() - INTERVAL '25 minutes'),
  ('Write a SQL query', 3, 'SELECT * FROM users WHERE active = true;', NOW() - INTERVAL '1 hour'),
  -- Add 20+ more...
```

This ensures:
- Pagination has multiple pages to demonstrate
- History looks realistic
- Database queries show meaningful data

---

**Good luck with your demo! 🎬**

If you need help editing the video or have technical issues, feel free to reach out.
