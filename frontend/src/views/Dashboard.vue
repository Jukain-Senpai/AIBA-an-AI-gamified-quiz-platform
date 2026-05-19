<template>
    <div class="dashboard-wrapper">
        <div class="dashboard-container">
            <!-- Welcome Section -->
            <section class="welcome-section">
                <div class="welcome-text">
                    <h1>Good morning, {{ user.username || 'Scholar' }}! 👋</h1>
                    <p>You're on a roll! Ready to conquer today's challenges?</p>
                </div>
                <div class="certified-badge">
                    <span class="material-symbols-outlined icon">verified</span>
                    <span>Certified Scholar</span>
                </div>
            </section>

            
            <section class="stats-overview">
                <!-- Level Card -->
                <div class="stat-card gradient-primary">
                    <div class="stat-header">
                        <div>
                            <span class="stat-label">Current Level</span>
                            <h2 class="stat-value">{{ user.level }}</h2>
                        </div>
                        <span class="material-symbols-outlined icon-large">workspace_premium</span>
                    </div>
                    <div class="stat-footer">
                        <div class="progress-info">
                            <span class="title-text">{{ user.title }}</span>
                            <span class="xp-text">{{ user.xp }} / {{ user.xpToNext }} XP</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" :style="{ width: xpPercentage + '%' }"></div>
                        </div>
                    </div>
                </div>

                <!-- Streak Card -->
                <div class="stat-card gradient-secondary">
                    <div class="stat-header">
                        <span class="material-symbols-outlined icon-large">local_fire_department</span>
                        <span class="badge-pill">Hot Streak</span>
                    </div>
                    <div class="stat-footer-text">
                        <h3>{{ user.stats.winStreak }} Day Streak!</h3>
                        <p>Keep it going! Don't break the chain.</p>
                    </div>
                </div>

                <!-- Completed Quizzes Card -->
                <div class="stat-card gradient-tertiary">
                    <div class="stat-header">
                        <span class="material-symbols-outlined icon-large">military_tech</span>
                    </div>
                    <div class="stat-footer-text">
                        <h3>{{ user.stats.quizzesCompleted }} Quizzes</h3>
                        <p>Completed so far.</p>
                    </div>
                </div>
            </section>

            <!-- Quick Actions -->
            <section class="actions-section">
                <div class="actions-header">
                    <h2>Quick Actions ⚡</h2>
                </div>
                <div class="actions-grid">
                    <!-- Play Quiz -->
                    <div class="action-card border-primary">
                        <div class="action-content">
                            <span class="action-badge bg-primary">PLAY</span>
                            <h4>Browse Quizzes</h4>
                        </div>
                        <router-link to="/quizzes" class="action-btn btn-primary">Go to Quizzes</router-link>
                    </div>

                    <!-- Create Quiz -->
                    <div class="action-card border-secondary">
                        <div class="action-content">
                            <span class="action-badge bg-secondary">CREATE</span>
                            <h4>Create a Quiz</h4>
                        </div>
                        <router-link to="/create-quiz" class="action-btn btn-secondary">Start Creating</router-link>
                    </div>

                    <!-- Forum -->
                    <div class="action-card border-tertiary">
                        <div class="action-content">
                            <span class="action-badge bg-tertiary">COMMUNITY</span>
                            <h4>Visit Forum</h4>
                        </div>
                        <router-link to="/forum" class="action-btn btn-tertiary">Join Discussion</router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import api from "../services/api";

