<template>
  <div class="skills-page">
    <div class="skills-header">
      <h1 class="title">Skill Tree</h1>
      <div class="sp-badge">
        <span class="sp-label">Available Points: </span>
        <span class="sp-value">{{ userSP }} SP</span>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading Skills...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchData" class="btn btn-primary">Retry</button>
    </div>

    <div v-else class="skill-tree-container">
      <!-- Strength Path -->
      <div class="skill-path">
        <div class="path-header">
          <h3 class="path-title knight-color">Strength Path</h3>
          <p class="path-subtitle">Knight</p>
        </div>

        <SkillNode 
          :skill="getSkillByName('Shield Mastery')" 
          :isUnlocked="isUnlocked('Shield Mastery')"
          colorTheme="red"
          icon="Shield.jpg"
          @unlock="unlockSkill"
        />
        <div class="path-connector red-connector"></div>
        <SkillNode 
          :skill="getSkillByName('Battle Fury')" 
          :isUnlocked="isUnlocked('Battle Fury')"
          :isLockedByPrereq="!isUnlocked('Shield Mastery')"
          colorTheme="red"
          icon="Fury.jpg"
          @unlock="unlockSkill"
        />
      </div>

      <!-- Intelligence Path -->
      <div class="skill-path">
        <div class="path-header">
          <h3 class="path-title mage-color">Intelligence Path</h3>
          <p class="path-subtitle">Mage</p>
        </div>

        <SkillNode 
          :skill="getSkillByName('Incantation')" 
          :isUnlocked="isUnlocked('Incantation')"
          colorTheme="cyan"
          icon="Incantation.jpg"
          @unlock="unlockSkill"
        />
        <div class="path-connector cyan-connector"></div>
        <SkillNode 
          :skill="getSkillByName('Arcane Knowledge')" 
          :isUnlocked="isUnlocked('Arcane Knowledge')"
          :isLockedByPrereq="!isUnlocked('Incantation')"
          colorTheme="cyan"
          icon="Arcane.jpg"
          @unlock="unlockSkill"
        />
      </div>

      <!-- Social Path -->
      <div class="skill-path">
        <div class="path-header">
          <h3 class="path-title bard-color">Social Path</h3>
          <p class="path-subtitle">Bard</p>
        </div>

        <SkillNode 
          :skill="getSkillByName('Healing Song')" 
          :isUnlocked="isUnlocked('Healing Song')"
          colorTheme="emerald"
          icon="Healing.jpg"
          @unlock="unlockSkill"
        />
        <div class="path-connector emerald-connector"></div>
        <SkillNode 
          :skill="getSkillByName('Crowd Mentality')" 
          :isUnlocked="isUnlocked('Crowd Mentality')"
          :isLockedByPrereq="!isUnlocked('Healing Song')"
          colorTheme="emerald"
          icon="Crowd.jpg"
          @unlock="unlockSkill"
        />
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import SkillNode from '../components/SkillNode.vue';

export default {
  name: 'Skills',
  components: {
    SkillNode
  },
  data() {
    return {
      loading: true,
      error: null,
      skills: [],
      userSkills: [],
      userSP: 0,
      userLevel: 1
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const [skillsRes, userRes] = await Promise.all([
          api.get('/skills'),
          api.get('/users/me')
        ]);
        
        this.skills = skillsRes.data;
        this.userSkills = userRes.data.unlockedSkills || [];
        this.userSP = userRes.data.stats.skillPoints || 0;
        this.userLevel = userRes.data.level || 1;
        
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          this.$router.push("/login");
        } else {
          this.error = "Failed to load skills.";
          console.error(err);
        }
      } finally {
        this.loading = false;
      }
    },
    getSkillByName(name) {
      return this.skills.find(s => s.name === name) || { name, cost: 0, requiredLevel: 1, description: '' };
    },
    isUnlocked(name) {
      return this.userSkills.includes(name);
    },
    async unlockSkill(skill) {
      if (this.isUnlocked(skill.name)) return;

      if (this.userLevel < skill.requiredLevel) {
        alert(`You must be level ${skill.requiredLevel} to unlock this skill.`);
        return;
      }

      if (this.userSP < skill.cost) {
        alert(`Not enough Skill Points. Requires ${skill.cost} SP.`);
        return;
      }

      try {
        await api.post(`/skills/${skill.id}/unlock`);
        // Refresh data to show unlocked state and updated SP
        await this.fetchData();
        alert(`Successfully unlocked ${skill.name}!`);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to unlock skill.");
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.skills-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.skills-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.2rem;
  background: linear-gradient(90deg, #22d3ee, #a855f7);
  -webkit-background-clip: text;
  color: transparent;
  margin: 0;
}

.sp-badge {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(168, 85, 247, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.sp-label {
  color: #d8b4fe;
  font-size: 0.9rem;
}

.sp-value {
  color: #fbbf24;
  font-size: 1.2rem;
  font-weight: bold;
}

.skill-tree-container {
  display: flex;
  justify-content: space-around;
  background: rgba(30, 41, 59, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 16px;
  padding: 3rem;
}

.skill-path {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.path-header {
  text-align: center;
  margin-bottom: 2rem;
}

.path-title {
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
}

.knight-color { color: #f87171; }
.mage-color { color: #22d3ee; }
.bard-color { color: #34d399; }

.path-subtitle {
  font-size: 0.85rem;
  color: rgba(216, 180, 254, 0.6);
  margin: 0;
}

.path-connector {
  width: 2px;
  height: 3rem;
  margin: 0.5rem 0;
}

.red-connector { background: rgba(248, 113, 113, 0.3); }
.cyan-connector { background: rgba(34, 211, 238, 0.3); }
.emerald-connector { background: rgba(52, 211, 153, 0.3); }

.loading-state, .error-state {
  text-align: center;
  padding: 3rem;
  color: white;
}
</style>
