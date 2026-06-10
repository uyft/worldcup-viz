<template>
  <Transition name="splash-fade">
    <div
      v-if="visible"
      class="splash-overlay"
      :class="{
        'is-leaving': animStage === 'out',
        'is-goal': animStage === 'center'
      }"
      @click.self="dismiss"
    >
      <div class="splash-scene" aria-hidden="true">
        <div class="vignette"></div>
        <div class="stadium-light light-left"></div>
        <div class="stadium-light light-right"></div>
        <div class="big-year">2026</div>

        <!-- 中央球门：足球会沿曲线射入这里 -->
        <div class="main-goal" :class="{ 'goal-hit': animStage === 'center' }">
          <div class="goal-back-glow"></div>
          <div class="goal-frame front-frame"></div>
          <div class="goal-frame back-frame"></div>
          <div class="goal-side side-left"></div>
          <div class="goal-side side-right"></div>
          <div class="goal-grid"></div>
          <div class="goal-net-depth"></div>
          <div class="goal-impact"></div>
        </div>

        <!-- 曲线轨迹，只在足球飞入时显示 -->
        <svg v-if="animStage === 'fly'" class="curve-trail" viewBox="0 0 1000 520" preserveAspectRatio="none">
          <path class="curve-path curve-base" d="M 40 455 C 220 120, 560 80, 850 230" />
          <path class="curve-path curve-light" d="M 40 455 C 220 120, 560 80, 850 230" />
        </svg>

        <div class="grass-field">
          <span v-for="i in 8" :key="`stripe-${i}`" class="grass-stripe"></span>
          <span
            v-for="item in grassBlades"
            :key="item.id"
            class="grass-blade"
            :style="item.style"
          ></span>
        </div>

        <div class="float-particles">
          <span
            v-for="item in particles"
            :key="item.id"
            class="particle"
            :style="item.style"
          ></span>
        </div>
      </div>

      <div class="intro-card" :class="{ 'card-show': animStage === 'center' }">
        <div class="live-dot"></div>
        <div>
          <div class="eyebrow">GOAL · 2026 FIFA WORLD CUP</div>
          <h1>美加墨世界杯</h1>
          <p>一球入网，盛宴开启</p>
        </div>
      </div>

      <!-- 足球：外层走曲线，内层做立体旋转 -->
      <div
        class="splash-ball-wrap"
        :class="{
          'ball-fly-in': animStage === 'fly',
          'ball-center': animStage === 'center',
          'ball-out': animStage === 'out'
        }"
      >
        <div class="motion-shadow"></div>

        <div class="football-3d">
          <div class="football-core">
            <!-- 纹理由内层单独滚动，外层固定高光和阴影，视觉上更像真实 3D 球体 -->
            <div class="ball-texture">
              <span class="panel panel-center"></span>
              <span class="panel panel-top"></span>
              <span class="panel panel-left"></span>
              <span class="panel panel-right"></span>
              <span class="panel panel-bottom-left"></span>
              <span class="panel panel-bottom-right"></span>
              <span class="panel panel-edge-a"></span>
              <span class="panel panel-edge-b"></span>
              <span class="panel panel-edge-c"></span>
              <span class="panel panel-edge-d"></span>
              <span class="seam seam-1"></span>
              <span class="seam seam-2"></span>
              <span class="seam seam-3"></span>
              <span class="seam seam-4"></span>
              <span class="seam seam-5"></span>
              <span class="seam seam-6"></span>
              <span class="curve-seam curve-seam-a"></span>
              <span class="curve-seam curve-seam-b"></span>
              <span class="curve-seam curve-seam-c"></span>
            </div>
            <span class="ball-depth-shadow"></span>
            <span class="ball-gloss"></span>
            <span class="ball-rim-light"></span>
            <span class="ball-contact-light"></span>
          </div>
        </div>

        <div v-if="animStage === 'fly'" class="trail-particles">
          <span v-for="i in 20" :key="i" class="trail-dot" :style="{ '--i': i }"></span>
        </div>

        <div v-if="animStage === 'center'" class="ball-ring ring-a"></div>
        <div v-if="animStage === 'center'" class="ball-ring ring-b"></div>
      </div>

      <button
        v-if="animStage === 'center'"
        class="splash-close"
        type="button"
        aria-label="关闭开场动画"
        @click="dismiss"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <p v-if="animStage === 'center'" class="splash-hint">点击任意位置进入平台</p>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['done'])

