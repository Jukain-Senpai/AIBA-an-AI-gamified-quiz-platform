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
          <div class="nav-notification-wrap">
            <button type="button" class="nav-icon-btn" @click.stop="toggleNotifications">
              <span class="material-symbols-outlined">notifications</span>
              <span v-if="unreadNotificationCount > 0" class="notif-badge">{{ unreadNotificationCount }}</span>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showNotifications" class="notifications-dropdown">
                <div class="notifications-head">
                  <strong>Notifications</strong>
                  <button type="button" class="notif-clear-btn" @click="markAllRead" :disabled="unreadNotificationCount === 0">
                    Mark all read
                  </button>
                </div>
                <div v-if="notifications.length === 0" class="notifications-empty">No notifications yet.</div>
                <div v-else class="notifications-list">
                  <button
                    v-for="item in notifications"
                    :key="item.id"
                    type="button"
                    class="notification-item"
                    :class="{ unread: !item.isRead }"
                    @click="openNotification(item)"
                  >
                    <div class="notification-title">{{ item.title }}</div>
                    <div class="notification-message">{{ item.message }}</div>
                    <div class="notification-time">{{ formatNotificationTime(item.createdAt) }}</div>
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <router-link to="/profile" class="nav-item">
            <span class="nav-avatar-frame" :class="{ admin: isAdminUser }">
              <img :src="navAvatarUrl" class="nav-avatar" alt="Profile" />
            </span>
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
import api, { getImageUrl } from './services/api';
import { getCurrentUserRole } from './services/session';

export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token"),
      currentUserRole: getCurrentUserRole(),
      currentUserAvatar: '',
      notifications: [],
      unreadNotificationCount: 0,
      showNotifications: false,
      notificationPoller: null,
    };
  },
  async mounted() {
    await this.syncAuthState();
    window.addEventListener('click', this.handleDocumentClick);
    this.notificationPoller = setInterval(() => {
      if (this.isLoggedIn && !this.showNotifications) {
        this.loadNotifications();
      }
    }, 30000);
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
        '/forgot-password': 'Forgot Password',
        '/reset-password': 'Reset Password',
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
    },
    navAvatarUrl() {
      return this.currentUserAvatar ? getImageUrl(this.currentUserAvatar) : '/src/assets/Profile.svg';
    }
  },
  methods: {
    async loadNotifications() {
      if (!this.isLoggedIn) return;
      try {
        const [itemsRes, countRes] = await Promise.all([
          api.get('/notifications', { params: { limit: 20 } }),
          api.get('/notifications/unread-count'),
        ]);
        this.notifications = itemsRes.data.items || [];
        this.unreadNotificationCount = countRes.data.count || 0;
      } catch (err) {
        this.notifications = [];
        this.unreadNotificationCount = 0;
      }
    },
    async toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        await this.loadNotifications();
        await this.markAllRead();
      }
    },
    async markAllRead() {
      if (!this.isLoggedIn || this.unreadNotificationCount === 0) return;
      try {
        await api.patch('/notifications/read-all');
        this.unreadNotificationCount = 0;
        this.notifications = this.notifications.map((item) => ({ ...item, isRead: true }));
      } catch (err) {
        // ignore
      }
    },
    async openNotification(item) {
      try {
        await api.patch(`/notifications/${item.id}/read`);
        this.notifications = this.notifications.map((notif) =>
          notif.id === item.id ? { ...notif, isRead: true } : notif
        );
        const unread = this.notifications.filter((notif) => !notif.isRead).length;
        this.unreadNotificationCount = unread;
        this.showNotifications = false;
        if (item.link) {
          this.$router.push(item.link);
        }
      } catch (err) {
        if (item.link) {
          this.$router.push(item.link);
        }
      }
    },
    formatNotificationTime(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return date.toLocaleDateString();
    },
    async syncAuthState() {
      this.isLoggedIn = !!localStorage.getItem("token");
      this.currentUserRole = getCurrentUserRole();
      if (!this.isLoggedIn) {
        this.currentUserAvatar = '';
        return;
      }

      try {
        const res = await api.get('/users/me');
        this.currentUserAvatar = res.data.avatar || '';
        this.currentUserRole = (res.data.role || this.currentUserRole || '').toLowerCase();
        await this.loadNotifications();
      } catch (err) {
        this.currentUserAvatar = '';
      }
    },
    handleDocumentClick() {
      this.showNotifications = false;
    },
    logout() {
      localStorage.removeItem("token");
      this.syncAuthState();
      this.$router.push("/login");
    }
  },
  beforeUnmount() {
    window.removeEventListener('click', this.handleDocumentClick);
    if (this.notificationPoller) {
      clearInterval(this.notificationPoller);
      this.notificationPoller = null;
    }
  },
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
  align-items: center;
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

.nav-avatar-frame {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #4231cf;
  background: #e8e5ff;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px rgba(66, 49, 207, 0.12);
  flex-shrink: 0;
}

.nav-avatar-frame.admin {
  border-color: #007657;
  background: #d9fff0;
  box-shadow: 0 0 0 3px rgba(0, 118, 87, 0.14);
}

.nav-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.nav-notification-wrap {
  position: relative;
}

.nav-icon-btn {
  position: relative;
  border: none;
  background: transparent;
  color: #6B6B8A;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.nav-icon-btn .material-symbols-outlined {
  font-size: 24px;
}

.nav-icon-btn:hover {
  color: #5B4FE8;
  background: rgba(91, 79, 232, 0.1);
}

.notif-badge {
  position: absolute;
  top: 2px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9999px;
  background: #ba1a1a;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.notifications-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 340px;
  max-height: 420px;
  background: #fff;
  border: 1px solid #e2e0f0;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(91, 79, 232, 0.16);
  overflow: hidden;
  z-index: 1200;
}

.notifications-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #efeafc;
}

.notif-clear-btn {
  border: none;
  background: transparent;
  color: #4231cf;
  font-weight: 700;
  cursor: pointer;
}

.notif-clear-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.notifications-list {
  max-height: 360px;
  overflow: auto;
}

.notification-item {
  width: 100%;
  text-align: left;
  border: none;
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f0ff;
  cursor: pointer;
}

.notification-item.unread {
  background: #f7f5ff;
}

.notification-item:hover {
  background: #efeaff;
}

.notification-title {
  font-size: 14px;
  font-weight: 800;
  color: #1a1a2e;
}

.notification-message {
  margin-top: 4px;
  font-size: 13px;
  color: #464555;
  line-height: 1.4;
}

.notification-time,
.notifications-empty {
  margin-top: 6px;
  font-size: 12px;
  color: #777586;
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
