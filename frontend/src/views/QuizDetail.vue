<template>
  <div class="quiz-play-layout">
    <div class="page-glow page-glow-primary"></div>
    <div class="page-glow page-glow-tertiary"></div>

    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Loading quiz...</p>
    </div>

    <div v-else-if="error" class="state-container">
      <p class="error-text">{{ error }}</p>
      <button class="retry-btn" @click="loadQuizData">Retry</button>
    </div>

    <main v-else-if="quiz && currentQuestion" class="quiz-shell">
      <section class="quiz-topbar" aria-label="Quiz details">
        <button class="back-btn" type="button" @click="$router.push('/quizzes')">
          <img src="/src/assets/icons/navigation/arrow-back.svg" class="button-icon muted-icon" alt="" />
          <span>Quizzes</span>
        </button>

        <div class="quiz-summary">
          <h1 class="quiz-title">{{ quiz.title }}</h1>
          <p v-if="quiz.description" class="quiz-description">{{ quiz.description }}</p>
        </div>
      </section>

      <section class="progress-panel" aria-label="Quiz progress">
        <div class="progress-main">
          <div class="progress-copy">
            <span class="progress-label">Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>
            <span class="progress-percent">{{ progressPercent }}% Complete</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          </div>
        </div>

        <div class="score-pill">
          <img src="/src/assets/icons/ui/star-fill.svg" class="score-icon" alt="" />
          <span>{{ score }} pts</span>
        </div>
      </section>

      <section class="play-grid">
        <article class="question-card">
          <span class="question-kicker">Current Question</span>
          <h2 class="question-text">{{ currentQuestion.text }}</h2>
          <div v-if="currentQuestion.image" style="margin-top: 16px; text-align: center;">
            <img :src="getImageUrl(currentQuestion.image)" alt="Question Image" style="max-height: 250px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
          </div>
        </article>

        <aside class="timer-card" aria-label="Timer placeholder">
          <div class="timer-ring">
            <svg viewBox="0 0 120 120" class="timer-svg" aria-hidden="true">
              <circle cx="60" cy="60" r="52" class="timer-track"></circle>
              <circle cx="60" cy="60" r="52" class="timer-progress"></circle>
            </svg>
            <span class="timer-value">--</span>
          </div>
          <span class="timer-label">Timer Soon</span>
        </aside>
      </section>

      <section class="answers-grid" aria-label="Answer options">
        <button
          v-for="(option, index) in answerOptions"
          :key="option.id"
          class="answer-card"
          :class="answerClass(option)"
          type="button"
          :disabled="isOptionDisabled(option.id)"
          @click="submitAnswer(option.id)"
        >
          <span class="answer-letter">{{ optionLetter(index) }}</span>
          <span class="answer-text">{{ option.text }}</span>
        </button>
      </section>

      <section v-if="feedback" class="feedback-panel" :class="feedbackTone">
        <span class="feedback-dot"></span>
        <p>{{ feedback }}</p>
      </section>

      <footer class="play-footer">
        <div class="streak-pill">
          <img src="/src/assets/icons/ui/local_fire_department.svg" class="footer-icon warm-icon" alt="" />
          <span><strong>{{ correctStreak }}</strong> correct in a row</span>
        </div>

        <div class="footer-actions">
          <div v-if="userSkills.length > 0" class="skill-strip" aria-label="Available skills">
            <button
              v-for="skill in userSkills"
              :key="skill"
              class="skill-btn"
              :class="{ used: usedSkills.includes(skill) }"
              type="button"
              :title="skill"
              :disabled="usedSkills.includes(skill) || answered"
              @click="activateSkill(skill)"
            >
              <img :src="getSkillIcon(skill)" class="skill-icon" alt="" />
              <span>{{ skill }}</span>
            </button>
          </div>

          <button
            v-if="answered && currentIndex < totalQuestions - 1"
            class="primary-action"
            type="button"
            @click="nextQuestion"
          >
            Next Question
          </button>

          <button
            v-if="answered && currentIndex === totalQuestions - 1"
            class="primary-action"
            type="button"
            :disabled="isSubmitting"
            @click="finishQuiz"
          >
            {{ isSubmitting ? 'Submitting...' : 'Finish Quiz' }}
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import api, { getImageUrl } from '../services/api';