const visible = ref(true)
const animStage = ref('fly')
let centerTimer = null
let closeTimer = null

function random(min, max) {
  return Math.random() * (max - min) + min
}

const grassBlades = computed(() =>
  Array.from({ length: 46 }, (_, index) => ({
    id: `blade-${index}`,
    style: {
      left: `${random(0, 100).toFixed(1)}%`,
      bottom: `${random(0, 9).toFixed(1)}%`,
      height: `${random(8, 22).toFixed(0)}px`,
      animationDelay: `${random(0, 2).toFixed(2)}s`,
      animationDuration: `${random(2.4, 4.8).toFixed(2)}s`
    }
  }))
)

const particles = computed(() =>
  Array.from({ length: 32 }, (_, index) => ({
    id: `particle-${index}`,
    style: {
      left: `${random(0, 100).toFixed(1)}%`,
      top: `${random(0, 100).toFixed(1)}%`,
      width: `${random(2, 5).toFixed(0)}px`,
      height: `${random(2, 5).toFixed(0)}px`,
      animationDelay: `${random(0, 4).toFixed(2)}s`,
      animationDuration: `${random(4, 8).toFixed(2)}s`
    }
  }))
)

onMounted(() => {
  centerTimer = window.setTimeout(() => {
    animStage.value = 'center'
  }, 1850)
})

onBeforeUnmount(() => {
  window.clearTimeout(centerTimer)
  window.clearTimeout(closeTimer)
})

function dismiss() {
  if (animStage.value !== 'center') return
  animStage.value = 'out'
  closeTimer = window.setTimeout(() => {
    visible.value = false
    emit('done')
  }, 650)
}
</script>

<style scoped>
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  background:
    radial-gradient(circle at 50% 48%, rgba(21, 94, 117, 0.34), transparent 22%),
    radial-gradient(circle at 22% 18%, rgba(34, 211, 238, 0.14), transparent 26%),
    radial-gradient(circle at 80% 22%, rgba(251, 191, 36, 0.10), transparent 28%),
    linear-gradient(135deg, #050914 0%, #07142d 48%, #030712 100%);
  perspective: 1400px;
}

.splash-scene,
.vignette,
.float-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.vignette {
  background: radial-gradient(circle at center, transparent 34%, rgba(0, 0, 0, 0.62) 100%);
}

.stadium-light {
  position: absolute;
  top: -16%;
  width: 360px;
  height: 120%;
  opacity: 0.16;
  filter: blur(1px);
  transform-origin: top center;
}

.light-left {
  left: 10%;
  transform: rotate(-16deg);
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.75), transparent 76%);
}

.light-right {
  right: 10%;
  transform: rotate(16deg);
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.65), transparent 76%);
}

.big-year {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: Arial Black, Impact, sans-serif;
  font-size: clamp(140px, 19vw, 320px);
  font-weight: 900;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.035);
  text-shadow: 0 0 50px rgba(34, 211, 238, 0.09);
}

/* ===== 中央 3D 球门 ===== */
.main-goal {
  position: absolute;
  left: 50%;
  top: 52%;
  width: clamp(420px, 44vw, 680px);
  height: clamp(220px, 24vw, 360px);
  transform: translate(-50%, -50%) rotateX(7deg);
  transform-style: preserve-3d;
  opacity: 0.78;
  filter: drop-shadow(0 0 28px rgba(34, 211, 238, 0.16));
}

.goal-back-glow {
  position: absolute;
  inset: 10% 6% -2%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(34, 211, 238, 0.18), transparent 68%);
  transform: translateZ(-22px);
}

