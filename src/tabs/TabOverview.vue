<template>
  <div class="tab-overview">
    <Countdown />

    <QuickEntry @navigate="handleNav" />

    <!-- 核心数据 -->
    <div class="data-grid">
      <DataCard :value="48" label="参赛球队" desc="首次扩军至48队"
        iconPath="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
        gradient="linear-gradient(135deg,#06B6D4,#22D3EE)" :delay="1" />
      <DataCard :value="104" label="比赛场次" desc="历史最多"
        iconPath="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
        gradient="linear-gradient(135deg,#F59E0B,#FBBF24)" :delay="2" />
      <DataCard :value="16" label="举办城市" desc="跨越3个国家"
        iconPath="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        gradient="linear-gradient(135deg,#F43F5E,#FB7185)" :delay="3" />
    </div>

    <!-- 双栏布局 -->
    <div class="two-col">
      <!-- 最近冠军 -->
      <div class="champions-section card anim-fadeInUp delay-3">
        <div class="section-header">
          <h3 class="section-title">最近5届冠军</h3>
          <span class="badge badge-gold">荣耀殿堂</span>
        </div>
        <div class="champion-list">
          <div v-for="(c, i) in champions" :key="c.year" class="champion-item"
            :class="`anim-fadeInUp delay-${i+4}`">
            <div class="champion-year">{{ c.year }}</div>
            <FlagTag :code="c.code" :name="c.name" />
            <div class="champion-detail">
              <span class="champion-host">{{ c.host }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门比赛 -->
      <div class="hot-matches card anim-fadeInUp delay-4">
        <div class="section-header">
          <h3 class="section-title">焦点对决</h3>
          <span class="badge badge-new">即将开始</span>
        </div>
        <div class="match-list">
          <div v-for="(m, i) in hotMatches" :key="i" class="mini-match"
            :class="`anim-fadeInUp delay-${i+5}`">
            <div class="mini-date">{{ m.date }}</div>
            <div class="mini-teams">
              <FlagTag :code="m.home.code" :name="m.home.name" small />
              <span class="mini-vs">VS</span>
              <FlagTag :code="m.away.code" :name="m.away.name" small />
            </div>
            <div class="mini-group">{{ m.group }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 扩军对比 -->
    <ChartCard title="扩军影响对比" subtitle="32队时代 vs 48队时代" :height="340" :option="expansionOpt" :delay="6" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Countdown from '../components/Countdown.vue'
import QuickEntry from '../components/QuickEntry.vue'
import DataCard from '../components/DataCard.vue'
import ChartCard from '../components/ChartCard.vue'
import FlagTag from '../components/FlagTag.vue'

function handleNav(target) {
  console.log('navigate to', target)
}

const champions = [
  { year:'2022', code:'ar', name:'阿根廷', host:'卡塔尔' },
  { year:'2018', code:'fr', name:'法国', host:'俄罗斯' },
  { year:'2014', code:'de', name:'德国', host:'巴西' },
  { year:'2010', code:'es', name:'西班牙', host:'南非' },
  { year:'2006', code:'it', name:'意大利', host:'德国' },
]

const hotMatches = [
  { date:'6月12日', group:'揭幕战', home:{code:'us',name:'美国'}, away:{code:'mx',name:'墨西哥'} },
  { date:'6月15日', group:'A组', home:{code:'ar',name:'阿根廷'}, away:{code:'fr',name:'法国'} },
  { date:'6月18日', group:'B组', home:{code:'br',name:'巴西'}, away:{code:'de',name:'德国'} },
  { date:'6月22日', group:'C组', home:{code:'es',name:'西班牙'}, away:{code:'pt',name:'葡萄牙'} },
]

const expansionOpt = ref({
  tooltip: { trigger:'axis' },
  legend: { data:['32队时代','48队时代'], top: 0, textStyle: { color: '#8892A6' } },
  grid: { left:'3%',right:'4%',bottom:'3%',top: '40', containLabel:true },
  xAxis: {
    type:'category', data:['总场次','小组赛淘汰率%','平均进球','参赛大洲数'],
    axisLabel: { color: '#8892A6' },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    type:'value',
    axisLabel: { color: '#8892A6' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  series: [
    { name:'32队时代', type:'bar', data:[64,37,2.6,5], itemStyle:{borderRadius:[6,6,0,0], color:'#3A4A6B'} },
    { name:'48队时代', type:'bar', data:[104,25,2.8,6], itemStyle:{borderRadius:[6,6,0,0], color:'#22D3EE'} },
  ]
})
</script>

<style scoped>
.tab-overview { padding-top: 8px; }
.data-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  margin: 20px 0;
}
.two-col {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin: 20px 0;
}
.champions-section, .hot-matches { padding: 20px 24px; }
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.champion-list { display: flex; flex-direction: column; gap: 10px; }
.champion-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 10px;
  background: rgba(255,255,255,0.03);
  transition: all 0.2s ease;
}
.champion-item:hover {
  background: rgba(255,255,255,0.06);
  transform: translateX(4px);
}
.champion-year {
  font-size: 14px; font-weight: 800; color: #FBBF24;
  min-width: 44px;
}
.champion-host {
  font-size: 12px; color: #5A6478; margin-left: auto;
}
.match-list { display: flex; flex-direction: column; gap: 10px; }
.mini-match {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 10px;
  background: rgba(255,255,255,0.03);
  transition: all 0.2s ease;
}
.mini-match:hover { background: rgba(255,255,255,0.06); }
.mini-date { font-size: 12px; font-weight: 600; color: #22D3EE; min-width: 56px; }
.mini-teams { flex: 1; display: flex; align-items: center; gap: 8px; }
.mini-vs { font-size: 11px; font-weight: 700; color: #FBBF24; }
.mini-group { font-size: 11px; color: #5A6478; background: rgba(255,255,255,0.04); padding: 2px 8px; border-radius: 4px; }

@media (max-width: 768px) {
  .data-grid { grid-template-columns: 1fr; }
  .two-col { grid-template-columns: 1fr; }
}
</style>
