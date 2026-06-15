<template>
  <div class="result-wrapper">
    <div class="result-container" v-if="result">
      
      <!-- LEVEL UP BANNER -->
      <div v-if="result.leveledUp" class="level-up-banner slide-down">
        <div class="banner-content">
          <span class="icon-sparkle">✨</span>
          <div class="banner-text">
            <h2>LEVEL UP!</h2>
            <p>You reached <strong>Level {{ result.level }}</strong> and earned <strong>1 Skill Point</strong>!</p>
          </div>
          <span class="icon-sparkle">✨</span>
        </div>
      </div>

      <!-- MAIN RESULT CARD -->
      <div class="result-card fade-in">
        <div class="result-header">
          <h1 class="title">Quiz Complete</h1>
          <div class="score-ring">
            <div class="score-circle">
              <span class="score-value">{{ result.score }}</span>
              <span class="score-total">/ {{ result.totalQuestions }}</span>
            </div>
          </div>
          <p class="accuracy-text">{{ accuracy }}% Accuracy</p>
        </div>

        <!-- STREAK BANNER -->
        <div class="streak-badge" v-if="result.winStreak > 0">
          <span class="fire-icon">🔥</span>
          <span class="streak-text">{{ result.winStreak }} Quiz Hot Streak!</span>
        </div>

        <!-- XP BREAKDOWN -->
        <div class="xp-section">
          <h3 class="section-title">Experience Earned</h3>
          
          <div class="xp-row">
            <span class="xp-label">Base XP</span>
            <span class="xp-val">+{{ result.baseXP }}</span>
          </div>
          
          <div class="xp-row">
            <span class="xp-label">Completion Bonus</span>
            <span class="xp-val">+{{ result.completionXP }}</span>
          </div>
          
          <div class="xp-row highlight-row" v-if="result.streakBonusXP > 0">
            <span class="xp-label">🔥 Streak Bonus</span>
            <span class="xp-val">+{{ result.streakBonusXP }}</span>
          </div>
          
          <div class="xp-divider"></div>
          
          <div class="xp-row total-xp">
            <span>Total XP</span>
            <span class="xp-total-val">+{{ result.xpEarned }} XP</span>
          </div>
        </div>

        <!-- PROGRESS BAR -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="level-indicator">Lv. {{ result.level }}</span>
            <span class="xp-indicator">{{ result.currentXp }} / {{ result.level * 100 }} XP</span>
          </div>
          <div class="progress-bg">
            <div class="progress-fill" :style="{ width: xpPercentage + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="actions fade-in-delayed">
        <router-link to="/quizzes" class="action-btn btn-primary">Back to Quizzes</router-link>
        <router-link to="/dashboard" class="action-btn btn-secondary">Go to Dashboard</router-link>
      </div>

    </div>

    <!-- ERROR STATE -->
    <div v-else class="error-state">
      <h2>No result found.</h2>
      <p>It seems you haven't completed a quiz yet.</p>
      <router-link to="/quizzes" class="action-btn btn-primary">Go to Quizzes</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizResult",
  data() {
    return {
      result: null
    };
  },
  computed: {
    accuracy() {
      if (!this.result || this.result.totalQuestions === 0) return 0;
      return Math.round((this.result.score / this.result.totalQuestions) * 100);
    },
    xpPercentage() {
      if (!this.result) return 0;
      const target = this.result.level * 100;
      return Math.min(100, (this.result.currentXp / target) * 100);
    }
  },
  mounted() {
    const dataStr = localStorage.getItem("latestQuizResult");
    if (dataStr) {
      try {
        this.result = JSON.parse(dataStr);
      } catch (e) {
        console.error("Failed to parse result", e);
      }
    }
  }
};
</script>

<style scoped>
.result-wrapper {
  background-color: #f5f2ff;
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1.5rem;
  font-family: 'Inter', sans-serif;
}

.result-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Animations */
@keyframes slideDown {
  0% { transform: translateY(-30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.slide-down {
  animation: slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
  animation-delay: 0.2s;
}

.fade-in-delayed {
  opacity: 0;
  animation: fadeIn 0.6s ease forwards;
  animation-delay: 0.4s;
}

/* Level Up Banner */
.level-up-banner {
  background: linear-gradient(135deg, #ffba27 0%, #ff9800 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 10px 30px rgba(255, 186, 39, 0.3);
  text-align: center;
  border: 2px solid #ffd54f;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.icon-sparkle {
  font-size: 2rem;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 1; }
}

.banner-text h2 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 0 0.2rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.banner-text p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.95;
}

/* Result Card */
.result-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  box-shadow: 0 12px 40px rgba(91, 79, 232, 0.08);
  border: 1px solid rgba(200, 196, 216, 0.3);
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #464555;
  margin: 0 0 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.score-ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#5b4fe8 var(--progress, 100%), #e3dfff 0deg);
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(91, 79, 232, 0.2);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: #1a1a2e;
  line-height: 1;
}

.score-total {
  font-size: 1.1rem;
  color: #888;
  font-weight: 500;
}

.accuracy-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #5b4fe8;
  margin: 0;
}

/* Streak Badge */
.streak-badge {
  background: rgba(255, 183, 2, 0.15);
  border: 1px solid rgba(255, 183, 2, 0.3);
  border-radius: 12px;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.fire-icon {
  font-size: 1.5rem;
}

.streak-text {
  color: #d17900;
  font-weight: 700;
  font-size: 1.1rem;
}

/* XP Breakdown */
.xp-section {
  background: #fdfcff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f0eaff;
  margin-bottom: 2rem;
}

.section-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.1rem;
  color: #464555;
  margin: 0 0 1rem 0;
}

.xp-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 1rem;
  color: #464555;
}

.highlight-row {
  color: #d17900;
  font-weight: 600;
}

.xp-val {
  font-weight: 600;
  font-family: 'Nunito Sans', sans-serif;
}

.xp-divider {
  height: 1px;
  background: #e3dfff;
  margin: 0.8rem 0;
}

.total-xp {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a2e;
}

.xp-total-val {
  color: #5b4fe8;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.4rem;
}

/* Progress Bar */
.progress-section {
  margin-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  font-weight: 600;
  color: #464555;
  margin-bottom: 0.5rem;
}

.level-indicator {
  color: #5b4fe8;
  font-weight: 800;
}

.progress-bg {
  height: 12px;
  background: #f0eaff;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5b4fe8, #8b5cf6);
  border-radius: 999px;
  transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 10px rgba(91, 79, 232, 0.4);
}

/* Actions */
.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.action-btn:active {
  transform: scale(0.96);
}

.btn-primary {
  background: linear-gradient(135deg, #5b4fe8 0%, #4231cf 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(91, 79, 232, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 12px 35px rgba(91, 79, 232, 0.4);
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #5b4fe8;
  border: 2px solid #e3dfff;
}

.btn-secondary:hover {
  background: #f5f2ff;
  border-color: #c4c0ff;
}

.error-state {
  text-align: center;
  padding: 3rem;
}

.error-state h2 {
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.error-state p {
  color: #464555;
  margin-bottom: 2rem;
}
</style>
