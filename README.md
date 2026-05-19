# AIBA-an-AI-gamified-quiz-platform

God blessed me to pass to pass this final year project please





\## Key Features

\- User-generated quizzes

\- Gamification (XP, levels, badges)

\- Community forum linked to quizzes

\- AI-assisted quiz quality evaluation

\- AI-assisted forum moderation

\- Semantic similarity using vector embeddings



\## Tech Stack

\- Frontend: Vue.js

\- Backend: Node.js + Express

\- Database: PostgreSQL\* (placeholder for now, might change in the future)

\- AI \& Vector DB: Python, ChromaDB, Sentence Transformers



\## Architecture

The system follows a monolithic backend architecture with a separate AI service for embedding-based analysis.



\## Development Methodology

The project follows an iterative, sprint-based development approach with weekly milestones.



\## Requirements List

Based on the current implementation and project design specifications, the following requirements have been defined:

### 1. User Management & Authentication
- **User Registration**: Support for creating accounts with username, email, password, and avatar selection.
- **Unified Login**: Allow users to log in using either their email or username.
- **Secure Sessions**: Implementation of JWT-based authentication with protected routes.
- **Profile Customization**: Users can edit their username, email, and choose from a gallery of RPG-themed avatars.
- **User Progression**: Persistence of User Level, XP, and Skill Points (SP) in the database.

### 2. Quiz System
- **Quiz Playback**: Interactive interface for taking quizzes question-by-question with immediate feedback.
- **Manual Creation**: Form-based interface for users to create their own quizzes with custom questions and 4 multiple-choice answers.
- **AI Generation**: Integration with Groq (Llama 3.1) to generate full quizzes from a single text prompt.
- **Score Calculation**: Logic to award points based on answer correctness and the use of specific skills.

### 3. Gamification & Skills (RPG System)
- **Skill Tree**: A 3-path branching tree (Strength/Knight, Intelligence/Mage, Social/Bard) with tiered unlocking.
- **Prerequisite Logic**: Enforced unlocking order where Tier 2 skills require the corresponding Tier 1 skill.
- **In-Quiz Lifelines**: Functional integration of 6 unique skills:
  - **Shield Mastery**: 1-turn immunity to wrong answers.
  - **Battle Fury**: Removes 2 incorrect answers (50/50).
  - **Incantation**: Removes 1 incorrect answer.
  - **Arcane Knowledge**: Reveals the correct answer.
  - **Healing Song**: Grants points even if the answer is incorrect.
  - **Crowd Mentality**: Skips the question for half points.

### 4.Future Requirements 
- **Community Forum**: A social space for users to discuss quizzes and share tips (Design Phase).
- **Skill Selection**: A pre-quiz modal to select which unlocked skills to equip for the session (Design Phase).
- **Advanced Dashboard**: Visualized analytics of user performance and recent activity trends.
- **Leaderboards**: Competitive ranking system based on total XP and quiz accuracy.

## Architecture

The system follows a decoupled architecture:
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL.
- **Frontend**: Vue.js 3, Vite, Vanilla CSS.
- **AI Integration**: Groq API (Llama 3.1) for structured JSON generation.

## Development Methodology

The project follows an iterative, sprint-based development approach with weekly milestones.

## Status

**Current Version**: 1.0.0 (Skills System Integrated)
- [x] Auth & Profile System
- [x] Quiz Engine
- [x] AI Generation Service
- [x] Skill Tree & Lifelines
- [ ] Quiz Results persistence
- [ ] Community Forum