.goal-frame {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 8px solid rgba(240, 249, 255, 0.88);
  border-bottom: none;
  border-radius: 18px 18px 0 0;
  box-shadow:
    0 0 18px rgba(255, 255, 255, 0.28),
    0 0 34px rgba(34, 211, 238, 0.18),
    inset 0 0 20px rgba(255, 255, 255, 0.10);
}

.back-frame {
  opacity: 0.34;
  transform: translate3d(24px, -20px, -90px) scale(0.92);
}

.goal-side {
  position: absolute;
  top: 8px;
  width: 110px;
  height: 100%;
  border-top: 2px solid rgba(255, 255, 255, 0.22);
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.13) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.46;
  transform-origin: top center;
}

.side-left {
  left: -78px;
  transform: skewY(-12deg) rotateY(62deg);
}

.side-right {
  right: -78px;
  transform: skewY(12deg) rotateY(-62deg);
}

.goal-grid {
  position: absolute;
  inset: 8px 8px 0;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.20) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px);
  background-size: 38px 32px;
  mask-image: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.82) 62%, transparent 100%);
  transform: translateZ(-38px);
  transition: transform 0.34s ease, filter 0.34s ease;
}

.goal-net-depth {
  position: absolute;
  inset: 8px 8px 0;
  background:
    radial-gradient(circle at center, transparent 0 10px, rgba(255, 255, 255, 0.10) 11px 12px, transparent 13px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.10) 1px, transparent 1px);
  background-size: 54px 48px, 42px 42px;
  opacity: 0.32;
  transform: translate3d(34px, -24px, -105px) scale(0.88);
}

.goal-impact {
  position: absolute;
  left: 50%;
  top: 45%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.1);
  opacity: 0;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.72), rgba(34, 211, 238, 0.18) 42%, transparent 68%);
}

.main-goal.goal-hit .goal-grid {
  animation: netShake 0.58s ease-out 0.02s;
}

.main-goal.goal-hit .goal-impact {
  animation: goalFlash 0.72s ease-out;
}

@keyframes netShake {
  0% { transform: translateZ(-38px); filter: blur(0); }
  26% { transform: translate3d(0, 18px, -78px) scale(1.04); filter: blur(0.6px); }
  52% { transform: translate3d(0, -7px, -52px) scale(0.98); }
  100% { transform: translateZ(-38px); filter: blur(0); }
}

@keyframes goalFlash {
  0% { opacity: 0.95; transform: translate(-50%, -50%) scale(0.2); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(2.8); }
}

/* ===== 曲线轨迹 ===== */
.curve-trail {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(960px, 92vw);
  height: min(520px, 62vh);
  transform: translate(-50%, -50%);
  z-index: 3;
  overflow: visible;
}

.curve-path {
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 1150;
  stroke-dashoffset: 1150;
  animation: drawCurve 1.55s ease-out forwards;
}

.curve-base {
  stroke: rgba(255, 255, 255, 0.11);
  stroke-width: 6;
}

.curve-light {
  stroke: rgba(251, 191, 36, 0.78);
  stroke-width: 3;
  filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.55));
}

