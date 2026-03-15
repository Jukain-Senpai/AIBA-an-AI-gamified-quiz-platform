<template>
  <div class="quiz-wrapper" v-if="quiz">

    <h1 class="quiz-title">{{ quiz.title }}</h1>

    <div v-if="currentQuestion" class="question-card">

      <h2 class="question-text">
        Question {{ currentIndex + 1 }} / {{ quiz.questions?.length }}
      </h2>

      <p class="question">{{ currentQuestion.text }}</p>

      <div class="answers">

        <button
        v-for="option in currentQuestion.options"
        :key="option.id"
        class="answer-btn"
        @click="submitAnswer(option.id)"
        :disabled="answered"
        >
        {{ option.text }}
      </button>

      </div>
      <div v-if="feedback" class="feedback">
        {{ feedback }}
      </div>

      <button
      v-if="answered && currentIndex < quiz.questions.length -1"
      class="next-btn"
      @click="nextQuestion"
      >
      Next question   
    </button>

    <router-link
    v-if="answered && currentIndex === quiz.questions.length -1"
    to="/result"
    class="finish-btn"
    >
    Finish Quiz
  </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name:"QuizDetail",
  
  data() {
    return {
      quiz:null,
      currentIndex: 0,
      answered: false,
      feedback: ""
    };
  },

  computed: {
    currentQuestion() {
      if (!this.quiz || !this.quiz.questions) return null;
      return this.quiz.questions[this.currentIndex];
    }
  },

  async mounted() {
    const quizId = this.$route.params.id;
    await this.fetchQuiz(quizId);
  },

  methods: {

    async fetchQuiz(id) {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/quizzes/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();

        console.log("Quiz loaded:", data);
        this.quiz = data;
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      }
    },

    async submitAnswer(optionId) {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/quizzes/check-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ optionId })
        });

        const data = await res.json();

        this.answered= true;

        if (data.correct) {
          this.feedback = "✅ Correct!";
        }else {
          this.feedback = "❌ Incorrect!";
        }

      } catch (error) {
        console.error("Failed to check answer", error);
      }
    },

    nextQuestion() {
      this.currentIndex++;
      this.answered = false;
      this.feedback = "";
    }

  }
};
</script>

<style scoped>

.quiz-wrapper {
  width: 100%;
  padding: 4rem 6rem;
}

.quiz-title {
  color: #00e5ff;
  margin-bottom: 2rem;
}

.question-card {
  background: rgba(30, 15, 55, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 2rem;
  border-radius: 14px;
  backdrop-filter: blur(12px);
}

.question-text {
  color: #a78bfa;
  margin-bottom: 1rem;
}

.question {
  font-size: 1.3rem;
  color: white;
  margin-bottom: 2rem;
}

.answers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.answer-btn {
  padding: 0.8rem;
  border-radius: 10px;
  border: none;

  background: rgba(139, 92, 246, 0.2);
  color: white;

  cursor: pointer;
  transition: 0.2s;
}

.answer-btn:hover {
  background: rgba(139, 92, 246, 0.4);
}

.feedback {
  margin-top: 1.5rem;
  font-size: 1.2rem;
}

.next-btn,
.finish-btn {
  margin-top: 1.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;

  background: linear-gradient(135deg, #8b5cf6, #7c3aed);

  color: white;
  border: none;

  cursor: pointer;
}

</style>