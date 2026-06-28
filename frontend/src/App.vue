<template>
  <div class="app-wrapper">

    <div v-if="!isQuizPlayRoute" class="page-indicator">
      <span class="indicator-dot"></span>
      <span class="indicator-text">{{ currentPageName }}</span>
    </div>

    <nav v-if="!isQuizPlayRoute" class="navbar">

      <div class="nav-left">
        
        <img
          src="/src/assets/Logo.svg" 
          alt="AIBA Logo" 
          class="logo-icon"
        />
        <span class="logo-text">AIBA</span>
      </div>
      <div class="nav-links">
        <router-link to="/" class="nav-item">
          <img src="/src/assets/Home.svg" class="nav-icon" />
          <span>Home</span>
        </router-link>

        <!-- Logged In Links -->
        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="nav-item">
            <img src="/src/assets/Dashboard.svg" class="nav-icon" />
            <span>Dashboard</span>
          </router-link>
          <router-link to="/quizzes" class="nav-item">
            <img src="/src/assets/Quiz.svg" class="nav-icon" />
            <span>Quizzes</span>
          </router-link>
          <router-link to="/skills" class="nav-item">
            <img src="/src/assets/Skills.svg" class="nav-icon" />
            <span>Skills</span>
          </router-link>
          <router-link to="/forum" class="nav-item">
            <img src="/src/assets/Forum.svg" class="nav-icon" />
            <span>Forum</span>
          </router-link>
          <router-link v-if="isAdminUser" to="/admin" class="nav-item">
            <img src="/src/assets/Dashboard.svg" class="nav-icon" />
            <span>Admin</span>
          </router-link>
          <router-link to="/profile" class="nav-item">
            <img src="/src/assets/Profile.svg" class="nav-icon" />
            <span>Profile</span>
          </router-link>
        </template>

        <!-- Logged Out Links -->
        <template v-else>
          <router-link to="/login" class="nav-item">
            <span>Login</span>
          </router-link>
          <router-link to="/register" class="nav-item">
            <span>Register</span>
          </router-link>
        </template>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-left">© 2026 AIBA. All rights reserved.</div>
      <div class="footer-right">
        <a href="#">Terms</a>
        <a href="#">Privacy</a>
        <a href="#">Help</a>
      </div>
    </footer>
  </div>
</template>

<script>
import { getCurrentUserRole } from './services/session';

export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token"),
      currentUserRole: getCurrentUserRole()
    };
  },
  watch: {
    // Re-check login status whenever the route changes
    $route() {
      this.syncAuthState();
    }
  },
  computed: {
    currentPageName() {
      const routeNames = {
        '/': 'Home',
        '/login': 'Login Page',
        '/register': 'Register',
        '/dashboard': 'Dashboard',
        '/quizzes': 'Quizzes',
        '/admin': 'Admin',
        '/skills': 'Skills',
        '/forum': 'Forum',
        '/profile': 'Profile'
      };
      return routeNames[this.$route.path] || 'MysticQuest';
    },
    isAdminUser() {
      return this.currentUserRole === 'admin';
    },
    isQuizPlayRoute() {
      return this.$route.path.startsWith('/quizzes/') && this.$route.params.id;
    }
  },
  methods: {
    syncAuthState() {
      this.isLoggedIn = !!localStorage.getItem("token");
      this.currentUserRole = getCurrentUserRole();
    },
    logout() {
      localStorage.removeItem("token");
      this.syncAuthState();
      this.$router.push("/login");
    }
  }
};
</script>

<style>
/* 1. Global Reset to prevent "Box" mode */
* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: #FFFDF7;
  color: #1A1A2E;
  overflow-x: hidden;
}

.app-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #FFFDF7;
}

/* Page Indicator Bar */
.page-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 20px;
  background: linear-gradient(90deg, #5B4FE8 0%, #a855f7 100%);
  font-size: 0.8rem;
  font-weight: 500;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #06D6A0;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(6, 214, 160, 0.8);
}

.indicator-text {
  color: #ffffff;
  letter-spacing: 0.3px;
  font-family: 'Nunito Sans', sans-serif;
}

/* 2. Full-Width Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: #ffffff;
  border-bottom: 1px solid #E2E0F0;
  box-shadow: 0 2px 10px rgba(91, 79, 232, 0.05);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 28px;
  height: 28px;
}

.logo-text {
  color: #5B4FE8;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #6B6B8A;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-icon {
  width: 18px;
  height: 18px;
  opacity: 0.7;
  /* Approximating #6B6B8A from black using CSS filters */
  filter: brightness(0) saturate(100%) invert(43%) sepia(21%) saturate(541%) hue-rotate(206deg) brightness(95%) contrast(92%); 
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #5B4FE8;
  background: rgba(91, 79, 232, 0.1);
}

.nav-item:hover .nav-icon,
.nav-item.router-link-active .nav-icon {
  opacity: 1;
  /* Approximating #5B4FE8 from black using CSS filters */
  filter: brightness(0) saturate(100%) invert(26%) sepia(77%) saturate(5304%) hue-rotate(242deg) brightness(92%) contrast(92%); 
}

.logout-link {
  color: #EF476F; 
}

.logout-link .nav-icon {
  opacity: 1;
  /* Approximating #EF476F from black */
  filter: brightness(0) saturate(100%) invert(39%) sepia(61%) saturate(1637%) hue-rotate(318deg) brightness(93%) contrast(105%); 
}

.logout-link:hover {
  background: rgba(239, 71, 111, 0.1) !important;
  color: #d83a5c;
}

/* 3. Center the Login card in the remaining space */
.content {
  flex: 1;
}

/* 4. Full-Width Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 3rem;
  font-size: 0.9rem;
  color: #6B6B8A;
  background-color: #F5F3FF;
  border-top: 1px solid #E2E0F0;
}

.footer-left {
  color: #6B6B8A;
}

.footer-right {
  display: flex;
  gap: 1.5rem;
}

.footer-right a {
  color: #6B6B8A;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}

.footer-right a:hover {
  color: #5B4FE8;
}

/* Responsive: Shrink padding on smaller screens */
@media (max-width: 768px) {
  .navbar, .footer {
    padding: 1rem 1.5rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .nav-item span {
    display: none;
  }
  
  .nav-item {
    padding: 8px;
  }
}
</style>
