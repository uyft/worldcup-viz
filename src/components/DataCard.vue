<template>
  <div class="data-card card anim-fadeInUp" :class="`delay-${delay}`">
    <div class="data-icon" :style="{ background: gradient }">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path :d="iconPath" />
      </svg>
    </div>
    <div class="data-body">
      <div class="data-number text-gradient">{{ animatedValue }}</div>
      <div class="data-label">{{ label }}</div>
      <div class="data-desc">{{ desc }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, required: true },
  desc: { type: String, default: '' },
  iconPath: { type: String, required: true },
  gradient: { type: String, default: 'linear-gradient(135deg,#06B6D4,#22D3EE)' },
  delay: { type: Number, default: 1 },
  suffix: { type: String, default: '' }
})

const animatedValue = ref('0')

onMounted(() => {
  const duration = 1200
  const start = performance.now()
  const animate = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.round(eased * props.value)
    animatedValue.value = current.toLocaleString() + props.suffix
    if (progress < 1) requestAnimationFrame(animate)
  }
  setTimeout(() => requestAnimationFrame(animate), props.delay * 100)
})
</script>

<style scoped>
.data-card {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 22px;
}
.data-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #0B0F1A; flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.data-body { flex: 1; }
.data-number {
  font-size: 28px; font-weight: 800;
  line-height: 1.2; margin-bottom: 2px;
}
.data-label {
  font-size: 14px; font-weight: 600;
  color: #E8ECF1;
}
.data-desc {
  font-size: 12px; color: #5A6478;
  margin-top: 2px;
}
</style>
