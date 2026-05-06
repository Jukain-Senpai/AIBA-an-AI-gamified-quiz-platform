# AI Quiz Generation from Prompts

Users type a natural language prompt (e.g. *"Create a 10-question quiz about World War 2, medium difficulty"*) and the AI automatically fills the Create Quiz form with a complete set of questions and answers.

---

## How the Whole Thing Works (Big Picture)

```
User types prompt
       ↓
Frontend sends prompt → Backend AI endpoint
       ↓
Backend calls an LLM (Gemini / OpenAI)
       ↓
LLM returns structured JSON (title, questions, answers)
       ↓
Backend validates + returns JSON to frontend
       ↓
Frontend auto-populates the existing Create Quiz form
       ↓
User reviews, edits if needed, then saves
```

The key idea: **the AI fills the form, not the database directly.** The user still has full control to review and edit before submitting. This is much safer and more user-friendly.

---

## Proposed Changes

### 1. Backend — New AI Endpoint

#### [NEW] `backend/routes/ai.routes.js`
A single new route:
```
POST /api/ai/generate-quiz
Body: { prompt: string }
Auth: JWT required (same middleware already used)
```

#### [NEW] `backend/controllers/ai.controller.js`
This controller will:
1. Receive the user's prompt
2. Append instructions so the LLM knows to return a specific JSON format
3. Call an LLM API (e.g. Google Gemini via `@google/generative-ai` SDK, or OpenAI)
4. Parse and validate the response
5. Return the structured quiz data to the frontend

**The system prompt sent to the LLM will look like this:**
> *"You are a quiz generator. Given the user's request, return a JSON object with the following structure: `{ title, description, difficulty, category, questions: [{ text, answers: [string, string, string, string], correctIndex }] }`. Return only valid JSON, nothing else."*

This is called **"structured output prompting"** — constraining the AI to return a predictable format.

#### [MODIFY] `backend/index.js`
Register the new AI route: `app.use("/api/ai", aiRoutes)`

#### [MODIFY] `backend/.env`
Add the LLM API key:
```
GEMINI_API_KEY=your_key_here
# or
OPENAI_API_KEY=your_key_here
```

---

### 2. Frontend — AI Prompt Panel in CreateQuiz

#### [MODIFY] `frontend/src/views/CreateQuiz.vue`

Add a **collapsible AI panel** at the top of the create quiz page (above the existing form). It contains:

- A `<textarea>` for the user's prompt (e.g. *"10 questions about photosynthesis, hard difficulty"*)
- An optional **question count** number input
- A **"✨ Generate with AI"** button
- A loading spinner while waiting
- An error message if generation fails

**The flow in the Vue component:**
1. User types prompt → clicks Generate
2. `isGenerating = true` (show spinner)
3. `POST /api/ai/generate-quiz` with the prompt
4. On success: the returned JSON is mapped into the existing `quiz` and `questions` reactive data — **the form fills itself automatically**
5. `isGenerating = false`
6. The user sees the form pre-filled and can edit freely before saving

**No new pages needed.** It's a panel added to the existing page.

---

### 3. LLM Choice — Recommended: Google Gemini

Since this is a student project and Gemini has a **free tier**, it's the most practical choice.

| Option | Pros | Cons |
|---|---|---|
| **Google Gemini** (`gemini-1.5-flash`) | Free tier, fast, easy SDK | Needs Google account |
| OpenAI (`gpt-4o-mini`) | Very reliable JSON output | Paid, costs money |
| Ollama (local) | Free, no API key | Requires local setup, too complex |

**Recommendation: Gemini Flash** — it's free, fast, and has a simple Node.js SDK.

---

## Data Flow in Detail

### What the Frontend sends:
```json
{
  "prompt": "Create a 10-question quiz about the solar system, medium difficulty"
}
```

### What the Backend returns (after calling Gemini):
```json
{
  "title": "The Solar System",
  "description": "Test your knowledge of planets, moons, and space!",
  "difficulty": "Medium",
  "category": "General",
  "questions": [
    {
      "text": "Which planet is closest to the Sun?",
      "answers": ["Venus", "Mercury", "Mars", "Earth"],
      "correctIndex": 1
    },
    ...
  ]
}
```

### What the Frontend does with it:
```js
// Maps directly into existing reactive data — no schema changes needed
this.quiz.title = data.title;
this.quiz.description = data.description;
this.quiz.difficulty = data.difficulty;
this.questions = data.questions;
```

---

## UI/UX Design

The AI panel should feel like a **premium feature**, not an afterthought:

- **Glassmorphism card** with a purple/cyan gradient border and a ✨ sparkle icon
- A label like *"Generate with AI"* with a subtle glow effect
- **Loading state**: animated spinner + "Generating your quiz..." text
- **Success state**: a brief flash/toast — *"Quiz generated! Review and edit below."*
- **Error state**: friendly error message — *"AI couldn't generate this quiz. Try rephrasing your prompt."*

The panel can be **collapsible** (default: open) so users who prefer manual creation can hide it.

---

## Validation & Safety

> [!IMPORTANT]
> The LLM response must be validated before populating the form.

Backend validation steps:
1. Check that the response is valid JSON (use `JSON.parse` in a try/catch)
2. Verify required fields exist: `title`, `questions` array
3. Verify each question has `text`, `answers` (array of 4), and a valid `correctIndex` (0–3)
4. Cap the number of questions (e.g. max 20) to prevent abuse
5. Return a `400` error if the LLM returns bad/unparseable output

---

## Files to Touch Summary

| File | Change Type | What |
|---|---|---|
| `backend/routes/ai.routes.js` | **NEW** | Route for `POST /api/ai/generate-quiz` |
| `backend/controllers/ai.controller.js` | **NEW** | Calls Gemini, parses + validates response |
| `backend/index.js` | **MODIFY** | Register the new AI route |
| `backend/.env` | **MODIFY** | Add `GEMINI_API_KEY` |
| `backend/package.json` | **MODIFY** | Add `@google/generative-ai` dependency |
| `frontend/src/views/CreateQuiz.vue` | **MODIFY** | Add AI prompt panel + auto-fill logic |

> [!NOTE]
> No database schema changes required. No new frontend pages needed. This slots cleanly into what already exists.

---

## Verification Plan

1. Start backend, call `POST /api/ai/generate-quiz` via Postman/browser with a sample prompt — confirm valid JSON is returned
2. Open the Create Quiz page, type a prompt, click Generate — confirm the form auto-fills correctly
3. Edit a generated question manually — confirm it doesn't break anything
4. Click "Save Draft" on an AI-generated quiz — confirm it saves to the DB correctly like a manual quiz
5. Test edge cases: empty prompt, very long prompt, prompt in a different language
