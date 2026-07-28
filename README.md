# 🎮 AIBA - AI-Powered Gamified Quiz Platform

AIBA is a full-stack AI-powered quiz platform designed to make online learning more engaging through RPG-inspired gamification, AI-assisted quiz generation, and a community discussion forum.

The platform allows users to create quizzes manually or generate them using AI, complete quizzes to earn experience points (XP), level up, unlock skills, participate in discussions, and interact with other learners in a moderated community environment.

This project was developed as a Final Year Project (FYP).

---

# ✨ Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Password Reset via Email Verification

---

## Quiz System

- Create quizzes manually
- AI-generated quizzes using Groq (Llama 3.1)
- Edit quizzes
- Delete quizzes
- Public / Private quizzes
- Time-limited quizzes
- Quiz attempt history
- Automatic scoring

---

## Gamification

- Experience (XP) System
- Leveling System
- Win Streak Bonus
- Skill Points
- Skill Tree
- Equip up to 3 Skills
- RPG-inspired quiz assistance skills

Examples include:

- Battle Fury
- Arcane Knowledge
- Incantation
- Crowd Mentality

---

## Community Forum

Users can

- Create posts
- Upload images
- Comment
- Nested replies
- Upvote posts
- Upvote comments

---

## AI Integration

Powered by:

- Groq API
- Llama 3.1 8B Instant

Supports:

- Automatic quiz generation
- JSON-formatted quiz output
- Demo fallback when AI service is unavailable

---

## Moderation System

Automatic content moderation includes:

- Profanity detection
- AI-assisted moderation
- Pending approval workflow
- Admin approval/rejection
- Moderation logs

---

## Admin Dashboard

Administrators can:

- Review quizzes
- Review posts
- Review comments
- Review user reports
- Approve or reject submissions
- Bulk moderation
- View moderation history

---

## Notification System

Real-time user notifications for:

- Replies
- Comment responses
- Moderation results
- Deleted content
- Other user interactions

---

## Issue Reporting

Users can submit platform issues directly to administrators.

---

# 🛠 Tech Stack

## Frontend

- Vue.js
- Vue Router
- Axios
- CSS

---

## Backend

- Node.js
- Express.js

---

## Database

- PostgreSQL
- Prisma ORM

---

## Authentication

- JWT
- bcrypt

---

## AI

- Groq API
- Llama 3.1 8B Instant

---

## Email

- Nodemailer

---

# 📂 Project Structure

```
AIBA
│
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   ├── services/
│   │   └── router/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── prisma/
│
├── ai-service/
│
└── README.md
```

---

# ⚙️ Installation

## Clone

```bash
git clone https://github.com/yourusername/AIBA.git
```

---

## Backend

```bash
cd backend
npm install
```

Create

```
.env
```

Run

```bash
npm start
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Backend requires

```env
DATABASE_URL=

JWT_SECRET=

GROQ_API_KEY=

EMAIL_USER=

EMAIL_PASS=
```

---

# 📊 Database

Main entities include

- User
- Quiz
- Question
- AnswerOption
- Attempt
- AttemptAnswer
- Skill
- UserSkill
- Post
- Comment
- Notification
- ReportIssue
- ModerationLog

---

# 🔒 Authentication Flow

```
Register
      ↓
Hash Password
      ↓
Save User
      ↓
Generate JWT
      ↓
Frontend stores token
      ↓
Authenticated API Requests
```

---

# 🤖 AI Quiz Generation Flow

```
User Prompt
      ↓
Backend API
      ↓
Groq API
      ↓
Llama 3.1
      ↓
Generate Quiz JSON
      ↓
Frontend Quiz Editor
```

---

# 🏆 Quiz Flow

```
Create Quiz
      ↓
Moderation
      ↓
Publish
      ↓
User Attempts Quiz
      ↓
Score Calculation
      ↓
XP Reward
      ↓
Level Up
      ↓
Unlock Skills
```

---

# 🚀 Future Improvements

- Multiplayer quizzes
- Real-time leaderboard
- Friend system
- Achievement badges
- Mobile application
- Adaptive AI learning paths
- AI-generated explanations
- Analytics dashboard

---

# 👨‍💻 Authors

Final Year Project

Faculty of Computer Science

AI-Powered Gamified Quiz Platform

---

# 📄 License

This project was developed for educational purposes.