<template>
  <div class="flex flex-col items-center relative">
    <!-- Connecting line from top (if not first node) -->
    <div v-if="hasTopConnector" class="top-connector" :class="themeClass + '-connector'"></div>
    
    <div 
      class="skill-node-circle cursor-pointer z-10" 
      :class="[themeClass, { 'is-locked': !isUnlocked, 'prereq-locked': isLockedByPrereq, 'selected': isSelected }]"
      @click="handleClick"
    >
      <img v-if="icon" :src="`/src/assets/icons/ui/${icon}`" class="skill-icon" />
      
      <!-- Ping animation if selected -->
      <div v-if="isSelected && !isUnlocked" class="selected-ping" :class="themeClass + '-ping'">
        <div class="ping-inner"></div>
      </div>

      <!-- Lock overlay if locked by prereq -->
      <div v-if="!isUnlocked && isLockedByPrereq" class="lock-overlay">
        <img src="/src/assets/icons/states/lock.svg" class="lock-icon" />
      </div>
    </div>
    
    <p class="skill-label" :class="themeClass + '-text'">{{ skill.name }}</p>
  </div>
</template>

<script>
export default {
  name: 'SkillNode',
  props: {
    skill: Object,
    isUnlocked: Boolean,
    isLockedByPrereq: Boolean,
    isSelected: Boolean,
    themeClass: String, // 'primary', 'tertiary', 'secondary'
    icon: String,
    hasTopConnector: Boolean
  },
  methods: {
    handleClick() {
      this.$emit('select', this.skill);
    }
  }
}
</script>

<style scoped>
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.relative { position: relative; }
.z-10 { z-index: 10; }
.cursor-pointer { cursor: pointer; }

.top-connector {
  width: 4px;
  height: 64px;
  position: absolute;
  top: -64px;
}

.primary-connector {
  background: linear-gradient(to bottom, #4231cf, rgba(66, 49, 207, 0.2));
  border-left: 1px dashed rgba(66, 49, 207, 0.4);
}
.tertiary-connector {
  background: linear-gradient(to bottom, #005b42, rgba(0, 91, 66, 0.2));
  border-left: 1px dashed rgba(0, 91, 66, 0.4);
}
.secondary-connector {
  background: linear-gradient(to bottom, #7d5800, rgba(125, 88, 0, 0.2));
  border-left: 1px dashed rgba(125, 88, 0, 0.4);
}

.skill-node-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  transition: all 0.3s ease;
}

.skill-node-circle:hover {
  transform: scale(1.05);
}

.skill-icon {
  width: 24px;
  height: 24px;
  filter: invert(1);
}

.skill-label {
  margin-top: 16px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

/* Primary Theme (Mage) */
.skill-node-circle.primary {
  background: #4231cf;
  box-shadow: 0 0 20px rgba(91, 79, 232, 0.4);
}
.primary-text { color: #c4c0ff; }
.skill-node-circle.primary.selected {
  box-shadow: 0 0 25px rgba(91, 79, 232, 0.8);
  border-color: #c4c0ff;
}

/* Tertiary Theme (Bard) */
.skill-node-circle.tertiary {
  background: #005b42;
  box-shadow: 0 0 20px rgba(39, 224, 169, 0.4);
}
.tertiary-text { color: #54fdc4; }
.skill-node-circle.tertiary.selected {
  box-shadow: 0 0 25px rgba(39, 224, 169, 0.8);
  border-color: #54fdc4;
}

/* Secondary Theme (Knight) */
.skill-node-circle.secondary {
  background: rgba(255, 183, 2, 0.4);
  box-shadow: 0 0 15px rgba(255, 186, 39, 0.6);
}
.secondary-text { color: #ffb702; }
.skill-node-circle.secondary.selected {
  box-shadow: 0 0 25px rgba(255, 186, 39, 0.8);
  border-color: #ffb702;
}

/* Locked States */
.skill-node-circle.is-locked {
  background: #2f2e43 !important;
  border-color: rgba(119, 117, 134, 0.3) !important;
  box-shadow: none !important;
  opacity: 0.7;
}

.skill-node-circle.is-locked .skill-icon {
  opacity: 0.4;
}

.lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
  filter: invert(1);
}

.skill-node-circle.prereq-locked {
  cursor: not-allowed;
}

/* Selected Ping */
.selected-ping {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-ping { background: #4231cf; }
.tertiary-ping { background: #005b42; }
.secondary-ping { background: #7d5800; }

.ping-inner {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