@keyframes drawCurve {
  0% { stroke-dashoffset: 1150; opacity: 0; }
  16% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

.grass-field {
  position: absolute;
  left: -5%;
  right: -5%;
  bottom: -8%;
  height: 42%;
  transform: rotateX(68deg);
  transform-origin: bottom center;
  background:
    linear-gradient(90deg, rgba(34, 197, 94, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(180deg, rgba(22, 101, 52, 0.05), rgba(20, 83, 45, 0.5));
  background-size: 80px 80px, 80px 80px, auto;
  border-top: 1px solid rgba(34, 211, 238, 0.16);
  box-shadow: 0 -30px 80px rgba(34, 211, 238, 0.08);
}

.grass-stripe {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12.5%;
  background: rgba(34, 197, 94, 0.035);
}

.grass-stripe:nth-child(odd) { background: rgba(34, 197, 94, 0.06); }
.grass-stripe:nth-child(1) { left: 0; }
.grass-stripe:nth-child(2) { left: 12.5%; }
.grass-stripe:nth-child(3) { left: 25%; }
.grass-stripe:nth-child(4) { left: 37.5%; }
.grass-stripe:nth-child(5) { left: 50%; }
.grass-stripe:nth-child(6) { left: 62.5%; }
.grass-stripe:nth-child(7) { left: 75%; }
.grass-stripe:nth-child(8) { left: 87.5%; }

.grass-blade {
  position: absolute;
  width: 2px;
  border-radius: 2px;
  background: linear-gradient(180deg, rgba(74, 222, 128, 0.58), rgba(22, 163, 74, 0.10));
  transform-origin: bottom center;
  animation: bladeSway 3s ease-in-out infinite;
}

@keyframes bladeSway {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(5deg); }
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.55);
  opacity: 0;
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% { opacity: 0; transform: translate3d(0, 0, 0) scale(0.5); }
  20% { opacity: 0.75; }
  82% { opacity: 0.35; }
  100% { opacity: 0; transform: translate3d(0, -120px, 0) scale(1.2); }
}

.intro-card {
  position: absolute;
  top: 10%;
  left: 50%;
  z-index: 6;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 22px;
  border: 1px solid rgba(34, 211, 238, 0.20);
  border-radius: 20px;
  background: rgba(5, 11, 28, 0.55);
  box-shadow: 0 0 40px rgba(34, 211, 238, 0.08), inset 0 0 28px rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(14px);
  opacity: 0;
  transform: translate(-50%, -16px) scale(0.96);
  transition: opacity 0.45s ease, transform 0.45s ease;
  pointer-events: none;
}

.intro-card.card-show {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}

.live-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #f43f5e;
  box-shadow: 0 0 20px rgba(244, 63, 94, 0.75);
}

.eyebrow {
  color: #22d3ee;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.intro-card h1 {
  margin: 4px 0 2px;
  color: #fff;
  font-size: 30px;
  line-height: 1;
  letter-spacing: 0.04em;
}

.intro-card p {
  margin: 0;
  color: #8fa6c9;
  font-size: 14px;
}

.splash-ball-wrap {
  position: relative;
  z-index: 5;
  width: clamp(120px, 11vw, 170px);
  height: clamp(120px, 11vw, 170px);
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
}

/* 重点：曲线飞入 + 射门入网 */
.ball-fly-in {
  animation: ballCurveGoal 1.85s cubic-bezier(0.16, 0.85, 0.24, 1.05) forwards;
}

@keyframes ballCurveGoal {
  0% {
    transform: translate3d(-48vw, 34vh, -940px) scale(0.16) rotateX(72deg) rotateY(-260deg) rotateZ(-1080deg);
    opacity: 0;
    filter: blur(9px);
  }
  10% {
    opacity: 1;
  }
  30% {
    transform: translate3d(-28vw, -10vh, -420px) scale(0.48) rotateX(48deg) rotateY(-90deg) rotateZ(-720deg);
    filter: blur(4px);
  }
  55% {
    transform: translate3d(1vw, -20vh, 130px) scale(1.15) rotateX(22deg) rotateY(110deg) rotateZ(-260deg);
    filter: blur(0);
  }
  76% {
    transform: translate3d(20vw, -4vh, 42px) scale(0.88) rotateX(18deg) rotateY(255deg) rotateZ(80deg);
  }
  90% {
    transform: translate3d(0, -3vh, -75px) scale(0.72) rotateX(10deg) rotateY(380deg) rotateZ(250deg);
  }
  100% {
    transform: translate3d(0, -3vh, -96px) scale(0.64) rotateX(0deg) rotateY(420deg) rotateZ(360deg);
    opacity: 1;
  }
}

.ball-center {
  animation: ballInNet 3s ease-in-out infinite;
}

