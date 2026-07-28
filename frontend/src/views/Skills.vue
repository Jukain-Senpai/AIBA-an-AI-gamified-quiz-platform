<template>
  <div class="skill-tree-layout">
    <div class="cosmic-nebula"></div>

    <!-- Static Page Title (scrolls with page) -->
    <h1 class="page-title">Skill Tree</h1>

    <!-- Floating SP Badge (stays in view) -->
    <div class="sp-badge-floating">
      <span class="sp-label">Skill Points: {{ userSP }}</span>
      <img src="/src/assets/icons/ui/star-fill.svg" class="star-icon" />
    </div>

    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Loading Skills...</p>
    </div>

    <div v-else-if="error" class="state-container">
      <p class="error-text">{{ error }}</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <!-- Main Content / Tree Canvas -->
    <main v-else class="tree-canvas">
      <!-- Root Node -->
      <div class="root-node-container">
        <div class="root-node-glow" style="overflow: hidden;">
          <img :src="getAvatarUrl(userAvatar)" class="root-avatar" alt="User avatar" />
        </div>
        <p class="root-label">Choose Your Path</p>
        <div class="root-drop"></div>
      </div>

      <!-- Tree Structure -->
      <div class="tree-branches">
        <!-- Mage Branch -->
        <div class="branch-col">
          <SkillNode 
            :skill="getSkillByName('Incantation')" 
            :isUnlocked="isUnlocked('Incantation')"
            :isSelected="selectedSkill?.name === 'Incantation'"
            themeClass="primary"
            icon="auto_fix_high.svg"
            :hasTopConnector="true"
            @select="selectSkill"
          />
          <SkillNode 
            :skill="getSkillByName('Arcane Knowledge')" 
            :isUnlocked="isUnlocked('Arcane Knowledge')"
            :isLockedByPrereq="!isUnlocked('Incantation')"
            :isSelected="selectedSkill?.name === 'Arcane Knowledge'"
            themeClass="primary"
            icon="lightbulb.svg"
            :hasTopConnector="true"
            @select="selectSkill"
          />
          <h3 class="branch-title primary-text">Mage</h3>
          <img src="/src/assets/icons/mascot/Rabbit2.png" class="branch-mascot" alt="" />
        </div>

        <!-- Bard Branch -->
        <div class="branch-col">
          <div class="horizontal-bar"></div>
          <SkillNode 
            :skill="getSkillByName('Healing Song')" 
            :isUnlocked="isUnlocked('Healing Song')"
            :isSelected="selectedSkill?.name === 'Healing Song'"
            themeClass="tertiary"
            icon="music_note.svg"
            :hasTopConnector="true"
            @select="selectSkill"
          />
          <SkillNode 
            :skill="getSkillByName('Crowd Mentality')" 
            :isUnlocked="isUnlocked('Crowd Mentality')"
            :isLockedByPrereq="!isUnlocked('Healing Song')"
            :isSelected="selectedSkill?.name === 'Crowd Mentality'"
            themeClass="tertiary"
            icon="groups.svg"
            :hasTopConnector="true"
            @select="selectSkill"
          />
          <h3 class="branch-title tertiary-text">Bard</h3>
          <img src="/src/assets/icons/mascot/Cat2.png" class="branch-mascot" alt="" />
        </div>

        <!-- Knight Branch -->
        <div class="branch-col">
          <SkillNode 
            :skill="getSkillByName('Shield Mastery')" 
            :isUnlocked="isUnlocked('Shield Mastery')"
            :isSelected="selectedSkill?.name === 'Shield Mastery'"
            themeClass="secondary"
            icon="shield.svg"
            :hasTopConnector="true"
            @select="selectSkill"
          />
          <SkillNode 
            :skill="getSkillByName('Battle Fury')" 
            :isUnlocked="isUnlocked('Battle Fury')"
            :isLockedByPrereq="!isUnlocked('Shield Mastery')"
            :isSelected="selectedSkill?.name === 'Battle Fury'"
            themeClass="secondary"
            icon="swords.svg"
            :hasTopConnector="true"
            @select="selectSkill"
          />
          <h3 class="branch-title secondary-text">Knight</h3>
          <img src="/src/assets/icons/mascot/Wolf2.png" class="branch-mascot" alt="" />
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="selectedSkill" class="modal-backdrop">
        <div class="detail-modal">
          <div class="modal-glow" :class="getThemeClass(selectedSkill) + '-glow-bg'"></div>
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-icon-box" :class="getThemeClass(selectedSkill) + '-box'">
                <img :src="getIconForSkill(selectedSkill.name)" class="modal-icon" :class="getThemeClass(selectedSkill) + '-icon-color'" />
              </div>
              <button class="close-btn hover-bg-white-10" @click="closeModal">
                <img src="/src/assets/icons/navigation/close.svg" class="icon-gray" />
              </button>
            </div>
            
            <h2 class="modal-title">{{ selectedSkill.name }}</h2>
            <p class="modal-desc">{{ selectedSkill.description }}</p>
            
            <div class="modal-stats">
              <div class="stat-col">
                <span class="stat-label">Cost</span>
                <span class="stat-val cost-val">
                  {{ selectedSkill.cost }} SP
                  <img src="/src/assets/icons/ui/star-fill.svg" class="small-star" />
                </span>
              </div>
              <div class="stat-col right">
                <span class="stat-label">Requirement</span>
                <span class="stat-val req-val">Level {{ selectedSkill.requiredLevel }}</span>
              </div>
            </div>

            <button 
              v-if="!isUnlocked(selectedSkill.name)"
              class="unlock-btn" 
              :class="getThemeClass(selectedSkill) + '-btn'"
              @click="unlockSkill(selectedSkill)"
            >
              <span>Unlock Skill</span>
              <img src="/src/assets/icons/ui/star-fill.svg" class="btn-icon" />
            </button>
            <button 
              v-else-if="!isEquipped(selectedSkill.name)"
              class="unlock-btn" 
              :class="getThemeClass(selectedSkill) + '-btn'"
              :disabled="equippedSkills.length >= 3 || savingLoadout"
              @click="equipSkill(selectedSkill)"
            >
              <span v-if="equippedSkills.length >= 3">Loadout Full</span>
              <span v-else>{{ savingLoadout ? 'Saving...' : 'Equip for Quiz' }}</span>
              <img src="/src/assets/icons/ui/star-fill.svg" class="btn-icon" />
            </button>
            <button 
              v-else
              class="unlock-btn disabled-btn" 
              :disabled="savingLoadout"
              @click="unequipSkill(selectedSkill)"
            >
              <span>{{ savingLoadout ? 'Saving...' : 'Unequip from Quiz' }}</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Navigation Shell -->
    <footer class="bottom-shell">
      <div class="shell-content">
        <div class="equipped-section">
          <span class="equipped-label">Equipped:</span>
          <div class="equipped-slots">
            <button
              v-for="slotIndex in 3"
              :key="slotIndex"
              type="button"
              class="slot"
              :class="getEquippedSkill(slotIndex - 1) ? 'filled-slot' : 'empty-slot'"
              :title="getEquippedSkill(slotIndex - 1) ? getEquippedSkill(slotIndex - 1).name : 'Empty slot'"
              :aria-label="getEquippedSkill(slotIndex - 1) ? `Equipped skill: ${getEquippedSkill(slotIndex - 1).name}` : 'Empty skill slot'"
              @click="openEquippedSkill(slotIndex - 1)"
            >
              <template v-if="getEquippedSkill(slotIndex - 1)">
                <img :src="getIconForSkill(getEquippedSkill(slotIndex - 1).name)" class="slot-skill-icon" />
                <span class="slot-skill-name">{{ getEquippedSkill(slotIndex - 1).name }}</span>
                <span class="slot-remove" @click.stop="unequipSkill(getEquippedSkill(slotIndex - 1))">×</span>
              </template>
              <template v-else>
                <img src="/src/assets/icons/ui/add.svg" class="add-icon" />
              </template>
            </button>
          </div>
        </div>
        <button class="go-quiz-btn" :disabled="equippedSkills.length < 3 || savingLoadout" @click="$router.push('/quizzes')">
          <span v-if="equippedSkills.length < 3">Equip 3 Skills</span>
          <span v-else>Go to Quiz</span>
          <img src="/src/assets/icons/ui/rocket_launch-fill.svg" class="rocket-icon" />
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import api, { getImageUrl } from '../services/api';
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
      equippedSkills: [],
      userSP: 0,
      userLevel: 1,
      selectedSkill: null,
      savingLoadout: false,
      userAvatar: ''
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
        this.equippedSkills = Array.isArray(userRes.data.equippedSkills) ? userRes.data.equippedSkills : [];
        this.userSP = userRes.data.stats?.skillPoints || 0;
        this.userLevel = userRes.data.level || 1;
        this.userAvatar = userRes.data.avatar || '';
        
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
    isEquipped(name) {
      return this.equippedSkills.some((skill) => skill.name === name);
    },
    getEquippedSkill(slotIndex) {
      return this.equippedSkills.find((skill) => skill.slot === slotIndex + 1) || null;
    },
    selectSkill(skill) {
      this.selectedSkill = skill;
    },
    closeModal() {
      this.selectedSkill = null;
    },
    getThemeClass(skill) {
      if (!skill) return 'primary';
      if (['Incantation', 'Arcane Knowledge'].includes(skill.name)) return 'primary';
      if (['Healing Song', 'Crowd Mentality'].includes(skill.name)) return 'tertiary';
      if (['Shield Mastery', 'Battle Fury'].includes(skill.name)) return 'secondary';
      return 'primary';
    },
    getAvatarUrl(filename) {
      if (!filename) return '/src/assets/NeonKnight_M.jpg';
      if (filename.startsWith('/uploads/') || filename.startsWith('http')) return getImageUrl(filename);
      return `/src/assets/${filename}`;
    },
    getIconForSkill(name) {
      const iconMap = {
        'Incantation': 'auto_fix_high.svg',
        'Arcane Knowledge': 'lightbulb.svg',
        'Healing Song': 'music_note.svg',
        'Crowd Mentality': 'groups.svg',
        'Shield Mastery': 'shield.svg',
        'Battle Fury': 'swords.svg'
      };
      return `/src/assets/icons/ui/${iconMap[name] || 'star-fill.svg'}`;
    },
    async saveLoadout(nextSkills) {
      this.savingLoadout = true;
      try {
        const ordered = nextSkills.slice(0, 3);
        const res = await api.put('/skills/loadout', {
          skillIds: ordered.map((skill) => skill.id),
        });
        this.equippedSkills = Array.isArray(res.data?.equippedSkills) ? res.data.equippedSkills : [];
      } catch (err) {
        alert(err.response?.data?.message || "Failed to save your skill loadout.");
      } finally {
        this.savingLoadout = false;
      }
    },
    async equipSkill(skill) {
      if (!this.isUnlocked(skill.name) || this.isEquipped(skill.name)) return;

      if (this.equippedSkills.length >= 3) {
        alert("You can only equip 3 skills. Unequip one first.");
        return;
      }

      await this.saveLoadout([...this.equippedSkills, skill]);
    },
    async unequipSkill(skill) {
      if (!skill || !this.isEquipped(skill.name)) return;
      await this.saveLoadout(this.equippedSkills.filter((entry) => entry.name !== skill.name));
    },
    openEquippedSkill(slotIndex) {
      const skill = this.getEquippedSkill(slotIndex);
      if (skill) {
        this.selectedSkill = this.getSkillByName(skill.name);
      }
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
        await this.fetchData(); // Refresh SP and unlock states
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
.skill-tree-layout {
  min-height: 100%;
  background-color: #1A1035;
  background-image: radial-gradient(circle at 50% 50%, #2A1B5A 0%, #1A1035 100%);
  color: #fcf8ff;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
}

.cosmic-nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(rgba(26, 16, 53, 0.75), rgba(26, 16, 53, 0.85)), url('../assets/icons/mascot/Background.png') no-repeat center center;
  background-size: cover;
  filter: blur(6px);
  transform: scale(1.03);
}

/* Static Page Title (positioned absolutely at the top of the relative layout, scrolls naturally) */
.page-title {
  position: absolute;
  top: 40px;
  left: 40px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  z-index: 10;
}

/* Floating SP Badge (fixed in place at the top-right of the viewport) */
.sp-badge-floating {
  position: fixed;
  top: 125px; /* Placed below the global sticky navbar & page indicator */
  right: 40px;
  background: rgba(26, 16, 53, 0.8);
  border: 1px solid rgba(255, 183, 2, 0.3);
  padding: 8px 16px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 40;
}

@media (max-width: 768px) {
  .page-title {
    left: 24px;
    top: 24px;
  }
  .sp-badge-floating {
    right: 24px;
    top: 115px;
  }
}

.sp-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #ffba27;
}

