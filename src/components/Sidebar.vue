<template>
  <aside class="sidebar">
    <!-- Logo区 -->
    <div class="sb-logo">
      <div class="sb-logo-box">FIFA</div>
      <span class="sb-logo-text">世界杯</span>
    </div>

    <!-- 导航项 -->
    <nav class="sb-nav">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="sb-nav-item"
        :class="{ active: modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span class="sb-icon" v-html="tab.icon"></span>
        <span class="sb-label">{{ tab.name }}</span>
        <span v-if="tab.badge" class="sb-badge">{{ tab.badge }}</span>
        <div v-if="modelValue === tab.id" class="sb-active-bar"></div>
      </div>
    </nav>

    <!-- 底部装饰 -->
    <div class="sb-footer">
      <div class="sb-footer-line"></div>
      <div class="sb-footer-text">2026 · 美加墨</div>
      <div class="sb-footer-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, required: true }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.sidebar {
  width: 100px;
  background: linear-gradient(180deg, #0B0F1A 0%, #0E1424 50%, #0B0F1A 100%);
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}
/* 右侧发光线 */
.sidebar::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(180deg,
    transparent 0%, rgba(34,211,238,0.15) 20%, rgba(251,191,36,0.1) 50%, rgba(34,211,238,0.15) 80%, transparent 100%);
  pointer-events: none;
}

/* Logo */
.sb-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  width: 100%;
}
.sb-logo-box {
  background: linear-gradient(135deg, #22D3EE, #06B6D4);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 16px; font-weight: 900; color: #0B0F1A;
  letter-spacing: 1px;
  box-shadow: 0 2px 16px rgba(34,211,238,0.35);
}
.sb-logo-text {
  font-size: 12px; color: #5A6B82; font-weight: 600;
  letter-spacing: 3px;
}

/* 导航 */
.sb-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 0 10px;
}
.sb-nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 6px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
}
.sb-nav-item:hover {
  background: rgba(255,255,255,0.04);
}
.sb-nav-item.active {
  background: rgba(34,211,238,0.08);
}

/* 图标 */
.sb-icon {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  color: #5A6B82;
  transition: color 0.25s ease, filter 0.25s ease;
}
.sb-icon svg {
  width: 100%; height: 100%;
}
.sb-nav-item:hover .sb-icon { color: #8892A6; }
.sb-nav-item.active .sb-icon {
  color: #22D3EE;
  filter: drop-shadow(0 0 8px rgba(34,211,238,0.45));
}

/* 标签 */
.sb-label {
  font-size: 13px; font-weight: 600; color: #5A6B82;
  transition: color 0.25s ease;
  white-space: nowrap;
}
.sb-nav-item:hover .sb-label { color: #8892A6; }
.sb-nav-item.active .sb-label { color: #22D3EE; }

/* Badge */
.sb-badge {
  position: absolute;
  top: 8px; right: 8px;
  background: linear-gradient(135deg, #EF4444, #F87171);
  color: #fff; font-size: 9px; font-weight: 700;
  padding: 2px 6px; border-radius: 8px;
  line-height: 1.4;
}

/* 激活指示条 */
.sb-active-bar {
  position: absolute;
  left: 0; top: 15%; bottom: 15%;
  width: 3.5px;
  background: linear-gradient(180deg, #22D3EE, #06B6D4);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 10px rgba(34,211,238,0.5);
  animation: barIn 0.25s ease-out;
}
@keyframes barIn {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}

/* 底部 */
.sb-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  width: 100%;
}
.sb-footer-line {
  width: 40px; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(34,211,238,0.35), transparent);
}
.sb-footer-text {
  font-size: 11px; color: #3A4560; font-weight: 600;
  letter-spacing: 2px; white-space: nowrap;
}
.sb-footer-dots {
  display: flex; gap: 5px;
}
.sb-footer-dots span {
  width: 5px; height: 5px; border-radius: 50%;
  background: rgba(34,211,238,0.25);
  animation: dotPulse 2s ease-in-out infinite;
}
.sb-footer-dots span:nth-child(2) { animation-delay: 0.3s; background: rgba(251,191,36,0.25); }
.sb-footer-dots span:nth-child(3) { animation-delay: 0.6s; background: rgba(244,63,94,0.25); }
@keyframes dotPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}
</style>
