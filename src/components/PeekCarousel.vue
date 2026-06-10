<template>
  <div class="peek-carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div class="carousel-track">
      <!-- 左 peek -->
      <div class="peek-card peek-left" @click="prev">
        <img :src="slides[prevIdx].img" :alt="slides[prevIdx].title" class="peek-img" />
        <div class="peek-overlay" />
      </div>

      <!-- 主卡片 -->
      <div class="main-card">
        <img :src="slides[currentIdx].img" :alt="slides[currentIdx].title" class="main-img" />
        <div class="main-gradient" />
        <div class="main-info">
          <span class="main-tag">{{ slides[currentIdx].tag }}</span>
          <h3 class="main-title">{{ slides[currentIdx].title }}</h3>
        </div>
      </div>

      <!-- 右 peek -->
      <div class="peek-card peek-right" @click="next">
        <img :src="slides[nextIdx].img" :alt="slides[nextIdx].title" class="peek-img" />
        <div class="peek-overlay" />
      </div>
    </div>

    <!-- 左右箭头 -->
    <button class="arrow arrow-left" @click="prev">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="arrow arrow-right" @click="next">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>

    <!-- 指示点 -->
    <div class="dots">
      <button
        v-for="(s, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === currentIdx }"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const slides = [
  { img: '/images/hero-1.png', tag: '球队巡礼', title: '48强逐鹿北美，谁主沉浮' },
  { img: '/images/hero-2.png', tag: '出征名单', title: '众星云集，剑指大力神杯' },
  { img: '/images/hero-3.png', tag: '地理学堂', title: '三国联办，横跨北美大陆' },
]

const currentIdx = ref(0)
const paused = ref(false)
let timer = null
const INTERVAL = 5000

const prevIdx = computed(() => (currentIdx.value - 1 + slides.length) % slides.length)
const nextIdx = computed(() => (currentIdx.value + 1) % slides.length)

function next() { currentIdx.value = nextIdx.value }
function prev() { currentIdx.value = prevIdx.value }
function goTo(i) { currentIdx.value = i }

onMounted(() => {
  timer = setInterval(() => { if (!paused.value) next() }, INTERVAL)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.peek-carousel {
  position: relative;
  margin: 20px 0;
  padding: 0 0 36px;
  user-select: none;
}

.carousel-track {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-width: 1440px;
  margin: 0 auto;
}

/* 主卡片 */
.main-card {
  flex: 0 0 68%;
  max-width: 960px;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 12px 48px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.main-img {
  width: 100%;
  height: 440px;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.main-card:hover .main-img {
  transform: scale(1.02);
}
.main-gradient {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 55%;
  background: linear-gradient(to top, rgba(11,15,26,0.95) 0%, rgba(11,15,26,0.5) 50%, transparent 100%);
  pointer-events: none;
}
.main-info {
  position: absolute;
  bottom: 28px;
  left: 32px;
  z-index: 2;
}
.main-tag {
  display: inline-block;
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 10px;
  letter-spacing: 1px;
}
.main-title {
  font-size: 22px;
  font-weight: 700;
  color: #E8ECF1;
  text-shadow: 0 2px 12px rgba(0,0,0,0.5);
}

/* Peek 侧卡 */
.peek-card {
  flex: 0 0 14%;
  max-width: 200px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.peek-card:hover {
  transform: scale(1.04);
  border-color: rgba(34,211,238,0.2);
}
.peek-img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
  filter: brightness(0.7);
  transition: filter 0.3s ease;
}
.peek-card:hover .peek-img {
  filter: brightness(0.85);
}
.peek-overlay {
  position: absolute;
  inset: 0;
  background: rgba(11,15,26,0.35);
  pointer-events: none;
}
.peek-left { transform-origin: right center; }
.peek-right { transform-origin: left center; }

/* 箭头 */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(20,27,45,0.7);
  backdrop-filter: blur(8px);
  color: #E8ECF1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  opacity: 0;
}
.peek-carousel:hover .arrow { opacity: 1; }
.arrow:hover {
  background: rgba(34,211,238,0.15);
  border-color: rgba(34,211,238,0.3);
  transform: translateY(-50%) scale(1.08);
}
.arrow-left { left: max(calc(50% - 490px), 16px); }
.arrow-right { right: max(calc(50% - 490px), 16px); }

/* 指示点 */
.dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}
.dot.active {
  background: #22D3EE;
  box-shadow: 0 0 10px rgba(34,211,238,0.4);
  transform: scale(1.2);
}
.dot:hover:not(.active) {
  background: rgba(255,255,255,0.3);
}

@media (max-width: 1024px) {
  .main-card { flex: 0 0 60%; }
  .peek-card { flex: 0 0 16%; }
  .main-img { height: 340px; }
  .peek-img { height: 260px; }
}
@media (max-width: 768px) {
  .peek-card { display: none; }
  .main-card { flex: 0 0 100%; }
  .main-img { height: 280px; }
  .main-title { font-size: 18px; }
  .arrow { opacity: 1; }
  .arrow-left { left: 12px; }
  .arrow-right { right: 12px; }
}
</style>
