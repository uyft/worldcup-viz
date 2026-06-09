<template>
  <div class="tab-history">
    <ChartCard title="历届冠军归属流向" subtitle="国家 → 洲际 → 奖杯" :height="400" :option="sankeyOpt" :delay="1" />
    <ChartCard title="历届总进球趋势" subtitle="1930-2022 每届总进球数" :height="340" :option="goalsOpt" :delay="2" />

    <div class="history-grid">
      <ChartCard title="参赛国家气泡图" subtitle="夺冠次数 / 参赛次数 / 总进球" :height="400" :option="bubbleOpt" :delay="3" />
      <div class="champion-timeline card anim-fadeInUp delay-4">
        <h3 class="section-title">历届冠军时间轴</h3>
        <p class="section-subtitle">点击年份查看详情</p>
        <div class="timeline">
          <div v-for="(c, i) in timelineData" :key="c.year" class="timeline-item"
            :class="`anim-fadeInUp delay-${i+5}`">
            <div class="timeline-dot" :class="{ gold: i < 5 }"></div>
            <div class="timeline-content">
              <div class="timeline-year">{{ c.year }}</div>
              <div class="timeline-winner">
                <FlagTag :code="c.code" :name="c.name" small />
              </div>
              <div class="timeline-host">{{ c.host }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChartCard from '../components/ChartCard.vue'
import FlagTag from '../components/FlagTag.vue'

const sankeyOpt = ref({
  series: [{
    type: 'sankey',
    layout: 'none',
    emphasis: { focus: 'adjacency' },
    data: [
      { name: '巴西', itemStyle: { color: '#F43F5E' } }, { name: '德国', itemStyle: { color: '#6366F1' } },
      { name: '意大利', itemStyle: { color: '#10B981' } }, { name: '阿根廷', itemStyle: { color: '#22D3EE' } },
      { name: '法国', itemStyle: { color: '#3B82F6' } }, { name: '乌拉圭', itemStyle: { color: '#06B6D4' } },
      { name: '英格兰', itemStyle: { color: '#F59E0B' } }, { name: '西班牙', itemStyle: { color: '#EF4444' } },
      { name: '南美洲', itemStyle: { color: '#F43F5E' } }, { name: '欧洲', itemStyle: { color: '#6366F1' } },
      { name: '世界杯冠军', itemStyle: { color: '#FBBF24' } }
    ],
    links: [
      { source: '巴西', target: '南美洲', value: 5 },
      { source: '阿根廷', target: '南美洲', value: 3 },
      { source: '乌拉圭', target: '南美洲', value: 2 },
      { source: '德国', target: '欧洲', value: 4 },
      { source: '意大利', target: '欧洲', value: 4 },
      { source: '法国', target: '欧洲', value: 2 },
      { source: '英格兰', target: '欧洲', value: 1 },
      { source: '西班牙', target: '欧洲', value: 1 },
      { source: '南美洲', target: '世界杯冠军', value: 10 },
      { source: '欧洲', target: '世界杯冠军', value: 12 },
    ],
    lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.3 },
    itemStyle: { borderWidth: 0 },
    label: { color: '#E8ECF1', fontSize: 13, fontWeight: 600 }
  }]
})

const goalsOpt = ref({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['1930', '1934', '1938', '1950', '1954', '1958', '1962', '1966', '1970', '1974', '1978', '1982', '1986', '1990', '1994', '1998', '2002', '2006', '2010', '2014', '2018', '2022'],
    axisLabel: { color: '#5A6478', rotate: 45, fontSize: 10 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  series: [{
    type: 'line',
    data: [70, 70, 84, 88, 140, 126, 89, 89, 95, 97, 102, 146, 132, 115, 141, 171, 161, 147, 145, 171, 169, 172],
    smooth: true,
    symbol: 'circle', symbolSize: 6,
    lineStyle: { color: '#22D3EE', width: 3 },
    itemStyle: { color: '#22D3EE', borderColor: '#141B2D', borderWidth: 2 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: 'rgba(34,211,238,0.25)' }, { offset: 1, color: 'rgba(34,211,238,0)' }]
      }
    }
  }]
})

const bubbleOpt = ref({
  tooltip: {
    trigger: 'item',
    formatter: (p) => `${p.data[3]}<br/>夺冠: ${p.data[0]}次 | 参赛: ${p.data[1]}届 | 进球: ${p.data[2]}`
  },
  grid: { left: '3%', right: '8%', bottom: '3%', top: '8%', containLabel: true },
  xAxis: {
    name: '夺冠次数', nameTextStyle: { color: '#5A6478' },
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    name: '参赛次数', nameTextStyle: { color: '#5A6478' },
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  series: [{
    type: 'scatter',
    symbolSize: (d) => Math.sqrt(d[2]) * 3,
    data: [
      [5, 22, 237, '巴西', '#F43F5E'],
      [4, 20, 232, '德国', '#6366F1'],
      [4, 18, 128, '意大利', '#10B981'],
      [3, 18, 152, '阿根廷', '#22D3EE'],
      [2, 16, 136, '法国', '#3B82F6'],
      [2, 14, 89, '乌拉圭', '#06B6D4'],
      [1, 16, 104, '英格兰', '#F59E0B'],
      [1, 16, 110, '西班牙', '#EF4444'],
      [0, 11, 55, '荷兰', '#F97316'],
      [0, 8, 43, '葡萄牙', '#F43F5E'],
    ],
    itemStyle: {
      color: (p) => p.data[4],
      borderColor: '#141B2D', borderWidth: 2,
      shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.4)'
    }
  }]
})

const timelineData = [
  { year: '2022', code: 'ar', name: '阿根廷', host: '卡塔尔' },
  { year: '2018', code: 'fr', name: '法国', host: '俄罗斯' },
  { year: '2014', code: 'de', name: '德国', host: '巴西' },
  { year: '2010', code: 'es', name: '西班牙', host: '南非' },
  { year: '2006', code: 'it', name: '意大利', host: '德国' },
  { year: '2002', code: 'br', name: '巴西', host: '日韩' },
  { year: '1998', code: 'fr', name: '法国', host: '法国' },
  { year: '1994', code: 'br', name: '巴西', host: '美国' },
]
</script>

<style scoped>
.tab-history { padding-top: 8px; }
.history-grid {
  display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px;
  margin-top: 20px;
}
.champion-timeline { padding: 20px 24px; }
.timeline {
  display: flex; flex-direction: column; gap: 0;
  position: relative; padding-left: 20px;
}
.timeline::before {
  content: ''; position: absolute; left: 5px; top: 8px; bottom: 8px;
  width: 2px; background: linear-gradient(180deg, #FBBF24, rgba(255,255,255,0.06));
}
.timeline-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 10px 0; position: relative;
}
.timeline-dot {
  width: 12px; height: 12px; border-radius: 50%;
  background: #2A3350; border: 2px solid #141B2D;
  box-shadow: 0 0 0 2px #2A3350;
  position: absolute; left: -20px; top: 14px;
  flex-shrink: 0;
}
.timeline-dot.gold {
  background: #FBBF24;
  box-shadow: 0 0 0 2px #FBBF24, 0 0 12px rgba(251,191,36,0.3);
}
.timeline-content {
  display: flex; align-items: center; gap: 12px; flex: 1;
}
.timeline-year {
  font-size: 14px; font-weight: 800; color: #22D3EE;
  min-width: 40px;
}
.timeline-host {
  font-size: 12px; color: #5A6478; margin-left: auto;
}

@media (max-width: 768px) {
  .history-grid { grid-template-columns: 1fr; }
}
</style>
