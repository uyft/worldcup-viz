<template>
  <div class="player-card-wrap" :class="{ 'is-revealed': revealed, 'is-flipped': flipped }" @click="flipCard">
    <!-- 外部光晕 -->
    <div class="card-aura" v-if="revealed"></div>

    <!-- 主体卡片 -->
    <div class="trading-card" :class="[`rarity-${rarity}`, { flipped }]">
      <!-- ==================== 正面 ==================== -->
      <div class="card-front">
        <!-- 底纹图案 -->
        <div class="card-texture"></div>
        <!-- 镭射箔光斑 -->
        <div class="foil-layer"></div>
        <!-- 镭射扫光 -->
        <div class="foil-sweep"></div>
        <!-- 四角装饰 -->
        <div class="corner-tl"></div>
        <div class="corner-tr"></div>
        <div class="corner-bl"></div>
        <div class="corner-br"></div>
        <!-- 内框装饰线 -->
        <div class="inner-border"></div>

        <!-- 顶部装饰线 -->
        <div class="top-ornament">
          <span class="orn-line"></span>
          <span class="orn-diamond">◆</span>
          <span class="orn-line"></span>
        </div>

        <!-- 稀有度角标 -->
        <div class="rarity-badge">{{ rarityLabel }}</div>

        <!-- 评分徽章 (左上角，不挡脸) -->
        <div class="rating-badge">
          <svg class="rating-ring" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2.5"/>
            <circle cx="24" cy="24" r="21" fill="none" :stroke="ratingColor"
              stroke-width="2.5" stroke-linecap="round"
              :stroke-dasharray="132"
              :stroke-dashoffset="132 - (132 * player.overall / 100)"
              transform="rotate(-90 24 24)"/>
          </svg>
          <span class="rating-num">{{ player.overall }}</span>
        </div>

        <!-- 球员照片区 -->
        <div class="card-photo-area">
          <div class="photo-ring"></div>
          <div class="photo-frame">
            <img :src="playerImage" :alt="player.name" class="card-photo"
              @error="onImgError" ref="photoImg" />
            <div class="photo-fallback" :style="{ background: avatarBg }">
              <span>{{ initials }}</span>
            </div>
          </div>
        </div>

        <!-- 球员信息 -->
        <div class="card-info">
          <div class="card-name">{{ player.name }}</div>
          <div class="card-name-en">{{ player.nameEn }}</div>
          <div class="card-meta">
            <FlagTag :code="player.countryCode" small />
            <span class="meta-sep">·</span>
            <span class="card-pos">{{ player.position.split(' /')[0] }}</span>
            <span class="meta-sep">·</span>
            <span class="card-club">{{ player.club }}</span>
          </div>
        </div>

        <!-- 属性条 -->
        <div class="card-attrs">
          <div class="card-attr" v-for="(val, key) in topThreeAttrs" :key="key">
            <span class="ca-label">{{ attrLabels[key] }}</span>
            <div class="ca-bar"><div class="ca-fill" :style="{ width: val + '%', background: attrGradient(val) }"></div></div>
            <span class="ca-val">{{ val }}</span>
          </div>
        </div>

        <!-- 迷你足球场 -->
        <div class="mini-pitch">
          <div class="mp-grass"></div>
          <div class="mp-lines">
            <div class="mp-halfline"></div>
            <div class="mp-center-circle"></div>
            <div class="mp-center-dot"></div>
          </div>
          <div class="mp-player-dot" :style="{ left: positionX, top: positionY }" :title="player.position"></div>
        </div>

        <!-- 世界杯主题装饰条 -->
        <div class="wc-stripe" :style="{ '--stripe-color': countryColor }">
          <span class="wc-stripe-line"></span>
          <span class="wc-stripe-ball">⚽</span>
          <span class="wc-stripe-text">WORLD CUP 2026</span>
          <span class="wc-stripe-ball">⚽</span>
          <span class="wc-stripe-line"></span>
        </div>

        <!-- 底部装饰线 -->
        <div class="bot-ornament">
          <span class="orn-line"></span>
          <span class="orn-star">★</span>
          <span class="orn-line"></span>
        </div>
      </div>

      <!-- ==================== 背面 ==================== -->
      <div class="card-back">
        <div class="card-texture"></div>
        <div class="foil-layer"></div>
        <div class="corner-tl"></div>
        <div class="corner-tr"></div>
        <div class="corner-bl"></div>
        <div class="corner-br"></div>
        <div class="inner-border"></div>

        <div class="top-ornament">
          <span class="orn-line"></span>
          <span class="orn-diamond">◆</span>
          <span class="orn-line"></span>
        </div>

        <div class="back-header">
          <div class="back-name-row">
            <span class="back-name">{{ player.name }}</span>
            <FlagTag :code="player.countryCode" small />
          </div>
          <div class="back-stats-row">
            <div class="bsr-item">
              <span class="bsr-val">{{ player.age }}</span>
              <span class="bsr-label">年龄</span>
            </div>
            <div class="bsr-divider"></div>
            <div class="bsr-item">
              <span class="bsr-val">{{ player.caps }}</span>
              <span class="bsr-label">出场</span>
            </div>
            <div class="bsr-divider"></div>
            <div class="bsr-item">
              <span class="bsr-val">{{ player.goals }}</span>
              <span class="bsr-label">进球</span>
            </div>
            <div class="bsr-divider"></div>
            <div class="bsr-item">
              <span class="bsr-val">{{ player.assists }}</span>
              <span class="bsr-label">助攻</span>
            </div>
          </div>
        </div>

        <div class="back-radar">
          <v-chart :option="miniRadarOpt" autoresize />
        </div>

        <div class="back-hex">
          <div class="bh-item" v-for="(label, key) in attrLabels" :key="key">
            <div class="bh-ring" :style="{ '--pct': player.attributes[key] / 100, '--clr': attrColor(player.attributes[key]) }">
              <span class="bh-val">{{ player.attributes[key] }}</span>
            </div>
            <span class="bh-label">{{ label }}</span>
          </div>
        </div>

        <div class="back-value">
          <span class="bv-icon">💎</span>
          <span class="bv-text">{{ player.marketValue }}</span>
        </div>

        <div class="bot-ornament">
          <span class="orn-line"></span>
          <span class="orn-star">★</span>
          <span class="orn-line"></span>
        </div>
      </div>
    </div>

    <!-- 粒子特效 -->
    <div class="particles" v-if="showParticles">
      <span v-for="i in 16" :key="i" class="particle" :style="particleStyle(i)"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { RadarComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import FlagTag from './FlagTag.vue'

use([CanvasRenderer, RadarChart, RadarComponent])

const props = defineProps({
  player: { type: Object, required: true },
  autoReveal: { type: Boolean, default: false },
  delay: { type: Number, default: 0 },
})

const emit = defineEmits(['clickDetail'])

const revealed = ref(false)
const flipped = ref(false)
const showParticles = ref(false)
const imgFailed = ref(false)

const attrLabels = {
  pace: '速度', shooting: '射门', passing: '传球',
  dribbling: '盘带', defending: '防守', physical: '身体'
}

const playerImage = computed(() => {
  if (imgFailed.value) return ''
  return props.player.image || ''
})

const avatarBg = computed(() => {
  const bgs = [
    'linear-gradient(135deg, #6366F1, #8B5CF6)',
    'linear-gradient(135deg, #F43F5E, #FB7185)',
    'linear-gradient(135deg, #10B981, #34D399)',
    'linear-gradient(135deg, #F59E0B, #FBBF24)',
    'linear-gradient(135deg, #06B6D4, #22D3EE)',
    'linear-gradient(135deg, #EC4899, #F472B6)',
  ]
  return bgs[props.player.id % bgs.length]
})

const countryColor = computed(() => {
  const colors = {
    fr: '#1A237E', br: '#FDD835', ar: '#75AADB', de: '#FFFFFF', es: '#C60B1E',
    gb: '#FFFFFF', pt: '#C60B1E', no: '#C60B1E', nl: '#F36C21', hr: '#FFFFFF',
    uy: '#75AADB', eg: '#C60B1E', ma: '#C60B1E', us: '#FFFFFF', ca: '#C60B1E',
    mx: '#006847', co: '#FDD835', be: '#C60B1E',
  }
  return colors[props.player.countryCode] || '#22D3EE'
})

// 根据位置映射到迷你球场的坐标 (%)
const positionX = computed(() => {
  const pos = props.player.position
  if (pos.includes('门将') || pos.includes('GK')) return '12%'
  if (pos.includes('后卫') || pos.includes('B') || pos.includes('CB')) return '30%'
  if (pos.includes('后腰') || pos.includes('CDM')) return '48%'
  if (pos.includes('中场') || pos.includes('M') || pos.includes('CM') || pos.includes('CAM')) return '60%'
  if (pos.includes('边锋') || pos.includes('W')) return '75%'
  if (pos.includes('前锋') || pos.includes('ST')) return '82%'
  return '50%'
})
const positionY = computed(() => {
  const pos = props.player.position
  if (pos.includes('门将') || pos.includes('GK')) return '50%'
  if (pos.includes('边锋') || pos.includes('W')) return '30%'
  if (pos.includes('后卫') || pos.includes('B') || pos.includes('CB')) return '60%'
  if (pos.includes('后腰') || pos.includes('CDM')) return '50%'
  if (pos.includes('中场') || pos.includes('M')) return '42%'
  if (pos.includes('前锋') || pos.includes('ST')) return '50%'
  return '50%'
})

const initials = computed(() => {
  const n = props.player.name
  if (/[一-龥]/.test(n)) return n.length > 2 ? n.slice(-2) : n
  return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
})

const topThreeAttrs = computed(() => {
  const sorted = Object.entries(props.player.attributes).sort((a, b) => b[1] - a[1])
  return Object.fromEntries(sorted.slice(0, 3))
})

const rarity = computed(() => {
  const r = props.player.overall
  if (r >= 93) return 'legendary'
  if (r >= 90) return 'epic'
  if (r >= 87) return 'rare'
  if (r >= 85) return 'uncommon'
  return 'common'
})

const rarityLabel = computed(() => {
  const map = { legendary: '传奇', epic: '史诗', rare: '稀有', uncommon: '精良', common: '普通' }
  return map[rarity.value]
})

const ratingColor = computed(() => attrColor(props.player.overall))

const miniRadarOpt = computed(() => {
  const a = props.player.attributes
  return {
    radar: {
      center: ['50%', '50%'],
      radius: '62%',
      indicator: [
        { name: '速度', max: 100 }, { name: '射门', max: 100 }, { name: '传球', max: 100 },
        { name: '盘带', max: 100 }, { name: '防守', max: 100 }, { name: '身体', max: 100 },
      ],
      axisName: { color: '#8892A6', fontSize: 9 },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [a.pace, a.shooting, a.passing, a.dribbling, a.defending, a.physical],
        areaStyle: { opacity: 0.25, color: attrColor(props.player.overall) },
        lineStyle: { color: attrColor(props.player.overall), width: 1.8 },
        itemStyle: { color: attrColor(props.player.overall) },
        symbol: 'circle',
        symbolSize: 4,
      }],
    }],
  }
})

