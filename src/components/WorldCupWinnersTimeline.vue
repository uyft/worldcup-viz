<template>
  <div class="winners-timeline card">
    <div class="timeline-header">
      <h3 class="timeline-title">🏆 历届世界杯冠军 · All Winners</h3>
      <span class="timeline-badge">{{ champions.length }} 届</span>
    </div>

    <!-- 横向滚动时间轴 -->
    <div class="timeline-scroll" ref="scrollRef">
      <div class="timeline-track">
        <!-- 底部连线（在 track 内部，随内容滚动覆盖全部节点） -->
        <div class="timeline-line"></div>
        <div
          v-for="(champ, index) in champions"
          :key="champ.year"
          class="timeline-node"
          :class="{ 'is-active': activeChampion?.year === champ.year }"
          @click="onNodeClick(champ, index)"
        >
          <!-- 国旗圆形标记 -->
          <div class="node-flag-ring">
            <div class="node-flag-inner">
              <img
                v-if="!flagErrors[champ.winnerCode]"
                :src="`https://flagcdn.com/w80/${champ.winnerCode}.png`"
                :alt="champ.winnerName"
                class="node-flag-img"
                @error="onFlagError(champ.winnerCode)"
              />
              <span v-else class="node-flag-text">{{ champ.winnerCode.toUpperCase() }}</span>
            </div>
            <!-- 冠军星标 -->
            <span class="node-star">★</span>
          </div>
          <!-- 国家名 -->
          <div class="node-name">{{ champ.winnerName }}</div>
          <!-- 年份 -->
          <div class="node-year">{{ champ.year }}</div>
          <!-- 连线圆点 -->
          <div class="node-dot">
            <div class="dot-inner"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  champions: { type: Array, required: true },
})

const emit = defineEmits(['select-champion'])

const scrollRef = ref(null)
const activeChampion = ref(null)
const flagErrors = reactive({})

function onFlagError(code) {
  flagErrors[code] = true
}

function onNodeClick(champ, index) {
  activeChampion.value = champ

  // 滚动到可视区域中央
  if (scrollRef.value) {
    const nodes = scrollRef.value.querySelectorAll('.timeline-node')
    const target = nodes[index]
    if (target) {
      const scrollContainer = scrollRef.value
      const containerWidth = scrollContainer.clientWidth
      const targetLeft = target.offsetLeft
      const targetWidth = target.offsetWidth
      const scrollTo = targetLeft - containerWidth / 2 + targetWidth / 2
      scrollContainer.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' })
    }
  }

  emit('select-champion', champ)

  // 3.5 秒后清除激活状态
  setTimeout(() => {
    if (activeChampion.value === champ) {
      activeChampion.value = null
    }
  }, 3500)
}
</script>

<style scoped>
.winners-timeline {
  margin-bottom: 20px;
  padding: 16px 20px 10px;
  background: radial-gradient(ellipse at 50% 30%, #101830 0%, #0C1424 60%, #080E1E 100%);
  overflow: hidden;
  position: relative;
}

/* ===== Header ===== */
.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 700;
  color: #E8ECF1;
  margin: 0;
}

.timeline-badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 20px;
  background: rgba(255, 215, 0, 0.12);
  color: #FFD700;
  font-weight: 600;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

/* ===== 滚动容器 ===== */
.timeline-scroll {
  overflow-x: auto;
  overflow-y: visible;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: rgba(232, 160, 64, 0.25) transparent;
  padding-bottom: 24px;
}

.timeline-scroll::-webkit-scrollbar {
  height: 4px;
}
.timeline-scroll::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.02);
  border-radius: 3px;
}
.timeline-scroll::-webkit-scrollbar-thumb {
  background: rgba(232,160,64,0.25);
  border-radius: 3px;
}
.timeline-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(232,160,64,0.45);
}

/* ===== 底部连线（在 track 内部，覆盖全部节点） ===== */
.timeline-line {
  position: absolute;
  bottom: 9px;
  left: 28px;
  right: 28px;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.08) 4%,
    rgba(255, 215, 0, 0.3) 12%,
    rgba(255, 215, 0, 0.45) 50%,
    rgba(255, 215, 0, 0.3) 88%,
    rgba(255, 215, 0, 0.08) 96%,
    transparent 100%
  );
  pointer-events: none;
}

/* ===== 轨道 ===== */
.timeline-track {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-width: max-content;
  position: relative;
  padding: 8px 24px 0;
}

/* ===== 每个节点 ===== */
.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  width: 88px;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-bottom: 8px;
  transition: transform 0.25s ease;
}

