<template>
  <div class="auth-page">
    <main class="auth-shell">
      <section class="auth-hero">
        <div class="hero-copy">
          <img src="/src/assets/Logo.svg" class="brand-mark" alt="AIBA" />
          <h1>Join the Learning Journey</h1>
          <p>Create your profile and upload an avatar that feels like yours.</p>
        </div>
      </section>

      <section class="auth-panel">
        <div class="panel-inner">
          <div class="panel-header">
            <h2>Create Account</h2>
            <p>Set up your details and choose a profile avatar.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleRegister">
            <div class="field">
              <label for="username">Username</label>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="QuizMaster99"
                autocomplete="username"
                required
              />
            </div>

            <div class="field">
              <label for="email">Email Address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="name@example.com"
                autocomplete="email"
                required
              />
            </div>

            <div class="field">
              <label for="password">Password</label>
              <div class="password-field">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password"
                  autocomplete="new-password"
                  required
                />
                <button type="button" class="toggle-btn" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="field">
              <label>Avatar</label>
              <div class="upload-box">
                <label class="upload-btn" for="avatar-upload">
                  <span class="material-symbols-outlined">upload</span>
                  <span>Upload Avatar</span>
                </label>
                <input id="avatar-upload" type="file" accept="image/*" @change="handleAvatarUpload" hidden />
                <div v-if="avatar" class="avatar-preview">
                  <img :src="getAvatarPreviewUrl(avatar)" alt="Selected avatar" />
                  <button type="button" class="clear-btn" @click="avatar = ''">Remove</button>
                </div>
              </div>
            </div>

            <p v-if="error" class="error">{{ error }}</p>

            <button type="submit" class="primary-btn" :disabled="submitting">
              {{ submitting ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <p class="auth-footer">
            Already have an account?
            <router-link to="/login">Sign in</router-link>
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import api from '../services/api';
import { uploadImage, getImageUrl } from '../services/api';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      avatar: '',
      submitting: false,
      showPassword: false,
      error: null,
    };
  },
  methods: {
    getAvatarPreviewUrl(path) {
      if (!path) return '';
      return getImageUrl(path);
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const data = await uploadImage(file, 'avatar');
        this.avatar = data.url;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to upload avatar.';
      } finally {
        event.target.value = null;
      }
    },
    async handleRegister() {
      this.submitting = true;
      this.error = null;
      try {
        const res = await api.post('/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          avatar: this.avatar || 'NeonKnight_M.jpg',
        });

        localStorage.setItem('token', res.data.token);
        this.$router.push('/dashboard');
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed.';
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: #fcf8ff;
  color: #1a1a2e;
  font-family: 'Inter', sans-serif;
}

.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
}

.auth-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background:
    radial-gradient(circle at 25% 20%, rgba(255, 183, 2, 0.16) 0, transparent 34%),
    radial-gradient(circle at 80% 75%, rgba(39, 224, 169, 0.14) 0, transparent 34%),
    linear-gradient(135deg, #4231cf 0%, #5b4fe8 55%, #7d5800 100%);
  color: #ffffff;
}

.hero-copy {
  max-width: 520px;
}

.brand-mark {
  width: 120px;
  height: auto;
  margin-bottom: 24px;
}

.hero-copy h1 {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 900;
}

.hero-copy p {
  margin: 16px 0 0;
  max-width: 460px;
  font-size: 18px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.panel-inner {
  width: 100%;
  max-width: 460px;
}

.panel-header h2 {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 32px;
  line-height: 1.2;
  font-weight: 900;
  color: #1a1a2e;
}

.panel-header p {
  margin: 8px 0 0;
  color: #464555;
  line-height: 1.5;
}

.auth-form {
  margin-top: 28px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.field label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #464555;
}

.field input {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid #e2e0fc;
  background: #f5f2ff;
  color: #1a1a2e;
  font-size: 16px;
  box-sizing: border-box;
  transition: all 0.2s;
}

.field input:focus {
  outline: none;
  background: #ffffff;
  border-color: #4231cf;
  box-shadow: 0 0 0 4px rgba(66, 49, 207, 0.12);
}

.field input::placeholder {
  color: #777586;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 52px;
}

.toggle-btn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #777586;
  cursor: pointer;
}

.toggle-btn:hover {
  background: #e8e5ff;
  color: #4231cf;
}

.upload-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  border-radius: 12px;
  border: 1px dashed #c8c4d8;
  background: #f5f2ff;
  color: #4231cf;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.avatar-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-preview img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #4231cf;
}

.clear-btn {
  border: none;
  background: transparent;
  color: #ba1a1a;
  font-weight: 800;
  cursor: pointer;
}

.primary-btn {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 9999px;
  background: #ffb702;
  color: #6b4b00;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #b38000;
  transition: all 0.2s;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #ffd65c;
  box-shadow: 0 6px 0 #b38000;
}

.primary-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #b38000;
}

.primary-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

.auth-footer {
  margin: 20px 0 0;
  text-align: center;
  color: #464555;
}

.auth-footer a {
  color: #4231cf;
  font-weight: 800;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffdad6;
  color: #ba1a1a;
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 900px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-hero {
    min-height: 260px;
    padding: 32px 24px;
  }

  .hero-copy {
    text-align: center;
  }

  .hero-copy p {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 640px) {
  .auth-panel {
    padding: 24px 16px 40px;
  }

  .panel-header h2 {
    font-size: 28px;
  }

  .hero-copy h1 {
    font-size: 36px;
  }

  .hero-copy p {
    font-size: 16px;
  }

}
</style>