function attrColor(val) {
  if (val >= 93) return '#FBBF24'
  if (val >= 90) return '#22D3EE'
  if (val >= 80) return '#10B981'
  if (val >= 70) return '#6366F1'
  return '#8892A6'
}

function attrGradient(val) {
  if (val >= 90) return 'linear-gradient(90deg, #F59E0B, #FBBF24)'
  if (val >= 80) return 'linear-gradient(90deg, #22D3EE, #06B6D4)'
  if (val >= 70) return 'linear-gradient(90deg, #10B981, #34D399)'
  return 'linear-gradient(90deg, #6366F1, #818CF8)'
}

function flipCard() {
  if (!revealed.value) return
  flipped.value = !flipped.value
  if (flipped.value) {
    showParticles.value = true
    setTimeout(() => showParticles.value = false, 800)
  }
}

function onImgError(e) {
  imgFailed.value = true
  e.target.style.display = 'none'
  e.target.nextElementSibling.style.display = 'flex'
}

function particleStyle(i) {
  const angle = (i / 16) * 360
  const dist = 64 + Math.random() * 50
  return {
    '--angle': `${angle}deg`,
    '--dist': `${dist}px`,
    '--size': `${2.5 + Math.random() * 4}px`,
    '--dur': `${0.5 + Math.random() * 0.6}s`,
    '--clr': ['#FBBF24', '#22D3EE', '#F43F5E', '#10B981', '#6366F1', '#EC4899', '#fff'][i % 7],
  }
}

