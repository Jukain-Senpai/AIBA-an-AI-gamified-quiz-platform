<template>
  <div class="admin-page">
    <section class="hero-band">
      <div class="hero-copy">
        <p class="eyebrow">Moderator Console</p>
        <h1>Admin</h1>
        <p class="hero-text">
          Review quizzes, posts, and comments from one place. Ensure the community stays safe and clean.
        </p>
      </div>

      <button class="refresh-btn" type="button" @click="refreshAll" :disabled="loading">
        <span class="material-symbols-outlined">refresh</span>
        Refresh
      </button>
    </section>

    <section class="stats-grid" aria-label="Content summary">
      <article class="stat-card">
        <span class="stat-label">Pending Quizzes</span>
        <strong class="stat-value">{{ stats.pendingQuizzes }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Pending Posts</span>
        <strong class="stat-value">{{ stats.pendingPosts }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Pending Comments</span>
        <strong class="stat-value">{{ stats.pendingComments }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Open Reports</span>
        <strong class="stat-value">{{ stats.reportIssues || 0 }}</strong>
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

      <p class="control-note">Moderation {{ activeTab === 'logs' ? 'History' : 'Queue' }}</p>
    </section>

    <!-- Filters Bar -->
    <section class="filters-bar" v-if="activeTab !== 'logs'">
      <div class="search-wrap">
        <span class="material-symbols-outlined search-icon">search</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by keyword..." 
          @keyup.enter="fetchContent(1)"
        />
      </div>
      
      <div class="filter-wrap">
        <span class="material-symbols-outlined">filter_list</span>
        <select v-model="statusFilter" @change="fetchContent(1)">
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div class="filter-wrap">
        <span class="material-symbols-outlined">sort</span>
        <select v-model="sortBy" @change="fetchContent(1)">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </section>

    <!-- Bulk Actions -->
    <section class="bulk-actions" v-if="selectedItems.length > 0 && activeTab !== 'logs'">
      <div class="bulk-info">
        <span class="material-symbols-outlined">library_add_check</span>
        <span>{{ selectedItems.length }} item(s) selected</span>
      </div>
      <div class="bulk-btns">
        <button class="success-btn" @click="bulkModerate('APPROVED')">Approve Selected</button>
        <button class="danger-btn" @click="openRejectModal(null, true)">Reject Selected</button>
        <button class="neutral-btn" @click="selectedItems = []">Clear</button>
      </div>
    </section>

    <section v-if="loading" class="state-panel">
      <div class="spinner"></div>
      <p>Loading moderation data...</p>
    </section>

    <section v-else-if="error" class="state-panel">
      <p class="error-text">{{ error }}</p>
      <button class="retry-btn" type="button" @click="refreshAll">Retry</button>
    </section>

    <section v-else class="content-section">
      <!-- Audit Logs Tab -->
      <template v-if="activeTab === 'logs'">
        <div class="logs-container">
          <table class="logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Admin</th>
                <th>Action</th>
                <th>Target</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td>{{ formatDate(log.createdAt) }}</td>
                <td>{{ log.admin?.username || 'Unknown Admin' }}</td>
                <td>
                  <span class="status-pill moderation" :class="log.action.toLowerCase()">
                    {{ log.action }}
                  </span>
                </td>
                <td>{{ log.targetType }} #{{ log.targetId }}</td>
                <td>{{ log.reason || '-' }}</td>
              </tr>
              <tr v-if="logs.length === 0">
                <td colspan="5" class="empty-state">No moderation logs found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Content Queue Tabs (All, Quizzes, Posts, Comments) -->
      <template v-else>
        <!-- Select All Toggle -->
        <div class="select-all-wrap" v-if="items.length > 0">
          <input 
            type="checkbox" 
            id="selectAll" 
            :checked="isAllSelected" 
            @change="toggleSelectAll"
          />
          <label for="selectAll">Select All on this page</label>
        </div>

        <article
          v-for="item in items"
          :key="item.type + item.id"
          class="item-card"
          :class="{'selected': isSelected(item)}"
          @click="openItemModal(item)"
        >
          
          <div class="item-checkbox">
            <input type="checkbox" :value="item" v-model="selectedItems" @click.stop />
          </div>

          <div class="item-media" :style="getMediaStyle(item)">
            <div class="media-fallback" v-if="!hasMedia(item)">
              <span class="material-symbols-outlined">{{ getIconForType(item.type) }}</span>
            </div>
            <div class="type-badge">{{ item.type }}</div>
          </div>

          <div class="item-body">
            <div class="item-topline">
              <div>
                <p class="item-title">{{ getItemTitle(item) }}</p>
                <p class="item-meta">
                  by {{ getAuthorLabel(item) }} · {{ formatDate(item.createdAt) }}
                </p>
              </div>
              <div class="pill-stack">
                <span v-if="item.type === 'quiz'" class="status-pill" :class="item.isPublished ? 'public' : 'private'">
                  {{ item.isPublished ? 'Public' : 'Private' }}
                </span>
                <span v-else-if="item.type === 'report'" class="status-pill moderation open">
                  OPEN
                </span>
                <span class="status-pill moderation" :class="item.moderationStatus?.toLowerCase()">
                  {{ item.moderationStatus || 'APPROVED' }}
                </span>
              </div>
            </div>

            <!-- AI Flag Warning -->
            <div v-if="item.moderationStatus === 'PENDING' && item.moderationReason" class="ai-warning">
              <span class="material-symbols-outlined warning-icon">warning</span>
              <div class="warning-text">
                <strong>AI Auto-Flag:</strong> {{ item.moderationReason }}
              </div>
            </div>

            <p class="item-description">{{ getItemContent(item) }}</p>
            <p v-if="item.moderationStatus !== 'PENDING' && item.moderationReason" class="moderation-note">
              Moderator Note: {{ item.moderationReason }}
            </p>

            <div v-if="item.type === 'comment' && item.image" class="inline-preview">
              <img :src="getImageUrl(item.image)" alt="Comment image" />
            </div>

            <div class="item-footer">
              <div class="tag-row">
                <span class="tag" v-if="item.type === 'quiz' && item.category">{{ item.category }}</span>
                <span class="tag" v-if="item.type === 'quiz' && item.difficulty">{{ item.difficulty }}</span>
                <span class="tag" v-if="item.type === 'report'">{{ item.page || 'Issue Report' }}</span>
              </div>
              <div class="action-row">
                <button
                  v-if="item.type !== 'report'"
                  class="success-btn"
                  type="button"
                  :disabled="item.moderationStatus !== 'PENDING'"
                  @click.stop
                  @click="moderateItem(item, 'APPROVED')"
                >
                  <span class="material-symbols-outlined">check</span>
                  Approve
                </button>
                <button
                  v-if="item.type !== 'report'"
                  class="neutral-btn"
                  type="button"
                  :disabled="item.moderationStatus !== 'PENDING'"
                  @click.stop
                  @click="openRejectModal(item, false)"
                >
                  <span class="material-symbols-outlined">close</span>
                  Reject
                </button>
                <button class="danger-btn" type="button" @click.stop="deleteItem(item)">
                  <span class="material-symbols-outlined">delete</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </article>

        <div v-if="items.length === 0" class="empty-state">
          No content matches your current filters. You're all caught up!
        </div>
      </template>

      <!-- Pagination -->
      <div class="pagination-bar" v-if="totalPages > 1">
        <button class="page-btn" :disabled="page <= 1" @click="fetchContent(page - 1)">
          <span class="material-symbols-outlined">chevron_left</span> Previous
        </button>
        <span class="page-info">Page {{ page }} of {{ totalPages }}</span>
        <button class="page-btn" :disabled="page >= totalPages" @click="fetchContent(page + 1)">
          Next <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

    </section>

    <!-- Reject Modal -->
    <div v-if="rejectModal.show" class="modal-overlay" @click.self="closeRejectModal">
      <div class="modal-content">
        <h3>Reject Content</h3>
        <p v-if="rejectModal.isBulk">You are rejecting {{ selectedItems.length }} item(s).</p>
        <p v-else>Please provide a reason for rejecting this {{ rejectModal.item?.type }}.</p>
        
        <textarea 
          v-model="rejectModal.reason" 
          placeholder="e.g. Contains inappropriate language"
          rows="4"
        ></textarea>
        
        <div class="modal-actions">
          <button class="neutral-btn" @click="closeRejectModal">Cancel</button>
          <button class="danger-btn" @click="confirmReject">Confirm Reject</button>
        </div>
      </div>
    </div>

    <div v-if="detailModal.show" class="modal-overlay" @click.self="closeItemModal">
      <div class="modal-content detail-modal">
        <div class="detail-header">
          <div>
            <p class="detail-kicker">{{ detailModal.item?.type || 'content' }}</p>
            <h3>{{ getItemTitle(detailModal.item) }}</h3>
            <p class="detail-meta">by {{ getAuthorLabel(detailModal.item) }} · {{ formatDate(detailModal.item?.createdAt) }}</p>
          </div>
          <button class="icon-close-btn" type="button" @click="closeItemModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="detail-scroll">
          <div class="detail-media" v-if="hasMedia(detailModal.item)">
            <img v-if="detailModal.item?.type === 'comment' && detailModal.item.image" :src="getImageUrl(detailModal.item.image)" alt="" />
            <img v-else :src="getImageUrl(detailModal.item?.thumbnail || detailModal.item?.image)" alt="" />
          </div>

          <div class="detail-meta-stack">
            <span v-if="detailModal.item?.type === 'quiz'" class="status-pill" :class="detailModal.item.isPublished ? 'public' : 'private'">
              {{ detailModal.item.isPublished ? 'Public' : 'Private' }}
            </span>
            <span class="status-pill moderation" :class="detailModal.item?.moderationStatus?.toLowerCase()">
              {{ detailModal.item?.moderationStatus || 'APPROVED' }}
            </span>
            <span v-if="detailModal.item?.type === 'report'" class="status-pill moderation open">OPEN</span>
          </div>

          <div v-if="detailModal.item?.moderationStatus === 'PENDING' && detailModal.item?.moderationReason" class="ai-warning">
            <span class="material-symbols-outlined warning-icon">warning</span>
            <div class="warning-text">
              <strong>AI Auto-Flag:</strong> {{ detailModal.item.moderationReason }}
            </div>
          </div>

          <div class="detail-content">
            <p>{{ getItemContent(detailModal.item) }}</p>
          </div>

          <p v-if="detailModal.item?.type === 'report' && detailModal.item?.page" class="moderation-note">
            Reported from: {{ detailModal.item.page }}
          </p>

          <div v-if="detailModal.item?.type === 'comment' && detailModal.item?.image" class="detail-preview">
            <img :src="getImageUrl(detailModal.item.image)" alt="Comment image" />
          </div>
        </div>

        <div class="detail-actions">
          <button
            v-if="detailModal.item?.type !== 'report' && detailModal.item?.moderationStatus === 'PENDING'"
            class="success-btn"
            type="button"
            @click="moderateFromDetail('APPROVED')"
          >
            <span class="material-symbols-outlined">check</span>
            Approve
          </button>
          <button
            v-if="detailModal.item?.type !== 'report' && detailModal.item?.moderationStatus === 'PENDING'"
            class="neutral-btn"
            type="button"
            @click="openRejectModal(detailModal.item, false)"
          >
            <span class="material-symbols-outlined">close</span>
            Reject
          </button>
          <button class="danger-btn" type="button" @click="deleteFromDetail">
            <span class="material-symbols-outlined">delete</span>
            Delete
          </button>
        </div>
      </div>
    </div>

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
      activeTab: "all",
      tabs: [
        { key: "all", label: "Unified Queue" },
        { key: "quizzes", label: "Quizzes" },
        { key: "posts", label: "Posts" },
        { key: "comments", label: "Comments" },
        { key: "reports", label: "Report Issues" },
        { key: "logs", label: "Audit Logs" },
      ],
      stats: {
        pendingQuizzes: 0,
        pendingPosts: 0,
        pendingComments: 0,
        reportIssues: 0
      },
      
      // Pagination & Filters
      items: [],
      logs: [],
      page: 1,
      totalPages: 1,
      limit: 15,
      searchQuery: "",
      statusFilter: "PENDING",
      sortBy: "desc",
      
      // Bulk Actions
      selectedItems: [],

      // Reject Modal
      rejectModal: {
        show: false,
        isBulk: false,
        item: null,
        reason: ""
      },
      detailModal: {
        show: false,
        item: null,
      }
    };
  },
  computed: {
    isAllSelected() {
      if (this.items.length === 0) return false;
      return this.selectedItems.length === this.items.length;
    }
  },
  watch: {
    activeTab() {
      this.searchQuery = "";
      this.selectedItems = [];
      this.fetchContent(1);
    }
  },
  methods: {
    getImageUrl,
    formatDate(dateString) {
      if (!dateString) return "Unknown date";
      return new Date(dateString).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute:'2-digit' 
      });
    },
    getAuthorLabel(item) {
      const author = item.creator || item.author;
      if (!author) return "Unknown";
      return author.username || author.email?.split("@")[0] || "Unknown";
    },
    getItemTitle(item) {
      if (item.type === 'quiz') return item.title;
      if (item.type === 'post') return item.title;
      if (item.type === 'comment') return `Comment on ${item.post?.title || 'a post'}`;
      if (item.type === 'report') return item.subject;
      return "Untitled";
    },
    getItemContent(item) {
      if (item.type === 'quiz') return item.description || 'No description provided.';
      if (item.type === 'post') return item.content;
      if (item.type === 'comment') return item.content;
      if (item.type === 'report') return item.details;
      return "";
    },
    getIconForType(type) {
      if (type === 'quiz') return 'quiz';
      if (type === 'post') return 'article';
      if (type === 'comment') return 'comment';
      if (type === 'report') return 'report_problem';
      return 'help';
    },
    hasMedia(item) {
      if (item.type === 'quiz') return !!item.thumbnail;
      if (item.type === 'post') return !!item.image;
      return false;
    },
    getMediaStyle(item) {
      if (item.type === 'quiz' && item.thumbnail) return { backgroundImage: `url(${this.getImageUrl(item.thumbnail)})` };
      if (item.type === 'post' && item.image) return { backgroundImage: `url(${this.getImageUrl(item.image)})` };
      return {};
    },
    isSelected(item) {
      return this.selectedItems.some(i => i.id === item.id && i.type === item.type);
    },
    openItemModal(item) {
      this.detailModal = { show: true, item };
    },
    closeItemModal() {
      this.detailModal.show = false;
      this.detailModal.item = null;
    },
    toggleSelectAll(e) {
      if (e.target.checked) {
        this.selectedItems = [...this.items];
      } else {
        this.selectedItems = [];
      }
    },
    async refreshAll() {
      this.fetchStats();
      this.fetchContent(this.page);
    },
    async fetchStats() {
      try {
        const response = await api.get("/admin/content?tab=stats");
        this.stats = response.data;
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    },
    async fetchContent(page = 1) {
      this.loading = true;
      this.error = null;
      this.page = page;
      this.selectedItems = [];

      try {
        if (this.activeTab === 'logs') {
          const res = await api.get(`/admin/logs`, {
            params: { page: this.page, limit: this.limit }
          });
          this.logs = res.data.items || [];
          this.totalPages = res.data.totalPages || 1;
        } else {
          const res = await api.get(`/admin/content`, {
            params: {
              tab: this.activeTab,
              page: this.page,
              limit: this.limit,
              status: this.statusFilter,
              search: this.searchQuery,
              sortBy: this.sortBy
            }
          });
          this.items = res.data.items || [];
          this.totalPages = res.data.totalPages || 1;
        }
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },
    handleError(err) {
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
    },
    async deleteItem(item) {
      if (!window.confirm(`Delete this ${item.type}? This cannot be undone.`)) return;

      try {
        const routes = {
          quiz: `/quizzes/${item.id}`,
          post: `/posts/${item.id}`,
          comment: `/comments/${item.id}`,
          report: `/reports/${item.id}`,
        };
        await api.delete(routes[item.type]);
        await this.refreshAll();
      } catch (err) {
        alert(err.response?.data?.message || `Failed to delete ${item.type}`);
        console.error(err);
      }
    },
    async moderateItem(item, status, reason = null) {
      try {
        await api.patch(`/admin/content/${item.type}/${item.id}`, {
          moderationStatus: status,
          moderationReason: reason
        });
        await this.refreshAll();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update moderation status");
        console.error(err);
      }
    },
    async moderateFromDetail(status) {
      if (!this.detailModal.item) return;
      await this.moderateItem(this.detailModal.item, status);
      this.closeItemModal();
    },
    async deleteFromDetail() {
      if (!this.detailModal.item) return;
      await this.deleteItem(this.detailModal.item);
      this.closeItemModal();
    },
    async bulkModerate(status, reason = null) {
      if (this.selectedItems.length === 0) return;
      
      if (status === 'APPROVED' && !window.confirm(`Approve ${this.selectedItems.length} items?`)) {
        return;
      }

      try {
        const payloadItems = this.selectedItems.map(i => ({ type: i.type, id: i.id }));
        await api.post(`/admin/content/bulk-moderate`, {
          items: payloadItems,
          moderationStatus: status,
          moderationReason: reason
        });
        
        this.selectedItems = [];
        await this.refreshAll();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to bulk update status");
        console.error(err);
      }
    },
    openRejectModal(item, isBulk) {
      this.rejectModal = {
        show: true,
        isBulk,
        item,
        reason: ""
      };
    },
    closeRejectModal() {
      this.rejectModal.show = false;
    },
    async confirmReject() {
      const reason = this.rejectModal.reason;
      if (this.rejectModal.isBulk) {
        await this.bulkModerate('REJECTED', reason);
      } else {
        await this.moderateItem(this.rejectModal.item, 'REJECTED', reason);
      }
      this.closeRejectModal();
    }
  },
  mounted() {
    this.refreshAll();
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
.filters-bar,
.bulk-actions,
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

.filters-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  background: #ffffff;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e0fc;
}

.search-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f2ff;
  border-radius: 6px;
  padding: 0 12px;
}

