<template>
  <div class="tab-standings">
    <!-- 顶部标题 -->
    <div class="standings-header">
      <h2 class="section-title">小组赛积分榜</h2>
      <span class="badge badge-new">实时更新</span>
    </div>

    <!-- 概览数据卡 -->
    <div class="overview-row anim-fadeInUp">
      <div class="ov-card" v-for="ov in overviewCards" :key="ov.label" :style="{ '--ov-color': ov.color }">
        <span class="ov-icon" v-html="ov.icon"></span>
        <div class="ov-info">
          <span class="ov-val">{{ ov.value }}</span>
          <span class="ov-label">{{ ov.label }}</span>
        </div>
      </div>
    </div>

    <!-- 组别切换 -->
    <div class="group-tabs">
      <button v-for="g in groupNames" :key="g" class="group-btn" :class="{ active: activeGroup === g }"
        @click="activeGroup = g">{{ g }}组</button>
    </div>

    <!-- 双栏：积分表 + 攻防散点图 -->
    <div class="dual-grid anim-fadeInUp delay-2">
      <!-- 左：积分表 -->
      <div class="card standings-table-wrap">
        <div class="panel-head">
          <span class="panel-title">{{ activeGroup }}组积分榜</span>
          <span class="panel-sub">前2名晋级</span>
        </div>
        <table class="standings-table">
          <thead>
            <tr>
              <th class="col-rank">#</th>
              <th class="col-team">球队</th>
              <th class="col-num">赛</th>
              <th class="col-num">胜</th>
              <th class="col-num">平</th>
              <th class="col-num">负</th>
              <th class="col-num">进</th>
              <th class="col-num">失</th>
              <th class="col-num">净</th>
              <th class="col-pts">积分</th>
              <th class="col-bar">走势</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, i) in currentGroupTeams" :key="team.code + team.name"
              :class="{ promote: i < 2 }">
              <td class="col-rank">
                <span class="rank-num" :class="{ top: i < 2, third: i === 2 }">{{ i + 1 }}</span>
              </td>
              <td class="col-team">
                <FlagTag :code="team.code" :name="team.name" />
              </td>
              <td class="col-num">{{ team.p }}</td>
              <td class="col-num">{{ team.w }}</td>
              <td class="col-num">{{ team.d }}</td>
              <td class="col-num">{{ team.l }}</td>
              <td class="col-num">{{ team.gf }}</td>
              <td class="col-num">{{ team.ga }}</td>
              <td class="col-num" :class="{ positive: team.gd > 0, negative: team.gd < 0 }">
                {{ team.gd > 0 ? '+' : '' }}{{ team.gd }}
              </td>
              <td class="col-pts"><span class="pts-value">{{ team.pts }}</span></td>
              <td class="col-bar">
                <div class="pts-bar-wrap">
                  <div class="pts-bar" :style="{ width: (team.pts / maxPts * 100) + '%' }"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 右：攻防散点图 -->
      <div class="card chart-panel">
        <div class="panel-head">
          <span class="panel-title">攻防对比</span>
          <span class="panel-sub">进球 × 失球</span>
        </div>
        <div class="chart-wrap">
          <v-chart :option="scatterOpt" autoresize />
        </div>
      </div>
    </div>

    <!-- 双栏：各组积分分布 + 积分趋势 -->
    <div class="dual-grid anim-fadeInUp delay-3">
      <!-- 左：各组积分分布堆叠柱状图 -->
      <div class="card chart-panel">
        <div class="panel-head">
          <span class="panel-title">各组积分分布</span>
          <span class="panel-sub">前2名 vs 后2名</span>
        </div>
        <div class="chart-wrap">
          <v-chart :option="stackBarOpt" autoresize />
        </div>
      </div>

      <!-- 右：积分趋势折线图 -->
      <div class="card chart-panel">
        <div class="panel-head">
          <span class="panel-title">积分趋势</span>
          <span class="panel-sub">{{ activeGroup }}组各轮积分变化</span>
        </div>
        <div class="chart-wrap">
          <v-chart :option="trendLineOpt" autoresize />
        </div>
      </div>
    </div>

    <!-- 各组场均进球对比 -->
    <ChartCard title="各组场均进球对比" subtitle="12个小组进攻火力一览" :height="300" :option="goalsByGroupOpt" :delay="5" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import FlagTag from '../components/FlagTag.vue'
import ChartCard from '../components/ChartCard.vue'

use([CanvasRenderer, BarChart, LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent])

// ——— 数据加载 ———
const standingsData = ref({ groups: [], rounds: [] })
const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
const activeGroup = ref('A')

onMounted(async () => {
  try {
    const res = await fetch('/data/standings.json')
    const json = await res.json()
    standingsData.value = json
  } catch (e) {
    console.warn('standings.json 加载失败，使用空数据', e)
  }
})

// ——— 当前组数据 ———
const currentGroupTeams = computed(() => {
  const g = standingsData.value.groups.find(g => g.group === activeGroup.value)
  return g ? g.teams : []
})

