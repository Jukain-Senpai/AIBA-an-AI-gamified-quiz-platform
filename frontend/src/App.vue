<template>
  <div class="app-wrapper">

    <div class="page-indicator">
      <span class="indicator-dot"></span>
      <span class="indicator-text">{{ currentPageName }}</span>
    </div>

    <nav class="navbar">

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
        <router-link to="/profile" class="nav-item">
          <img src="/src/assets/Profile.svg" class="nav-icon" />
          <span>Profile</span>
        </router-link>
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
export default {
  computed: {
    currentPageName() {
      const routeNames = {
        '/': 'Home',
        '/login': 'Login Page',
        '/register': 'Register',
        '/quizzes': 'Quizzes',
        '/skills': 'Skills',
        '/forum': 'Forum',
        '/profile': 'Profile'
      };
      return routeNames[this.$route.path] || 'MysticQuest';
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
  background-color: #0d0221;
  color: #ffffff;
  overflow-x: hidden;
}

.app-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: 
    radial-gradient(ellipse at 80% 20%, rgba(88, 28, 135, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 20% 80%, rgba(59, 7, 100, 0.3) 0%, transparent 50%),
    linear-gradient(180deg, #1a0a2e 0%, #0d0221 100%);
}

/* Page Indicator Bar */
.page-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 20px;
  background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%);
  font-size: 0.8rem;
  font-weight: 500;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.8);
}

.indicator-text {
  color: #ffffff;
  letter-spacing: 0.3px;
}

/* 2. Full-Width Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background: linear-gradient(180deg, #1e1040 0%, #150a28 100%);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.5));
}

.nav-icon {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

.logo-text {
  color: #00e5ff;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
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
  color: #a78bfa;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-icon {
  width: 18px;
  height: 18px;
  opacity: 0.9;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #ffffff;
  background: rgba(139, 92, 246, 0.15);
}

.nav-item:hover .nav-icon,
.nav-item.router-link-active .nav-icon {
  opacity: 1;
}

/* 3. Center the Login card in the remaining space */
.content {
  flex: 1;
  padding: 2rem;
}

/* 4. Full-Width Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 3rem;
  font-size: 0.8rem;
  color: #6b5b8a;
  background: rgba(13, 2, 33, 0.98);
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.footer-left {
  color: #6b5b8a;
}

.footer-right {
  display: flex;
  gap: 1.5rem;
}

.footer-right a {
  color: #6b5b8a;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-right a:hover {
  color: #a78bfa;
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