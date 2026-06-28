<template>
  <div class="discussion-wrapper">

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Loading Discussion...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container">
      <p class="error-msg">{{ error }}</p>
      <button @click="$router.push('/forum')" class="btn-secondary">Back to Community</button>
    </div>

    <!-- Main Content -->
    <div v-else-if="post" class="discussion-container">

      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-link" @click="$router.push('/forum')">Community</span>
        <img src="/src/assets/icons/navigation/chevron_right.svg" class="icon-xs icon-muted" alt="" />
        <span class="breadcrumb-link" v-if="post.category" @click="$router.push('/forum')">{{ post.category }}</span>
        <img src="/src/assets/icons/navigation/chevron_right.svg" class="icon-xs icon-muted" v-if="post.category" alt="" />
        <span class="breadcrumb-current">{{ post.title }}</span>
      </nav>

      <!-- Original Post -->
      <article class="post-article">
        <div class="post-article-header">
          <div class="post-author-info">
            <div class="author-avatar">
              {{ (post.author.username || 'U').charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="author-name">{{ post.author.username }}</div>
              <span class="author-level-badge">Level {{ post.author.level || 1 }} • {{ post.author.title || 'Member' }}</span>
            </div>
          </div>
          <time class="post-time">{{ formatTime(post.createdAt) }}</time>
        </div>

        <!-- Category + Tags -->
        <div class="post-meta-row" v-if="post.category || post.tags?.length">
          <span class="category-badge" v-if="post.category">{{ getCategoryEmoji(post.category) }} {{ post.category }}</span>
          <span v-for="tag in post.tags" :key="tag" class="tag-chip">#{{ tag }}</span>
        </div>

        <h1 class="post-article-title">{{ post.title }}</h1>

        <div class="post-article-content">
          <p>{{ post.content }}</p>
          <div v-if="post.image" class="post-image-container" style="margin-top: 1rem;">
            <img :src="getImageUrl(post.image)" alt="Post Attachment" style="max-width: 100%; max-height: 400px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
          </div>
        </div>

        <!-- Post Actions -->
        <div class="post-actions">
          <button
            class="action-btn action-primary"
            :class="{ liked: hasUpvoted }"
            @click="toggleUpvote"
          >
            <img src="/src/assets/icons/navigation/arrow_upward.svg" class="icon-sm" alt="" />
            {{ post.upvotes }} Upvotes
          </button>
          <button class="action-btn">
            <img src="/src/assets/icons/ui/chat_bubble.svg" class="icon-sm icon-muted" alt="" />
            {{ post.comments?.length || 0 }} Replies
          </button>
          <button class="action-btn action-right">
            <img src="/src/assets/icons/ui/bookmark.svg" class="icon-sm icon-muted" alt="" />
            <span class="action-label">Save</span>
          </button>
          <button class="action-btn action-danger" v-if="canDelete" @click="deletePost">
            <img src="/src/assets/icons/ui/flag.svg" class="icon-sm" alt="" />
          </button>
        </div>
      </article>

      <!-- Reply Composer -->
      <section class="reply-composer">
        <h2 class="section-title">Post a Reply</h2>
        <div class="composer-card" :class="{ focused: composerFocused }">
          <textarea
            v-model="newComment"
            class="composer-textarea"
            placeholder="Write your helpful reply here..."
            rows="4"
            @focus="composerFocused = true"
            @blur="composerFocused = false"
          ></textarea>
          <div class="composer-footer">
            <div class="composer-tools">
              <button class="tool-btn" title="Bold">
                <img src="/src/assets/icons/ui/format_bold.svg" class="icon-sm icon-muted" alt="Bold" />
              </button>
              <button class="tool-btn" title="Italic">
                <img src="/src/assets/icons/ui/format_italic.svg" class="icon-sm icon-muted" alt="Italic" />
              </button>
              <button class="tool-btn" title="List">
                <img src="/src/assets/icons/ui/format_list_bulleted.svg" class="icon-sm icon-muted" alt="List" />
              </button>
              <button class="tool-btn" type="button" title="Attach Image" @click="$refs.commentImageInput.click()">
                <span class="material-symbols-outlined icon-muted" style="font-size: 18px;">image</span>
              </button>
            </div>
            
            <!-- Image Upload UI inside composer-card -->
            <input ref="commentImageInput" type="file" accept="image/*" @change="handleImageUpload" style="display: none;" />
            <div v-if="commentImage" class="post-image-preview" style="padding: 10px; border-top: 1px solid rgba(200, 196, 216, 0.3); position: relative; background: #fafafa;">
              <img :src="getImageUrl(commentImage)" alt="Attached Image" style="max-height: 150px; border-radius: 8px;" />
              <button type="button" @click="commentImage = null" style="position: absolute; top: 15px; left: 15px; background: #ba1a1a; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
            </div>
            <p v-if="uploadingImage" style="padding: 10px; color: #4231cf; font-weight: bold; font-size: 14px; margin: 0; background: #fafafa;">Uploading image...</p>
            
            <button
              class="btn-post-reply"
              :disabled="!newComment.trim() || submittingComment"
              @click="postComment"
            >
              {{ submittingComment ? 'Posting...' : 'Post Reply' }}
            </button>
          </div>
        </div>
        <p v-if="commentError" class="error-msg">{{ commentError }}</p>
      </section>

      <!-- Replies Section -->
      <section class="replies-section" v-if="post.comments && post.comments.length > 0">
        <h2 class="section-title">{{ post.comments.length }} {{ post.comments.length === 1 ? 'Reply' : 'Replies' }}</h2>

        <div class="comment-list">
          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="comment-card"
          >
            <div class="comment-header">
              <div class="comment-author-info">
                <div class="comment-avatar">
                  {{ (comment.author.username || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="comment-author-name">{{ comment.author.username }}</div>
                  <span class="comment-author-level">Level {{ comment.author.level || 1 }}</span>
                </div>
              </div>
              <time class="post-time">{{ formatTime(comment.createdAt) }}</time>
            </div>

            <p class="comment-content">{{ comment.content }}</p>
            <div v-if="comment.image" class="comment-image-container" style="margin-top: 10px; margin-bottom: 12px;">
              <img :src="getImageUrl(comment.image)" alt="Reply Attachment" style="max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" />
            </div>

            <div class="comment-actions">
              <button class="comment-action-btn" @click="toggleCommentUpvote(comment)">
                <img src="/src/assets/icons/ui/thumb_up.svg" class="icon-xs icon-muted" alt="" />
                {{ comment.upvotes }}
              </button>
              <button class="comment-action-btn" v-if="canDeleteComment(comment)" @click="deleteComment(comment)">
                <img src="/src/assets/icons/ui/flag.svg" class="icon-xs icon-muted" alt="" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- No Replies Yet -->
      <section class="replies-empty" v-else-if="!loading">
        <p>No replies yet. Be the first to help!</p>
      </section>

    </div>
  </div>
</template>

<script>
import api, { getImageUrl, uploadImage } from '../services/api';

export default {
  name: 'Discussion',
  data() {
    return {
      loading: true,
      error: null,
      post: null,
      hasUpvoted: false,
      newComment: '',
      commentImage: null,
      uploadingImage: false,
      composerFocused: false,
      submittingComment: false,
      commentError: null,
      currentUserId: null,
      currentUserRole: null,
    };
  },
  computed: {
    canDelete() {
      if (!this.post || !this.currentUserId) return false;
      return this.post.author.id === this.currentUserId || this.currentUserRole === 'admin';
    },
  },
  methods: {
    getImageUrl,
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.uploadingImage = true;
      try {
        const data = await uploadImage(file, 'forum-comment');
        this.commentImage = data.url;
      } catch (err) {
        alert(err.response?.data?.message || "Failed to upload image.");
      } finally {
        this.uploadingImage = false;
        event.target.value = null;
      }
    },
    async fetchPost() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/posts/${this.$route.params.id}`);
        this.post = res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else if (err.response?.status === 404) {
          this.error = 'Post not found.';
        } else {
          this.error = 'Failed to load discussion. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchCurrentUser() {
      try {
        const res = await api.get('/users/me');
        this.currentUserId = res.data.id;
        this.currentUserRole = (res.data.role || '').toLowerCase();
      } catch (err) {
        // Not critical
      }
    },
    async toggleUpvote() {
      try {
        const res = await api.post(`/posts/${this.post.id}/upvote`);
        if (res.data.liked) {
          this.post.upvotes += 1;
          this.hasUpvoted = true;
        } else {
          this.post.upvotes -= 1;
          this.hasUpvoted = false;
        }
      } catch (err) {
        console.error('Failed to upvote', err);
      }
    },
    async postComment() {
      if (!this.newComment.trim()) return;
      this.submittingComment = true;
      this.commentError = null;
      try {
        const res = await api.post(`/comments/post/${this.post.id}`, {
          content: this.newComment.trim(),
          image: this.commentImage,
        });
        this.post.comments.push(res.data);
        this.newComment = '';
        this.commentImage = null;
      } catch (err) {
        this.commentError = err.response?.data?.message || 'Failed to post reply.';
      } finally {
        this.submittingComment = false;
      }
    },
    async toggleCommentUpvote(comment) {
      try {
        const res = await api.post(`/comments/${comment.id}/upvote`);
        if (res.data.liked) {
          comment.upvotes += 1;
        } else {
          comment.upvotes -= 1;
        }
      } catch (err) {
        console.error('Failed to upvote comment', err);
      }
    },
    async deletePost() {
      if (!confirm('Are you sure you want to delete this post?')) return;
      try {
        await api.delete(`/posts/${this.post.id}`);
        this.$router.push('/forum');
      } catch (err) {
        alert('Failed to delete post.');
      }
    },
    async deleteComment(comment) {
      if (!confirm('Delete this comment?')) return;
      try {
        await api.delete(`/comments/${comment.id}`);
        this.post.comments = this.post.comments.filter(c => c.id !== comment.id);
      } catch (err) {
        alert('Failed to delete comment.');
      }
    },
    canDeleteComment(comment) {
      return this.currentUserId && (comment.author.id === this.currentUserId || this.currentUserRole === 'admin');
    },
    getCategoryEmoji(category) {
      const map = {
        'General': '💬', 'Quiz Help': '🧠', 'Challenges': '🏆',
        'Tips & Tricks': '💡', 'Announcements': '📢',
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
    this.fetchPost();
    this.fetchCurrentUser();
  },
};
</script>

<style scoped>
.discussion-wrapper {
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

.error-msg { color: #ba1a1a; margin-bottom: 1rem; }

.discussion-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #777586;
  flex-wrap: wrap;
}

.breadcrumb-link {
  cursor: pointer;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #4231cf;
}

.breadcrumb-current {
  color: #4231cf;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* Original Post */
.post-article {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.08);
  border: 1px solid rgba(200, 196, 216, 0.3);
  position: relative;
  overflow: hidden;
}

.post-article::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #ffb702, #4231cf);
  border-radius: 4px 0 0 4px;
}

.post-article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  gap: 1rem;
}

.post-author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b4fe8, #4231cf);
  color: white;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(91, 79, 232, 0.2);
}

.author-name {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.author-level-badge {
  font-size: 12px;
  font-weight: 700;
  color: #5e4100;
  background: #ffb702;
  padding: 2px 8px;
  border-radius: 9999px;
  display: inline-block;
  margin-top: 3px;
}

.post-time {
  font-size: 12px;
  color: #777586;
  white-space: nowrap;
}

.post-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.category-badge {
  font-size: 13px;
  font-weight: 600;
  color: #4231cf;
  background: rgba(66, 49, 207, 0.08);
  padding: 3px 12px;
  border-radius: 8px;
}

.tag-chip {
  font-size: 12px;
  font-weight: 600;
  color: #464555;
  background: #efecff;
  padding: 3px 8px;
  border-radius: 4px;
}

.post-article-title {
  margin: 0 0 1.25rem;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 26px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.3;
}

.post-article-content {
  font-size: 16px;
  line-height: 1.7;
  color: #464555;
  margin-bottom: 1.5rem;
  border-top: 1px solid rgba(200, 196, 216, 0.3);
  padding-top: 1.25rem;
}

.post-article-content p { margin: 0; }

/* Post Actions */
.post-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(200, 196, 216, 0.3);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 9999px;
  border: none;
  background: #efecff;
  color: #464555;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover { background: #e2e0fc; }

.action-primary {
  background: #e8e5ff;
  color: #4231cf;
}

.action-primary img {
  filter: brightness(0) saturate(100%) invert(18%) sepia(87%) saturate(1800%) hue-rotate(240deg) brightness(85%) contrast(95%);
}

.action-primary.liked {
  background: #4231cf;
  color: white;
}

.action-primary.liked img {
  filter: brightness(0) invert(1);
}

.action-right { margin-left: auto; }

.action-danger { color: #ba1a1a; }

.action-danger img {
  filter: brightness(0) saturate(100%) invert(18%) sepia(90%) saturate(2000%) hue-rotate(340deg) brightness(85%) contrast(100%);
}

.action-label { display: inline; }

/* Reply Composer */
.reply-composer { }

.section-title {
  margin: 0 0 1rem;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.composer-card {
  background: white;
  border-radius: 16px;
  border: 1px solid rgba(200, 196, 216, 0.5);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.06);
  transition: box-shadow 0.2s;
}

.composer-card.focused {
  box-shadow: 0 0 0 3px rgba(66, 49, 207, 0.2);
  border-color: rgba(66, 49, 207, 0.4);
}

.composer-textarea {
  width: 100%;
  border: none;
  padding: 1rem 1.25rem;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #1a1a2e;
  resize: none;
  background: transparent;
  outline: none;
  box-sizing: border-box;
}

.composer-textarea::placeholder { color: #777586; }

.composer-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(200, 196, 216, 0.3);
  background: #fafafa;
}

.composer-tools {
  display: flex;
  gap: 4px;
}

.tool-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.tool-btn:hover { background: #efecff; }

.btn-post-reply {
  background: #ffb702;
  color: #5e4100;
  border: none;
  padding: 8px 24px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(255, 183, 2, 0.25);
}

.btn-post-reply:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(255, 183, 2, 0.35);
}

.btn-post-reply:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Replies */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(91, 79, 232, 0.06);
  border: 1px solid rgba(200, 196, 216, 0.3);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.comment-author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #efecff, #e2e0fc);
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-author-name {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}

.comment-author-level {
  font-size: 11px;
  font-weight: 700;
  color: #5e4100;
  background: rgba(255, 183, 2, 0.25);
  padding: 2px 6px;
  border-radius: 4px;
}

.comment-content {
  margin: 0 0 1rem;
  font-size: 15px;
  line-height: 1.65;
  color: #464555;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: #777586;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s;
}

.comment-action-btn:hover {
  background: #efecff;
  color: #4231cf;
}

.comment-action-btn:hover img {
  filter: brightness(0) saturate(100%) invert(18%) sepia(87%) saturate(1800%) hue-rotate(240deg) brightness(85%) contrast(95%);
}

.replies-empty {
  text-align: center;
  color: #777586;
  font-style: italic;
  padding: 1rem;
}

/* Secondary button */
.btn-secondary {
  background: white;
  color: #4231cf;
  border: 2px solid #4231cf;
  padding: 10px 24px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #efecff;
}

/* Icon Utilities */
.icon-xs { width: 14px; height: 14px; }
.icon-sm { width: 18px; height: 18px; }

.icon-muted {
  filter: brightness(0) saturate(100%) invert(43%) sepia(10%) saturate(800%) hue-rotate(210deg) brightness(95%) contrast(90%);
}

@media (max-width: 600px) {
  .discussion-wrapper { padding: 1.5rem 1rem; }
  .post-article { padding: 1.5rem 1.25rem; }
  .post-article-title { font-size: 20px; }
  .action-label { display: none; }
}
</style>
