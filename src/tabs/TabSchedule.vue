<template>
  <div class="tab-schedule">
    <div class="schedule-header">
      <h2 class="section-title">小组赛程</h2>
      <div class="schedule-filters">
        <button v-for="g in groups" :key="g"
          class="filter-btn" :class="{ active: activeGroup === g }"
          @click="activeGroup = g">{{ g }}</button>
      </div>
    </div>

    <div class="match-grid">
      <MatchCard v-for="(m, i) in filteredMatches" :key="i"
        :group="m.group" :time="m.time" :stage="m.stage"
        :home="m.home" :away="m.away" :venue="m.venue"
        :delay="i + 1" />
    </div>

    <ChartCard title="赛事日历密度" subtitle="6月12日 - 7月20日 每日比赛场次" :height="320" :option="calendarOpt" :delay="filteredMatches.length + 1" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MatchCard from '../components/MatchCard.vue'
import ChartCard from '../components/ChartCard.vue'

const groups = ['全部', 'A', 'B', 'C', 'D', 'E', 'F']
const activeGroup = ref('全部')

const matches = [
  { group:'A', time:'6月12日 20:00', stage:'揭幕战', home:{code:'us',name:'美国',score:0}, away:{code:'mx',name:'墨西哥',score:0}, venue:'洛杉矶 SoFi体育场' },
  { group:'A', time:'6月13日 18:00', stage:'小组赛', home:{code:'ca',name:'加拿大',score:0}, away:{code:'jp',name:'日本',score:0}, venue:'温哥华 BC Place' },
  { group:'B', time:'6月14日 20:00', stage:'小组赛', home:{code:'ar',name:'阿根廷',score:0}, away:{code:'fr',name:'法国',score:0}, venue:'纽约 大都会人寿体育场' },
  { group:'B', time:'6月15日 18:00', stage:'小组赛', home:{code:'de',name:'德国',score:0}, away:{code:'kr',name:'韩国',score:0}, venue:'达拉斯 AT&T体育场' },
  { group:'C', time:'6月16日 20:00', stage:'小组赛', home:{code:'br',name:'巴西',score:0}, away:{code:'pt',name:'葡萄牙',score:0}, venue:'迈阿密 硬石体育场' },
  { group:'C', time:'6月17日 18:00', stage:'小组赛', home:{code:'es',name:'西班牙',score:0}, away:{code:'nl',name:'荷兰',score:0}, venue:'亚特兰大 梅赛德斯-奔驰体育场' },
  { group:'D', time:'6月18日 20:00', stage:'小组赛', home:{code:'gb-eng',name:'英格兰',score:0}, away:{code:'it',name:'意大利',score:0}, venue:'多伦多 BMO球场' },
  { group:'D', time:'6月19日 18:00', stage:'小组赛', home:{code:'uy',name:'乌拉圭',score:0}, away:{code:'co',name:'哥伦比亚',score:0}, venue:'墨西哥城 阿兹特克体育场' },
]

const filteredMatches = computed(() =>
  activeGroup.value === '全部' ? matches : matches.filter(m => m.group === activeGroup.value)
)

const calendarOpt = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '30', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['6.12', '6.13', '6.14', '6.15', '6.16', '6.17', '6.18', '6.19', '6.20', '6.21', '6.22', '6.23', '6.24', '6.25'],
    axisLabel: { color: '#5A6478', fontSize: 11 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    type: 'value', max: 6,
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  series: [{
    type: 'bar',
    data: [2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 3],
    itemStyle: { borderRadius: [6, 6, 0, 0], color: '#22D3EE' },
    barWidth: '60%'
  }]
})
</script>

<style scoped>
.tab-schedule { padding-top: 8px; }
.schedule-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
}
.schedule-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-btn {
  padding: 6px 14px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  font-size: 13px; font-weight: 600; color: #8892A6;
  cursor: pointer; transition: all 0.2s ease;
}
.filter-btn:hover { border-color: #22D3EE; color: #22D3EE; }
.filter-btn.active {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A; border-color: transparent;
  box-shadow: 0 2px 12px rgba(34,211,238,0.25);
}
.match-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 768px) {
  .match-grid { grid-template-columns: 1fr; }
}
</style>
