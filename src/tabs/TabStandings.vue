<template>
  <div class="tab-standings">
    <div class="standings-header">
      <h2 class="section-title">小组赛积分榜</h2>
      <span class="badge badge-new">实时更新</span>
    </div>

    <div class="group-tabs">
      <button
        v-for="g in groupNames"
        :key="g"
        class="group-btn"
        :class="{ active: activeGroup === g }"
        @click="activeGroup = g"
      >{{ g }}组</button>
    </div>

    <div class="standings-table card anim-fadeInUp">
      <table>
        <thead>
          <tr>
            <th class="col-rank">排名</th>
            <th class="col-team">球队</th>
            <th class="col-num">赛</th>
            <th class="col-num">胜</th>
            <th class="col-num">平</th>
            <th class="col-num">负</th>
            <th class="col-num">进</th>
            <th class="col-num">失</th>
            <th class="col-num">净</th>
            <th class="col-pts">积分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, i) in currentGroupTeams" :key="team.name"
            :class="{ promote: i < 2, animFadeInUp: true }" :style="{ animationDelay: `${i * 0.1}s` }">
            <td class="col-rank">
              <span class="rank-num" :class="{ top: i < 2, third: i === 2 }">{{ i + 1 }}</span>
            </td>
            <td class="col-team"><FlagTag :code="team.code" :name="team.name" /></td>
            <td class="col-num">{{ team.p }}</td>
            <td class="col-num">{{ team.w }}</td>
            <td class="col-num">{{ team.d }}</td>
            <td class="col-num">{{ team.l }}</td>
            <td class="col-num">{{ team.gf }}</td>
            <td class="col-num">{{ team.ga }}</td>
            <td class="col-num" :class="{ positive: team.gd > 0, negative: team.gd < 0 }">{{ team.gd > 0 ? '+' : '' }}{{ team.gd }}</td>
            <td class="col-pts"><span class="pts-value">{{ team.pts }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <ChartCard title="各组场均进球对比" subtitle="12个小组进攻火力一览" :height="320" :option="goalsByGroupOpt" :delay="5" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FlagTag from '../components/FlagTag.vue'
import ChartCard from '../components/ChartCard.vue'

const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const activeGroup = ref('A')

const standings = {
  A: [
    { code: 'us', name: '美国', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { code: 'mx', name: '墨西哥', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { code: 'ca', name: '加拿大', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { code: 'jp', name: '日本', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
  B: [
    { code: 'ar', name: '阿根廷', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { code: 'fr', name: '法国', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { code: 'de', name: '德国', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    { code: 'kr', name: '韩国', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
  ],
}

const currentGroupTeams = computed(() => standings[activeGroup.value] || standings['A'])

const goalsByGroupOpt = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '30', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    axisLabel: { color: '#5A6478' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  series: [{
    type: 'bar',
    data: [2.8, 3.2, 2.5, 2.9, 3.1, 2.6, 2.7, 3.0, 2.4, 2.8, 3.3, 2.5],
    itemStyle: {
      borderRadius: [6, 6, 0, 0],
      color: (p) => {
        const v = p.value
        if (v >= 3.0) return '#F43F5E'
        if (v >= 2.7) return '#22D3EE'
        return '#3A4A6B'
      }
    },
    barWidth: '55%'
  }]
})
</script>

<style scoped>
.tab-standings { padding-top: 8px; }
.standings-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.group-tabs {
  display: flex; gap: 6px; flex-wrap: wrap;
  margin-bottom: 16px;
}
.group-btn {
  padding: 6px 14px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  font-size: 13px; font-weight: 600; color: #8892A6;
  cursor: pointer; transition: all 0.2s ease;
}
.group-btn:hover { border-color: #22D3EE; color: #22D3EE; }
.group-btn.active {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A; border-color: transparent;
  box-shadow: 0 2px 12px rgba(34,211,238,0.25);
}
.standings-table { overflow: hidden; }
.standings-table table {
  width: 100%; border-collapse: collapse;
}
.standings-table th {
  padding: 12px 10px;
  font-size: 12px; font-weight: 600; color: #5A6478;
  text-align: center; background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.standings-table td {
  padding: 12px 10px;
  font-size: 13px; text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: #8892A6;
  transition: background 0.15s ease;
}
.standings-table tr:hover td { background: rgba(255,255,255,0.03); }
.standings-table tr.promote { background: linear-gradient(90deg, rgba(34,211,238,0.04), transparent); }
.col-rank { width: 50px; }
.col-team { text-align: left !important; }
.col-num { width: 44px; }
.col-pts { width: 60px; }
.rank-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px;
  font-size: 12px; font-weight: 700; color: #5A6478;
  background: rgba(255,255,255,0.04);
}
.rank-num.top {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A;
}
.rank-num.third {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  color: #0B0F1A;
}
.pts-value {
  font-size: 15px; font-weight: 800; color: #22D3EE;
}
.positive { color: #10B981; font-weight: 600; }
.negative { color: #EF4444; font-weight: 600; }
</style>