.timeline-node:hover {
  transform: translateY(-4px);
}

.timeline-node.is-active {
  transform: translateY(-6px);
}

/* ===== 国旗圆框 ===== */
.node-flag-ring {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  padding: 2px;
  background: conic-gradient(
    from 0deg,
    rgba(255, 215, 0, 0.5),
    rgba(255, 180, 0, 0.2),
    rgba(255, 215, 0, 0.5),
    rgba(255, 180, 0, 0.2),
    rgba(255, 215, 0, 0.5)
  );
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.timeline-node:hover .node-flag-ring {
  background: conic-gradient(
    from 0deg,
    rgba(255, 215, 0, 0.9),
    rgba(255, 180, 0, 0.5),
    rgba(255, 215, 0, 0.9),
    rgba(255, 180, 0, 0.5),
    rgba(255, 215, 0, 0.9)
  );
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.3), 0 0 48px rgba(255, 180, 0, 0.12);
  transform: scale(1.08);
}

.timeline-node.is-active .node-flag-ring {
  background: conic-gradient(
    from 0deg,
    #FFD700,
    #FFA020,
    #FFD700,
    #FFA020,
    #FFD700
  );
  box-shadow: 0 0 28px rgba(255, 215, 0, 0.45), 0 0 56px rgba(255, 180, 0, 0.18);
  animation: activePulse 0.8s ease-in-out infinite;
}

@keyframes activePulse {
  0%, 100% { box-shadow: 0 0 28px rgba(255, 215, 0, 0.45), 0 0 56px rgba(255, 180, 0, 0.18); }
  50%      { box-shadow: 0 0 40px rgba(255, 215, 0, 0.7), 0 0 72px rgba(255, 180, 0, 0.3); }
}

/* 冠军小星星 */
.node-star {
  position: absolute;
  top: -5px;
  right: -3px;
  font-size: 12px;
  color: #FFD700;
  text-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
  pointer-events: none;
  z-index: 2;
}

/* ===== 国旗内部 ===== */
.node-flag-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #1A2340;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-flag-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.node-flag-text {
  font-size: 9px;
  font-weight: 700;
  color: #8892A6;
  text-align: center;
  line-height: 1.2;
  padding: 2px;
}

/* ===== 国家名 ===== */
.node-name {
  font-size: 11px;
  font-weight: 600;
  color: #C0C8D4;
  white-space: nowrap;
  text-align: center;
  max-width: 84px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.25s;
}

.timeline-node:hover .node-name {
  color: #FFD700;
}

.timeline-node.is-active .node-name {
  color: #FFD700;
}

/* ===== 年份 ===== */
.node-year {
  font-size: 10px;
  font-weight: 700;
  color: #8A90A0;
  white-space: nowrap;
  transition: color 0.25s;
}

.timeline-node:hover .node-year {
  color: #E8A040;
}

.timeline-node.is-active .node-year {
  color: #FFD700;
}

/* ===== 连线节点 ===== */
.node-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: absolute;
  bottom: 2px;
}

.dot-inner {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(200, 180, 140, 0.4);
  transition: all 0.3s ease;
}

.timeline-node:hover .dot-inner {
  width: 8px;
  height: 8px;
  background: #E8A040;
}

.timeline-node.is-active .dot-inner {
  width: 10px;
  height: 10px;
  background: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
}

.timeline-node.is-active .node-dot {
  background: rgba(255, 215, 0, 0.08);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .winners-timeline {
    padding: 12px 14px 6px;
  }

  .timeline-title {
    font-size: 13px;
  }

  .timeline-node {
    width: 72px;
    gap: 4px;
  }

  .node-flag-ring {
    width: 40px;
    height: 40px;
  }

  .node-name {
    font-size: 10px;
    max-width: 68px;
  }

  .node-year {
    font-size: 9px;
  }

  .node-star {
    font-size: 10px;
    top: -4px;
    right: -2px;
  }

  .timeline-track {
    gap: 2px;
    padding: 6px 14px 0;
  }

  .dot-inner {
    width: 4px;
    height: 4px;
  }
}

@media (max-width: 500px) {
  .timeline-node {
    width: 58px;
    gap: 3px;
  }

  .node-flag-ring {
    width: 32px;
    height: 32px;
  }

  .node-name {
    font-size: 9px;
    max-width: 54px;
  }

  .node-year {
    font-size: 8px;
  }

  .node-star {
    font-size: 8px;
    top: -3px;
    right: -1px;
  }

  .timeline-track {
    gap: 0px;
    padding: 4px 10px 0;
  }

  .timeline-line {
    bottom: 16px;
  }
}
</style>