onMounted(() => {
  if (props.autoReveal) {
    setTimeout(() => {
      revealed.value = true
      setTimeout(() => showParticles.value = true, 300)
      setTimeout(() => showParticles.value = false, 1100)
    }, props.delay)
  }
})

defineExpose({ reveal: () => { revealed.value = true; showParticles.value = true; setTimeout(() => showParticles.value = false, 800) } })
</script>

<style scoped>
/* ================================================================
   球员收藏卡 - 高端交易卡设计
   ================================================================ */
.player-card-wrap {
  position: relative;
  width: 220px; height: 350px;
  perspective: 1200px;
  cursor: pointer;
}

/* ---- 外部光晕 ---- */
.card-aura {
  position: absolute; inset: -16px;
  border-radius: 24px;
  background: radial-gradient(circle at 50% 50%, rgba(34,211,238,0.12), transparent 65%);
  animation: auraPulse 2.5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes auraPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.04); }
}

/* ---- 主体卡片 ---- */
.trading-card {
  position: relative;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
}
.trading-card.flipped { transform: rotateY(180deg); }

.card-front, .card-back {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  border-radius: 18px;
  overflow: hidden;
}

/* ================================================================
   正面
   ================================================================ */
.card-front {
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 100%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,211,238,0.04) 0%, transparent 100%),
    linear-gradient(175deg, #1c2948 0%, #162244 25%, #111e3c 55%, #0e1a34 100%);
  border: 1.5px solid rgba(255,255,255,0.12);
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 14px 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
}

