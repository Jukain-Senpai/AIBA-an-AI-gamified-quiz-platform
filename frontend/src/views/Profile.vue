<template>
  <div class="profile-container">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading Profile...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchProfile" class="btn btn-primary">Retry</button>
    </div>

    <div v-else class="profile-content">
      <!-- Header Section -->
      <div class="profile-header-card">
        <div class="header-flex">
          <!-- Avatar -->
          <div class="avatar-wrapper">
            <img :src="getAvatarUrl(user.avatar)" alt="Avatar" class="profile-avatar" />
          </div>

          <!-- Info & Stats -->
          <div class="info-section">
            <div class="info-top">
              <h1 class="username-display">{{ user.username || user.email.split('@')[0] }}</h1>
              <span class="level-badge">Level {{ user.level }}</span>
            </div>
            <p class="title-path">{{ user.title }} • {{ user.path }} Path</p>

            <!-- XP Bar -->
            <div class="xp-container">
              <div class="xp-labels">
                <span>Experience Points</span>
                <span>{{ user.xp }} / {{ user.xpToNext }} XP</span>
              </div>
              <div class="xp-bar-bg">
                <div class="xp-bar-fill" :style="{ width: `${(user.xp / user.xpToNext) * 100}%` }"></div>
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-label">Accuracy</div>
                <div class="stat-value">--%</div> <!-- We don't have accuracy tracked yet -->
              </div>
              <div class="stat-box">
                <div class="stat-label">Quizzes Taken</div>
                <div class="stat-value">{{ user.stats.quizzesCompleted }}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Streak</div>
                <div class="stat-value">{{ user.stats.winStreak }}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Rank</div>
                <div class="stat-value">#---</div>
              </div>
            </div>
            
            <button class="btn-edit" @click="isEditing = true">Edit Profile</button>
          </div>
        </div>
      </div>

      <div class="bottom-grid">
        <!-- Unlocked Skills Summary -->
        <div class="skills-summary-card">
          <h3 class="card-title">Unlocked Skills</h3>
          <div v-if="user.unlockedSkills && user.unlockedSkills.length" class="skills-list">
            <div v-for="skill in user.unlockedSkills" :key="skill" class="skill-pill">
              {{ skill }}
            </div>
          </div>
          <p v-else class="empty-text">No skills unlocked yet. Take quizzes to earn SP!</p>
        </div>

        <!-- Recent Activity -->
        <div class="activity-card">
          <h3 class="card-title">Recent Activity</h3>
          <div class="activity-list">
            <div v-for="attempt in user.recentAttempts" :key="attempt.id" class="activity-item">
              <span class="activity-name">Completed "{{ attempt.quiz.title }}"</span>
              <span class="activity-score">Score: {{ attempt.score }}</span>
            </div>
            <p v-if="!user.recentAttempts || user.recentAttempts.length === 0" class="empty-text">
              No recent activity.
            </p>
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
          // Token is invalid or expired
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
        // Only send password if it's not empty
        const payload = {
          username: this.editForm.username,
          email: this.editForm.email,
          avatar: this.editForm.avatar
        };
        if (this.editForm.password) {
          payload.password = this.editForm.password;
        }

        await api.put('/users/me', payload);
        
        // Refresh local user data
        this.user.username = this.editForm.username;
        this.user.email = this.editForm.email;
        this.user.avatar = this.editForm.avatar;
        
        this.isEditing = false;
        this.editForm.password = ''; // clear password field
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
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  color: #fff;
  padding-bottom: 2rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header Card */
.profile-header-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}

.header-flex {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #9333ea, #4f46e5);
  border: 3px solid rgba(251, 191, 36, 0.6);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
  flex-shrink: 0;
  overflow: hidden;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.info-section {
  flex: 1;
}

.info-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.username-display {
  margin: 0;
  font-size: 1.75rem;
  color: #e9d5ff;
}

.level-badge {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(251, 191, 36, 0.4);
  color: #fcd34d;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.title-path {
  color: rgba(216, 180, 254, 0.6);
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.xp-container {
  margin-bottom: 1.5rem;
}

.xp-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #d8b4fe;
  margin-bottom: 0.25rem;
}

.xp-bar-bg {
  height: 8px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #a855f7);
  transition: width 0.5s ease;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-box {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(216, 180, 254, 0.6);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  color: #e9d5ff;
  font-weight: 600;
}

.btn-edit {
  background: transparent;
  border: 1px solid #a855f7;
  color: #e9d5ff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.btn-edit:hover {
  background: rgba(168, 85, 247, 0.2);
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.skills-summary-card, .activity-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
}

.card-title {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: #d8b4fe;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-pill {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #e9d5ff;
  padding: 0.3rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.8rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
  font-size: 0.85rem;
  color: rgba(216, 180, 254, 0.8);
}

.activity-item:last-child {
  border-bottom: none;
}

.empty-text {
  color: rgba(216, 180, 254, 0.5);
  font-size: 0.85rem;
  font-style: italic;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #1e1b4b;
  border: 1px solid #8b5cf6;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.modal-title {
  margin: 0 0 1.5rem 0;
  color: #fff;
  text-align: center;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
}

.tabs button {
  background: none;
  border: none;
  color: #a78bfa;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tabs button.active {
  color: #fff;
  border-bottom-color: #a855f7;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #a78bfa;
  margin-bottom: 0.4rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  color: #fff;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.avatar-option {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
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
  border-color: #22d3ee;
  box-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
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
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-save {
  background: #7c3aed;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
}

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
}

.btn-primary {
  background: #7c3aed;
  border: none;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