@keyframes ballInNet {
  0%, 100% { transform: translate3d(0, -3vh, -96px) scale(0.64) rotateY(-6deg); }
  50% { transform: translate3d(0, -3.8vh, -78px) scale(0.66) rotateY(7deg); }
}

.ball-out {
  animation: ballFlyOut 0.65s cubic-bezier(0.6, 0, 1, 0.45) forwards;
}

@keyframes ballFlyOut {
  0% { transform: translate3d(0, -3vh, -90px) scale(0.64); opacity: 1; filter: blur(0); }
  100% { transform: translate3d(24vw, -18vh, -760px) scale(0.15) rotateZ(540deg); opacity: 0; filter: blur(8px); }
}

.motion-shadow {
  position: absolute;
  left: 50%;
  bottom: -28px;
  width: 150%;
  height: 30px;
  border-radius: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.48), transparent 70%);
  filter: blur(6px);
  opacity: 0.42;
}

.football-3d,
.football-core,
.ball-texture {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform-style: preserve-3d;
}

/* 外层负责空间旋转：增加 rotate3d 和 translateZ，球体不再像平面贴图 */
.football-3d {
  transform: translateZ(42px) rotateX(-18deg) rotateY(22deg);
  animation: footballSpin3D 0.62s linear infinite;
  filter: drop-shadow(0 24px 26px rgba(0, 0, 0, 0.42));
}

.ball-center .football-3d {
  animation: footballSettle3D 2.8s ease-in-out infinite;
}

@keyframes footballSpin3D {
  0% {
    transform: translateZ(42px) rotateX(-26deg) rotateY(0deg) rotateZ(0deg);
  }
  50% {
    transform: translateZ(56px) rotateX(18deg) rotateY(210deg) rotateZ(250deg);
  }
  100% {
    transform: translateZ(42px) rotateX(-26deg) rotateY(420deg) rotateZ(720deg);
  }
}

@keyframes footballSettle3D {
  0%, 100% {
    transform: translateZ(40px) rotateX(-10deg) rotateY(-18deg) rotateZ(0deg);
  }
  50% {
    transform: translateZ(54px) rotateX(8deg) rotateY(22deg) rotateZ(7deg);
  }
}

.football-core {
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 26% 18%, rgba(255, 255, 255, 1) 0 7%, transparent 19%),
    radial-gradient(circle at 34% 28%, #ffffff 0%, #f3f7fb 25%, #cbd5df 52%, #788491 72%, #1f2937 100%);
  box-shadow:
    0 0 30px rgba(255, 255, 255, 0.24),
    0 0 76px rgba(34, 211, 238, 0.28),
    0 0 118px rgba(251, 191, 36, 0.18),
    inset 22px 20px 32px rgba(255, 255, 255, 0.58),
    inset -30px -34px 48px rgba(0, 0, 0, 0.62),
    inset -2px -2px 0 rgba(255, 255, 255, 0.12);
}

/* 纹理比球体稍大，旋转时会从边缘“卷过去”，更像球面滚动 */
.ball-texture {
  inset: -10%;
  opacity: 0.98;
  transform-origin: center;
  animation: textureRoll 0.62s linear infinite;
  background:
    radial-gradient(circle at 50% 50%, transparent 0 62%, rgba(0, 0, 0, 0.22) 72%, rgba(0, 0, 0, 0.46) 100%);
}

.ball-center .ball-texture {
  animation: textureSettle 2.8s ease-in-out infinite;
}

@keyframes textureRoll {
  0% { transform: translate3d(-9%, 5%, 0) rotate(-34deg) scale(1.12); }
  50% { transform: translate3d(9%, -6%, 0) rotate(178deg) scale(1.12); }
  100% { transform: translate3d(-9%, 5%, 0) rotate(394deg) scale(1.12); }
}

@keyframes textureSettle {
  0%, 100% { transform: translate3d(-2%, 1%, 0) rotate(-8deg) scale(1.09); }
  50% { transform: translate3d(3%, -1%, 0) rotate(10deg) scale(1.09); }
}