/* ---- 纹理：菱形皮革 + 微网格 ---- */
.card-texture {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    repeating-linear-gradient(60deg, transparent, transparent 10px, rgba(255,255,255,0.012) 10px, rgba(255,255,255,0.012) 11px),
    repeating-linear-gradient(-60deg, transparent, transparent 10px, rgba(255,255,255,0.012) 10px, rgba(255,255,255,0.012) 11px),
    repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.005) 4px, rgba(255,255,255,0.005) 8px),
    repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.005) 4px, rgba(255,255,255,0.005) 8px);
}

/* ---- 镭射箔光斑 ---- */
.foil-layer {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse at 10% 5%, rgba(251,191,36,0.12) 0%, transparent 40%),
    radial-gradient(ellipse at 90% 10%, rgba(236,72,153,0.08) 0%, transparent 38%),
    radial-gradient(ellipse at 75% 65%, rgba(34,211,238,0.1) 0%, transparent 42%),
    radial-gradient(ellipse at 15% 75%, rgba(99,102,241,0.09) 0%, transparent 38%),
    radial-gradient(ellipse at 50% 90%, rgba(16,185,129,0.07) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.03) 0%, transparent 60%);
  animation: foilShift 5s ease-in-out infinite;
}
@keyframes foilShift {
  0%, 100% { opacity: 0.55; }
  33% { opacity: 0.9; }
  66% { opacity: 0.7; }
}

