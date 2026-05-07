<template>
  <div class="quiz-wrapper">
    <div class="page-header">
      <h1 class="title">Available Quizzes</h1>
      <router-link to="/create-quiz" class="create-btn">Create Your Own Quiz</router-link>
    </div>

    <div class="quiz-container">
      <div
      v-for="quiz in quizzes"
      :key="quiz.id"
      class="quiz-card"
      >
        <div class="quiz-info">
          <h2>{{ quiz.title }}</h2>
          <p class="creator"> by {{ quiz.creator?.email }}</p>

          <div class="meta">
            <span class="question">
              {{ quiz._count.questions || 0 }} questions
            </span>

            <span class="date">
              {{ formatDate(quiz.createdAt) }}
            </span>
          </div>
        </div>

        <div class="quiz-action">
          <router-link
          :to="`/quizzes/${quiz.id}`"
          class="start-btn">
        Start Quiz
        </router-link>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizList",

  data() {
    return {
      quizzes: []
    };
  },

  async mounted() {
    this.fetchQuizzes();
  },

  methods: {
    async fetchQuizzes() {
      try{
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/quizzes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          this.$router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await res.json();
        console.log("Loaded quizzes:", data);
        this.quizzes = Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("Failed to load quizzes", err);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>

.quiz-wrapper {
  width: 100%;
  padding: 4rem 6rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #00e5ff;
  margin: 0;
}

.create-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #22d3ee, #0ea5e9);
  color: white;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);
  transition: 0.25s;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 211, 238, 0.5);
}

/* QUIZ LIST */

.quiz-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* QUIZ CARD */

.quiz-card {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 1.8rem;

  border-radius: 14px;

  background: rgba(30, 15, 55, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.3);

  backdrop-filter: blur(12px);

  transition: 0.3s;
}

.quiz-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 229, 255, 0.5);
}

/* LEFT INFO */

.quiz-info h2 {
  color: white;
  margin-bottom: 0.4rem;
}

.creator {
  color: #a78bfa;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #9f8cc0;
}

/* BUTTON */

.start-btn {
  padding: 0.7rem 1.6rem;

  border-radius: 10px;

  background: linear-gradient(135deg, #8b5cf6, #7c3aed);

  color: white;
  text-decoration: none;
  font-weight: 600;

  box-shadow: 0 6px 18px rgba(139, 92, 246, 0.4);

  transition: 0.25s;
}

.start-btn:hover {
  transform: translateY(-2px);
}

/* RESPONSIVE */

@media (max-width: 900px) {

  .quiz-wrapper {
    padding: 3rem 2rem;
  }

  .quiz-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .quiz-action {
    align-self: flex-end;
  }
}

</style>