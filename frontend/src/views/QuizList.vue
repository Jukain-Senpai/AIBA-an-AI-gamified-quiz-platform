<template>
  <div class="quiz-list-wrapper">
    <!-- Cosmic Background -->
    <div class="bg-decoration">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="quiz-list-container">

      <!-- ── Page Header ── -->
      <section class="page-header">
        <h1 class="page-title">Explore Quizzes 🔍</h1>
        <router-link to="/create-quiz" class="create-btn">
          <img src="/src/assets/icons/ui/add.svg" class="btn-icon-sm" alt="" />
          Create Quiz
        </router-link>
      </section>

      <!-- ── Search Bar ── -->
      <section class="search-section">
        <div class="search-wrapper">
          <img src="/src/assets/icons/ui/search.svg" class="search-icon" alt="" />
          <input
            id="quiz-search"
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search for quizzes..."
          />
        </div>
      </section>

      <!-- ── Category Filter Tabs ── -->
      <nav class="category-nav" aria-label="Quiz category filters">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="cat-tab"
          :class="{ 'cat-tab--active': activeCategory === cat.value }"
          @click="setCategory(cat.value)"
        >
          {{ cat.label }}
        </button>
      </nav>

      <!-- ── Loading State ── -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p class="state-text">Loading quizzes...</p>
      </div>

      <!-- ── Error State ── -->
      <div v-else-if="error" class="state-container">
        <p class="error-text">{{ error }}</p>
        <button class="retry-btn" @click="fetchQuizzes">Retry</button>
      </div>

      <!-- ── Quiz Grid ── -->
      <template v-else>
        <!-- Empty State -->
        <div v-if="paginatedQuizzes.length === 0" class="state-container">
          <p class="empty-icon">🔍</p>
          <p class="state-text">No quizzes found for this filter.</p>
          <p class="state-subtext">Try a different category or search term.</p>
        </div>

        <!-- Cards -->
        <section v-else class="quiz-grid">
          <article
            v-for="quiz in paginatedQuizzes"
            :key="quiz.id"
            class="quiz-card"
          >
            <!-- Thumbnail Placeholder -->
            <div class="card-thumbnail" :style="quiz.thumbnail ? { backgroundImage: `url(${getImageUrl(quiz.thumbnail)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
              <span class="cat-badge" :style="getCatBadgeStyle(quiz.category)">
                {{ getCatEmoji(quiz.category) }} {{ quiz.category || 'General' }}
              </span>
              <span class="diff-badge" :class="getDiffClass(quiz.difficulty)">
                {{ quiz.difficulty || 'Easy' }}
              </span>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <div class="card-headline">
                <h2 class="card-title">{{ quiz.title }}</h2>
                <div class="card-menu-wrap">
                  <button class="menu-btn" type="button" @click.stop="toggleMenu(quiz.id)" aria-label="Quiz actions">
                    <span class="material-symbols-outlined">more_vert</span>
                  </button>
                  <div v-if="openMenuId === quiz.id" class="menu-popover" @click.stop>
                    <button v-if="canEditQuiz(quiz)" class="menu-item" type="button" @click="editQuiz(quiz)">
                      <span class="material-symbols-outlined">edit</span>
                      Edit
                    </button>
                    <button v-if="canDeleteQuiz(quiz)" class="menu-item danger" type="button" @click="deleteQuiz(quiz)">
                      <span class="material-symbols-outlined">delete</span>
                      Delete
                    </button>
                    <button class="menu-item" type="button" @click="copyQuiz(quiz)">
                      <span class="material-symbols-outlined">content_copy</span>
                      Copy and edit as my own
                    </button>
                  </div>
                </div>
              </div>

              <p class="card-creator">
                by <span class="creator-name">{{ getCreatorName(quiz.creator) }}</span>
              </p>

              <!-- Metadata Row -->
              <div class="card-meta">
                <div class="meta-item">
                  <img src="/src/assets/icons/ui/play-circle.svg" class="meta-icon primary-icon" alt="" />
                  <span>{{ quiz._count.questions }} Qs</span>
                </div>
                <div class="meta-item">
                  <img src="/src/assets/icons/ui/schedule.svg" class="meta-icon muted-icon" alt="" />
                  <span>{{ estimateTime(quiz._count.questions) }}</span>
                </div>
                <div class="meta-item">
                  <img src="/src/assets/icons/ui/star-fill.svg" class="meta-icon star-icon-col" alt="" />
                  <span>{{ formatDate(quiz.createdAt) }}</span>
                </div>
              </div>

              <div class="card-footer">
                <router-link :to="`/quizzes/${quiz.id}`" class="start-btn">
                  Start Quiz
                </router-link>
              </div>

            </div>
          </article>
        </section>

        <!-- Load More -->
        <div v-if="filteredQuizzes.length > displayCount" class="load-more-wrapper">
          <button class="load-more-btn" @click="loadMore">
            Show More Quests
            <img src="/src/assets/icons/navigation/keyboard-arrow-down.svg" class="arrow-down-icon" alt="" />
          </button>
        </div>
      </template>

    </div>

    <!-- ── FAB: Create Quiz ── -->
    <router-link to="/create-quiz" class="fab" aria-label="Create a new quiz">
      <img src="/src/assets/icons/ui/add.svg" class="fab-icon" alt="Create quiz" />
    </router-link>
  </div>
