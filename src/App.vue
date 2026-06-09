<template>
  <div class="app">
    <AppHeader />
    <TabBar :tabs="tabs" v-model="activeTab" />
    <main class="main-content">
      <div class="container">
        <Transition name="tab-switch" mode="out-in">
          <component :is="currentTab" />
        </Transition>
      </div>
    </main>
    <footer class="app-footer">
      <p>2026 FIFA World Cup Data Visualization  数据可视化课设</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import TabBar from './components/TabBar.vue'
import TabOverview from './tabs/TabOverview.vue'
import TabHistory from './tabs/TabHistory.vue'
import TabSchedule from './tabs/TabSchedule.vue'
import TabStandings from './tabs/TabStandings.vue'
import TabPlayers from './tabs/TabPlayers.vue'
import TabMap from './tabs/TabMap.vue'

const tabs = [
  { id: 'overview', name: '总览' },
  { id: 'history', name: '历史' },
  { id: 'schedule', name: '赛程' },
  { id: 'standings', name: '积分' },
  { id: 'players', name: '球员' },
  { id: 'map', name: '地图', badge: 'NEW' },
]

const activeTab = ref('overview')
const tabMap = { overview: TabOverview, history: TabHistory, schedule: TabSchedule, standings: TabStandings, players: TabPlayers, map: TabMap }
const currentTab = computed(() => tabMap[activeTab.value])
</script>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; padding: 0 0 40px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

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
}
</style>
