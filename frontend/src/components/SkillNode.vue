<template>
  <div 
    class="skill-node" 
    :class="[colorTheme, { 'is-unlocked': isUnlocked, 'is-locked': !isUnlocked, 'prereq-locked': isLockedByPrereq }]"
    @click="handleClick"
    :title="skill.description"
  >
    <div class="icon-container">
      <img v-if="icon" :src="`/src/assets/${icon}`" class="skill-icon" />
    </div>
    
    <div v-if="!isUnlocked && isLockedByPrereq" class="padlock-overlay">
      <!-- Simple SVG Padlock -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lock-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    </div>
    <div v-else-if="!isUnlocked" class="cost-overlay">
      <span>{{ skill.cost }} SP</span>
    </div>

    <div class="skill-info">
      <p class="skill-name">{{ skill.name }}</p>
      <p class="skill-tier">Lvl {{ skill.requiredLevel }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillNode',
  props: {
    skill: Object,
    isUnlocked: Boolean,
    isLockedByPrereq: Boolean,
    colorTheme: String,
    icon: String
  },
  methods: {
    handleClick() {
      if (this.isLockedByPrereq && !this.isUnlocked) {
        alert("You must unlock the previous skill in this path first!");
        return;
      }
      this.$emit('unlock', this.skill);
    }
  }
}
</script>

<style scoped>
.skill-node {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(15, 23, 42, 0.5);
}

.skill-node:hover {
  transform: scale(1.05);
}

/* Red Theme (Knight) */
.skill-node.red.is-unlocked {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #f87171;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}
.skill-node.red.is-locked { border-color: rgba(248, 113, 113, 0.3); }

/* Cyan Theme (Mage) */
.skill-node.cyan.is-unlocked {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-color: #22d3ee;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}
.skill-node.cyan.is-locked { border-color: rgba(34, 211, 238, 0.3); }

/* Emerald Theme (Bard) */
.skill-node.emerald.is-unlocked {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #34d399;
  box-shadow: 0 0 20px rgba(52, 211, 153, 0.4);
}
.skill-node.emerald.is-locked { border-color: rgba(52, 211, 153, 0.3); }


/* Internals */
.icon-container {
  margin-bottom: 0.5rem;
  z-index: 2;
}

.skill-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
.is-locked .skill-icon {
  opacity: 0.4;
}

.skill-info {
  text-align: center;
  z-index: 2;
}

.skill-name {
  font-size: 0.75rem;
  color: white;
  margin: 0;
  line-height: 1.1;
  padding: 0 8px;
}

.skill-tier {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 2px 0 0 0;
}

/* Overlays */
.padlock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.lock-icon {
  color: #a78bfa;
}

.prereq-locked {
  cursor: not-allowed;
  opacity: 0.7;
}

.cost-overlay {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #fbbf24;
  color: #000;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  z-index: 4;
}
</style>