/* ---- 镭射扫光 ---- */
.foil-sweep {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background: linear-gradient(115deg,
    transparent 28%, rgba(255,255,255,0.02) 38%,
    rgba(255,255,255,0.06) 44%, rgba(255,255,255,0.03) 47%,
    rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.03) 53%,
    rgba(255,255,255,0.06) 56%, rgba(255,255,255,0.02) 62%,
    transparent 72%
  );
  background-size: 300% 100%;
  animation: foilSweep 6.5s ease-in-out infinite;
}
@keyframes foilSweep {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ---- 四角装饰 ---- */
.corner-tl, .corner-tr, .corner-bl, .corner-br {
  position: absolute; z-index: 2; pointer-events: none;
  width: 20px; height: 20px;
}
.corner-tl { top: 4px; left: 4px; border-top: 1px solid rgba(255,255,255,0.15); border-left: 1px solid rgba(255,255,255,0.15); border-radius: 4px 0 0 0; }
.corner-tr { top: 4px; right: 4px; border-top: 1px solid rgba(255,255,255,0.15); border-right: 1px solid rgba(255,255,255,0.15); border-radius: 0 4px 0 0; }
.corner-bl { bottom: 4px; left: 4px; border-bottom: 1px solid rgba(255,255,255,0.15); border-left: 1px solid rgba(255,255,255,0.15); border-radius: 0 0 0 4px; }
.corner-br { bottom: 4px; right: 4px; border-bottom: 1px solid rgba(255,255,255,0.15); border-right: 1px solid rgba(255,255,255,0.15); border-radius: 0 0 4px 0; }

/* ---- 内框装饰线 ---- */
.inner-border {
  position: absolute; inset: 6px; z-index: 0; pointer-events: none;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 14px;
}

/* ---- 稀有度边框光 ---- */
.rarity-legendary .card-front { border-color: rgba(251,191,36,0.55); box-shadow: 0 0 28px rgba(251,191,36,0.18), 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); }
.rarity-legendary .inner-border { border-color: rgba(251,191,36,0.12); }
.rarity-epic .card-front { border-color: rgba(34,211,238,0.45); box-shadow: 0 0 22px rgba(34,211,238,0.14), 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04); }
.rarity-epic .inner-border { border-color: rgba(34,211,238,0.1); }
.rarity-rare .card-front { border-color: rgba(99,102,241,0.4); box-shadow: 0 0 16px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.4); }
.rarity-rare .inner-border { border-color: rgba(99,102,241,0.08); }
.rarity-uncommon .card-front { border-color: rgba(16,185,129,0.35); box-shadow: 0 0 12px rgba(16,185,129,0.08), 0 4px 18px rgba(0,0,0,0.4); }
.rarity-common .card-front { border-color: rgba(255,255,255,0.1); }

/* ---- 顶部/底部装饰 ---- */
.top-ornament, .bot-ornament {
  display: flex; align-items: center; gap: 6px;
  z-index: 2; width: 100%;
}
.top-ornament { margin-bottom: 6px; }
.bot-ornament { /* pushed by parent's auto margin on mini-pitch */ }
.orn-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); }
.orn-diamond { font-size: 6px; color: rgba(255,255,255,0.2); }
.orn-star { font-size: 8px; color: rgba(255,255,255,0.15); }