.star-icon {
  width: 18px;
  height: 18px;
  /* Approximate #ffba27 */
  filter: invert(72%) sepia(51%) saturate(1212%) hue-rotate(352deg) brightness(101%) contrast(106%);
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  z-index: 10;
  position: relative;
}

/* Tree Canvas */
.tree-canvas {
  position: relative;
  min-height: auto;
  padding-top: 120px;
  padding-bottom: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.root-node-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.root-node-glow {
  width: 96px;
  height: 96px;
  background: linear-gradient(to bottom right, #4231cf, #5b4fe8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(91, 79, 232, 0.4);
}

.root-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.root-label {
  margin-top: 16px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #c4c0ff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.root-drop {
  width: 4px;
  height: 48px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(39, 224, 169, 0.6));
  margin-top: 16px;
}

.tree-branches {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 96px;
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  margin-top: 64px; /* Space for the horizontal bar and top-connectors */
}

@media (max-width: 768px) {
  .tree-branches {
    grid-template-columns: 1fr;
    gap: 64px;
  }

  .branch-mascot {
    width: 64px;
    height: 64px;
  }
}

.branch-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  position: relative;
}

.branch-mascot {
  width: 300px;
  height: 300px;
  object-fit: contain;
  filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.25));
  margin-top: 4px;
}

