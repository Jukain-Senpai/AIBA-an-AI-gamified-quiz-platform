<template>
  <div class="comment-thread" :style="{ marginLeft: `${depth * 24}px` }">
    <div class="comment-card">
      <div class="comment-header">
        <div class="comment-author-info">
          <div class="comment-avatar">
            <img
              v-if="comment.author?.avatar"
              :src="getImageUrl(comment.author.avatar)"
              :alt="`${comment.author.username || 'User'} avatar`"
            />
            <span v-else>{{ (comment.author.username || 'U').charAt(0).toUpperCase() }}</span>
          </div>
          <div>
            <div class="comment-author-name">{{ comment.author.username }}<span v-if="comment.author?.role === 'admin'" class="role-badge admin">Admin</span><span v-else-if="comment.author?.role === 'mod'" class="role-badge mod">Mod</span></div>
            <span class="comment-author-level">Level {{ comment.author.level || 1 }}</span>
          </div>
        </div>
        <time class="post-time">{{ formatTime(comment.createdAt) }}</time>
      </div>

      <div v-if="comment.moderationStatus && comment.moderationStatus !== 'APPROVED'" class="comment-status-badge" :class="comment.moderationStatus.toLowerCase()">
        {{ comment.moderationStatus }} Review
      </div>
      <p class="comment-content">{{ comment.content }}</p>
      <div v-if="comment.image" class="comment-image-container">
        <img :src="getImageUrl(comment.image)" alt="Reply Attachment" />
      </div>

      <div class="comment-actions">
        <button class="comment-action-btn" @click="$emit('upvote', comment)">
          <img src="/src/assets/icons/ui/thumb_up.svg" class="icon-xs icon-muted" alt="" />
          {{ comment.upvotes }}
        </button>
        <button class="comment-action-btn" @click="$emit('reply', comment)">
          <img src="/src/assets/icons/ui/question_answer.svg" class="icon-xs icon-muted" alt="" />
          Reply
        </button>
        <button class="comment-action-btn" v-if="canDelete" @click="$emit('delete', comment)">
          <img src="/src/assets/icons/ui/flag.svg" class="icon-xs icon-muted" alt="" />
        </button>
      </div>

      <div v-if="activeReplyId === comment.id" class="inline-reply-composer">
        <textarea
          v-model="replyText"
          class="inline-reply-textarea"
          rows="3"
          :placeholder="`Reply to ${comment.author?.username || 'this comment'}...`"
        ></textarea>
        <div class="inline-reply-footer">
          <div class="inline-reply-actions">
            <button class="btn-post-reply inline-submit" type="button" :disabled="!replyText.trim()" @click="submitReply">
              Post Reply
            </button>
            <button class="btn-cancel-reply inline-cancel" type="button" @click="$emit('cancel-reply')">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="comment.replies && comment.replies.length" class="comment-children">
      <CommentThread
        v-for="child in comment.replies"
        :key="child.id"
        :comment="child"
        :depth="depth + 1"
        :can-delete="canDelete"
        :active-reply-id="activeReplyId"
        @reply="$emit('reply', $event)"
        @upvote="$emit('upvote', $event)"
        @delete="$emit('delete', $event)"
        @submit-reply="$emit('submit-reply', $event)"
        @cancel-reply="$emit('cancel-reply')"
      />
    </div>
  </div>
</template>

<script>
import { getImageUrl } from '../services/api';

export default {
  name: 'CommentThread',
  inheritAttrs: false,
  props: {
    comment: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    canDelete: { type: Boolean, default: false },
    activeReplyId: { type: Number, default: null },
  },
  emits: ['reply', 'upvote', 'delete', 'submit-reply', 'cancel-reply'],
  data() {
    return {
      replyText: '',
    };
  },
  methods: {
    getImageUrl,
    submitReply() {
      this.$emit('submit-reply', {
        parentCommentId: this.comment.id,
        content: this.replyText,
        image: null,
      });
      this.replyText = '';
      this.$emit('cancel-reply');
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
};
</script>

<style scoped>
.comment-thread { display: block; }

.comment-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(91, 79, 232, 0.06);
  border: 1px solid rgba(200, 196, 216, 0.3);
}

.comment-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; gap: 1rem; }
.comment-author-info { display: flex; align-items: center; gap: 10px; }
.comment-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: linear-gradient(135deg, #efecff, #e2e0fc); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #4231cf; flex-shrink: 0; }
.comment-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.comment-avatar span { line-height: 1; }
.comment-author-name { font-family: 'Nunito Sans', sans-serif; font-size: 15px; font-weight: 700; color: #1a1a2e; }
.role-badge { display: inline-flex; align-items: center; padding: 1px 7px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-left: 6px; vertical-align: middle; }
.role-badge.admin { background: #d9fff0; color: #007657; }
.role-badge.mod { background: #ffdad6; color: #ba1a1a; }
.comment-author-level { font-size: 11px; font-weight: 700; color: #5e4100; background: rgba(255, 183, 2, 0.25); padding: 2px 6px; border-radius: 4px; }
.post-time { font-size: 12px; color: #777586; white-space: nowrap; }
.comment-status-badge { display: inline-flex; align-items: center; margin: 8px 0 10px; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 800; }
.comment-status-badge.pending { background: #fff1c7; color: #6b4b00; }
.comment-status-badge.rejected { background: #ffdad6; color: #ba1a1a; }
.comment-content { margin: 0 0 1rem; font-size: 15px; line-height: 1.65; color: #464555; white-space: pre-wrap; }
.comment-image-container img { max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 100%; display: block; }
.comment-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.comment-action-btn { display: inline-flex; align-items: center; gap: 6px; background: #efecff; border: none; border-radius: 9999px; padding: 7px 12px; color: #464555; font-weight: 600; cursor: pointer; }
.comment-action-btn:hover { background: #e2e0fc; }
.comment-children { margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; }

.inline-reply-composer {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid rgba(66, 49, 207, 0.14);
  background: #fbfaff;
}

.inline-reply-textarea {
  width: 100%;
  border: 1px solid rgba(200, 196, 216, 0.7);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  resize: vertical;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
}

.inline-reply-textarea:focus {
  border-color: #4231cf;
  box-shadow: 0 0 0 3px rgba(66, 49, 207, 0.12);
}

.inline-reply-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.inline-reply-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.inline-submit {
  background: #4231cf;
  color: white;
}

.inline-submit:hover {
  background: #3526b3;
}

.btn-cancel-reply {
  border: 1px solid rgba(66, 49, 207, 0.16);
  background: #f6f4ff;
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel-reply:hover {
  background: #ece8ff;
  border-color: rgba(66, 49, 207, 0.28);
}
</style>
