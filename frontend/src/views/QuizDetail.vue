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
        :class="{
          'correct': (answered && option.id === correctOptionId) || option.id === arcaneRevealedId,
          'incorrect': answered && option.id === selectedOptionId && option.id !== correctOptionId,
          'disabled-option': removedOptionIds.includes(option.id) || (shieldActive && shieldUsedOnId === option.id)
        }"
        @click="submitAnswer(option.id)"
        :disabled="answered || removedOptionIds.includes(option.id) || (shieldActive && shieldUsedOnId === option.id)"
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

    <button
    v-if="answered && currentIndex === quiz.questions.length -1"
    @click="finishQuiz"
    class="finish-btn"
    :disabled="isSubmitting"
    >
    {{ isSubmitting ? 'Submitting...' : 'Finish Quiz' }}
    </button>
    </div>

    <!-- Active Skills / Lifelines -->
    <div class="lifelines-container" v-if="userSkills.length > 0">
      <h3 class="lifelines-title">Lifelines</h3>
      <div class="skills-bar">
        <button 
          v-for="skill in userSkills" 
          :key="skill"
          class="lifeline-btn"
          :class="{ 'used': usedSkills.includes(skill) }"
          @click="activateSkill(skill)"
          :disabled="usedSkills.includes(skill) || answered"
        >
          {{ getSkillIcon(skill) }} {{ skill }}
        </button>
      </div>
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
      selectedOptionId: null,
      correctOptionId: null,
      feedback: "",
      
      // Skills
      userSkills: [],
      usedSkills: [],
      removedOptionIds: [],
      shieldActive: false,
      shieldUsedOnId: null, // Track which wrong answer they clicked
      healingSongActive: false,
      arcaneRevealedId: null,
      score: 0, // Local score tracking
      answers: [],
      isSubmitting: false
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
    await Promise.all([
      this.fetchQuiz(quizId),
      this.fetchUserSkills()
    ]);
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

    async fetchUserSkills() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        this.userSkills = data.unlockedSkills || [];
      } catch (err) {
        console.error("Failed to load skills", err);
      }
    },

    getSkillIcon(skillName) {
      const icons = {
        "Shield Mastery": "🛡️",
        "Battle Fury": "⚔️",
        "Incantation": "📖",
        "Arcane Knowledge": "🔮",
        "Healing Song": "🎵",
        "Crowd Mentality": "👥"
      };
      return icons[skillName] || "✨";
    },

    async activateSkill(skillName) {
      if (this.usedSkills.includes(skillName) || this.answered) return;
      this.usedSkills.push(skillName);

      if (skillName === "Shield Mastery") {
        this.shieldActive = true;
        return;
      }
      if (skillName === "Healing Song") {
        this.healingSongActive = true;
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/quizzes/use-skill/${this.currentQuestion.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ skillName })
        });
        const data = await res.json();

        if (skillName === "Battle Fury" || skillName === "Incantation") {
          this.removedOptionIds.push(...data.removedOptionIds);
        } else if (skillName === "Arcane Knowledge") {
          this.arcaneRevealedId = data.correctOptionId;
        } else if (skillName === "Crowd Mentality") {
          this.submitAnswer(data.correctOptionId, true);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async submitAnswer(optionId, isCrowdMentality = false) {
      if (this.answered) return;

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

        // Handle Shield Mastery logic
        if (!data.correct && this.shieldActive && !this.shieldUsedOnId) {
          this.shieldUsedOnId = optionId;
          this.feedback = "🛡️ Shield Activated! Try again.";
          return; // Do not mark as answered
        }

        this.selectedOptionId = optionId;
        this.correctOptionId = data.correctOptionId;
        this.answered = true;
        this.answers.push({ selectedOptionId: optionId });

        if (data.correct) {
          if (isCrowdMentality) {
            this.feedback = "👥 Crowd Mentality! Skipped for half points.";
            this.score += 5; // Half points
          } else {
            this.feedback = "✅ Correct!";
            this.score += 10; // Full points
          }
        } else {
          if (this.healingSongActive) {
            this.feedback = "🎵 Healing Song! Incorrect, but you still get points!";
            this.score += 10;
          } else {
            this.feedback = "❌ Incorrect!";
          }
        }

      } catch (error) {
        console.error("Failed to check answer", error);
      }
    },

    nextQuestion() {
      this.currentIndex++;
      this.answered = false;
      this.selectedOptionId = null;
      this.correctOptionId = null;
      this.feedback = "";
      
      // Reset single-question skill states
      this.removedOptionIds = [];
      this.shieldActive = false;
      this.shieldUsedOnId = null;
      this.healingSongActive = false;
      this.arcaneRevealedId = null;
    },

    async finishQuiz() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/quizzes/${this.quiz.id}/attempts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ answers: this.answers })
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Error submitting quiz");
          throw new Error(data.message || "Failed to submit quiz attempt");
        }
        
        // Save result locally so QuizResult page can read it
        localStorage.setItem("latestQuizResult", JSON.stringify(data));
        
        this.$router.push("/result");
      } catch (err) {
        console.error("Failed to submit quiz attempt", err);
      } finally {
        this.isSubmitting = false;
      }
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

.answer-btn:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.4);
}

.answer-btn.correct {
  background: #10b981 !important;
  color: white;
  border: 1px solid #059669;
}

.answer-btn.incorrect {
  background: #ef4444 !important;
  color: white;
  border: 1px solid #dc2626;
}

.answer-btn:disabled {
  cursor: default;
}

.feedback {
  margin-top: 1.5rem;
  margin-bottom: 1rem; 
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

/* LIFELINES */
.lifelines-container {
  margin-top: 3rem;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.lifelines-title {
  color: #d8b4fe;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.skills-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.lifeline-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: 1px solid #60a5fa;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.lifeline-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.lifeline-btn.used {
  background: rgba(71, 85, 105, 0.5);
  border-color: #475569;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.disabled-option {
  opacity: 0.3;
  cursor: not-allowed !important;
  background: transparent !important;
  border: 1px dashed rgba(139, 92, 246, 0.3) !important;
}

</style>