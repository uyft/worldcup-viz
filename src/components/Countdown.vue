<template>
  <div class="countdown-hero">
    <div class="hero-inner">
      <p class="hero-label anim-fadeInUp">距 2026 世界杯开幕</p>
      <div class="countdown-grid">
        <div v-for="(item, i) in items" :key="item.label"
          class="countdown-block anim-fadeInUp" :class="`delay-${i+1}`">
          <div class="countdown-number-wrap">
            <span class="countdown-number" :class="{ changed: item.changed }">{{ item.value }}</span>
          </div>
          <span class="countdown-label">{{ item.label }}</span>
        </div>
      </div>
      <p class="hero-date anim-fadeInUp delay-5">2026年6月12日 北美 · 三国联合举办</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const items = ref([
  { label: '天', value: '00', changed: false },
  { label: '时', value: '00', changed: false },
  { label: '分', value: '00', changed: false },
  { label: '秒', value: '00', changed: false },
])

let timer = null

function update() {
  const target = new Date('2026-06-12T00:00:00')
  const now = new Date()
  const diff = target - now
  if (diff <= 0) return
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  const values = [String(d).padStart(2,'0'), String(h).padStart(2,'0'), String(m).padStart(2,'0'), String(s).padStart(2,'0')]
  items.value.forEach((item, i) => {
    if (item.value !== values[i]) {
      item.value = values[i]
      item.changed = true
      setTimeout(() => item.changed = false, 300)
    }
  })
}

onMounted(() => { update(); timer = setInterval(update, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.countdown-hero {
  background: linear-gradient(135deg, #0B0F1A 0%, #141B2D 40%, #1A2340 100%);
  border-radius: 20px;
  margin: 24px 0;
  padding: 36px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
}
.countdown-hero::before {
  content: '';
  position: absolute; top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(34,211,238,0.06) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(251,191,36,0.04) 0%, transparent 50%);
  animation: float 8s ease-in-out infinite;
}
.hero-inner { position: relative; z-index: 1; }
.hero-label {
  color: rgba(232,236,241,0.5);
  font-size: 14px; font-weight: 500;
  margin-bottom: 18px; letter-spacing: 2px;
}
.countdown-grid {
  display: flex; justify-content: center; gap: 16px;
  flex-wrap: wrap;
}
.countdown-block {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.countdown-number-wrap {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(34,211,238,0.15);
  border-radius: 14px;
  padding: 14px 22px;
  min-width: 72px;
  transition: all 0.3s ease;
}
.countdown-number {
  font-size: 36px; font-weight: 800;
  color: #22D3EE;
  font-variant-numeric: tabular-nums;
  display: block;
  transition: all 0.3s ease;
}
.countdown-number.changed {
  animation: popIn 0.3s ease-out;
  color: #FBBF24;
}
@keyframes popIn {
  0%   { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
.countdown-label {
  color: #5A6478;
  font-size: 12px; font-weight: 500;
}
.hero-date {
  color: #5A6478;
  font-size: 13px; margin-top: 18px;
}
</style>
