<template>
  <nav class="tab-bar">
    <div class="tab-inner">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span class="tab-name">{{ tab.name }}</span>
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
        <div v-if="modelValue === tab.id" class="tab-indicator" />
      </div>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, required: true }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.tab-bar {
  background: #0F1525;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  position: sticky; top: 58px; z-index: 90;
}
.tab-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; gap: 4px; padding: 0 24px;
}
.tab-item {
  position: relative;
  padding: 14px 20px;
  font-size: 15px; font-weight: 600;
  color: #5A6478; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: color 0.25s ease;
  user-select: none;
}
.tab-item:hover { color: #22D3EE; }
.tab-item.active { color: #22D3EE; }

.tab-badge {
  background: linear-gradient(135deg, #EF4444, #F87171);
  color: #fff; font-size: 10px; font-weight: 700;
  padding: 2px 7px; border-radius: 10px;
}

.tab-indicator {
  position: absolute; bottom: 0; left: 10%; right: 10%;
  height: 3px;
  background: linear-gradient(90deg, #22D3EE, #06B6D4);
  border-radius: 3px 3px 0 0;
  animation: scaleIn 0.25s ease-out;
  box-shadow: 0 0 8px rgba(34,211,238,0.4);
}
@keyframes scaleIn {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
</style>
