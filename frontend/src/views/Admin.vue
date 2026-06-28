<template>
  <div class="admin-page">
    <section class="hero-band">
      <div class="hero-copy">
        <p class="eyebrow">Moderator Console</p>
        <h1>Admin</h1>
        <p class="hero-text">
          Review quizzes, posts, and comments from one place. Public quizzes stay open to everyone, while private ones stay with their creator.
        </p>
      </div>

      <button class="refresh-btn" type="button" @click="fetchAdminContent" :disabled="loading">
        <span class="material-symbols-outlined">refresh</span>
        Refresh
      </button>
    </section>

    <section class="stats-grid" aria-label="Content summary">
      <article class="stat-card">
        <span class="stat-label">Quizzes</span>
        <strong class="stat-value">{{ quizzes.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Posts</span>
        <strong class="stat-value">{{ posts.length }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Comments</span>
        <strong class="stat-value">{{ comments.length }}</strong>
      </article>
    </section>

    <section class="control-bar">
      <div class="tab-switcher" role="tablist" aria-label="Admin content tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <p class="control-note">{{ activeTabLabel }} ready for review</p>
    </section>

    <section v-if="loading" class="state-panel">
      <div class="spinner"></div>
      <p>Loading moderation data...</p>
    </section>

    <section v-else-if="error" class="state-panel">
      <p class="error-text">{{ error }}</p>
      <button class="retry-btn" type="button" @click="fetchAdminContent">Retry</button>
    </section>

    <section v-else class="content-section">
      <template v-if="activeTab === 'quizzes'">
        <article v-for="quiz in quizzes" :key="quiz.id" class="item-card">
          <div class="item-media" :style="quiz.thumbnail ? { backgroundImage: `url(${getImageUrl(quiz.thumbnail)})` } : {}">
            <div class="media-fallback" v-if="!quiz.thumbnail">
              <span class="material-symbols-outlined">quiz</span>
            </div>
          </div>

          <div class="item-body">
            <div class="item-topline">
              <div>
                <p class="item-title">{{ quiz.title }}</p>
                <p class="item-meta">
                  by {{ getAuthorLabel(quiz.creator) }} · {{ quiz._count.questions }} questions
                </p>
              </div>
              <span class="status-pill" :class="quiz.isPublished ? 'public' : 'private'">
                {{ quiz.isPublished ? 'Public' : 'Private' }}
              </span>
            </div>

            <p class="item-description">{{ quiz.description || 'No description provided.' }}</p>

            <div class="item-footer">
              <div class="tag-row">
                <span class="tag">{{ quiz.category || 'General' }}</span>
                <span class="tag">{{ quiz.difficulty || 'Easy' }}</span>
              </div>
              <button class="danger-btn" type="button" @click="deleteItem('quiz', quiz.id)">
                <span class="material-symbols-outlined">delete</span>
                Delete
              </button>
            </div>
          </div>
        </article>
      </template>

      <template v-else-if="activeTab === 'posts'">
        <article v-for="post in posts" :key="post.id" class="item-card">
          <div class="item-media" :style="post.image ? { backgroundImage: `url(${getImageUrl(post.image)})` } : {}">
            <div class="media-fallback" v-if="!post.image">
              <span class="material-symbols-outlined">article</span>
            </div>
          </div>

          <div class="item-body">
            <div class="item-topline">
              <div>
                <p class="item-title">{{ post.title }}</p>
                <p class="item-meta">
                  by {{ getAuthorLabel(post.author) }} · {{ post._count.comments }} comments · {{ post.upvotes }} upvotes
                </p>
              </div>
              <span class="status-pill soft">Forum</span>
            </div>

            <p class="item-description">{{ post.content }}</p>

            <div class="item-footer">
              <div class="tag-row">
                <span class="tag">{{ post.category || 'General' }}</span>
                <span v-for="tag in (post.tags || []).slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <button class="danger-btn" type="button" @click="deleteItem('post', post.id)">
                <span class="material-symbols-outlined">delete</span>
                Delete
              </button>
            </div>
          </div>
        </article>
      </template>

      <template v-else>
        <article v-for="comment in comments" :key="comment.id" class="item-card comment-card">
          <div class="comment-marker">
            <span class="material-symbols-outlined">comment</span>
          </div>

          <div class="item-body">
            <div class="item-topline">
              <div>
                <p class="item-title">{{ getAuthorLabel(comment.author) }}</p>
                <p class="item-meta">On {{ comment.post?.title || 'Unknown post' }} · {{ comment.upvotes }} upvotes</p>
              </div>
              <span class="status-pill soft">Comment</span>
            </div>

            <p class="item-description">{{ comment.content }}</p>

            <div v-if="comment.image" class="inline-preview">
              <img :src="getImageUrl(comment.image)" alt="Comment image" />
            </div>

            <div class="item-footer">
              <div class="tag-row">
                <span class="tag">Post #{{ comment.post?.id || 'N/A' }}</span>
              </div>
              <button class="danger-btn" type="button" @click="deleteItem('comment', comment.id)">
                <span class="material-symbols-outlined">delete</span>
                Delete
              </button>
            </div>
          </div>
        </article>
      </template>

      <div v-if="currentList.length === 0" class="empty-state">
        Nothing to review in this section right now.
      </div>
    </section>
  </div>
</template>

<script>
import api, { getImageUrl } from "../services/api";

export default {
  name: "Admin",
  data() {
    return {
      loading: true,
      error: null,
      activeTab: "quizzes",
      quizzes: [],
      posts: [],
      comments: [],
      tabs: [
        { key: "quizzes", label: "Quizzes" },
        { key: "posts", label: "Posts" },
        { key: "comments", label: "Comments" },
      ],
    };
  },
  computed: {
    currentList() {
      if (this.activeTab === "quizzes") return this.quizzes;
      if (this.activeTab === "posts") return this.posts;
      return this.comments;
    },
    activeTabLabel() {
      const tab = this.tabs.find((item) => item.key === this.activeTab);
      return tab ? tab.label : "Content";
    },
  },
  methods: {
    getImageUrl,
    getAuthorLabel(author) {
      if (!author) return "Unknown";
      return author.username || author.email?.split("@")[0] || "Unknown";
    },
    async fetchAdminContent() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/admin/content");
        this.quizzes = Array.isArray(response.data?.quizzes) ? response.data.quizzes : [];
        this.posts = Array.isArray(response.data?.posts) ? response.data.posts : [];
        this.comments = Array.isArray(response.data?.comments) ? response.data.comments : [];
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          this.$router.push("/login");
          return;
        }

        if (err.response?.status === 403) {
          this.$router.push("/dashboard");
          return;
        }

        this.error = "Failed to load moderation data.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(type, id) {
      const labels = {
        quiz: "quiz",
        post: "post",
        comment: "comment",
      };

      if (!window.confirm(`Delete this ${labels[type]}? This cannot be undone.`)) {
        return;
      }

      try {
        const routes = {
          quiz: `/quizzes/${id}`,
          post: `/posts/${id}`,
          comment: `/comments/${id}`,
        };

        await api.delete(routes[type]);
        await this.fetchAdminContent();
      } catch (err) {
        alert(err.response?.data?.message || `Failed to delete ${labels[type]}`);
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchAdminContent();
  },
};
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 32px 32px 120px;
  background: #fcf8ff;
  color: #1a1a2e;
  font-family: "Inter", sans-serif;
}

.hero-band,
.stats-grid,
.control-bar,
.content-section,
.state-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-band {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0 18px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #4231cf;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.hero-copy h1 {
  margin: 0;
  font-family: "Nunito Sans", sans-serif;
  font-size: 34px;
  line-height: 1.1;
  font-weight: 900;
}

.hero-text {
  max-width: 760px;
  margin: 10px 0 0;
  color: #464555;
  line-height: 1.55;
}

.refresh-btn,
.retry-btn,
.danger-btn,
.tab-btn {
  font-family: "Nunito Sans", sans-serif;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  background: #ffffff;
  color: #4231cf;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(66, 49, 207, 0.06);
}

.refresh-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 8px 22px rgba(66, 49, 207, 0.06);
}

.stat-label {
  display: block;
  color: #777586;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.stat-value {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  color: #1a1a2e;
}

.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-bottom: 12px;
}

