<template>
  <div class="profile-wrapper">
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Loading Profile...</p>
    </div>

    <div v-else-if="error" class="state-container">
      <p class="error-msg">{{ error }}</p>
      <button @click="fetchProfile" class="btn btn-primary">Retry</button>
    </div>

    <div v-else-if="user" class="profile-container">

      <!-- Header Banner -->
      <div class="profile-banner">
        <div class="banner-top">
          <div class="avatar-container">
            <img :src="getAvatarUrl(user.avatar)" class="avatar-image" />
            <button class="edit-avatar-btn" @click="isEditing = true">
              <span class="material-symbols-outlined" style="font-size: 16px;">edit</span>
            </button>
          </div>
          <h1>{{ user.username || user.email.split('@')[0] }}</h1>
          <div class="title-badge">
            <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: text-bottom;">star</span>
            Level {{ user.level }} • {{ user.title }}
          </div>
        </div>
        <div class="banner-bottom">
          <div class="xp-text">{{ user.xp }} / {{ user.xpToNext }} XP to Level {{ user.level + 1 }}</div>
          <div class="xp-bar-bg">
            <div class="xp-bar-fill" :style="{ width: `${user.xpToNext > 0 ? (user.xp / user.xpToNext) * 100 : 0}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-icon">🔥</span>
          <h3>{{ user.stats.winStreak }} Day Streak</h3>
          <p>Don't break the chain!</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🏆</span>
          <h3>{{ user.stats.quizzesCompleted }} Quizzes</h3>
          <p>Completed so far</p>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <h3>{{ user.stats.skillPoints || 0 }} SP</h3>
          <p>Skill Points earned</p>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="main-layout">
        <div class="left-col">
          <!-- Unlocked Skills -->
          <div class="card">
            <div class="card-header">
              <h2>Unlocked Skills 🏅</h2>
              <router-link to="/skills" class="see-all">Manage Skills</router-link>
            </div>
            <div class="skills-row">
              <div v-for="skill in user.unlockedSkills" :key="skill" class="skill-circle">
                <div class="skill-icon-bg">{{ skill.charAt(0).toUpperCase() }}</div>
                <span>{{ skill }}</span>
              </div>
              <div v-if="!user.unlockedSkills || user.unlockedSkills.length === 0" class="empty-state">
                No skills unlocked yet. Take quizzes to earn SP!
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <h2 style="margin-bottom: 1.5rem;">Recent Activity</h2>
            <div class="activity-list">
              <div v-for="attempt in user.recentAttempts" :key="attempt.id" class="activity-item">
                <div class="activity-icon">
                  <span class="material-symbols-outlined">science</span>
                </div>
                <div class="activity-details">
                  <h4>{{ attempt.quiz.title }}</h4>
                  <p>{{ attempt.quiz.category || 'General' }} • {{ new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString() }}</p>
                </div>
                <div class="activity-score">
                  <span class="score-percent" :class="getScoreColorClass(attempt.score)">{{ attempt.score }}%</span>
                  <span class="score-label" :class="getScoreColorClass(attempt.score)">{{ getScoreMessage(attempt.score) }}</span>
                </div>
              </div>
              <p v-if="!user.recentAttempts || user.recentAttempts.length === 0" class="empty-state">
                No recent activity.
              </p>
            </div>
          </div>
        </div>

        <div class="right-col">
          <!-- Settings / Menu -->
          <div class="card settings-card">
            <button class="settings-item" @click="isEditing = true; editTab = 'info'">
              <span class="material-symbols-outlined">settings</span> Account Settings
            </button>
            <button class="settings-item">
              <span class="material-symbols-outlined">notifications</span> Notifications
            </button>
            <button class="settings-item">
              <span class="material-symbols-outlined">help</span> Help Center
            </button>
            <button class="settings-item log-out" @click="logout">
              <span class="material-symbols-outlined">logout</span> Log Out
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditing" class="modal-overlay" @click.self="isEditing = false">
      <div class="modal-content">
        <h2 class="modal-title">Edit Profile</h2>
        
        <div class="tabs">
          <button :class="{ active: editTab === 'info' }" @click="editTab = 'info'">User Info</button>
          <button :class="{ active: editTab === 'avatar' }" @click="editTab = 'avatar'">Avatar</button>
        </div>

        <form @submit.prevent="updateProfile" v-if="editTab === 'info'" class="edit-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" v-model="editForm.username" placeholder="KnightScholar" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="editForm.email" required />
          </div>
          <div class="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" v-model="editForm.password" />
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="isEditing = false">Cancel</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
          <p v-if="editError" class="error-msg">{{ editError }}</p>
        </form>

        <div v-else class="avatar-grid">
          <div 
            v-for="avatar in availableAvatars" 
            :key="avatar"
            class="avatar-option"
            :class="{ selected: editForm.avatar === avatar }"
            @click="editForm.avatar = avatar"
          >
            <img :src="getAvatarUrl(avatar)" />
          </div>
          <div class="modal-actions full-width">
            <button type="button" class="btn-cancel" @click="isEditing = false">Cancel</button>
            <button type="button" class="btn-save" @click="updateProfile" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Avatar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Profile',
  data() {
    return {
      loading: true,
      error: null,
      user: null,
      isEditing: false,
      editTab: 'info',
      saving: false,
      editError: null,
      editForm: {
        username: '',
        email: '',
        password: '',
        avatar: ''
      },
      availableAvatars: [
        'NeonKnight_M.jpg',
        'NeonKnight_F.jpg',
        'knight.jpg',
        'download (1).jpg',
        'AI.png'
      ]
    };
  },
  methods: {
    getAvatarUrl(filename) {
      if (!filename) return '/src/assets/NeonKnight_M.jpg';
      return `/src/assets/${filename}`;
    },
    getScoreColorClass(score) {
      if (score >= 90) return 'text-excellent';
      if (score >= 70) return 'text-good';
      return 'text-needs-work';
    },
    getScoreMessage(score) {
      if (score >= 90) return 'Excellent!';
      if (score >= 70) return 'Good job!';
      return 'Keep trying!';
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/users/me');
        this.user = response.data;
        this.editForm.username = this.user.username || '';
        this.editForm.email = this.user.email || '';
        this.editForm.avatar = this.user.avatar || 'NeonKnight_M.jpg';
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          this.$router.push("/login");
        } else {
          this.error = "Failed to load profile. Please try again.";
          console.error(err);
        }
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      this.saving = true;
      this.editError = null;
      try {
        const payload = {
          username: this.editForm.username,
          email: this.editForm.email,
          avatar: this.editForm.avatar
        };
        if (this.editForm.password) {
          payload.password = this.editForm.password;
        }

        await api.put('/users/me', payload);
        
        this.user.username = this.editForm.username;
        this.user.email = this.editForm.email;
        this.user.avatar = this.editForm.avatar;
        
        this.isEditing = false;
        this.editForm.password = ''; 
      } catch (err) {
        this.editError = err.response?.data?.error || "Failed to update profile";
      } finally {
        this.saving = false;
      }
    }
  },
  mounted() {
    this.fetchProfile();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');

.profile-wrapper {
  background-color: #f5f2ff;
  min-height: calc(100vh - 80px);
  padding: 2rem 1.5rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
}

.state-container {
  text-align: center;
  padding: 4rem;
}

.spinner {
  border: 4px solid rgba(66, 49, 207, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: #4231cf;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Banner */
.profile-banner {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}

.banner-top {
  background: linear-gradient(135deg, #5b4fe8, #4231cf);
  padding: 3rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  position: relative;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  background-color: white;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  color: #4231cf;
  transition: transform 0.2s;
}

.edit-avatar-btn:hover {
  transform: scale(1.1);
}

.banner-top h1 {
  margin: 0 0 0.75rem 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 28px;
  font-weight: 800;
}

.title-badge {
  background: #ffb702;
  color: #6b4b00;
  padding: 6px 16px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.banner-bottom {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.xp-text {
  font-size: 14px;
  font-weight: 600;
  color: #464555;
}

.xp-bar-bg {
  width: 100%;
  max-width: 400px;
  height: 12px;
  background: #efecff;
  border-radius: 9999px;
  overflow: hidden;
}

.xp-bar-fill {
  height: 100%;
  background: #ffb702;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}

.stat-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-card h3 {
  margin: 0 0 0.25rem 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-card p {
  margin: 0;
  font-size: 13px;
  color: #777586;
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .stats-row {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card h2 {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.see-all {
  color: #4231cf;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}
.see-all:hover {
  text-decoration: underline;
}

/* Skills Row */
.skills-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.skill-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 70px;
}

.skill-icon-bg {
  width: 60px;
  height: 60px;
  background: #f5f2ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 800;
}

.skill-circle span {
  font-size: 12px;
  color: #464555;
  text-align: center;
  font-weight: 500;
  line-height: 1.2;
}

/* Recent Activity */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  background: #fcf8ff;
  padding: 1rem;
  border-radius: 12px;
  gap: 1rem;
}

.activity-icon {
  width: 48px;
  height: 48px;
  background: #e8e5ff;
  color: #4231cf;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-details h4 {
  margin: 0 0 0.25rem 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.activity-details p {
  margin: 0;
  font-size: 12px;
  color: #777586;
}

.activity-score {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.score-percent {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
}
.score-label {
  font-size: 12px;
  font-weight: 600;
}

.text-excellent { color: #007657; }
.text-good { color: #7d5800; }
.text-needs-work { color: #ba1a1a; }

/* Settings Menu */
.settings-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
  font-family: 'Inter', sans-serif;
}

.settings-item:hover {
  background: #f5f2ff;
}

.settings-item .material-symbols-outlined {
  color: #777586;
}

.settings-item.log-out {
  color: #ba1a1a;
}
.settings-item.log-out .material-symbols-outlined {
  color: #ba1a1a;
}
.settings-item.log-out:hover {
  background: #ffdad6;
}

.empty-state {
  color: #777586;
  font-size: 14px;
  font-style: italic;
  padding: 1rem 0;
}

/* Modal Styles - Updated for Light Mode */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #ffffff;
  border-radius: 24px;
  padding: 2rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.modal-title {
  margin: 0 0 1.5rem 0;
  color: #1a1a2e;
  text-align: center;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 800;
  font-size: 24px;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e0fc;
}

.tabs button {
  background: none;
  border: none;
  color: #777586;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.tabs button.active {
  color: #4231cf;
  border-bottom-color: #4231cf;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #464555;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  background: #fcf8ff;
  border: 1px solid #c8c4d8;
  border-radius: 8px;
  color: #1a1a2e;
  font-family: 'Inter', sans-serif;
}
.form-group input:focus {
  outline: none;
  border-color: #5b4fe8;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.avatar-option {
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-option img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #4231cf;
  box-shadow: 0 0 15px rgba(66, 49, 207, 0.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions.full-width {
  grid-column: 1 / -1;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #c8c4d8;
  color: #464555;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-cancel:hover {
  background: #f5f2ff;
}

.btn-save {
  background: #ffb702;
  border: none;
  color: #6b4b00;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s;
}
.btn-save:active {
  transform: scale(0.95);
}
.btn-primary {
  background: #4231cf;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.error-msg {
  color: #ba1a1a;
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
}
</style>
