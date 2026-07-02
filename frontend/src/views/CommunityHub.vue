<template>
  <div class="hub-wrapper">

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Loading Community Hub...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container">
      <p class="error-msg">{{ error }}</p>
      <button @click="fetchPosts" class="btn-primary">Retry</button>
    </div>

    <!-- Main Content -->
    <div v-else class="hub-container">

      <!-- Header Section -->
      <div class="hub-header">
        <div class="hub-title-area">
          <h1>Community Hub 🌐</h1>
          <p>Ask questions, share knowledge, and challenge your friends in our vibrant learning ecosystem!</p>
        </div>
        <button class="btn-new-post" @click="$router.push('/forum/create')">
          <img src="/src/assets/icons/ui/add_circle.svg" class="icon-sm icon-white" alt="" />
          New Post
        </button>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-primary">
            <img src="/src/assets/icons/ui/post_add.svg" class="icon-md icon-primary" alt="" />
          </div>
          <div>
            <div class="stat-value stat-primary">{{ posts.length }}</div>
            <div class="stat-label">Total Posts</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-tertiary">
            <img src="/src/assets/icons/ui/groups.svg" class="icon-md icon-tertiary" alt="" />
          </div>
          <div>
            <div class="stat-value stat-tertiary">Active</div>
            <div class="stat-label">Community</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-error">
            <img src="/src/assets/icons/ui/local_fire_department.svg" class="icon-md icon-error" alt="" />
          </div>
          <div>
            <div class="stat-value stat-error">{{ hotPosts }}</div>
            <div class="stat-label">Hot Discussions</div>
          </div>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="tab-btn"
          :class="{ active: selectedCategory === cat.value }"
          @click="selectCategory(cat.value)"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Main Layout -->
      <div class="main-layout">

        <!-- Post List -->
        <div class="posts-col">

          <!-- Empty State -->
          <div v-if="filteredPosts.length === 0" class="empty-state-card">
            <img src="/src/assets/icons/ui/post_add.svg" class="icon-lg icon-muted" alt="" />
            <p>No posts yet in this category. Be the first to start a discussion!</p>
            <button class="btn-primary" @click="$router.push('/forum/create')">Create a Post</button>
          </div>

          <!-- Post Cards -->
          <div
            v-for="post in filteredPosts"
            :key="post.id"
            class="post-card"
            @click="$router.push(`/forum/post/${post.id}`)"
          >
            <!-- Upvote Column -->
            <div class="vote-col">
              <button class="vote-btn" @click.stop="toggleUpvote(post)">
                <img src="/src/assets/icons/navigation/arrow_upward.svg" class="icon-sm icon-muted" alt="upvote" />
              </button>
              <span class="vote-count">{{ post.upvotes }}</span>
            </div>

            <!-- Post Content -->
            <div class="post-body">
              <div class="post-meta-top">
                <span class="post-category-badge" v-if="post.category">{{ getCategoryEmoji(post.category) }} {{ post.category }}</span>
                <div class="post-tags">
                  <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag-chip">#{{ tag }}</span>
                </div>
              </div>
              <h4 class="post-title">{{ post.title }}</h4>
              <span v-if="post.moderationStatus && post.moderationStatus !== 'APPROVED'" class="post-status-badge" :class="post.moderationStatus.toLowerCase()">
                {{ post.moderationStatus }} Review
              </span>
              <p class="post-excerpt">{{ post.content }}</p>
              <div v-if="post.image" class="post-image-indicator" style="margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                <span class="material-symbols-outlined" style="font-size: 16px; color: #4231cf;">image</span> <span style="font-size: 12px; font-weight: 600; color: #4231cf;">Attachment</span>
              </div>
              <div class="post-footer">
                <div class="post-author">
                  <div class="author-avatar-small">{{ (post.author.username || 'U').charAt(0).toUpperCase() }}</div>
                  <span class="author-name">{{ post.author.username }}</span>
                  <span class="author-level">LEVEL {{ post.author.level || 1 }}</span>
                  <span class="post-time">• {{ formatTime(post.createdAt) }}</span>
                </div>
                <div class="post-stats">
                  <div class="post-stat">
                    <img src="/src/assets/icons/ui/chat_bubble.svg" class="icon-xs icon-muted" alt="" />
                    <span>{{ post._count?.comments || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Sidebar -->
        <aside class="sidebar">

          <!-- Trending Topics -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">
              <img src="/src/assets/icons/ui/trending_up.svg" class="icon-sm icon-primary" alt="" />
              Trending Topics
            </h3>
            <div class="tag-cloud">
              <a
                v-for="tag in trendingTags"
                :key="tag"
                class="tag-cloud-item"
                href="#"
                @click.prevent="searchTag(tag)"
              >#{{ tag }}</a>
            </div>
          </div>

          <!-- Community Guidelines Quick Links -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">
              <img src="/src/assets/icons/ui/link.svg" class="icon-sm icon-muted" alt="" />
              Quick Links
            </h3>
            <ul class="quick-links">
              <li>
                <img src="/src/assets/icons/navigation/chevron_right.svg" class="icon-xs icon-muted" alt="" />
                <a href="#">Community Guidelines</a>
              </li>
              <li>
                <img src="/src/assets/icons/navigation/chevron_right.svg" class="icon-xs icon-muted" alt="" />
                <a href="#">Report an Issue</a>
              </li>
            </ul>
          </div>

        </aside>

      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'CommunityHub',
  data() {
    return {
      loading: true,
      error: null,
      posts: [],
      selectedCategory: 'All',
      categories: [
        { label: 'All', value: 'All' },
        { label: '💬 General', value: 'General' },
        { label: '🧠 Quiz Help', value: 'Quiz Help' },
        { label: '🏆 Challenges', value: 'Challenges' },
        { label: '💡 Tips & Tricks', value: 'Tips & Tricks' },
        { label: '📢 Announcements', value: 'Announcements' },
      ],
    };
  },
  computed: {
    filteredPosts() {
      if (this.selectedCategory === 'All') return this.posts;
      return this.posts.filter(p => p.category === this.selectedCategory);
    },
    hotPosts() {
      return this.posts.filter(p => p.upvotes >= 5).length;
    },
    trendingTags() {
      const tagMap = {};
      this.posts.forEach(p => {
        (p.tags || []).forEach(t => {
          tagMap[t] = (tagMap[t] || 0) + 1;
        });
      });
      return Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([tag]) => tag);
    },
  },
  methods: {
    async fetchPosts() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/posts');
        this.posts = res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else {
          this.error = 'Failed to load posts. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },
    async toggleUpvote(post) {
      try {
        const res = await api.post(`/posts/${post.id}/upvote`);
        if (res.data.liked) {
          post.upvotes += 1;
        } else {
          post.upvotes -= 1;
        }
      } catch (err) {
        console.error('Failed to upvote', err);
      }
    },
    selectCategory(cat) {
      this.selectedCategory = cat;
    },
    searchTag(tag) {
      this.selectedCategory = 'All';
      // Future: filter by tag
    },
    getCategoryEmoji(category) {
      const map = {
        'General': '💬',
        'Quiz Help': '🧠',
        'Challenges': '🏆',
        'Tips & Tricks': '💡',
        'Announcements': '📢',
      };
      return map[category] || '📝';
    },
    formatTime(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return date.toLocaleDateString();
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
.hub-wrapper {
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

.error-msg {
  color: #ba1a1a;
  margin-bottom: 1rem;
}

.hub-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.hub-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hub-title-area h1 {
  margin: 0 0 0.5rem;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #4231cf;
}

.hub-title-area p {
  margin: 0;
  font-size: 16px;
  color: #464555;
  max-width: 560px;
}

.btn-new-post {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffb702;
  color: #5e4100;
  border: none;
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 183, 2, 0.3);
  transition: all 0.2s ease;
}

.btn-new-post:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 183, 2, 0.4);
}

.btn-new-post:active {
  transform: translateY(0px);
}

.btn-primary {
  background: #4231cf;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #3824c7;
}

/* Stats */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.08);
  border: 1px solid rgba(200, 196, 216, 0.3);
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-primary { background: rgba(91, 79, 232, 0.1); }
.stat-icon-tertiary { background: rgba(0, 118, 87, 0.1); }
.stat-icon-error { background: rgba(186, 26, 26, 0.1); }

.stat-value {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.stat-primary { color: #4231cf; }
.stat-tertiary { color: #005b42; }
.stat-error { color: #ba1a1a; }

.stat-label {
  font-size: 12px;
  color: #464555;
  font-weight: 500;
}

/* Category Tabs */
.category-tabs {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 4px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  white-space: nowrap;
  padding: 8px 20px;
  border-radius: 9999px;
  border: 1px solid rgba(200, 196, 216, 0.5);
  background: white;
  color: #464555;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #efecff;
  border-color: #c4c0ff;
}

.tab-btn.active {
  background: #4231cf;
  color: white;
  border-color: #4231cf;
  box-shadow: 0 4px 12px rgba(66, 49, 207, 0.25);
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  align-items: start;
}

/* Posts Column */
.posts-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state-card {
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.08);
  border: 1px solid rgba(200, 196, 216, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #777586;
}

.post-card {
  background: white;
  border: 1px solid rgba(200, 196, 216, 0.3);
  border-radius: 16px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(91, 79, 232, 0.14);
  border-color: rgba(91, 79, 232, 0.2);
}

/* Vote column */
.vote-col {
  width: 64px;
  background: #efecff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  gap: 6px;
  border-right: 1px solid rgba(200, 196, 216, 0.3);
  flex-shrink: 0;
}

.vote-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.vote-btn:hover {
  background: rgba(66, 49, 207, 0.1);
}

.vote-count {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #4231cf;
}

/* Post Body */
.post-body {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.post-meta-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-category-badge {
  font-size: 12px;
  font-weight: 600;
  color: #005b42;
  background: rgba(0, 118, 87, 0.1);
  padding: 2px 10px;
  border-radius: 6px;
}

.post-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag-chip {
  font-size: 11px;
  font-weight: 600;
  color: #4231cf;
  background: rgba(66, 49, 207, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
}

.post-title {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  transition: color 0.2s;
  /* Clamp to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-status-badge {
  display: inline-flex;
  align-items: center;
  margin: 6px 0 0;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0;
}

.post-status-badge.pending {
  background: #fff1c7;
  color: #6b4b00;
}

.post-status-badge.rejected {
  background: #ffdad6;
  color: #ba1a1a;
}

.post-card:hover .post-title {
  color: #4231cf;
}

.post-excerpt {
  margin: 0;
  font-size: 14px;
  color: #464555;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 6px;
}

.author-avatar-small {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e2e0fc;
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.author-level {
  font-size: 10px;
  font-weight: 700;
  color: #4231cf;
  background: rgba(66, 49, 207, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.post-time {
  font-size: 12px;
  color: #777586;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.post-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #777586;
  font-weight: 500;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.08);
  border: 1px solid rgba(200, 196, 216, 0.3);
}

.sidebar-title {
  margin: 0 0 1rem;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-cloud-item {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 8px;
  background: #efecff;
  color: #464555;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.tag-cloud-item:hover {
  background: rgba(66, 49, 207, 0.15);
  color: #4231cf;
}

.quick-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-links li {
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-links a {
  color: #464555;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.quick-links a:hover {
  color: #4231cf;
}

/* Icon Utilities */
.icon-xs { width: 14px; height: 14px; }
.icon-sm { width: 18px; height: 18px; }
.icon-md { width: 24px; height: 24px; }
.icon-lg { width: 40px; height: 40px; }

.icon-primary { filter: brightness(0) saturate(100%) invert(18%) sepia(87%) saturate(1800%) hue-rotate(240deg) brightness(85%) contrast(95%); }
.icon-tertiary { filter: brightness(0) saturate(100%) invert(22%) sepia(100%) saturate(600%) hue-rotate(130deg) brightness(80%) contrast(100%); }
.icon-error { filter: brightness(0) saturate(100%) invert(18%) sepia(90%) saturate(2000%) hue-rotate(340deg) brightness(85%) contrast(100%); }
.icon-muted { filter: brightness(0) saturate(100%) invert(43%) sepia(10%) saturate(800%) hue-rotate(210deg) brightness(95%) contrast(90%); }
.icon-white { filter: brightness(0) invert(1); }

/* Responsive */
@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}

@media (max-width: 600px) {
  .hub-wrapper {
    padding: 1.5rem 1rem;
  }

  .stats-bar {
    grid-template-columns: 1fr;
  }

  .hub-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