.tab-switcher {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tab-btn {
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  background: #ffffff;
  color: #464555;
  font-weight: 800;
  cursor: pointer;
}

.tab-btn.active {
  background: #4231cf;
  color: #ffffff;
  border-color: #4231cf;
}

.control-note {
  margin: 0;
  color: #777586;
  font-size: 14px;
  font-weight: 600;
}

.content-section {
  display: grid;
  gap: 16px;
}

.item-card {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 18px;
  background: #ffffff;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  padding: 14px;
  box-shadow: 0 8px 22px rgba(66, 49, 207, 0.06);
}

.item-media {
  min-height: 140px;
  border-radius: 8px;
  background: #efecff;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-fallback,
.comment-marker {
  display: grid;
  place-items: center;
  color: #4231cf;
  background: #e8e5ff;
}

.media-fallback {
  width: 100%;
  height: 100%;
  font-size: 34px;
}

.item-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.item-title {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  line-height: 1.3;
}

.item-meta {
  margin: 6px 0 0;
  color: #777586;
  font-size: 13px;
}

.item-description {
  margin: 0;
  color: #464555;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag,
.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 800;
}

.tag {
  background: #efecff;
  color: #4231cf;
}

.status-pill {
  background: #e8e5ff;
  color: #4231cf;
}

.status-pill.private {
  background: #fce8e6;
  color: #ba1a1a;
}

.status-pill.soft {
  background: #f5f2ff;
  color: #464555;
}

.danger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #f3b8b0;
  border-radius: 8px;
  background: #fff4f3;
  color: #ba1a1a;
  font-weight: 800;
  cursor: pointer;
}

.danger-btn:hover {
  background: #ffd9d4;
}

.comment-card {
  grid-template-columns: 60px minmax(0, 1fr);
}

.comment-marker {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  font-size: 28px;
  align-self: start;
}

.inline-preview {
  max-width: 320px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e0fc;
}

.inline-preview img {
  display: block;
  width: 100%;
  height: auto;
}

.state-panel {
  padding: 72px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid rgba(66, 49, 207, 0.14);
  border-left-color: #4231cf;
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
  min-height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: #4231cf;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.empty-state {
  padding: 28px;
  border-radius: 8px;
  border: 1px dashed #c4c0ff;
  background: rgba(228, 224, 252, 0.4);
  color: #464555;
  text-align: center;
}

@media (max-width: 900px) {
  .admin-page {
    padding: 24px 16px 96px;
  }

  .hero-band,
  .control-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid,
  .item-card {
    grid-template-columns: 1fr;
  }

  .item-media {
    min-height: 180px;
  }
}
</style>