export default {
  name: 'QuizDetail',

  data() {
    return {
      loading: true,
      error: null,
      quiz: null,
      currentIndex: 0,
      answered: false,
      selectedOptionId: null,
      correctOptionId: null,
      feedback: '',
      userSkills: [],
      usedSkills: [],
      removedOptionIds: [],
      shieldActive: false,
      shieldUsedOnId: null,
      healingSongActive: false,
      arcaneRevealedId: null,
      score: 0,
      correctStreak: 0,
      answers: [],
      isSubmitting: false,
    };
  },

  computed: {
    currentQuestion() {
      if (!this.quiz?.questions?.length) return null;
      return this.quiz.questions[this.currentIndex];
    },

    answerOptions() {
      return this.currentQuestion?.options || this.currentQuestion?.answerOptions || [];
    },

    totalQuestions() {
      return this.quiz?.questions?.length || 0;
    },

    progressPercent() {
      if (!this.totalQuestions) return 0;
      return Math.round(((this.currentIndex + 1) / this.totalQuestions) * 100);
    },

    feedbackTone() {
      if (!this.feedback) return '';
      const lower = this.feedback.toLowerCase();
      if (lower.includes('correct') || lower.includes('points') || lower.includes('healing')) return 'feedback-success';
      if (lower.includes('incorrect')) return 'feedback-danger';
      return 'feedback-info';
    },
  },

  mounted() {
    this.loadQuizData();
  },

  methods: {
    getImageUrl,

    async loadQuizData() {
      this.loading = true;
      this.error = null;
      try {
        const quizId = this.$route.params.id;
        const [quizRes, userRes] = await Promise.all([
          api.get(`/quizzes/${quizId}`),
          api.get('/users/me'),
        ]);

        this.quiz = quizRes.data;
        this.userSkills = userRes.data.unlockedSkills || [];
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else if (err.response?.status === 403) {
          this.error = err.response?.data?.message || 'This quiz is private.';
        } else {
          this.error = 'Failed to load this quiz.';
          console.error(err);
        }
      } finally {
        this.loading = false;
      }
    },

    optionLetter(index) {
      return String.fromCharCode(65 + index);
    },

    answerClass(option) {
      return {
        correct: (this.answered && option.id === this.correctOptionId) || option.id === this.arcaneRevealedId,
        incorrect: this.answered && option.id === this.selectedOptionId && option.id !== this.correctOptionId,
        disabled: this.isUnavailableOption(option.id),
      };
    },

    isOptionDisabled(optionId) {
      return this.answered || this.isUnavailableOption(optionId);
    },

    isUnavailableOption(optionId) {
      return this.removedOptionIds.includes(optionId) || (this.shieldActive && this.shieldUsedOnId === optionId);
    },

    getSkillIcon(skillName) {
      const iconMap = {
        'Shield Mastery': 'shield.svg',
        'Battle Fury': 'swords.svg',
        Incantation: 'auto_fix_high.svg',
        'Arcane Knowledge': 'lightbulb.svg',
        'Healing Song': 'music_note.svg',
        'Crowd Mentality': 'groups.svg',
      };
      return `/src/assets/icons/ui/${iconMap[skillName] || 'stars.svg'}`;
    },

    async activateSkill(skillName) {
      if (this.usedSkills.includes(skillName) || this.answered) return;
      this.usedSkills.push(skillName);

      if (skillName === 'Shield Mastery') {
        this.shieldActive = true;
        this.feedback = 'Shield Mastery is ready. One wrong option can be blocked.';
        return;
      }

      if (skillName === 'Healing Song') {
        this.healingSongActive = true;
        this.feedback = 'Healing Song is ready for this question.';
        return;
      }

      try {
        const res = await api.post(`/quizzes/use-skill/${this.currentQuestion.id}`, { skillName });
        const data = res.data;

        if (skillName === 'Battle Fury' || skillName === 'Incantation') {
          this.removedOptionIds.push(...(data.removedOptionIds || []));
          this.feedback = `${skillName} removed a few options.`;
        } else if (skillName === 'Arcane Knowledge') {
          this.arcaneRevealedId = data.correctOptionId;
          this.feedback = 'Arcane Knowledge revealed the correct answer.';
        } else if (skillName === 'Crowd Mentality') {
          this.feedback = 'Crowd Mentality chose an answer for partial credit.';
          this.submitAnswer(data.correctOptionId, true);
        }
      } catch (err) {
        console.error(err);
        this.feedback = 'That skill could not be used right now.';
      }
    },

    async submitAnswer(optionId, isCrowdMentality = false) {
      if (this.answered) return;

      try {
        const res = await api.post('/quizzes/check-answer', { optionId });
        const data = res.data;

        if (!data.correct && this.shieldActive && !this.shieldUsedOnId) {
          this.shieldUsedOnId = optionId;
          this.feedback = 'Shield Mastery blocked that answer. Try again.';
          return;
        }

        this.selectedOptionId = optionId;
        this.correctOptionId = data.correctOptionId;
        this.answered = true;
        this.answers.push({ selectedOptionId: optionId });

        if (data.correct) {
          this.correctStreak += 1;
          if (isCrowdMentality) {
            this.feedback = 'Crowd Mentality locked in a correct answer for partial points.';
            this.score += 5;
          } else {
            this.feedback = 'Correct. Nice work.';
            this.score += 10;
          }
        } else if (this.healingSongActive) {
          this.correctStreak = 0;
          this.feedback = 'Incorrect, but Healing Song protected your points.';
          this.score += 10;
        } else {
          this.correctStreak = 0;
          this.feedback = 'Incorrect. Review the highlighted answer.';
        }
      } catch (err) {
        console.error('Failed to check answer', err);
        this.feedback = 'Failed to check this answer. Please try again.';
      }
    },

    nextQuestion() {
      this.currentIndex += 1;
      this.answered = false;
      this.selectedOptionId = null;
      this.correctOptionId = null;
      this.feedback = '';
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
        const res = await api.post(`/quizzes/${this.quiz.id}/attempts`, { answers: this.answers });
        localStorage.setItem('latestQuizResult', JSON.stringify(res.data));
        this.$router.push('/result');
      } catch (err) {
        console.error('Failed to submit quiz attempt', err);
        alert(err.response?.data?.message || 'Error submitting quiz');
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.quiz-play-layout {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: #fcf8ff;
  color: #1a1a2e;
  font-family: 'Inter', sans-serif;
  padding: 0 40px 132px;
}

.page-glow {
  position: fixed;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.3;
  z-index: 0;
}

.page-glow-primary {
  width: 440px;
  height: 440px;
  top: -160px;
  left: -140px;
  background: #c4c0ff;
}

.page-glow-tertiary {
  width: 360px;
  height: 360px;
  right: -120px;
  bottom: 60px;
  background: #54fdc4;
}

.quiz-shell {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.quiz-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.88);
  border: 0;
  border-bottom: 1px solid #e2e0fc;
  border-radius: 0;
  margin: 0 calc(50% - 50vw);
  padding: 16px 40px;
  box-shadow: 0 8px 24px rgba(91, 79, 232, 0.08);
  backdrop-filter: blur(14px);
}

.quiz-summary {
  min-width: 0;
}

.progress-panel {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid #e2e0fc;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 8px 24px rgba(91, 79, 232, 0.08);
  backdrop-filter: blur(14px);
}

.back-btn,
.score-pill,
.streak-pill,
.skill-btn,
.primary-action {
  font-family: 'Nunito Sans', sans-serif;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border: none;
  border-radius: 9999px;
  color: #464555;
  background: #efecff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  color: #4231cf;
  background: #e8e5ff;
}

.button-icon {
  width: 18px;
  height: 18px;
}

.muted-icon {
  filter: brightness(0) saturate(100%) invert(31%) sepia(8%) saturate(947%) hue-rotate(203deg) brightness(90%) contrast(86%);
}

.progress-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.progress-label,
.progress-percent {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
}

.progress-label {
  color: #4231cf;
}

.progress-percent {
  color: #777586;
}

.progress-track {
  width: 100%;
  height: 12px;
  background: #efecff;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #4231cf, #54fdc4);
  transition: width 0.35s ease;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  background: #fff7da;
  border: 1px solid rgba(255, 183, 2, 0.28);
  border-radius: 9999px;
  color: #6b4b00;
  font-size: 15px;
  font-weight: 800;
}

.score-icon {
  width: 18px;
  height: 18px;
  filter: invert(72%) sepia(51%) saturate(1212%) hue-rotate(352deg) brightness(101%) contrast(106%);
}

.play-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 24px;
  align-items: start;
}

.question-card,
.timer-card,
.feedback-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e0fc;
  box-shadow: 0 8px 28px rgba(91, 79, 232, 0.09);
}