</template>

<script>
import api, { getImageUrl } from '../services/api';

export default {
  name: 'QuizList',

  data() {
    return {
      loading: true,
      error: null,
      quizzes: [],
      currentUserId: null,
      currentUserRole: null,
      openMenuId: null,
      searchQuery: '',
      activeCategory: 'General',
      displayCount: 9,
      categories: [
        { label: '🌐 General',      value: 'General'    },
        { label: '🧪 Science',      value: 'Science'    },
        { label: '➗ Math',         value: 'Math'       },
        { label: '🏛️ History',     value: 'History'    },
        { label: '🗣️ Language',    value: 'Language'   },
        { label: '🍿 Pop Culture',  value: 'Pop Culture'},
        { label: '💻 Tech',         value: 'Tech'       },
        { label: '📚 Teaching',     value: 'Teaching'   },
        { label: '📝 Homework',     value: 'Homework'   },
        { label: '📖 Self Study',   value: 'Self Study' },
        { label: '🌀 Other',        value: 'Other'      },
      ],
    };
  },

  computed: {
    filteredQuizzes() {
      let list = this.quizzes;

      // Category filter — "General" shows all
      if (this.activeCategory !== 'General') {
        list = list.filter(q => q.category === this.activeCategory);
      }

      // Search filter
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(
          quiz =>
            quiz.title.toLowerCase().includes(q) ||
            (quiz.description && quiz.description.toLowerCase().includes(q))
        );
      }

      return list;
    },

    paginatedQuizzes() {
      return this.filteredQuizzes.slice(0, this.displayCount);
    },
  },

  methods: {
    getImageUrl,
    closeMenus() {
      this.openMenuId = null;
    },
    toggleMenu(quizId) {
      this.openMenuId = this.openMenuId === quizId ? null : quizId;
    },
    canEditQuiz(quiz) {
      return this.currentUserId && quiz.creator?.id === this.currentUserId;
    },
    canDeleteQuiz(quiz) {
      return this.canEditQuiz(quiz) || this.currentUserRole === 'admin';
    },
    async loadCurrentUser() {
      try {
        const res = await api.get('/users/me');
        this.currentUserId = res.data.id;
        this.currentUserRole = (res.data.role || '').toLowerCase();
      } catch (err) {
        console.error(err);
      }
    },
    async fetchQuizzes() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/quizzes');
        this.quizzes = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else {
          this.error = 'Failed to load quizzes. Please try again.';
          console.error(err);
        }
      } finally {
        this.loading = false;
      }
    },
    async deleteQuiz(quiz) {
      if (!confirm(`Delete "${quiz.title}"?`)) return;
      try {
        await api.delete(`/quizzes/${quiz.id}`);
        this.openMenuId = null;
        await this.fetchQuizzes();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete quiz.');
      }
    },
    editQuiz(quiz) {
      this.openMenuId = null;
      this.$router.push({ path: '/create-quiz', query: { mode: 'edit', quizId: quiz.id } });
    },
    copyQuiz(quiz) {
      this.openMenuId = null;
      this.$router.push({ path: '/create-quiz', query: { mode: 'copy', copyFrom: quiz.id } });
    },

    setCategory(val) {
      this.activeCategory = val;
      this.displayCount = 9; // reset pagination on filter change
    },

    loadMore() {
      this.displayCount += 9;
    },

    getCreatorName(creator) {
      if (!creator) return 'Unknown';
      return creator.username || creator.email.split('@')[0];
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    estimateTime(questionCount) {
      const mins = Math.max(1, Math.round(questionCount * 0.75));
      return `~${mins}m`;
    },

    getDiffClass(difficulty) {
      const map = { Easy: 'diff-easy', Medium: 'diff-medium', Hard: 'diff-hard' };
      return map[difficulty] || 'diff-easy';
    },

    getCatEmoji(category) {
      const map = {
        General: '🌐', Science: '🧪', Math: '➗', History: '🏛️',
        Language: '🗣️', 'Pop Culture': '🍿', Tech: '💻',
        Teaching: '📚', Homework: '📝', 'Self Study': '📖', Other: '🌀',
      };
      return map[category] || '🌐';
    },

    getCatBadgeStyle(category) {
      const map = {
        Science:      'background: rgba(0,118,87,0.85); color: #77ffcc;',
        Math:         'background: rgba(125,88,0,0.85); color: #ffdea9;',
        History:      'background: rgba(66,49,207,0.3); color: #c4c0ff;',
        Language:     'background: rgba(0,91,66,0.3); color: #54fdc4;',
        'Pop Culture':'background: rgba(94,65,0,0.85); color: #ffdea9;',
        Tech:         'background: rgba(82,68,222,0.85); color: #e3dfff;',
        Teaching:     'background: rgba(66,49,207,0.5); color: #e3dfff;',
        Homework:     'background: rgba(125,88,0,0.5); color: #ffdea9;',
        'Self Study': 'background: rgba(0,91,66,0.5); color: #54fdc4;',
        Other:        'background: rgba(80,80,100,0.7); color: #e2e0fc;',
        General:      'background: rgba(66,49,207,0.2); color: #c4c0ff;',
      };
      return map[category] || map['General'];
    },
  },

  mounted() {
    this.loadCurrentUser().finally(() => this.fetchQuizzes());
    window.addEventListener('click', this.closeMenus);
  },
  beforeUnmount() {
    window.removeEventListener('click', this.closeMenus);
  },
};
</script>