.horizontal-bar {
  position: absolute;
  top: -64px; /* Aligns with the top of the SkillNode's top-connector */
  left: calc(-50% - 96px); /* 96px is the grid gap */
  width: calc(200% + 192px); /* Spans 2 full columns plus 2 gaps */
  height: 4px;
  background: linear-gradient(90deg, rgba(66, 49, 207, 0.4) 0%, rgba(39, 224, 169, 0.6) 50%, rgba(255, 183, 2, 0.4) 100%);
  z-index: 0;
}

@media (max-width: 768px) {
  .horizontal-bar {
    display: none;
  }
}

.branch-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin-top: 16px;
}

.primary-text { color: #c4c0ff; }
.tertiary-text { color: #54fdc4; }
.secondary-text { color: #ffb702; }

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-modal {
  width: 100%;
  max-width: 384px;
  position: relative;
}

.modal-content {
  background: #2f2e43;
  border: 1px solid rgba(66, 49, 207, 0.4);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  position: relative;
  z-index: 10;
}

.modal-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 128px;
  height: 128px;
  filter: blur(48px);
  border-radius: 50%;
  z-index: 1;
}
.primary-glow-bg { background: rgba(66, 49, 207, 0.2); }
.tertiary-glow-bg { background: rgba(0, 91, 66, 0.2); }
.secondary-glow-bg { background: rgba(125, 88, 0, 0.2); }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.modal-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.primary-box { background: rgba(66, 49, 207, 0.2); border: 1px solid rgba(66, 49, 207, 0.3); }
.tertiary-box { background: rgba(0, 91, 66, 0.2); border: 1px solid rgba(0, 91, 66, 0.3); }
.secondary-box { background: rgba(255, 183, 2, 0.2); border: 1px solid rgba(255, 183, 2, 0.3); }

.modal-icon { width: 32px; height: 32px; }
.primary-icon-color { filter: invert(47%) sepia(85%) saturate(5411%) hue-rotate(242deg) brightness(95%) contrast(92%); }
.tertiary-icon-color { filter: invert(72%) sepia(51%) saturate(464%) hue-rotate(107deg) brightness(101%) contrast(96%); }
.secondary-icon-color { filter: invert(72%) sepia(51%) saturate(1212%) hue-rotate(352deg) brightness(101%) contrast(106%); }

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
}

.modal-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.modal-desc {
  font-size: 16px;
  line-height: 1.6;
  color: #c8c4d8;
  margin: 0 0 24px 0;
}

.modal-stats {
  display: flex;
  justify-content: space-between;
  background: rgba(226, 224, 252, 0.05);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 24px;
}

.stat-col {
  display: flex;
  flex-direction: column;
}
.stat-col.right { text-align: right; }

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(200, 196, 216, 0.6);
  text-transform: uppercase;
}