.question-card {
  border-radius: 24px;
  padding: 36px;
  min-height: 260px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.question-card::after {
  content: '';
  position: absolute;
  width: 170px;
  height: 170px;
  right: -60px;
  top: -70px;
  border-radius: 50%;
  background: rgba(255, 183, 2, 0.14);
}

.quiz-title {
  position: relative;
  z-index: 1;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  line-height: 1.2;
  font-weight: 900;
  color: #1a1a2e;
  margin: 0;
}

.quiz-description {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 4px 0 0;
  color: #464555;
  line-height: 1.45;
}

.question-kicker {
  display: block;
  margin-bottom: 10px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 13px;
  font-weight: 900;
  color: #777586;
  text-transform: uppercase;
  letter-spacing: 0;
}

.question-text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 28px;
  line-height: 1.35;
  font-weight: 800;
  margin: 0;
  color: #1a1a2e;
}

.timer-card {
  position: sticky;
  top: 116px;
  border-radius: 24px;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.timer-ring {
  width: 124px;
  height: 124px;
  display: grid;
  place-items: center;
  position: relative;
}

.timer-svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}

.timer-track,
.timer-progress {
  fill: none;
  stroke-width: 8;
}

.timer-track {
  stroke: #e8e5ff;
}

.timer-progress {
  stroke: #4231cf;
  stroke-linecap: round;
  stroke-dasharray: 210 327;
}