const maxPts = computed(() => {
  const teams = currentGroupTeams.value
  return teams.length ? Math.max(...teams.map(t => t.pts), 1) : 1
})

// ——— 概览卡 ———
const overviewCards = computed(() => {
  const allTeams = standingsData.value.groups.flatMap(g => g.teams)
  if (!allTeams.length) return []
  const totalGoals = allTeams.reduce((s, t) => s + t.gf, 0)
  const totalMatches = allTeams.reduce((s, t) => s + t.p, 0) / 2
  const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : '0'
  const topScorer = [...allTeams].sort((a, b) => b.gf - a.gf)[0]
  const topDefender = [...allTeams].sort((a, b) => a.ga - b.ga)[0]
  const fullWins = allTeams.filter(t => t.w === t.p && t.p > 0).length
  return [
    { label: '场均进球', value: avgGoals, color: '#22D3EE',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path d="M2 12h20"/></svg>' },
    { label: '最强火力', value: topScorer ? topScorer.name : '-', color: '#FBBF24',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
    { label: '最佳防线', value: topDefender ? topDefender.name : '-', color: '#34D399',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
    { label: '全胜球队', value: fullWins, color: '#F43F5E',
      icon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>' },
  ]
})

// ——— 攻防散点图 ———
const scatterOpt = computed(() => {
  const teams = currentGroupTeams.value
  return {
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.data[3]}<br/>进球: ${p.data[0]}  失球: ${p.data[1]}`
    },
    grid: { left: '8%', right: '8%', bottom: '12%', top: '8%', containLabel: true },
    xAxis: {
      name: '进球', type: 'value', min: 0,
      axisLabel: { color: '#6B7B92', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    yAxis: {
      name: '失球', type: 'value', min: 0,
      axisLabel: { color: '#6B7B92', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    series: [{
      type: 'scatter',
      symbolSize: (val) => Math.max(val[2] * 6, 16),
      data: teams.map(t => [t.gf, t.ga, t.pts, t.name]),
      itemStyle: {
        color: (p) => {
          const colors = ['#22D3EE', '#FBBF24', '#34D399', '#F43F5E']
          return colors[p.dataIndex] || '#6B7B92'
        },
        shadowBlur: 10,
        shadowColor: 'rgba(34,211,238,0.3)'
      },
      label: {
        show: true,
        formatter: (p) => p.data[3],
        position: 'top',
        color: '#8892A6',
        fontSize: 11,
        fontWeight: 600
      }
    }]
  }
})

// ——— 各组积分分布堆叠柱状图 ———
const stackBarOpt = computed(() => {
  const groups = standingsData.value.groups
  const labels = groups.map(g => g.group + '组')
  const top2Pts = groups.map(g => g.teams.slice(0, 2).reduce((s, t) => s + t.pts, 0))
  const bot2Pts = groups.map(g => g.teams.slice(2).reduce((s, t) => s + t.pts, 0))
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['前2名', '后2名'], textStyle: { color: '#8892A6', fontSize: 11 }, top: 4 },
    grid: { left: '4%', right: '4%', bottom: '10%', top: '40px', containLabel: true },
    xAxis: {
      type: 'category', data: labels,
      axisLabel: { color: '#6B7B92', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6B7B92', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    series: [
      {
        name: '前2名', type: 'bar', stack: 'total', data: top2Pts,
        itemStyle: { color: '#22D3EE', borderRadius: [0, 0, 0, 0] },
        barWidth: '50%'
      },
      {
        name: '后2名', type: 'bar', stack: 'total', data: bot2Pts,
        itemStyle: { color: '#3A4A6B', borderRadius: [4, 4, 0, 0] },
      }
    ]
  }
})

// ——— 积分趋势折线图 ———
const trendLineOpt = computed(() => {
  const rounds = standingsData.value.rounds
  if (!rounds.length) return {}

  // 计算当前组各队每轮累计积分
  const teams = currentGroupTeams.value
  const teamMap = {}
  teams.forEach(t => { teamMap[t.name] = [0] })

  rounds.forEach(r => {
    const roundPts = {}
    teams.forEach(t => { roundPts[t.name] = 0 })
    r.results.forEach(m => {
      if (m.group !== activeGroup.value) return
      const home = teams.find(t => t.code === m.home)
      const away = teams.find(t => t.code === m.away)
      if (home) roundPts[home.name] = (roundPts[home.name] || 0) + (m.hg > m.ag ? 3 : m.hg === m.ag ? 1 : 0)
      if (away) roundPts[away.name] = (roundPts[away.name] || 0) + (m.ag > m.hg ? 3 : m.hg === m.ag ? 1 : 0)
    })
    teams.forEach(t => {
      const prev = teamMap[t.name][teamMap[t.name].length - 1] || 0
      teamMap[t.name].push(prev + (roundPts[t.name] || 0))
    })
  })

  const colors = ['#22D3EE', '#FBBF24', '#34D399', '#F43F5E']
  const series = teams.map((t, i) => ({
    name: t.name, type: 'line', data: teamMap[t.name] || [],
    smooth: true, symbol: 'circle', symbolSize: 6,
    lineStyle: { width: 2.5, color: colors[i] },
    itemStyle: { color: colors[i] },
  }))

  return {
    tooltip: { trigger: 'axis' },
    legend: {
      data: teams.map(t => t.name),
      textStyle: { color: '#8892A6', fontSize: 11 },
      top: 4
    },
    grid: { left: '4%', right: '4%', bottom: '10%', top: '40px', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['赛前', ...rounds.map((_, i) => `第${i + 1}轮`)],
      axisLabel: { color: '#6B7B92', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: '#6B7B92', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    },
    series
  }
})

// ——— 各组场均进球对比 ———
const goalsByGroupOpt = computed(() => {
  const groups = standingsData.value.groups
  const labels = groups.map(g => g.group + '组')
  const avgGoals = groups.map(g => {
    const totalP = g.teams.reduce((s, t) => s + t.p, 0)
    const totalGf = g.teams.reduce((s, t) => s + t.gf, 0)
    return totalP > 0 ? +(totalGf / (totalP / 2)).toFixed(1) : 0
  })
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '30', containLabel: true },
    xAxis: {
      type: 'category', data: labels,
      axisLabel: { color: '#5A6478' },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#5A6478' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [{
      type: 'bar', data: avgGoals,
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
  }
})
</script>

<style scoped>
.tab-standings { padding-top: 8px; }

/* 标题 */
.standings-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.section-title { font-size: 20px; font-weight: 800; color: #E8ECF1; }
.badge {
  font-size: 11px; font-weight: 700;
  padding: 4px 12px; border-radius: 20px;
}
.badge-new {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A;
}

/* 概览卡 */
.overview-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.ov-card {
  display: flex; align-items: center; gap: 12px;
  background: linear-gradient(160deg, rgba(20,27,45,0.95), rgba(15,21,38,0.98));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 16px 18px;
  position: relative; overflow: hidden;
  transition: all 0.3s ease;
}
.ov-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--ov-color), transparent);
  opacity: 0.6;
}
.ov-card:hover {
  border-color: var(--ov-color);
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}
.ov-icon {
  color: var(--ov-color);
  display: flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(255,255,255,0.05);
  flex-shrink: 0;
}
.ov-info { display: flex; flex-direction: column; gap: 2px; }
.ov-val { font-size: 16px; font-weight: 800; color: #E8ECF1; }
.ov-label { font-size: 11px; color: #5A6B82; font-weight: 500; }

/* 组别切换 */
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

/* 双栏布局 */
.dual-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-bottom: 16px;
}

/* 通用 card */
.card {
  background: linear-gradient(160deg, rgba(20,27,45,0.95), rgba(15,21,38,0.98));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04);
  position: relative; overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
}

/* 面板头 */
.panel-head {
  display: flex; align-items: baseline; gap: 10px;
  padding: 18px 22px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.panel-title { font-size: 16px; font-weight: 700; color: #E8ECF1; }
.panel-sub { font-size: 12px; color: #5A6478; font-weight: 500; }

/* 图表区 */
.chart-panel { padding: 0; display: flex; flex-direction: column; }
.chart-wrap { padding: 0 10px 10px; line-height: 0; flex: 1; min-height: 240px; }
.chart-wrap > * { width: 100%; height: 100%; }

/* 积分表 */
.standings-table-wrap { padding: 0; }
.standings-table {
  width: 100%; border-collapse: collapse;
}
.standings-table th {
  padding: 10px 8px;
  font-size: 11px; font-weight: 600; color: #5A6478;
  text-align: center; background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
}
.standings-table td {
  padding: 10px 8px;
  font-size: 13px; text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: #8892A6;
  transition: background 0.15s ease;
}
.standings-table tr:hover td { background: rgba(255,255,255,0.03); }
.standings-table tr.promote td { background: linear-gradient(90deg, rgba(34,211,238,0.04), transparent); }
.col-rank { width: 40px; }
.col-team { text-align: left !important; min-width: 80px; }
.col-num { width: 36px; }
.col-pts { width: 50px; }
.col-bar { width: 80px; }
.rank-num {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 6px;
  font-size: 11px; font-weight: 700; color: #5A6478;
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

/* 积分进度条 */
.pts-bar-wrap {
  height: 6px; background: rgba(255,255,255,0.06);
  border-radius: 3px; overflow: hidden;
}
.pts-bar {
  height: 100%; border-radius: 3px;
  background: linear-gradient(90deg, #22D3EE, #06B6D4);
  transition: width 0.8s ease;
}

/* 响应式 */
@media (max-width: 1024px) {
  .overview-row { grid-template-columns: repeat(2, 1fr); }
  .dual-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .overview-row { grid-template-columns: 1fr; }
  .col-bar { display: none; }
}
</style>