export default {
    name: "Dashboard",

    data() {
        return {
            user: {
                username: "",
                level: 1,
                xp: 0,
                xpToNext: 100,
                title: "Novice",
                path: "Unassigned",
                stats: {
                    quizzesCompleted: 0,
                    winStreak: 0,
                    skillPoints: 0,
                },
            },
        };
    },
    computed: {
        xpPercentage(){
            if (this.user.xpToNext === 0) return 0;
            return Math.min(100, (this.user.xp / this.user.xpToNext) * 100);
        },
    },
    async mounted() {
        try {
            const response = await api.get("/users/me");
            this.user = response.data;
        } catch (err) {
            console.log("Using fallback user data");
        }
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');

.dashboard-wrapper {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f5f2ff 0%, #efecff 100%);
  width: 100%;
  min-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashboard-container {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 1.5rem;
}
@media (min-width: 768px) {
  .dashboard-container {
    padding: 3rem 2.5rem;
  }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* Welcome Section */
.welcome-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .welcome-section {
    flex-direction: row;
    align-items: center;
  }
}
.welcome-text h1 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}
@media (min-width: 768px) {
  .welcome-text h1 {
    font-size: 32px;
  }
}
.welcome-text p {
  font-size: 16px;
  color: #464555;
  margin: 0;
}
.certified-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  padding: 8px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(200, 196, 216, 0.3);
}
.certified-badge .icon {
  color: #4231cf;
  font-size: 20px;
}
.certified-badge span:not(.icon) {
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #4231cf;
  font-size: 16px;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 3rem;
}
@media (min-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  color: white;
}
.gradient-primary {
  background: linear-gradient(135deg, #5b4fe8 0%, #4231cf 100%);
  box-shadow: 0 8px 30px rgba(91,79,232,0.2);
}
.gradient-secondary {
  background: linear-gradient(135deg, #ffba27 0%, #ff9800 100%);
  box-shadow: 0 8px 30px rgba(255,186,39,0.2);
}
.gradient-tertiary {
  background: linear-gradient(135deg, #27e0a9 0%, #007657 100%);
  box-shadow: 0 8px 30px rgba(39,224,169,0.2);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.stat-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
}
.stat-value {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 48px;
  font-weight: 800;
  margin: 4px 0 0 0;
  line-height: 1;
}
.icon-large {
  font-size: 40px;
  opacity: 0.5;
}
.gradient-secondary .icon-large, .gradient-tertiary .icon-large {
  opacity: 1;
}
.badge-pill {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.stat-footer-text h3 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 4px 0;
  line-height: 1.2;
}
.stat-footer-text p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}
.title-text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
}
.xp-text {
  font-size: 12px;
  font-weight: 500;
}
.progress-bar-bg {
  height: 12px;
  width: 100%;
  background: rgba(255,255,255,0.2);
  border-radius: 9999px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: #ffb702;
  box-shadow: 0 0 10px rgba(255,183,2,0.6);
  transition: width 0.5s ease;
}

/* Quick Actions Section */
.actions-section {
  margin-bottom: 3rem;
}
.actions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.actions-header h2 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}
.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.action-card {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(200, 196, 216, 0.3);
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
}
.action-card:hover {
  box-shadow: 0 12px 30px rgba(91,79,232,0.12);
  transform: translateY(-4px);
}
.border-primary { border-left: 8px solid #4231cf; }
.border-secondary { border-left: 8px solid #ffb702; }
.border-tertiary { border-left: 8px solid #27e0a9; }

.action-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.action-badge {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}
.bg-primary { background: rgba(66,49,207,0.1); color: #4231cf; }
.bg-secondary { background: rgba(255,183,2,0.2); color: #7d5800; }
.bg-tertiary { background: rgba(39,224,169,0.2); color: #005b42; }

.action-card h4 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 16px 0 0 0;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  display: block;
  margin-top: 24px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.action-btn:active {
  transform: scale(0.95);
}
.btn-primary {
  background-color: #e3dfff;
  color: #3824c7;
  border-bottom: 4px solid #c4c0ff;
}
.btn-secondary {
  background-color: #ffb702;
  color: #6b4b00;
  border-bottom: 4px solid #cc9400;
}
.btn-tertiary {
  background-color: #54fdc4;
  color: #00513b;
  border-bottom: 4px solid #27e0a9;
}
</style>