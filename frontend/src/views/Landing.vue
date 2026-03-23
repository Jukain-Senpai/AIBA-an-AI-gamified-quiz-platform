<template>
    <div class="landing-wrapper">
        <section class="hero">
            <div class="hero-left">
                <h1>Learn, Play, Evolve<br /> Shape How Your Study Path Now </h1>
                <p class="hero-subtitle">
                    AI-powered quizzes, dynamic skill trees, and a community-driven forum - All in one immersive learning ecosystem.
                </p>

                <div class="hero-buttons">
                    <router-link to="/register" class="primary-btn">
                        Begin Your Journey
                    </router-link>
                    <router-link to="/login" class="secondary-btn">
                        Login
                    </router-link>
                </div>
            </div>

            <div class="hero-right">
                <img src="/src/assets/Progression.png" class="hero-illustration" />
            </div>
        </section>

        <section class ="feature-section">
            <div class="feature-image">
                <img src="/src/assets/Skills.png" />
            </div>
            <div class="feature-text">
                <h2> Dynamic Skill Tree System</h2>
                <p>
                Choose your learning path and unlock branches of knowledge.
                Your avatar evolves based on your chosen skills —
                every decision shapes your progression.              
                </p>
            </div>
        </section>
        <section class="feature-section reverse">
            <div class="feature-image">
                <img src="/src/assets/AI.png" />
            </div>
            <div class="feature-text">
                <h2> AI Quiz Engine</h2>
                <p>
                Intelligent question generation and adaptive difficulty ensure
                every quiz matches your level and pushes you forward.
                </p>
            </div>
        </section>

        <section class="feature-section">
            <div class="feature-image">
                <img src="/src/assets/Forum.png" />
            </div>
            <div class="feature-text">
                <h2> community Forum</h2>
                <p>
                Discuss strategies, share knowledge, and grow together.
                Learning becomes collaborative — not isolated.
                </p>
            </div>
        </section>

        <section class="how-it-works">
            <h2>How Everything Connects</h2>

            <div class="steps">
                <div class="step-card">
                    <img src="/src/assets/StepRegister.png" />
                    <p>Register & Create Avatar</p>
                </div>

                <div class="step-card">
                    <img src="/src/assets/StepQuiz.png" />
                    <p>AI Quizzes</p>
                </div> 
                
                <div class="step-card">
                    <img src="/src/assets/StepSkill.png" />
                    <p>Unlock Skill Branches</p>
                </div>  
                
                <div class="step-card">
                    <img src="/src/assets/StepForum.png" />
                    <p>Engage in Forum</p>
                </div>                
            </div>
        </section>

        <section class="final-cta">
            <h2>Ready to Build Your Legend?</h2>
            <router-link to="/register" class="primary-btn">
                Create Your Hero
            </router-link>
        </section>
    </div>
</template>

<script>
export default {
  name: "Landing"
};
</script>

<style scoped>
/* Override centered layout from App.vue */
.landing-wrapper {
  width: 100%;
  padding: 4rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

/* HERO */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.hero-left {
  max-width: 600px;
}

.hero h1 {
  font-size: 3rem;
  color: #00e5ff;
  text-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  color: #9f8cc0;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.primary-btn {
  padding: 0.9rem 1.8rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
  transition: 0.3s;
}

.primary-btn:hover {
  transform: translateY(-2px);
}

.secondary-btn {
  padding: 0.9rem 1.8rem;
  border-radius: 10px;
  border: 1px solid rgba(139, 92, 246, 0.4);
  color: #a78bfa;
  text-decoration: none;
  transition: 0.3s;
}

.secondary-btn:hover {
  background: rgba(139, 92, 246, 0.15);
}

.hero-right {
  flex: 1; /* take half of hero */
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-illustration {
  width: 100%;
  max-width: 600px; /* control max size */
  height: auto;

  filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.5));
}

/* FEATURE SECTIONS */
.feature-section {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.feature-section.reverse {
  flex-direction: row-reverse;
}

.feature-text h2 {
  color: #00e5ff;
  margin-bottom: 1rem;
}

.feature-text p {
  color: #b8a7d9;
  line-height: 1.6;
}

.feature-image img {
  width: 280px;
}

/* HOW IT WORKS */
.how-it-works {
  text-align: center;
}

.how-it-works h2 {
  color: #00e5ff;
  margin-bottom: 3rem;
}

.steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.step-card {
  background: rgba(30, 15, 55, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.25);
  padding: 1.5rem;
  border-radius: 12px;
  width: 180px;
  backdrop-filter: blur(12px);
  transition: 0.3s;
}

.step-card:hover {
  transform: translateY(-5px);
}

.step-card img {
  width: 40px;
  margin-bottom: 1rem;
}

.step-card p {
  color: #9f8cc0;
  font-size: 0.9rem;
}

/* FINAL CTA */
.final-cta {
  text-align: center;
  padding: 3rem;
  background: rgba(30, 15, 55, 0.4);
  border-radius: 16px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.final-cta h2 {
  margin-bottom: 2rem;
  color: #00e5ff;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero {
    flex-direction: column;
    text-align: center;
  }

  .feature-section,
  .feature-section.reverse {
    flex-direction: column;
    text-align: center;
  }

  .steps {
    flex-direction: column;
    align-items: center;
  }

  .landing-wrapper {
    padding: 3rem 2rem;
  }
}
</style>