.panel {
  position: absolute;
  width: 25%;
  height: 25%;
  background:
    linear-gradient(145deg, #020617, #0f172a 62%, #1e293b);
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  box-shadow:
    inset 4px 4px 8px rgba(255, 255, 255, 0.13),
    inset -5px -6px 10px rgba(0, 0, 0, 0.58),
    0 1px 4px rgba(0, 0, 0, 0.38);
  z-index: 2;
}

.panel-center { top: 37%; left: 37%; transform: scale(1.12); }
.panel-top { top: 6%; left: 38%; transform: rotate(8deg) scale(0.82) skewX(-7deg); }
.panel-left { top: 33%; left: 7%; transform: rotate(18deg) scaleX(0.7) scaleY(0.92); }
.panel-right { top: 33%; right: 7%; transform: rotate(-18deg) scaleX(0.7) scaleY(0.92); }
.panel-bottom-left { bottom: 7%; left: 23%; transform: rotate(34deg) scaleX(0.78) scaleY(0.84); }
.panel-bottom-right { bottom: 7%; right: 23%; transform: rotate(-34deg) scaleX(0.78) scaleY(0.84); }
.panel-edge-a { top: 10%; left: -4%; transform: rotate(-18deg) scaleX(0.46) scaleY(0.72); opacity: 0.78; }
.panel-edge-b { bottom: 17%; right: -4%; transform: rotate(16deg) scaleX(0.46) scaleY(0.72); opacity: 0.78; }
.panel-edge-c { top: 54%; left: -7%; transform: rotate(32deg) scaleX(0.4) scaleY(0.6); opacity: 0.62; }
.panel-edge-d { top: 12%; right: -6%; transform: rotate(-32deg) scaleX(0.42) scaleY(0.62); opacity: 0.62; }

.seam,
.curve-seam {
  position: absolute;
  background: rgba(8, 16, 32, 0.28);
  border-radius: 999px;
  transform-origin: left center;
  z-index: 1;
}

.seam {
  height: 3px;
  box-shadow: 0 1px 2px rgba(255, 255, 255, 0.14);
}

.seam-1 { top: 30%; left: 27%; width: 47%; transform: rotate(4deg); }
.seam-2 { top: 42%; left: 19%; width: 34%; transform: rotate(52deg); }
.seam-3 { top: 42%; right: 19%; width: 34%; transform: rotate(-52deg); transform-origin: right center; }
.seam-4 { bottom: 26%; left: 28%; width: 46%; transform: rotate(-3deg); }
.seam-5 { top: 58%; left: 12%; width: 76%; transform: rotate(22deg); opacity: 0.20; }
.seam-6 { top: 22%; left: 13%; width: 72%; transform: rotate(-26deg); opacity: 0.14; }

/* 曲面缝线：椭圆弧会强化“这是一个球”的感觉 */
.curve-seam {
  width: 76%;
  height: 54%;
  border: 3px solid rgba(8, 16, 32, 0.20);
  background: transparent;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.08);
}
.curve-seam-a { left: 12%; top: 18%; transform: rotate(20deg) scaleX(0.72); opacity: 0.42; }
.curve-seam-b { left: 10%; top: 28%; transform: rotate(-30deg) scaleX(0.48); opacity: 0.32; }
.curve-seam-c { left: 22%; top: 4%; transform: rotate(86deg) scaleX(0.55); opacity: 0.26; }

