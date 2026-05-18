<template>
    <div class="landing-wrapper">
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-content">
                <div class="hero-left">
                    <div class="badge">
                        <span class="material-symbols-outlined icon">bolt</span>
                        <span class="badge-text">Powered by AI</span>
                    </div>
                    <h1>Learn Smarter.<br/>Level Up Faster.</h1>
                    <p class="hero-subtitle">
                        Join thousands of students turning knowledge into power. Complete quizzes, earn XP, and unlock real-world skills through our adaptive learning engine.
                    </p>
                    <div class="hero-buttons">
                        <router-link to="/register" class="primary-btn faux-3d-amber">
                            Start Your Journey
                        </router-link>
                        <router-link to="/quizzes" class="secondary-btn">
                            Browse Quizzes
                        </router-link>
                    </div>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <span class="stat-number">10,000+</span>
                            <span class="stat-label">Quizzes</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">50,000+</span>
                            <span class="stat-label">Players</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">500+</span>
                            <span class="stat-label">Topics</span>
                        </div>
                    </div>
                </div>

                <div class="hero-right">
                    <div class="illustration-container">
                        <div class="blob primary-blob"></div>
                        <div class="blob secondary-blob"></div>
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk2TZn2z96_oa6Yz9jYos-wRyHULct1XUnQ5oGdo-p6OOkk-TTIuTYEtfoPj7pwUWMcMtj_Or61N3boIMBoeoEL1UnK0irB2MbEGNZRyrzH1PUzCFtvoW80U2bSXZWjajJfLD7JgsRDffdIXsV6xgF05wqwlRjc93ObhuOt4fHUm4HMOhhxmKvAKYUVd0BzOc1Vn0z0dtEsB2ZyAVPUZVTXv-BIiLfHGoCB5T0U6FBvfzHUzbA3fAecicgCCPYwee1hpkRI44sYLcK" class="hero-illustration bouncy-hover" alt="Student learning" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
            <div class="features-header">
                <h2>Level Up Your Learning</h2>
                <div class="header-underline"></div>
            </div>
            <div class="features-grid">
                <!-- Feature Card 1 -->
                <div class="feature-card bouncy-hover indigo-glow-shadow">
                    <div class="feature-icon-wrapper tertiary-bg">
                        <span class="material-symbols-outlined icon">account_tree</span>
                    </div>
                    <h3>Skill Tree</h3>
                    <p>
                        Navigate through personalized learning paths. Unlock special abilities and mastery badges as you level up your expertise.
                    </p>
                </div>

                <!-- Feature Card 2 -->
                <div class="feature-card bouncy-hover indigo-glow-shadow">
                    <div class="feature-icon-wrapper primary-bg">
                        <span class="material-symbols-outlined icon">psychology</span>
                    </div>
                    <h3>AI Evaluation</h3>
                    <p>
                        Our smart engine adjusts difficulty in real-time. Experience quizzes that grow with you, ensuring you're always challenged but never overwhelmed.
                    </p>
                </div>

                <!-- Feature Card 3 -->
                <div class="feature-card bouncy-hover indigo-glow-shadow">
                    <div class="feature-icon-wrapper secondary-bg">
                        <span class="material-symbols-outlined icon">groups</span>
                    </div>
                    <h3>Community</h3>
                    <p>
                        Challenge friends, join study guilds, and climb the global ranks. Learning is better when you're part of a thriving ecosystem.
                    </p>
                </div>
            </div>
        </section>

        <!-- CTA Banner -->
        <section class="cta-section">
            <div class="cta-banner">
                <div class="cta-blob top-blob"></div>
                <div class="cta-blob bottom-blob"></div>
                <h2 class="cta-title">Ready to start your first quest?</h2>
                <p class="cta-subtitle">
                    Create an account today and get a free 7-day boost to your XP gains. Join over 50,000 learners already mastering their subjects.
                </p>
                <div class="cta-buttons">
                    <router-link to="/register" class="cta-primary-btn faux-3d-amber shadow-lg">
                        Create Free Account
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
  name: "Landing"
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');