.timer-value {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 36px;
  font-weight: 900;
  color: #4231cf;
}

.timer-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #777586;
}

.answers-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.answer-card {
  min-height: 88px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 2px solid rgba(200, 196, 216, 0.8);
  border-radius: 18px;
  background: #ffffff;
  color: #1a1a2e;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 5px 16px rgba(91, 79, 232, 0.06);
  transition: transform 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s;
}

.answer-card:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: #4231cf;
  background: #f5f2ff;
  box-shadow: 0 12px 24px rgba(66, 49, 207, 0.14);
}

.answer-card:active:not(:disabled) {
  transform: translateY(1px);
}

.answer-letter {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #e3dfff;
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 22px;
  font-weight: 900;
}

.answer-text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
  line-height: 1.35;
  font-weight: 800;
  word-break: break-word;
}

.answer-card.correct {
  border-color: #007657;
  background: #d9fff0;
}

.answer-card.correct .answer-letter {
  background: #007657;
  color: #ffffff;
}

.answer-card.incorrect {
  border-color: #ba1a1a;
  background: #ffdad6;
}

.answer-card.incorrect .answer-letter {
  background: #ba1a1a;
  color: #ffffff;
}

.answer-card.disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.feedback-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 18px;
  padding: 16px 18px;
}

.feedback-panel p {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 800;
}