<style scoped>
/* ── Base Layout ── */
.quiz-list-wrapper {
  min-height: 100vh;
  background-color: #fcf8ff;
  color: #1a1a2e;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.bg-decoration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}

.blob-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  left: -150px;
  background: radial-gradient(circle, #c4c0ff, transparent);
}

.blob-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, #54fdc4, transparent);
}

.quiz-list-container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 120px;
}

@media (max-width: 768px) {
  .quiz-list-container {
    padding: 24px 24px 100px;
  }
}

/* ── Page Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}

@media (max-width: 640px) {
  .page-title {
    font-size: 24px;
  }
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #4231cf;
  color: #ffffff;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 9999px;
  box-shadow: 0 4px 0 #2a1e8a;
  transition: all 0.2s;
}

.create-btn:hover {
  background: #5244de;
  transform: translateY(-1px);
  box-shadow: 0 6px 0 #2a1e8a;
}

.create-btn:active {
  transform: translateY(2px);
  box-shadow: none;
}

.btn-icon-sm {
  width: 18px;
  height: 18px;
  filter: invert(1);
}

/* ── Search ── */
.search-section {
  margin-bottom: 24px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(49%) sepia(8%) saturate(699%) hue-rotate(213deg) brightness(94%) contrast(89%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 56px;
  padding: 0 20px 0 48px;
  background: #efecff;
  border: none;
  border-radius: 9999px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #1a1a2e;
  box-shadow: 0 2px 8px rgba(66, 49, 207, 0.08);
  transition: all 0.2s;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #777586;
}

.search-input:focus {
  outline: none;
  background: #e8e5ff;
  box-shadow: 0 0 0 3px rgba(66, 49, 207, 0.2);
}

/* ── Category Tabs ── */
.category-nav {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 32px;
  /* Hide scrollbar but keep scrollable */
  scrollbar-width: none;
}

.category-nav::-webkit-scrollbar {
  display: none;
}

.cat-tab {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  background: #e8e5ff;
  color: #464555;
  transition: all 0.2s;
  white-space: nowrap;
}

.cat-tab:hover {
  background: #d6d2ff;
}

.cat-tab:active {
  transform: scale(0.97);
}

.cat-tab--active {
  background: #4231cf;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(66, 49, 207, 0.3);
}

.cat-tab--active:hover {
  background: #5244de;
}

/* ── State Containers ── */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 12px;
}

.state-text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #464555;
  margin: 0;
}

.state-subtext {
  font-size: 14px;
  color: #777586;
  margin: 0;
}

