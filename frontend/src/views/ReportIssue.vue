<template>
  <div class="create-post-wrapper">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="create-post-container">
      <div class="form-header">
        <button class="back-btn" @click="$router.push('/forum')">
          <img src="/src/assets/icons/navigation/arrow-back.svg" class="icon-sm icon-muted" alt="Back" />
          Back to Community
        </button>
        <h1 class="form-title">Report an Issue</h1>
        <p class="form-subtitle">Send us anything that needs moderator attention.</p>
      </div>

      <div class="form-card">
        <div class="guidelines-banner">
          <img src="/src/assets/icons/status-and-alerts/info.svg" class="icon-sm icon-secondary" alt="" />
          <p>Please include enough detail so the admin team can review it properly.</p>
        </div>

        <div class="form-section">
          <label class="form-label" for="issue-subject">Subject <span class="required">*</span></label>
          <input id="issue-subject" v-model="form.subject" class="form-input" placeholder="What happened?" maxlength="120" />
        </div>

        <div class="form-section">
          <label class="form-label" for="issue-details">Issue Details <span class="required">*</span></label>
          <textarea id="issue-details" v-model="form.details" class="form-textarea" rows="8" placeholder="Describe the problem, where you saw it, and any helpful context."></textarea>
        </div>

        <div class="form-section">
          <label class="form-label" for="issue-page">Where did this happen?</label>
          <input id="issue-page" v-model="form.page" class="form-input" placeholder="Forum, quiz page, profile page..." />
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$router.push('/forum')">Cancel</button>
          <button type="button" class="btn-publish" :disabled="submitting" @click="submitReport">
            {{ submitting ? 'Sending...' : 'Send Report' }}
          </button>
        </div>

        <p v-if="submitError" class="error-msg">{{ submitError }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'ReportIssue',
  data() {
    return {
      form: {
        subject: '',
        details: '',
        page: '',
      },
      submitting: false,
      submitError: null,
    };
  },
  methods: {
    async submitReport() {
      if (!this.form.subject.trim() || !this.form.details.trim()) {
        this.submitError = 'Subject and details are required.';
        return;
      }

      this.submitting = true;
      this.submitError = null;
      try {
        await api.post('/reports', {
          subject: this.form.subject.trim(),
          details: this.form.details.trim(),
          page: this.form.page.trim() || null,
        });
        alert('Thanks. Your report has been sent to the admin team.');
        this.$router.push('/forum');
      } catch (err) {
        this.submitError = err.response?.data?.message || 'Failed to send report.';
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.create-post-wrapper {
  background-color: #f5f2ff;
  min-height: calc(100vh - 80px);
  padding: 2.5rem 1.5rem;
  font-family: 'Inter', sans-serif;
  color: #1a1a2e;
  position: relative;
  overflow: hidden;
}

.bg-blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: rgba(91, 79, 232, 0.06);
  top: 10%;
  left: 5%;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: rgba(255, 183, 2, 0.05);
  bottom: 5%;
  right: 5%;
}

.create-post-container {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #777586;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

.form-title {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 28px;
  font-weight: 800;
}

.form-subtitle {
  margin: 0;
  font-size: 15px;
  color: #464555;
}

.form-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(91, 79, 232, 0.1);
  border: 1px solid rgba(200, 196, 216, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.guidelines-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 222, 169, 0.35);
  border: 1px solid rgba(125, 88, 0, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 700;
}

.required {
  color: #ba1a1a;
}

.form-input,
.form-textarea {
  border: 1px solid rgba(200, 196, 216, 0.8);
  border-radius: 12px;
  padding: 14px 16px;
  font: inherit;
  background: #fff;
}

.form-textarea {
  resize: vertical;
  min-height: 180px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 4px;
}

.btn-cancel,
.btn-publish {
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  background: #efecff;
  color: #4231cf;
}

.btn-publish {
  background: #4231cf;
  color: white;
}

.btn-publish:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #ba1a1a;
  margin: 0;
  font-weight: 600;
}
</style>