.feedback-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4231cf;
}

.feedback-success {
  color: #00513b;
  background: #d9fff0;
  border-color: rgba(0, 118, 87, 0.24);
}

.feedback-success .feedback-dot {
  background: #007657;
}

.feedback-danger {
  color: #93000a;
  background: #ffdad6;
  border-color: rgba(186, 26, 26, 0.22);
}

.feedback-danger .feedback-dot {
  background: #ba1a1a;
}

.feedback-info {
  color: #3824c7;
  background: #e3dfff;
}

.play-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 40px;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #e2e0fc;
  box-shadow: 0 -8px 28px rgba(91, 79, 232, 0.08);
  backdrop-filter: blur(18px);
}

.streak-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 16px;
  border-radius: 9999px;
  background: #fff7da;
  color: #6b4b00;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
}

.footer-icon {
  width: 20px;
  height: 20px;
}

.warm-icon {
  filter: invert(72%) sepia(51%) saturate(1212%) hue-rotate(352deg) brightness(101%) contrast(106%);
}

.footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  min-width: 0;
}

.skill-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(58vw, 620px);
  overflow-x: auto;
  padding: 4px;
  scrollbar-width: none;
}

.skill-strip::-webkit-scrollbar {
  display: none;
}

.skill-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid rgba(66, 49, 207, 0.22);
  border-radius: 9999px;
  background: #efecff;
  color: #4231cf;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.skill-btn:hover:not(:disabled) {
  background: #e3dfff;
  transform: translateY(-2px);
}

.skill-btn.used,
.skill-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.skill-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(26%) sepia(77%) saturate(5304%) hue-rotate(242deg) brightness(92%) contrast(92%);
}

.primary-action {
  min-height: 48px;
  padding: 0 24px;
  border: none;
  border-radius: 9999px;
  background: #4231cf;
  color: #ffffff;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #2a1e8a;
  transition: all 0.2s;
  white-space: nowrap;
}

.primary-action:hover:not(:disabled) {
  background: #5244de;
  transform: translateY(-1px);
  box-shadow: 0 6px 0 #2a1e8a;
}

.primary-action:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #2a1e8a;
}

.primary-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.state-container {
  position: relative;
  z-index: 1;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-family: 'Nunito Sans', sans-serif;
  color: #464555;
}

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid rgba(66, 49, 207, 0.16);
  border-left-color: #4231cf;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-text {
  color: #ba1a1a;
  font-weight: 800;
}

.retry-btn {
  height: 44px;
  padding: 0 22px;
  border: none;
  border-radius: 9999px;
  background: #4231cf;
  color: #ffffff;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 800;
  cursor: pointer;
}

@media (max-width: 900px) {
  .quiz-play-layout {
    padding: 0 24px 184px;
  }

  .quiz-topbar,
  .progress-panel {
    grid-template-columns: 1fr;
  }

  .play-grid {
    grid-template-columns: 1fr;
  }

  .timer-card {
    position: static;
    flex-direction: row;
    justify-content: center;
  }

  .timer-ring {
    width: 96px;
    height: 96px;
  }

  .play-footer {
    flex-direction: column;
    align-items: stretch;
    padding: 14px 24px;
  }

  .footer-actions {
    justify-content: space-between;
  }

  .skill-strip {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .quiz-play-layout {
    padding: 0 16px 210px;
  }

  .quiz-topbar {
    margin: 0 calc(50% - 50vw);
    padding: 16px;
  }

  .question-card {
    padding: 24px;
    border-radius: 20px;
  }

  .quiz-title {
    font-size: 24px;
  }

  .question-text {
    font-size: 22px;
  }

  .answers-grid {
    grid-template-columns: 1fr;
  }

  .answer-card {
    min-height: 76px;
  }

  .answer-text {
    font-size: 17px;
  }

  .footer-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-action {
    width: 100%;
  }
}
</style>
