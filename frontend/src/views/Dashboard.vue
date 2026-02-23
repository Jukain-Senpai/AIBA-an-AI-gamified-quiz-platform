<template>
    <div class="dashboard-wrapper">

        <section class="progress-section">
            <div>
                <h2 class="level-text">Level {{ user.level }}</h2>
                <p class="xp-text">
                    {{ user.xp }} / {{ user.xpToNext }} xp
                </p>

                <div class="xp-bar">
                    <div
                    class="xp-fill"
                    :style="{ width:xpPercentage + '%' }"></div>
                    </div>

            </div>
        </section>
        <section class="middle-section">

            <div class="avatar-card">
                <div class ="avatar-circle">
                    <img :src="avatarImage" alt="User Avatar" />
                </div>
                <h3>{{ user.title }}</h3>
                <p>{{ user.path }}</p>
            </div>

            <div class="action-card">
                <router-link to="/quizzes" class="primary-btn">
                    Play Quiz
                </router-link>

                <router-link to="/create-quiz" class="secondary-btn">
                    Create Quiz
                </router-link>

                <router-link to="/forum" class="tertiary-btn">
                    Visit forum
                </router-link>
            </div>

        </section>

        <section class="stats-section">
            <div class="stat-card">
                <h3>{{  user.stats.quizzesCompleted }}</h3>
                <p>Quizzes Completed</p>
            </div>

            <div class="stat-card">
                <h3>{{  user.stats.winStreak }}</h3>
                <p>Win Streak</p>
            </div>

            <div class="stat-card">
                <h3>{{  user.stats.skillPoints }}</h3>
                <p>Skill Points</p>
            </div>            
        </section>
    </div>
</template>

<script>
import api from "../services/api";
import NeonKnight from "../assets/NeonKnight_M.jpg";

export default {
    name: "Dashboard",

    data() {
        return {
            avatarImage: NeonKnight,
            user: {
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
            return (this.user.xp / this.user.xpToNext) * 100;
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
.dashboard-wrapper {
  padding: 3rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* Progress Section */
.progress-section {
  background: rgba(30, 15, 55, 0.5);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.level-text {
  color: #00e5ff;
  margin: 0 0 0.5rem 0;
}

.xp-text {
  color: #a78bfa;
  margin-bottom: 1rem;
}

.xp-bar {
  width: 100%;
  height: 18px;
  background: rgba(88, 60, 120, 0.4);
  border-radius: 10px;
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #00e5ff, #8b5cf6);
  transition: width 0.5s ease;
}

/* Middle Section */
.middle-section {
  display: flex;
  gap: 4rem;
}

.avatar-card {
  flex: 1;
  background: rgba(30, 15, 55, 0.5);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.avatar-circle {
  width: 140px;
  height: 140px;
  margin: 0 auto 1.5rem auto;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #00e5ff, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 25px rgba(0, 229, 255, 0.4),
    0 0 40px rgba(139, 92, 246, 0.3);
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #0d0221;
}

.action-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.primary-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  color: white;
  font-weight: 600;
}

.secondary-btn {
  padding: 1rem;
  background: #f59e0b;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  color: white;
  font-weight: 600;
}

.tertiary-btn {
  padding: 1rem;
  background: #334155;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;
  color: white;
}

/* Stats */
.stats-section {
  display: flex;
  gap: 2rem;
}

.stat-card {
  flex: 1;
  background: rgba(30, 15, 55, 0.5);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.stat-card h3 {
  font-size: 2rem;
  color: #00e5ff;
}
</style>