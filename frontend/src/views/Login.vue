<template>
 <div class="auth-container">
  <h1>Login</h1>

  <form @submit.prevent="handleLogin">
    <input 
    type="email"
    placeholder="Email"
    v-model="email"
    required
    />
    <input
    type="password"
    placeholder="Password"
    v-model="password"
    required
    />
    <button type="submit">Login</button>
    <p v-if="error" class="error">{{ error }}</p>
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
        async handleLogin() {
            try {
                const res = await api.post("/auth/login", {
                    email: this.email,
                    password: this.password,
                });

                localStorage.setItem("token", res.data.token);
                this.$router.push("/quizzes");
            } catch (err) {
                this.error = 
                err.response?.data?.message || "Login failed.";
            }
        },
    },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

button {
  width: 100%;
  padding: 0.5rem;
}

.error {
  margin-top: 1rem;
  color: red;
}
</style>