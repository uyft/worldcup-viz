<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <div class="logo-box">
          <span class="fifa-text">FIFA</span>
        </div>
        <h1 class="header-title">世界杯</h1>
        <div class="year-select">
          <select v-model="year" class="year-dropdown">
            <option>2026</option>
            <option>2022</option>
            <option>2018</option>
            <option>2014</option>
          </select>
          <svg class="dropdown-icon" viewBox="0 0 24 24" width="14" height="14">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
      <div class="header-right">
        <span class="header-badge anim-pulse">2026 美加墨</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const year = ref('2026')
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #0B0F1A 0%, #141B2D 60%, #1A2340 100%);
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
  position: sticky; top: 0; z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  max-width: 1200px; margin: 0 auto; padding: 14px 24px;
  display: flex; align-items: center; justify-content: space-between;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.logo-box {
  background: linear-gradient(135deg, #22D3EE, #06B6D4);
  border-radius: 6px; padding: 4px 8px;
  box-shadow: 0 2px 12px rgba(34,211,238,0.3);
}
.fifa-text {
  font-size: 14px; font-weight: 900; color: #0B0F1A;
  letter-spacing: 1px;
}
.header-title {
  font-size: 20px; font-weight: 700; color: #E8ECF1;
  letter-spacing: 2px;
}
.year-select { position: relative; }
.year-dropdown {
  appearance: none; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 5px 28px 5px 12px;
  font-size: 13px; color: #E8ECF1; font-weight: 600;
  cursor: pointer; outline: none;
  transition: all 0.2s ease;
}
.year-dropdown:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
}
.year-dropdown option { background: #141B2D; color: #E8ECF1; }
.dropdown-icon {
  position: absolute; right: 8px; top: 50%;
  transform: translateY(-50%); color: #8892A6;
  pointer-events: none;
}
.header-badge {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  color: #0B0F1A; font-size: 12px; font-weight: 700;
  padding: 6px 14px; border-radius: 20px;
  box-shadow: 0 2px 12px rgba(245,158,11,0.3);
  letter-spacing: 1px;
}
</style>
