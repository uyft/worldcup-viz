<template>
  <div class="app">
    <SplashScreen v-if="showSplash" @done="showSplash = false" />
    <AppHeader />
    <div class="app-body">
      <Sidebar :tabs="tabs" v-model="activeTab" />
      <main class="main-content">
        <div class="container">
          <Transition name="tab-switch" mode="out-in">
            <component :is="currentTab" @navigate="handleNavigate" />
          </Transition>
        </div>
      </main>
    </div>
    <footer class="app-footer">
      <p>2026 FIFA World Cup Data Visualization  数据可视化课设</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SplashScreen from './components/SplashScreen.vue'
import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
import TabOverview from './tabs/TabOverview.vue'
import TabHistory from './tabs/TabHistory.vue'
import TabSchedule from './tabs/TabSchedule.vue'
import TabStandings from './tabs/TabStandings.vue'
import TabPlayers from './tabs/TabPlayers.vue'
import TabMap from './tabs/TabMap.vue'

const tabs = [
  { id: 'overview', name: '总览', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: 'history', name: '历史', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { id: 'schedule', name: '赛程', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
  { id: 'standings', name: '积分', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
  { id: 'players', name: '球员', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { id: 'map', name: '地图', badge: 'NEW', icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>' },
]

const showSplash = ref(true)
const activeTab = ref('overview')
const tabMap = { overview: TabOverview, history: TabHistory, schedule: TabSchedule, standings: TabStandings, players: TabPlayers, map: TabMap }
const currentTab = computed(() => tabMap[activeTab.value])

function handleNavigate(target) {
  if (tabMap[target]) activeTab.value = target
}
</script>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }

.app-body {
  flex: 1;
  display: flex;
}

.main-content {
  flex: 1;
  padding: 0 0 40px;
  overflow-x: hidden;
}
.container {
  max-width: 1680px;
  margin: 0 auto;
  padding: 0 32px;
}

/* Tab 切换动画 */
.tab-switch-enter-active { animation: tabIn 0.35s ease-out; }
.tab-switch-leave-active { animation: tabOut 0.2s ease-in; }
@keyframes tabIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes tabOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}

.app-footer {
  text-align: center; padding: 24px;
  color: #5A6478; font-size: 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  margin-left: 100px;
}
</style>
