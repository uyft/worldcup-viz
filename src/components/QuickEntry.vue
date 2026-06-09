<template>
  <div class="quick-entry">
    <div
      v-for="(item, i) in entries"
      :key="item.label"
      class="entry-item card anim-fadeInUp"
      :class="`delay-${i+1}`"
      @click="$emit('navigate', item.target)"
    >
      <div class="entry-icon" :style="{background: item.bg}">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path :d="item.path" />
        </svg>
      </div>
      <span class="entry-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
const entries = [
  { label:'比赛日', target:'schedule', bg:'linear-gradient(135deg,#06B6D4,#22D3EE)', path:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
  { label:'积分榜', target:'standings', bg:'linear-gradient(135deg,#F59E0B,#FBBF24)', path:'M6 20h4v-8H6v8zm8-12h4v12h-4V8zM2 14h4v6H2v-6zm16-6h4v12h-4V8z' },
  { label:'射手榜', target:'players', bg:'linear-gradient(135deg,#F43F5E,#FB7185)', path:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { label:'历史', target:'history', bg:'linear-gradient(135deg,#10B981,#34D399)', path:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
]
defineEmits(['navigate'])
</script>

<style scoped>
.quick-entry {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 24px 0;
}
.entry-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 20px 12px; gap: 10px; cursor: pointer;
}
.entry-icon {
  width: 52px; height: 52px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  color: #0B0F1A;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  transition: transform 0.25s ease;
}
.entry-item:hover .entry-icon { transform: scale(1.1) rotate(-4deg); }
.entry-label {
  font-size: 14px; font-weight: 600; color: #E8ECF1;
}
@media (max-width: 640px) {
  .quick-entry { grid-template-columns: repeat(2, 1fr); }
}
</style>
