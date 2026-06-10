<template>
  <div class="hero-section">
    <div class="hero-inner">
      <div class="hero-left">
        <p class="hero-tag anim-fadeInUp">2026 FIFA World Cup</p>
        <h1 class="hero-title anim-fadeInUp delay-1">美加墨 · 世界杯</h1>
        <p class="hero-subtitle anim-fadeInUp delay-2">48队 · 104场 · 跨越3国</p>
        <div class="hero-countdown anim-fadeInUp delay-3">
          <div v-for="(item, i) in items" :key="item.label" class="countdown-block">
            <div class="countdown-number-wrap" :class="{ changed: item.changed }">
              <span class="countdown-number">{{ item.value }}</span>
            </div>
            <span class="countdown-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
      <div class="hero-right anim-fadeInUp delay-2">
        <div class="trophy-circle">
          <svg viewBox="0 0 64 64" width="72" height="72" fill="none">
            <path d="M28 8h8v4h-8z" fill="url(#gold1)"/>
            <path d="M24 12h16l2 8H22l2-8z" fill="url(#gold1)"/>
            <path d="M22 20h20c0 12-4 18-10 20-6-2-10-8-10-20z" fill="url(#gold2)"/>
            <path d="M30 40h4v8h-4z" fill="url(#gold1)"/>
            <path d="M24 48h16v4H24z" fill="url(#gold1)"/>
            <circle cx="32" cy="28" r="3" fill="rgba(255,255,255,0.3)"/>
            <defs>
              <linearGradient id="gold1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FBBF24"/>
                <stop offset="100%" stop-color="#F59E0B"/>
              </linearGradient>
              <linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FBBF24"/>
                <stop offset="50%" stop-color="#E8B94B"/>
                <stop offset="100%" stop-color="#D97706"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
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
  if (diff <= 0) {
    // 已开幕，显示正计时
    const elapsed = now - target
    const d = Math.floor(elapsed / 86400000)
    const h = Math.floor((elapsed % 86400000) / 3600000)
    const m = Math.floor((elapsed % 3600000) / 60000)
    const s = Math.floor((elapsed % 60000) / 1000)
    const values = [String(d).padStart(2,'0'), String(h).padStart(2,'0'), String(m).padStart(2,'0'), String(s).padStart(2,'0')]
    items.value[0].label = '天'
    items.value.forEach((item, i) => {
      if (item.value !== values[i]) {
        item.value = values[i]
        item.changed = true
        setTimeout(() => item.changed = false, 300)
      }
    })
    return
  }
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
.hero-section {
  background: linear-gradient(135deg, #0B0F1A 0%, #0D1B3E 40%, #122B5C 100%);
  border-radius: 20px;
  margin: 16px 0 0;
  padding: 40px 36px 32px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
}
.hero-section::before {
  content: '';
  position: absolute; top: -30%; right: -10%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 60%);
  pointer-events: none;
}
.hero-section::after {
  content: '';
  position: absolute; bottom: -20%; left: 10%;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 60%);
  pointer-events: none;
}
.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  max-width: 1440px;
  margin: 0 auto;
}
.hero-left {
  flex: 1;
}
.hero-tag {
  font-size: 13px;
  font-weight: 500;
  color: rgba(34,211,238,0.7);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.hero-title {
  font-size: 32px;
  font-weight: 800;
  color: #E8ECF1;
  letter-spacing: 2px;
  margin-bottom: 8px;
  line-height: 1.3;
}
.hero-subtitle {
  font-size: 14px;
  color: #5A6B82;
  font-weight: 500;
  margin-bottom: 24px;
}

/* 倒计时 - 横排紧凑 */
.hero-countdown {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.countdown-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.countdown-number-wrap {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(34,211,238,0.15);
  border-radius: 10px;
  padding: 8px 16px;
  min-width: 56px;
  text-align: center;
  transition: all 0.3s ease;
}
.countdown-number-wrap.changed {
  border-color: rgba(251,191,36,0.5);
  box-shadow: 0 0 16px rgba(251,191,36,0.15);
}
.countdown-number {
  font-size: 24px;
  font-weight: 800;
  color: #22D3EE;
  font-variant-numeric: tabular-nums;
  display: block;
  transition: color 0.3s ease;
}
.countdown-number-wrap.changed .countdown-number {
  color: #FBBF24;
  animation: popIn 0.3s ease-out;
}
@keyframes popIn {
  0% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
.countdown-label {
  color: #5A6B82;
  font-size: 11px;
  font-weight: 500;
}

/* 右侧奖杯装饰 */
.hero-right {
  flex-shrink: 0;
  margin-left: 40px;
}
.trophy-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.03) 60%, transparent 80%);
  border: 1px solid rgba(251,191,36,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (max-width: 768px) {
  .hero-inner { flex-direction: column; text-align: center; }
  .hero-right { margin-left: 0; margin-top: 20px; }
  .hero-countdown { justify-content: center; }
  .hero-title { font-size: 24px; }
}
</style>