.landing-wrapper {
  font-family: 'Inter', sans-serif;
  background-color: #fcf8ff;
  color: #1a1a2e;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

.bouncy-hover {
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.bouncy-hover:hover {
  transform: translateY(-4px) scale(1.02);
}
.bouncy-hover:active {
  transform: translateY(0) scale(0.98);
}
.faux-3d-amber {
  box-shadow: 0 4px 0 #6b4b00;
  transition: all 0.2s ease;
}
.faux-3d-amber:active {
  box-shadow: 0 0 0 #6b4b00;
  transform: translateY(4px);
}
.indigo-glow-shadow {
  box-shadow: 0 10px 30px -10px rgba(91, 79, 232, 0.2);
}

.hero-section {
  background: linear-gradient(135deg, #f5f2ff 0%, #efecff 100%);
  padding: 4rem 1.5rem;
  display: flex;
  justify-content: center;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 768px) {
  .hero-section {
    padding: 6rem 2.5rem;
  }
  .hero-content {
    flex-direction: row;
  }
}

.hero-left {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 10;
}

@media (min-width: 768px) {
  .hero-left {
    width: 50%;
    align-items: flex-start;
    text-align: left;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  background-color: #ffb702;
  border: 1px solid rgba(125, 88, 0, 0.2);
  border-radius: 9999px;
  margin-bottom: 2rem;
}
.badge .icon {
  font-size: 18px;
  color: #6b4b00;
}
.badge-text {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #6b4b00;
}

.hero-left h1 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 3rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  font-weight: 800;
  color: #4231cf;
  margin: 0 0 2rem 0;
}
@media (min-width: 768px) {
  .hero-left h1 {
    font-size: 48px;
  }
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #464555;
  max-width: 32rem;
  margin: 0 0 2rem 0;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}
@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
    width: auto;
  }
}

.primary-btn {
  padding: 1rem 2.5rem;
  background-color: #ffb702;
  color: #6b4b00;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
}

.secondary-btn {
  padding: 1rem 2.5rem;
  background-color: transparent;
  color: #4231cf;
  border: 2px solid #4231cf;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  cursor: pointer;
}
.secondary-btn:hover {
  background-color: rgba(66, 49, 207, 0.05);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(200, 196, 216, 0.3);
  justify-content: center;
  width: 100%;
}
@media (min-width: 768px) {
  .hero-stats {
    justify-content: flex-start;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-number {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #4231cf;
  line-height: 1.4;
}
.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #464555;
  line-height: 1.2;
}

.hero-right {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
@media (min-width: 768px) {
  .hero-right {
    width: 50%;
  }
}

.illustration-container {
  position: relative;
  width: 100%;
  max-width: 28rem;
  aspect-ratio: 1 / 1;
}

.blob {
  position: absolute;
  width: 16rem;
  height: 16rem;
  border-radius: 9999px;
  filter: blur(48px);
}
.primary-blob {
  top: -2.5rem;
  right: -2.5rem;
  background-color: rgba(66, 49, 207, 0.1);
}
.secondary-blob {
  bottom: -2.5rem;
  left: -2.5rem;
  background-color: rgba(125, 88, 0, 0.1);
}

.hero-illustration {
  width: 100%;
  height: auto;
  position: relative;
  z-index: 10;
  filter: drop-shadow(0 25px 25px rgba(0,0,0,0.15));
}

.features-section {
  padding: 6rem 1.5rem;
  background-color: #fcf8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width: 768px) {
  .features-section {
    padding: 6rem 2.5rem;
  }
}

.features-header {
  text-align: center;
  margin-bottom: 4rem;
}
.features-header h2 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}
.header-underline {
  width: 6rem;
  height: 0.375rem;
  background-color: #5b4fe8;
  margin: 0 auto;
  border-radius: 9999px;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
}
@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid rgba(200, 196, 216, 0.3);
  display: flex;
  flex-direction: column;
}

.feature-icon-wrapper {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.feature-icon-wrapper.tertiary-bg {
  background-color: #54fdc4;
}
.feature-icon-wrapper.tertiary-bg .icon {
  color: #002116;
}
.feature-icon-wrapper.primary-bg {
  background-color: #e3dfff;
}
.feature-icon-wrapper.primary-bg .icon {
  color: #4231cf;
}
.feature-icon-wrapper.secondary-bg {
  background-color: #ffdea9;
}
.feature-icon-wrapper.secondary-bg .icon {
  color: #7d5800;
}
.feature-icon-wrapper .icon {
  font-size: 32px;
}

.feature-card h3 {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}
.feature-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #464555;
  margin: 0;
}

.cta-section {
  padding: 0 1.5rem 6rem 1.5rem;
  display: flex;
  justify-content: center;
  background-color: #fcf8ff;
}
@media (min-width: 768px) {
  .cta-section {
    padding: 0 2.5rem 6rem 2.5rem;
  }
}

.cta-banner {
  background-color: #5b4fe8;
  border-radius: 32px;
  padding: 3rem;
  text-align: center;
  color: #e8e4ff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 1200px;
  width: 100%;
}
@media (min-width: 768px) {
  .cta-banner {
    padding: 4rem;
  }
}

.cta-blob {
  position: absolute;
  background-color: rgba(232, 228, 255, 0.1);
  border-radius: 9999px;
}
.top-blob {
  top: 0;
  left: 0;
  width: 8rem;
  height: 8rem;
  transform: translate(-4rem, -4rem);
}
.bottom-blob {
  bottom: 0;
  right: 0;
  width: 12rem;
  height: 12rem;
  transform: translate(6rem, 6rem);
}

.cta-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.3;
  margin: 0 0 1.5rem 0;
  position: relative;
  z-index: 10;
  color: #ffffff;
}
.cta-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: #e3dfff;
  max-width: 42rem;
  margin: 0 auto 2.5rem auto;
  position: relative;
  z-index: 10;
}
.cta-buttons {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.cta-primary-btn {
  padding: 1rem 3rem;
  background-color: #ffb702;
  color: #6b4b00;
  border-radius: 9999px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s;
}
.cta-primary-btn:hover {
  filter: brightness(1.1);
}
.cta-primary-btn:active {
  transform: scale(0.95);
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>