<template>
  <div class="tab-players">
    <div class="players-header">
      <h2 class="section-title">射手榜</h2>
      <span class="badge badge-gold">金靴争夺</span>
    </div>

    <!-- TOP 3 突出展示 -->
    <div class="top3-grid">
      <div v-for="(p, i) in top3" :key="p.name"
        class="top3-card card anim-fadeInUp" :class="`delay-${i+1}`"
        :style="{ borderTop: `4px solid ${p.color}` }">
        <div class="top3-rank" :style="{ color: p.color }">#{{ i + 1 }}</div>
        <FlagTag :code="p.code" :name="p.name" large />
        <div class="top3-goals">
          <span class="goals-num">{{ p.goals }}</span>
          <span class="goals-label">进球</span>
        </div>
        <div class="top3-detail">
          <span>{{ p.tournaments }}届</span>
          <span>{{ p.matches }}场</span>
          <span>{{ p.avg }}场均</span>
        </div>
      </div>
    </div>

    <!-- 完整射手榜表格 -->
    <div class="full-table card anim-fadeInUp delay-4">
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>球员</th>
            <th>国家</th>
            <th>进球</th>
            <th>场次</th>
            <th>场均</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in players" :key="p.name">
            <td><span class="table-rank" :class="{ top: i < 3 }">{{ i + 1 }}</span></td>
            <td class="player-name">{{ p.name }}</td>
            <td><FlagTag :code="p.code" small /></td>
            <td><span class="goals-highlight">{{ p.goals }}</span></td>
            <td>{{ p.matches }}</td>
            <td>{{ p.avg }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ChartCard title="球员对比雷达图" subtitle="进球 / 助攻 / 场次 / 夺冠 / MVP" :height="420" :option="radarOpt" :delay="5" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FlagTag from '../components/FlagTag.vue'
import ChartCard from '../components/ChartCard.vue'

const top3 = [
  { name: '克洛泽', code: 'de', goals: 16, tournaments: 4, matches: 24, avg: '0.67', color: '#FBBF24' },
  { name: '罗纳尔多', code: 'br', goals: 15, tournaments: 3, matches: 19, avg: '0.79', color: '#F43F5E' },
  { name: '穆勒', code: 'de', goals: 14, tournaments: 2, matches: 13, avg: '1.08', color: '#22D3EE' },
]

const players = [
  { name: '克洛泽', code: 'de', goals: 16, matches: 24, avg: '0.67' },
  { name: '罗纳尔多', code: 'br', goals: 15, matches: 19, avg: '0.79' },
  { name: '穆勒', code: 'de', goals: 14, matches: 13, avg: '1.08' },
  { name: '方丹', code: 'fr', goals: 13, matches: 6, avg: '2.17' },
  { name: '梅西', code: 'ar', goals: 13, matches: 26, avg: '0.50' },
  { name: '贝利', code: 'br', goals: 12, matches: 14, avg: '0.86' },
  { name: '科奇什', code: 'hu', goals: 11, matches: 5, avg: '2.20' },
  { name: '克林斯曼', code: 'de', goals: 11, matches: 17, avg: '0.65' },
]

const radarOpt = ref({
  tooltip: {},
  legend: { data: ['克洛泽', '罗纳尔多', '梅西'], top: 0, textStyle: { color: '#8892A6' } },
  radar: {
    indicator: [
      { name: '总进球', max: 20 },
      { name: '世界杯数', max: 5 },
      { name: '场均进球', max: 2.5 },
      { name: '冠军数', max: 3 },
      { name: '金球奖', max: 3 },
    ],
    axisName: { color: '#5A6478', fontSize: 12 },
    splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [16, 4, 0.67, 1, 0], name: '克洛泽', areaStyle: { opacity: 0.15, color: '#FBBF24' }, lineStyle: { color: '#FBBF24' }, itemStyle: { color: '#FBBF24' } },
      { value: [15, 3, 0.79, 2, 0], name: '罗纳尔多', areaStyle: { opacity: 0.15, color: '#F43F5E' }, lineStyle: { color: '#F43F5E' }, itemStyle: { color: '#F43F5E' } },
      { value: [13, 5, 0.50, 1, 2], name: '梅西', areaStyle: { opacity: 0.15, color: '#22D3EE' }, lineStyle: { color: '#22D3EE' }, itemStyle: { color: '#22D3EE' } },
    ]
  }]
})
</script>

<style scoped>
.tab-players { padding-top: 8px; }
.players-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.top3-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  margin-bottom: 20px;
}
.top3-card {
  display: flex; flex-direction: column; align-items: center;
  padding: 24px 16px; gap: 10px; text-align: center;
}
.top3-rank {
  font-size: 14px; font-weight: 800;
}
.top3-goals {
  display: flex; flex-direction: column; align-items: center;
}
.goals-num {
  font-size: 36px; font-weight: 800;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.goals-label {
  font-size: 12px; color: #5A6478;
}
.top3-detail {
  display: flex; gap: 12px;
  font-size: 12px; color: #5A6478;
}
.full-table { overflow: hidden; margin-bottom: 20px; }
.full-table table { width: 100%; border-collapse: collapse; }
.full-table th {
  padding: 12px 10px;
  font-size: 12px; font-weight: 600; color: #5A6478;
  text-align: center; background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.full-table td {
  padding: 10px; font-size: 13px; text-align: center;
  color: #8892A6;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.full-table tr:hover td { background: rgba(255,255,255,0.03); }
.player-name { font-weight: 600; color: #E8ECF1; text-align: left !important; }
.table-rank {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px;
  font-size: 12px; font-weight: 700; color: #5A6478;
  background: rgba(255,255,255,0.04);
}
.table-rank.top {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  color: #0B0F1A;
}
.goals-highlight {
  font-size: 15px; font-weight: 800; color: #22D3EE;
}

@media (max-width: 768px) {
  .top3-grid { grid-template-columns: 1fr; }
}
</style>
