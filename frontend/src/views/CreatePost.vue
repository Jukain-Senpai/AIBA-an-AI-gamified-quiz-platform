<template>
  <div class="create-post-wrapper">

    <!-- Background Blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="create-post-container">

      <!-- Header -->
      <div class="form-header">
        <button class="back-btn" @click="$router.push('/forum')">
          <img src="/src/assets/icons/navigation/arrow-back.svg" class="icon-sm icon-muted" alt="Back" />
          Back to Community
        </button>
        <h1 class="form-title">Create a New Post ✏️</h1>
        <p class="form-subtitle">Share your questions, tips, or experiences with the AIBA community!</p>
      </div>

      <!-- Form Card -->
      <div class="form-card">

        <!-- Guidelines Banner -->
        <div class="guidelines-banner">
          <img src="/src/assets/icons/status-and-alerts/info.svg" class="icon-sm icon-secondary" alt="" />
          <p>💛 Be kind, be helpful, keep it relevant to learning!</p>
        </div>

        <!-- Category Selector -->
        <div class="form-section">
          <label class="form-label">Choose a Category</label>
          <div class="category-grid">
            <button
              v-for="cat in categories"
              :key="cat.value"
              class="category-btn"
              :class="{ selected: form.category === cat.value }"
              @click="form.category = cat.value"
              type="button"
            >
              <img :src="cat.icon" class="icon-md icon-primary" :alt="cat.label" />
              <span>{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <!-- Title -->
        <div class="form-section">
          <label class="form-label" for="post-title">Title <span class="required">*</span></label>
          <input
            id="post-title"
            type="text"
            v-model="form.title"
            class="form-input"
            :class="{ 'input-error': errors.title }"
            placeholder="What's on your mind?"
            maxlength="150"
          />
          <div class="input-footer">
            <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
            <span class="char-count">{{ form.title.length }}/150</span>
          </div>
        </div>

        <!-- Content Body -->
        <div class="form-section">
          <label class="form-label" for="post-body">Your Thoughts <span class="required">*</span></label>
          <div class="textarea-card" :class="{ focused: contentFocused, 'input-error': errors.content }">
            <!-- Mini Toolbar -->
            <div class="textarea-toolbar">
              <button class="tool-btn" type="button" title="Bold">
                <img src="/src/assets/icons/ui/format_bold.svg" class="icon-sm icon-muted" alt="Bold" />
              </button>
              <button class="tool-btn" type="button" title="Italic">
                <img src="/src/assets/icons/ui/format_italic.svg" class="icon-sm icon-muted" alt="Italic" />
              </button>
              <button class="tool-btn" type="button" title="List">
                <img src="/src/assets/icons/ui/format_list_bulleted.svg" class="icon-sm icon-muted" alt="List" />
              </button>
              <button class="tool-btn" type="button" title="Attach Image" @click="$refs.postImageInput.click()">
                <span class="material-symbols-outlined icon-muted" style="font-size: 18px;">image</span>
              </button>
            </div>
            <textarea
              id="post-body"
              v-model="form.content"
              class="form-textarea"
              placeholder="Write your post here... Share your knowledge or ask a question!"
              rows="7"
              @focus="contentFocused = true"
              @blur="contentFocused = false"
            ></textarea>
            
            <!-- Image Upload UI -->
            <input ref="postImageInput" type="file" accept="image/*" @change="handleImageUpload" style="display: none;" />
            <div v-if="form.image" class="post-image-preview" style="padding: 10px; border-top: 1px solid rgba(200, 196, 216, 0.3); position: relative; background: rgba(255, 255, 255, 0.6);">
              <img :src="getImageUrl(form.image)" alt="Attached Image" style="max-height: 200px; border-radius: 8px;" />
              <button type="button" @click="form.image = null" style="position: absolute; top: 15px; left: 15px; background: #ba1a1a; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;">✕</button>
            </div>
            <p v-if="uploadingImage" style="padding: 10px; color: #4231cf; font-weight: bold; font-size: 14px; margin: 0;">Uploading image...</p>
          </div>
          <span v-if="errors.content" class="field-error">{{ errors.content }}</span>
        </div>

        <!-- Submit Buttons -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$router.push('/forum')">Cancel</button>
          <button
            type="button"
            class="btn-publish"
            :disabled="submitting"
            @click="publishPost"
          >
            {{ submitting ? 'Publishing...' : 'Publish Post 🚀' }}
          </button>
        </div>

        <p v-if="submitError" class="error-msg">{{ submitError }}</p>

      </div>
    </div>
  </div>
</template>

<script>
import api, { getImageUrl, uploadImage } from '../services/api';

export default {
  name: 'CreatePost',
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: '',
        image: null,
      },
      contentFocused: false,
      submitting: false,
      uploadingImage: false,
      submitError: null,
      errors: {
        title: '',
        content: '',
      },
      categories: [
        { label: 'Study Tips', value: 'Tips & Tricks', icon: '/src/assets/icons/ui/lightbulb.svg' },
        { label: 'Success', value: 'Challenges', icon: '/src/assets/icons/ui/emoji_events.svg' },
        { label: 'Questions', value: 'Quiz Help', icon: '/src/assets/icons/ui/question_answer.svg' },
        { label: 'General', value: 'General', icon: '/src/assets/icons/ui/groups.svg' },
      ],
    };
  },
  methods: {
    getImageUrl,
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.uploadingImage = true;
      try {
        const data = await uploadImage(file, 'forum-post');
        this.form.image = data.url;
      } catch (err) {
        alert(err.response?.data?.message || "Failed to upload image.");
      } finally {
        this.uploadingImage = false;
        event.target.value = null;
      }
    },
    validate() {
      let valid = true;
      this.errors = { title: '', content: '' };

      if (!this.form.title.trim()) {
        this.errors.title = 'Title is required.';
        valid = false;
      } else if (this.form.title.trim().length < 5) {
        this.errors.title = 'Title must be at least 5 characters.';
        valid = false;
      }

      if (!this.form.content.trim()) {
        this.errors.content = 'Content is required.';
        valid = false;
      } else if (this.form.content.trim().length < 10) {
        this.errors.content = 'Content must be at least 10 characters.';
        valid = false;
      }

      return valid;
    },
    async publishPost() {
      if (!this.validate()) return;

      this.submitting = true;
      this.submitError = null;
      try {
        const res = await api.post('/posts', {
          title: this.form.title.trim(),
          content: this.form.content.trim(),
          image: this.form.image,
          category: this.form.category || 'General',
        });
        if (res.data.moderationStatus === "PENDING") {
          alert("Your post is pending moderation review.");
        }
        this.$router.push(`/forum/post/${res.data.id}`);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else {
          this.submitError = err.response?.data?.message || 'Failed to publish post. Please try again.';
        }
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

/* Background decorations */
.bg-blob {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  width: 400px; height: 400px;
  background: rgba(91, 79, 232, 0.06);
  top: 10%; left: 5%;
}

.blob-2 {
  width: 500px; height: 500px;
  background: rgba(255, 183, 2, 0.05);
  bottom: 5%; right: 5%;
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

/* Header */
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
  transition: color 0.2s;
  margin-bottom: 0.5rem;
}

.back-btn:hover { color: #4231cf; }

.form-title {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
}

.form-subtitle {
  margin: 0;
  font-size: 15px;
  color: #464555;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(91, 79, 232, 0.1);
  border: 1px solid rgba(200, 196, 216, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Guidelines */
.guidelines-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 222, 169, 0.35);
  border: 1px solid rgba(125, 88, 0, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
}

.guidelines-banner p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #5e4100;
}

/* Form Sections */
.form-section { display: flex; flex-direction: column; gap: 8px; }

.form-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #464555;
}

.required { color: #ba1a1a; }

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background: #f5f2ff;
  border: 1px solid rgba(200, 196, 216, 0.6);
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #1a1a2e;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #5b4fe8;
  box-shadow: 0 0 0 3px rgba(91, 79, 232, 0.12);
  background: white;
}

.form-input.input-error {
  border-color: #ba1a1a;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: #777586;
  margin-left: auto;
}

.field-error {
  font-size: 12px;
  color: #ba1a1a;
  font-weight: 500;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid rgba(200, 196, 216, 0.5);
  background: #f5f2ff;
  cursor: pointer;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #464555;
  transition: all 0.2s ease;
}

.category-btn:hover {
  border-color: #4231cf;
  background: #efecff;
  color: #4231cf;
  transform: translateY(-2px);
}

.category-btn.selected {
  border-color: #4231cf;
  background: rgba(66, 49, 207, 0.08);
  color: #4231cf;
  box-shadow: 0 0 0 3px rgba(66, 49, 207, 0.15);
}

/* Textarea Card */
.textarea-card {
  background: #f5f2ff;
  border-radius: 14px;
  border: 1px solid rgba(200, 196, 216, 0.6);
  overflow: hidden;
  transition: all 0.2s;
}

.textarea-card.focused {
  border-color: #5b4fe8;
  box-shadow: 0 0 0 3px rgba(91, 79, 232, 0.12);
  background: white;
}

.textarea-card.input-error {
  border-color: #ba1a1a;
}

.textarea-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(200, 196, 216, 0.3);
  background: rgba(255, 255, 255, 0.6);
}

.tool-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.tool-btn:hover { background: #efecff; }

.form-textarea {
  width: 100%;
  border: none;
  padding: 14px 16px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #1a1a2e;
  resize: none;
  background: transparent;
  outline: none;
  box-sizing: border-box;
  line-height: 1.6;
}

.form-textarea::placeholder { color: #777586; }

/* Tags */
.tags-input-card {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f5f2ff;
  border: 1px solid rgba(200, 196, 216, 0.6);
  min-height: 46px;
  transition: all 0.2s;
}

.tags-input-card:focus-within {
  border-color: #5b4fe8;
  box-shadow: 0 0 0 3px rgba(91, 79, 232, 0.12);
  background: white;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(66, 49, 207, 0.1);
  color: #4231cf;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  line-height: 1;
}

.tag-input-field {
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #1a1a2e;
  flex: 1;
  min-width: 120px;
}

.tag-input-field::placeholder { color: #777586; }

.form-hint {
  margin: 0;
  font-size: 12px;
  color: #777586;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(200, 196, 216, 0.3);
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(200, 196, 216, 0.8);
  color: #464555;
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover { background: #f5f2ff; }

.btn-publish {
  background: #ffb702;
  color: #5e4100;
  border: none;
  padding: 12px 32px;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 183, 2, 0.3);
  transition: all 0.2s ease;
}

.btn-publish:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 183, 2, 0.4);
}

.btn-publish:active:not(:disabled) { transform: translateY(0); }

.btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-msg {
  text-align: center;
  color: #ba1a1a;
  font-size: 14px;
  font-weight: 500;
}

/* Icon Utilities */
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 18px; height: 18px; }
.icon-md { width: 22px; height: 22px; }

.icon-primary { filter: brightness(0) saturate(100%) invert(18%) sepia(87%) saturate(1800%) hue-rotate(240deg) brightness(85%) contrast(95%); }
.icon-secondary { filter: brightness(0) saturate(100%) invert(35%) sepia(80%) saturate(900%) hue-rotate(25deg) brightness(75%) contrast(100%); }
.icon-muted { filter: brightness(0) saturate(100%) invert(43%) sepia(10%) saturate(800%) hue-rotate(210deg) brightness(95%) contrast(90%); }

@media (max-width: 600px) {
  .create-post-wrapper { padding: 1.5rem 1rem; }
  .form-card { padding: 1.5rem; }
  .category-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