/* ---- 稀有度角标 ---- */
.rarity-badge {
  position: absolute; top: 10px; right: 10px; z-index: 3;
  padding: 2px 10px; border-radius: 10px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.8px;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
}
.rarity-legendary .rarity-badge { color: #FBBF24; border: 1px solid rgba(251,191,36,0.35); text-shadow: 0 0 8px rgba(251,191,36,0.3); }
.rarity-epic .rarity-badge { color: #22D3EE; border: 1px solid rgba(34,211,238,0.3); text-shadow: 0 0 6px rgba(34,211,238,0.25); }
.rarity-rare .rarity-badge { color: #A5B4FC; border: 1px solid rgba(99,102,241,0.3); }
.rarity-uncommon .rarity-badge { color: #34D399; border: 1px solid rgba(16,185,129,0.25); }
.rarity-common .rarity-badge { color: #9CA3AF; border: 1px solid rgba(255,255,255,0.1); }

/* ---- 评分徽章 (卡面左上，不与照片重叠) ---- */
.rating-badge {
  position: absolute; top: 8px; left: 8px;
  width: 48px; height: 48px; z-index: 4;
  display: flex; align-items: center; justify-content: center;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}
.rating-badge .rating-ring {
  position: absolute; inset: 0; width: 48px; height: 48px;
}
.rating-num {
  position: relative; z-index: 1;
  font-size: 15px; font-weight: 900;
  color: #FBBF24;
  text-shadow: 0 0 12px rgba(251,191,36,0.5);
}

/* ---- 照片区 ---- */
.card-photo-area { position: relative; z-index: 2; margin-bottom: 6px; }
.photo-ring {
  position: absolute; inset: -5px; border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.08);
  pointer-events: none;
}
.rarity-legendary .photo-ring { border-color: rgba(251,191,36,0.3); box-shadow: 0 0 12px rgba(251,191,36,0.1); }
.rarity-epic .photo-ring { border-color: rgba(34,211,238,0.25); box-shadow: 0 0 10px rgba(34,211,238,0.08); }

.photo-frame {
  width: 82px; height: 82px; border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.18);
  background: #1A2340;
  position: relative;
  box-shadow: 0 4px 16px rgba(0,0,0,0.35);
}
.card-photo { width: 100%; height: 100%; object-fit: cover; }
.photo-fallback {
  width: 100%; height: 100%; display: none;
  align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; color: #fff;
}

/* ---- 信息 ---- */
.card-info { text-align: center; z-index: 2; margin-bottom: 4px; }
.card-name {
  font-size: 15px; font-weight: 700; color: #F0F2F5;
  letter-spacing: 0.3px;
}
.card-name-en {
  font-size: 10px; color: #5A6478; margin-top: 1px;
  letter-spacing: 0.2px;
}
.card-meta {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  margin-top: 5px;
}
.meta-sep { font-size: 8px; color: rgba(255,255,255,0.12); }
.card-pos { font-size: 10px; color: #22D3EE; font-weight: 600; }
.card-club { font-size: 10px; color: #6B7280; }

/* ---- 属性条 ---- */
.card-attrs {
  width: 100%; z-index: 2; display: flex; flex-direction: column; gap: 4px;
  padding: 0 2px; margin-top: 8px;
}
.card-attr { display: flex; align-items: center; gap: 5px; }
.ca-label { font-size: 9px; color: #6B7280; width: 24px; font-weight: 500; }
.ca-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.ca-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
.ca-val { font-size: 9px; font-weight: 700; color: #9CA3AF; width: 18px; text-align: right; }

/* ---- 迷你足球场 ---- */
.mini-pitch {
  position: relative; z-index: 2;
  width: 100%; height: 36px; border-radius: 6px;
  overflow: hidden;
  margin-top: auto;
  margin-bottom: 2px;
  border: 1px solid rgba(255,255,255,0.08);
}
.mp-grass {
  position: absolute; inset: 0;
  background:
    repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(255,255,255,0.02) 12px, rgba(255,255,255,0.02) 14px),
    linear-gradient(180deg, #1e6b32 0%, #185828 30%, #124420 60%, #0e3618 100%);
}
.mp-lines { position: absolute; inset: 0; }
.mp-halfline {
  position: absolute; left: 50%; top: 0; bottom: 0;
  width: 1px; background: rgba(255,255,255,0.3);
}
.mp-center-circle {
  position: absolute; left: 50%; top: 50%;
  width: 16px; height: 16px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.mp-center-dot {
  position: absolute; left: 50%; top: 50%;
  width: 3px; height: 3px; border-radius: 50%;
  background: rgba(255,255,255,0.35);
  transform: translate(-50%, -50%);
}
/* 球场边界线 */
.mini-pitch::before {
  content: '';
  position: absolute; inset: 3px; border: 1px solid rgba(255,255,255,0.15);
  border-radius: 3px; pointer-events: none; z-index: 1;
}

/* 禁区线 (左) */
.mini-pitch::after {
  content: '';
  position: absolute; left: 8px; top: 6px; bottom: 6px;
  width: 10px; border: 1px solid rgba(255,255,255,0.12);
  border-radius: 2px; pointer-events: none; z-index: 1;
}

/* 球员位置点 */
.mp-player-dot {
  position: absolute; z-index: 2;
  width: 6px; height: 6px; border-radius: 50%;
  background: #FBBF24;
  box-shadow: 0 0 6px rgba(251,191,36,0.6);
  transform: translate(-50%, -50%);
  animation: dotPulse 2s ease-in-out infinite;
}
@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 4px rgba(251,191,36,0.4); }
  50% { box-shadow: 0 0 10px rgba(251,191,36,0.8); }
}

/* ---- 世界杯装饰条 ---- */
.wc-stripe {
  display: flex; align-items: center; gap: 6px;
  z-index: 2; width: 100%; padding: 3px 0;
  opacity: 0.85;
}
.wc-stripe-line {
  flex: 1; height: 2px; border-radius: 1px;
  background: linear-gradient(90deg, transparent, var(--stripe-color), transparent);
}
.wc-stripe-ball {
  font-size: 11px;
  animation: ballSpin 3s ease-in-out infinite;
}
@keyframes ballSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(15deg) scale(1.2); }
}
.wc-stripe-text {
  font-size: 8px; font-weight: 700; letter-spacing: 1.2px;
  color: rgba(255,255,255,0.3);
}

/* ================================================================
   背面
   ================================================================ */
.card-back {
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 100%),
    radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,211,238,0.04) 0%, transparent 100%),
    linear-gradient(175deg, #1c2948 0%, #162244 25%, #111e3c 55%, #0e1a34 100%);
  border: 1.5px solid rgba(255,255,255,0.12);
  transform: rotateY(180deg);
  display: flex; flex-direction: column;
  padding: 12px 14px 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  gap: 2px;
}
.rarity-legendary .card-back { border-color: rgba(251,191,36,0.5); }
.rarity-legendary .card-back .inner-border { border-color: rgba(251,191,36,0.12); }
.rarity-epic .card-back { border-color: rgba(34,211,238,0.4); }
.rarity-epic .card-back .inner-border { border-color: rgba(34,211,238,0.1); }
.rarity-rare .card-back { border-color: rgba(99,102,241,0.35); }
.rarity-rare .card-back .inner-border { border-color: rgba(99,102,241,0.08); }

.back-header { z-index: 2; text-align: center; }
.back-name-row {
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.back-name { font-size: 14px; font-weight: 700; color: #F0F2F5; }
.back-stats-row {
  display: flex; align-items: center; justify-content: center;
  gap: 2px; margin-top: 6px;
  padding: 6px 8px; border-radius: 10px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.05);
}
.bsr-item { display: flex; flex-direction: column; align-items: center; min-width: 36px; }
.bsr-val { font-size: 14px; font-weight: 800; color: #E8ECF1; line-height: 1; }
.bsr-label { font-size: 8px; color: #5A6478; margin-top: 2px; }
.bsr-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.06); }

.back-radar { flex: 1; min-height: 0; z-index: 2; margin: 0 -4px; }

.back-hex {
  display: flex; justify-content: center; gap: 9px;
  z-index: 2; padding: 0 2px; flex-wrap: wrap;
}
.bh-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.bh-ring {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: conic-gradient(var(--clr) calc(var(--pct) * 360deg), rgba(255,255,255,0.04) 0);
  position: relative;
}
.bh-ring::after {
  content: ''; position: absolute;
  width: 28px; height: 28px; border-radius: 50%;
  background: #141B2D;
}
.bh-val { position: relative; z-index: 1; font-size: 10px; font-weight: 800; color: #E8ECF1; }
.bh-label { font-size: 8px; color: #5A6478; }

.back-value {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  z-index: 2;
  padding: 5px 12px; border-radius: 10px;
  background: rgba(251,191,36,0.08);
  border: 1px solid rgba(251,191,36,0.15);
}
.bv-icon { font-size: 11px; }
.bv-text { font-size: 11px; font-weight: 700; color: #FBBF24; }

/* ================================================================
   粒子特效
   ================================================================ */
.particles {
  position: absolute; top: 50%; left: 50%; pointer-events: none; z-index: 10;
}
.particle {
  position: absolute;
  width: var(--size); height: var(--size);
  border-radius: 50%;
  background: var(--clr);
  box-shadow: 0 0 4px var(--clr);
  animation: particleBurst var(--dur) ease-out forwards;
}
@keyframes particleBurst {
  from {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(var(--dist));
    opacity: 0;
  }
}

/* ================================================================
   揭示动画
   ================================================================ */
.player-card-wrap:not(.is-revealed) .trading-card {
  opacity: 0;
  transform: scale(0.82) translateY(24px);
  transition: all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.player-card-wrap.is-revealed .trading-card {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* ================================================================
   响应式
   ================================================================ */
@media (max-width: 768px) {
  .player-card-wrap { width: 180px; height: 300px; }
  .card-front { padding: 10px 10px 8px; }
  .card-back { padding: 8px 10px 6px; }
  .photo-frame { width: 64px; height: 64px; }
  .rating-badge { width: 38px; height: 38px; top: 6px; left: 6px; }
  .rating-badge .rating-ring { width: 38px; height: 38px; }
  .rating-num { font-size: 12px; }
  .card-name { font-size: 13px; }
  .bh-ring { width: 30px; height: 30px; }
  .bh-ring::after { width: 24px; height: 24px; }
  .bh-val { font-size: 9px; }
  .corner-tl, .corner-tr, .corner-bl, .corner-br { width: 14px; height: 14px; }
  .inner-border { inset: 4px; border-radius: 12px; }
}
</style>