.search-wrap input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px;
  outline: none;
  font-family: inherit;
  color: #1a1a2e;
}

.search-icon {
  color: #777586;
  font-size: 20px;
}

.filter-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f2ff;
  border-radius: 6px;
  padding: 0 12px;
}

.filter-wrap select {
  border: none;
  background: transparent;
  padding: 10px 0;
  outline: none;
  font-family: inherit;
  color: #1a1a2e;
  cursor: pointer;
}

.bulk-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #4231cf;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.bulk-btns {
  display: flex;
  gap: 8px;
}

.content-section {
  display: grid;
  gap: 16px;
}

.select-all-wrap {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #464555;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e0fc;
}

.select-all-wrap input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.item-card {
  display: grid;
  grid-template-columns: auto 160px minmax(0, 1fr);
  gap: 18px;
  background: #ffffff;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(66, 49, 207, 0.04);
  transition: all 0.2s;
  min-height: 260px;
  max-height: 260px;
  overflow: hidden;
  cursor: pointer;
}

.item-card.selected {
  border-color: #4231cf;
  background: #fbfaff;
}

.item-checkbox {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.item-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.item-media {
  min-height: 120px;
  border-radius: 8px;
  background: #efecff;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.media-fallback {
  display: grid;
  place-items: center;
  color: #4231cf;
  font-size: 34px;
}

.type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.item-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.item-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.pill-stack {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.item-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 52px;
}

.ai-warning {
  background: #fff1c7;
  border: 1px solid #ffd466;
  color: #6b4b00;
  padding: 10px 14px;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.warning-icon {
  color: #b37d00;
  margin-top: 2px;
}

.warning-text {
  font-size: 13px;
  line-height: 1.4;
}

.moderation-note {
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f5f2ff;
  color: #464555;
  font-size: 13px;
  font-style: italic;
}

.inline-preview {
  max-width: 240px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e0fc;
}
.inline-preview img {
  display: block;
  width: 100%;
  height: auto;
}

.item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: auto;
  max-height: 112px;
  overflow: hidden;
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
  min-height: 26px;
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
.status-pill.moderation.pending {
  background: #fff1c7;
  color: #6b4b00;
}
.status-pill.moderation.approved {
  background: #d9fff0;
  color: #007657;
}
.status-pill.moderation.rejected {
  background: #ffdad6;
  color: #ba1a1a;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}

.success-btn,
.neutral-btn,
.danger-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  font-size: 13px;
}

.success-btn {
  background: #d9fff0;
  color: #007657;
  border-color: rgba(0, 118, 87, 0.2);
}
.success-btn:hover { background: #c9ffe7; }

.neutral-btn {
  background: #efecff;
  color: #4231cf;
  border-color: #e2e0fc;
}
.neutral-btn:hover { background: #e3dfff; }

.danger-btn {
  border-color: #f3b8b0;
  background: #fff4f3;
  color: #ba1a1a;
}
.danger-btn:hover { background: #ffd9d4; }

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e0fc;
}
.page-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #e2e0fc;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-info {
  font-weight: 600;
  color: #464555;
}

/* Logs Table */
.logs-container {
  background: #fff;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  overflow-x: auto;
}
.logs-table {
  width: 100%;
  border-collapse: collapse;
}
.logs-table th, .logs-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e0fc;
}
.logs-table th {
  background: #f5f2ff;
  font-weight: 700;
  color: #4231cf;
  font-size: 13px;
  text-transform: uppercase;
}
.logs-table td {
  font-size: 14px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.detail-modal {
  max-width: 760px;
  max-height: 84vh;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.detail-kicker {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0;
  font-size: 12px;
  font-weight: 800;
  color: #4231cf;
}

.detail-header h3 {
  margin: 0;
  font-family: "Nunito Sans", sans-serif;
  font-size: 24px;
  line-height: 1.2;
}

.detail-meta {
  margin: 8px 0 0;
  color: #777586;
  font-size: 13px;
}

.icon-close-btn {
  border: 0;
  background: #efecff;
  color: #4231cf;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex: none;
}

.detail-scroll {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
  padding-right: 4px;
}

.detail-media img,
.detail-preview img {
  width: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #e2e0fc;
}

.detail-meta-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-content {
  background: #f5f2ff;
  border: 1px solid #e2e0fc;
  border-radius: 10px;
  padding: 16px;
}

.detail-content p {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.65;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}
.modal-content h3 {
  margin: 0 0 12px;
}
.modal-content textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e0fc;
  border-radius: 8px;
  font-family: inherit;
  margin-bottom: 16px;
  resize: vertical;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  to { transform: rotate(360deg); }
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
  .admin-page { padding: 24px 16px 96px; }
  .item-card { grid-template-columns: auto 1fr; }
  .item-media { display: none; }
  .filters-bar { flex-direction: column; }
}
</style>