.empty-icon {
  font-size: 48px;
  margin: 0;
}

.error-text {
  font-size: 16px;
  color: #ba1a1a;
  margin: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(66, 49, 207, 0.15);
  border-left-color: #4231cf;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  padding: 10px 24px;
  background: #4231cf;
  color: white;
  border: none;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #5244de;
}

/* ── Quiz Grid ── */
.quiz-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .quiz-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .quiz-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Quiz Card ── */
.quiz-card {
  background: #ffffff;
  border: 1px solid #e2e0fc;
  border-radius: 24px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.07);
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
}

.quiz-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(66, 49, 207, 0.15);
  border-color: #c4c0ff;
  z-index: 20;
}

/* ── Thumbnail Placeholder ── */
.card-thumbnail {
  height: 160px;
  margin: 10px 10px 0 10px;
  border-radius: 16px;
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
  overflow: hidden;
}

/* Subtle shimmer effect inside placeholder */
.card-thumbnail::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%);
  border-radius: 16px;
  pointer-events: none;
}

.cat-badge {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  z-index: 1;
  white-space: nowrap;
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.diff-badge {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.diff-easy   { background: #d1fae5; color: #065f46; }
.diff-medium { background: #fef3c7; color: #92400e; }
.diff-hard   { background: #fee2e2; color: #991b1b; }

/* ── Card Body ── */
.card-body {
  padding: 20px 20px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-headline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.card-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 10px 0;
  line-height: 1.4;
  /* 2-line clamp */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;
}

.quiz-card:hover .card-title {
  color: #4231cf;
}

.card-creator {
  font-size: 13px;
  color: #777586;
  margin: 0 0 16px 0;
}

.creator-name {
  font-weight: 600;
  color: #464555;
}

/* ── Meta Row ── */
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0eeff;
  border-bottom: 1px solid #f0eeff;
  padding: 10px 0;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #464555;
  flex: 1;
}

.meta-item:not(:last-child) {
  border-right: 1px solid #f0eeff;
}

.meta-icon {
  width: 18px;
  height: 18px;
}

.primary-icon {
  filter: brightness(0) saturate(100%) invert(26%) sepia(77%) saturate(5304%) hue-rotate(242deg) brightness(92%) contrast(92%);
}

.muted-icon {
  filter: brightness(0) saturate(100%) invert(49%) sepia(8%) saturate(699%) hue-rotate(213deg) brightness(94%) contrast(89%);
}

.star-icon-col {
  filter: invert(72%) sepia(51%) saturate(1212%) hue-rotate(352deg) brightness(101%) contrast(106%);
}

/* ── Card Footer ── */
.card-menu-wrap {
  position: relative;
  flex-shrink: 0;
}

.menu-btn {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: #efecff;
  color: #4231cf;
  cursor: pointer;
}

.menu-btn:hover {
  background: #e3dfff;
}

.menu-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 40;
  min-width: 240px;
  background: #ffffff;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(66, 49, 207, 0.12);
  overflow: hidden;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: #1a1a2e;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f2ff;
}

.menu-item.danger {
  color: #ba1a1a;
}

.menu-item.danger:hover {
  background: #ffdad6;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.start-btn {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #4231cf;
  text-decoration: none;
  padding: 8px 20px;
  border-radius: 9999px;
  transition: all 0.2s;
}

.start-btn:hover {
  background: rgba(66, 49, 207, 0.08);
}

/* ── Load More ── */
.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 2px solid rgba(66, 49, 207, 0.25);
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover {
  background: #efecff;
  border-color: #4231cf;
}

.load-more-btn:active {
  transform: scale(0.97);
}

.arrow-down-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(26%) sepia(77%) saturate(5304%) hue-rotate(242deg) brightness(92%) contrast(92%);
  transition: transform 0.2s;
}

.load-more-btn:hover .arrow-down-icon {
  transform: translateY(3px);
}

/* ── FAB ── */
.fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 64px;
  height: 64px;
  background: #4231cf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 0 #2a1e8a, 0 12px 24px rgba(66, 49, 207, 0.4);
  text-decoration: none;
  z-index: 50;
  transition: all 0.2s;
}

.fab:hover {
  background: #5244de;
  transform: translateY(-2px);
}

.fab:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #2a1e8a;
}

.fab-icon {
  width: 32px;
  height: 32px;
  filter: invert(1);
}

@media (max-width: 640px) {
  .fab {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
  .fab-icon {
    width: 26px;
    height: 26px;
  }
}
</style>
