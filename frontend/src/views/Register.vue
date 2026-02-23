<template>
  <div class="auth-card">
    <div class="card-header">
      <img src="/src/assets/Logo.svg" class="sparkle-icon" />

      <h1>Begin Your Quest</h1>
      <p class="subtitle">Create your adventurer profile</p>
    </div>

    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="input-group">
        <label>Email</label>
        <input 
          type="email" 
          placeholder="AIBA1@gmail.com" 
          v-model="email" 
          required 
        />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          v-model="password" 
          required 
        />
      </div>

      <button type="submit" class="register-btn">Create Account</button>
      
      <p v-if="error" class="error">{{ error }}</p>

      <p class="login-link">
        Already an adventurer? <router-link to="/login">Sign in</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    async handleRegister() {
      try {
        await api.post("/auth/register", {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);

        this.$router.push("/dashboard");
      } catch (err) {
        this.error = 
          err.response?.data?.message || 
          err.response?.data?.error ||
          "Registration failed.";
      }
    },
  },
};
</script>

<style scoped>
.auth-card {
  background: rgba(30, 15, 55, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 16px;
  padding: 2.5rem 3rem;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(12px);
  text-align: center;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.card-header {
  margin-bottom: 1.5rem;
}

.sparkle-icon {
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 12px rgba(0, 229, 255, 0.5));
}

.sparkle-icon svg {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

h1 {
  font-size: 1.75rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #00e5ff;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

.subtitle {
  color: #9f8cc0;
  font-size: 0.9rem;
  margin: 0;
}

.auth-form {
  margin-top: 2rem;
}

.input-group {
  text-align: left;
  margin-bottom: 1.25rem;
}

.input-group label {
  display: block;
  color: #e0d4f5;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(10, 5, 30, 0.7);
  border: 1.5px solid rgba(88, 60, 120, 0.5);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

input::placeholder {
  color: #6b5b8a;
}

input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

.register-btn {
  width: 100%;
  padding: 0.95rem;
  margin-top: 0.75rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #a855f7 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  background: linear-gradient(135deg, #9b6cf6 0%, #8c4aed 50%, #b865f7 100%);
}

.register-btn:active {
  transform: translateY(0);
}

.login-link {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #9f8cc0;
}

.login-link a {
  color: #00e5ff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.login-link a:hover {
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.error {
  color: #f87171;
  font-size: 0.85rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
}
</style>