.stat-val {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.cost-val { color: #ffba27; }
.req-val { color: #54fdc4; }

.small-star {
  width: 14px;
  height: 14px;
  filter: invert(72%) sepia(51%) saturate(1212%) hue-rotate(352deg) brightness(101%) contrast(106%);
}

.unlock-btn {
  width: 100%;
  height: 56px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.unlock-btn:active {
  transform: scale(0.98);
}

.primary-btn {
  background: #c4c0ff;
  color: #120068;
  box-shadow: 0 8px 0 #3824c7;
}
.primary-btn:hover { background: #e3dfff; }

.tertiary-btn {
  background: #54fdc4;
  color: #002116;
  box-shadow: 0 8px 0 #00513b;
}
.tertiary-btn:hover { background: #77ffcc; }

.secondary-btn {
  background: #ffb702;
  color: #6b4b00;
  box-shadow: 0 8px 0 #7d5800;
}
.secondary-btn:hover { background: #ffdea9; }

.disabled-btn {
  background: #464555;
  color: #1a1a2e;
  box-shadow: none;
  cursor: not-allowed;
}
.disabled-btn:active { transform: none; }

.btn-icon {
  width: 20px;
  height: 20px;
  filter: invert(0.2);
}

/* Bottom Shell */
.bottom-shell {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 50;
  background: rgba(26, 16, 53, 0.8);
  backdrop-filter: blur(24px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
}

.shell-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .shell-content {
    flex-direction: column;
    gap: 16px;
  }
}

.equipped-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.equipped-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: rgba(200, 196, 216, 0.6);
}

.equipped-slots {
  display: flex;
  gap: 8px;
}

.slot {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0;
  cursor: pointer;
}

.slot.filled-slot {
  background: rgba(255, 255, 255, 0.08);
}

.slot-skill-icon {
  width: 18px;
  height: 18px;
  filter: invert(1);
}

.slot-skill-name {
  display: none;
}

.slot-remove {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 16px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.8);
}

.empty-slot {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.add-icon {
  width: 20px;
  height: 20px;
  opacity: 0.2;
  filter: invert(1);
}

.go-quiz-btn {
  height: 64px;
  padding: 0 40px;
  background: linear-gradient(to right, #4231cf, #5b4fe8);
  border: none;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: white;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(91, 79, 232, 0.4);
  transition: all 0.2s;
}

.go-quiz-btn:hover {
  filter: brightness(1.1);
}

.go-quiz-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  filter: none;
}

.go-quiz-btn:active {
  transform: scale(0.95);
}

.rocket-icon {
  width: 24px;
  height: 24px;
  filter: invert(1);
}
</style>
