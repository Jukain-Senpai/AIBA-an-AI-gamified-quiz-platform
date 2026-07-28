<template>
  <div class="auth-page">
    <main class="auth-shell">
      <section class="auth-hero">
        <div class="hero-copy">
          <img src="/src/assets/icons/mascot/Logo.png" class="brand-mark" alt="AIBA" />
          <h1>New Password</h1>
          <p>Choose a strong new password and confirm it to finish resetting your account.</p>
        </div>
      </section>

      <section class="auth-panel">
        <div class="panel-inner">
          <div class="panel-header">
            <h2>Set New Password</h2>
            <p>Enter and confirm your new password below.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleReset">
            <div class="field">
              <label for="password">New Password</label>
              <div class="password-field">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter new password"
                  autocomplete="new-password"
                  required
                />
                <button type="button" class="toggle-btn" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div class="field">
              <label for="confirmPassword">Confirm New Password</label>
              <div class="password-field">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Re-enter new password"
                  autocomplete="new-password"
                  required
                />
                <button type="button" class="toggle-btn" @click="showConfirmPassword = !showConfirmPassword" :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'">
                  <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <p v-if="error" class="error">{{ error }}</p>
            <p v-if="success" class="success">{{ success }}</p>

            <button type="submit" class="primary-btn" :disabled="submitting">
              {{ submitting ? 'Updating Password...' : 'Update Password' }}
            </button>
          </form>

          <p class="auth-footer">
            Back to
            <router-link to="/login">Sign in</router-link>
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'ResetPassword',
  data() {
    return {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      submitting: false,
      error: null,
      success: null,
    };
  },
  created() {
    this.email = this.$route.query.email || '';
    this.code = this.$route.query.code || '';

    if (!this.email || !this.code) {
      this.$router.replace('/forgot-password');
    }
  },
  methods: {
    async handleReset() {
      this.error = null;
      this.success = null;

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
      }

      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters.';
        return;
      }

      this.submitting = true;

      try {
        await api.post('/auth/reset-password', {
          email: this.email,
          code: this.code,
          password: this.password,
        });
        this.success = 'Password updated successfully. Redirecting to sign in...';
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to reset password.';
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
  grid-template-columns: 1.1fr 0.9fr;
}

.auth-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 183, 2, 0.16) 0, transparent 36%),
    radial-gradient(circle at 75% 75%, rgba(39, 224, 169, 0.14) 0, transparent 36%),
    linear-gradient(135deg, #5b4fe8 0%, #4231cf 40%, #7d5800 100%);
  color: #ffffff;
}

.hero-copy {
  max-width: 520px;
  text-align: left;
}

.brand-mark {
  width: 160px;
  height: auto;
  margin-bottom: 24px;
  display: block;
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
  max-width: 440px;
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

.primary-btn {
  width: 100%;
  height: 56px;
  border: none;
  border-radius: 9999px;
  background: #4231cf;
  color: #ffffff;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #2a1e8a;
  transition: all 0.2s;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #5244de;
  box-shadow: 0 6px 0 #2a1e8a;
}

.primary-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #2a1e8a;
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

.success {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #d7f8ea;
  color: #0d6b45;
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