.ball-depth-shadow,
.ball-gloss,
.ball-rim-light,
.ball-contact-light {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

.ball-depth-shadow {
  z-index: 4;
  background:
    radial-gradient(circle at 76% 78%, rgba(0, 0, 0, 0.60), transparent 42%),
    radial-gradient(circle at 58% 54%, transparent 0 42%, rgba(0, 0, 0, 0.34) 74%, rgba(0, 0, 0, 0.72) 100%);
  mix-blend-mode: multiply;
}

.ball-gloss {
  z-index: 5;
  background:
    radial-gradient(ellipse at 29% 20%, rgba(255, 255, 255, 0.82) 0 8%, rgba(255, 255, 255, 0.36) 9% 19%, transparent 36%),
    linear-gradient(120deg, rgba(255, 255, 255, 0.24), transparent 34%, rgba(34, 211, 238, 0.13) 68%, transparent 100%);
  mix-blend-mode: screen;
}

.ball-rim-light {
  z-index: 6;
  box-shadow:
    inset -12px 0 20px rgba(34, 211, 238, 0.34),
    inset 8px 0 14px rgba(251, 191, 36, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.15);
}

.ball-contact-light {
  z-index: 7;
  inset: 6%;
  background: radial-gradient(circle at 52% 50%, transparent 0 57%, rgba(255,255,255,0.14) 59%, transparent 66%);
  filter: blur(0.4px);
}

.trail-particles {
  position: absolute;
  inset: -80px;
  pointer-events: none;
}

.trail-dot {
  --delay: calc(var(--i) * 0.026s);
  position: absolute;
  top: calc(76% - var(--i) * 2.8%);
  right: calc(68% + var(--i) * 3.6%);
  width: calc(9px - var(--i) * 0.22px);
  height: calc(9px - var(--i) * 0.22px);
  min-width: 3px;
  min-height: 3px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 16px rgba(251, 191, 36, 0.72);
  opacity: 0;
  animation: trailSpark 0.78s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes trailSpark {
  0% { opacity: 0.95; transform: translate3d(0, 0, 0) scale(1); }
  100% { opacity: 0; transform: translate3d(-90px, 30px, 0) scale(0.15); }
}

.ball-ring {
  position: absolute;
  inset: -26px;
  border-radius: 50%;
  pointer-events: none;
  border: 1px solid rgba(34, 211, 238, 0.22);
  box-shadow: 0 0 26px rgba(34, 211, 238, 0.16);
  animation: ringPulse 2.2s ease-in-out infinite;
}

.ring-b {
  inset: -44px;
  border-color: rgba(251, 191, 36, 0.18);
  animation-delay: 0.35s;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(0.92); opacity: 0.25; }
  50% { transform: scale(1.08); opacity: 0.68; }
}

.splash-close {
  position: absolute;
  top: 38px;
  right: 42px;
  z-index: 10;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #cbd5e1;
  background: rgba(8, 17, 36, 0.6);
  backdrop-filter: blur(12px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.22s ease, color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.splash-close:hover {
  color: #fb7185;
  border-color: rgba(251, 113, 133, 0.65);
  box-shadow: 0 0 28px rgba(244, 63, 94, 0.25);
  transform: scale(1.08) rotate(90deg);
}

.splash-hint {
  position: absolute;
  bottom: 52px;
  z-index: 6;
  margin: 0;
  color: rgba(203, 213, 225, 0.64);
  font-size: 14px;
  letter-spacing: 0.08em;
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.42; transform: translateY(0); }
  50% { opacity: 0.95; transform: translateY(-2px); }
}

.splash-fade-enter-active,
.splash-fade-leave-active {
  transition: opacity 0.52s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .intro-card {
    top: 10%;
    width: calc(100% - 56px);
    box-sizing: border-box;
  }

  .intro-card h1 { font-size: 24px; }
  .splash-close { top: 24px; right: 24px; }
  .main-goal {
    width: 86vw;
    height: 48vw;
    top: 52%;
  }
  .splash-ball-wrap {
    width: 112px;
    height: 112px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ball-fly-in,
  .ball-center,
  .ball-out,
  .football-3d,
  .particle,
  .grass-blade,
  .trail-dot,
  .ball-ring,
  .splash-hint,
  .curve-path,
  .main-goal.goal-hit .goal-grid,
  .main-goal.goal-hit .goal-impact {
    animation: none !important;
  }

  .splash-ball-wrap {
    opacity: 1;
    transform: translate3d(0, -3vh, -96px) scale(0.64) !important;
  }
}
</style>
