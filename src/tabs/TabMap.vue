<template>
  <div class="tab-map">
    <div class="map-grid">
      <div class="map-section card anim-fadeInUp delay-1">
        <div class="section-header">
          <h3 class="section-title">2026 举办城市</h3>
          <div class="legend-row">
            <span class="legend-dot" style="background:#6366F1"></span>美国
            <span class="legend-dot" style="background:#F43F5E"></span>加拿大
            <span class="legend-dot" style="background:#10B981"></span>墨西哥
          </div>
        </div>
        <div class="na-map-placeholder">
          <div class="na-map-visual">
            <div class="country-block usa">
              <div class="country-label">美国</div>
              <div class="city-tags">
                <span v-for="c in usaCities" :key="c" class="city-tag">{{ c }}</span>
              </div>
            </div>
            <div class="country-block canada">
              <div class="country-label">加拿大</div>
              <div class="city-tags">
                <span v-for="c in canadaCities" :key="c" class="city-tag">{{ c }}</span>
              </div>
            </div>
            <div class="country-block mexico">
              <div class="country-label">墨西哥</div>
              <div class="city-tags">
                <span v-for="c in mexicoCities" :key="c" class="city-tag">{{ c }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="map-side card anim-fadeInUp delay-2">
        <h3 class="section-title">16 座场馆</h3>
        <div class="venue-list">
          <div v-for="(v, i) in venues" :key="v.name" class="venue-item"
            :class="`anim-fadeInUp delay-${i+3}`">
            <div class="venue-rank">{{ i + 1 }}</div>
            <div class="venue-info">
              <div class="venue-name">{{ v.name }}</div>
              <div class="venue-city">{{ v.city }} · {{ v.country }}</div>
            </div>
            <div class="venue-cap">{{ v.capacity }}</div>
          </div>
        </div>
      </div>
    </div>

    <ChartCard title="洲际实力雷达" subtitle="南美 vs 欧洲 vs 其他大洲" :height="380" :option="radarOpt" :delay="4" />

    <div class="matrix-section card anim-fadeInUp delay-5">
      <div class="section-header">
        <h3 class="section-title">48队分组矩阵</h3>
        <span class="section-subtitle">12组 × 4队 = 48强</span>
      </div>
      <div class="group-matrix">
        <div v-for="g in groupMatrix" :key="g.name" class="group-card">
          <div class="group-title">{{ g.name }}组</div>
          <div class="group-teams">
            <div v-for="t in g.teams" :key="t.code" class="group-team">
              <FlagTag :code="t.code" :name="t.name" small />
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

const usaCities = ['纽约', '洛杉矶', '达拉斯', '迈阿密', '亚特兰大', '西雅图', '旧金山', '波士顿', '费城', '华盛顿', '休斯顿']
const canadaCities = ['多伦多', '温哥华']
const mexicoCities = ['墨西哥城', '瓜达拉哈拉', '蒙特雷']

const venues = [
  { name: '大都会人寿体育场', city: '纽约', country: '美国', capacity: '82,500' },
  { name: 'SoFi体育场', city: '洛杉矶', country: '美国', capacity: '70,240' },
  { name: 'AT&T体育场', city: '达拉斯', country: '美国', capacity: '80,000' },
  { name: '硬石体育场', city: '迈阿密', country: '美国', capacity: '64,767' },
  { name: '梅赛德斯-奔驰体育场', city: '亚特兰大', country: '美国', capacity: '71,000' },
  { name: 'BC Place', city: '温哥华', country: '加拿大', capacity: '54,500' },
  { name: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', capacity: '87,523' },
]

const radarOpt = ref({
  tooltip: {},
  legend: { data: ['南美洲', '欧洲', '其他洲'], top: 0, textStyle: { color: '#8892A6' } },
  radar: {
    indicator: [
      { name: '冠军数', max: 15 },
      { name: '决赛次数', max: 20 },
      { name: '参赛届数', max: 22 },
      { name: '总进球', max: 250 },
      { name: '四强次数', max: 25 },
    ],
    axisName: { color: '#5A6478', fontSize: 12 },
    splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
  },
  series: [{
    type: 'radar',
    data: [
      { value: [10, 12, 90, 180, 20], name: '南美洲', areaStyle: { opacity: 0.12, color: '#F43F5E' }, lineStyle: { color: '#F43F5E' }, itemStyle: { color: '#F43F5E' } },
      { value: [12, 16, 110, 200, 28], name: '欧洲', areaStyle: { opacity: 0.12, color: '#6366F1' }, lineStyle: { color: '#6366F1' }, itemStyle: { color: '#6366F1' } },
      { value: [0, 2, 40, 60, 5], name: '其他洲', areaStyle: { opacity: 0.12, color: '#22D3EE' }, lineStyle: { color: '#22D3EE' }, itemStyle: { color: '#22D3EE' } },
    ]
  }]
})

const groupMatrix = [
  { name: 'A', teams: [{ code: 'us', name: '美国' }, { code: 'mx', name: '墨西哥' }, { code: 'ca', name: '加拿大' }, { code: 'jp', name: '日本' }] },
  { name: 'B', teams: [{ code: 'ar', name: '阿根廷' }, { code: 'fr', name: '法国' }, { code: 'de', name: '德国' }, { code: 'kr', name: '韩国' }] },
  { name: 'C', teams: [{ code: 'br', name: '巴西' }, { code: 'pt', name: '葡萄牙' }, { code: 'es', name: '西班牙' }, { code: 'nl', name: '荷兰' }] },
  { name: 'D', teams: [{ code: 'gb-eng', name: '英格兰' }, { code: 'it', name: '意大利' }, { code: 'uy', name: '乌拉圭' }, { code: 'co', name: '哥伦比亚' }] },
  { name: 'E', teams: [{ code: 'be', name: '比利时' }, { code: 'hr', name: '克罗地亚' }, { code: 'ma', name: '摩洛哥' }, { code: 'sn', name: '塞内加尔' }] },
  { name: 'F', teams: [{ code: 'ch', name: '瑞士' }, { code: 'pl', name: '波兰' }, { code: 'ir', name: '伊朗' }, { code: 'au', name: '澳大利亚' }] },
]
</script>

<style scoped>
.tab-map { padding-top: 8px; }
.map-grid {
  display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 16px;
  margin-bottom: 20px;
}
.map-section, .map-side { padding: 20px 24px; }
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
}
.legend-row { display: flex; align-items: center; gap: 12px; font-size: 12px; color: #8892A6; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 4px; }

.na-map-visual {
  display: flex; flex-direction: column; gap: 12px;
}
.country-block {
  padding: 16px 20px; border-radius: 12px;
  transition: all 0.25s ease;
}
.country-block:hover { transform: translateX(4px); }
.usa { background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.02)); border-left: 4px solid #6366F1; }
.canada { background: linear-gradient(135deg, rgba(244,63,94,0.1), rgba(244,63,94,0.02)); border-left: 4px solid #F43F5E; }
.mexico { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02)); border-left: 4px solid #10B981; }
.country-label { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
.usa .country-label { color: #818CF8; }
.canada .country-label { color: #FB7185; }
.mexico .country-label { color: #34D399; }
.city-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.city-tag {
  font-size: 12px; padding: 4px 10px; border-radius: 6px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: #8892A6;
}

.venue-list { display: flex; flex-direction: column; gap: 10px; }
.venue-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.03); transition: all 0.2s ease;
}
.venue-item:hover { background: rgba(255,255,255,0.06); transform: translateX(3px); }
.venue-rank {
  width: 24px; height: 24px; border-radius: 6px;
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.venue-name { font-size: 13px; font-weight: 600; color: #E8ECF1; }
.venue-city { font-size: 11px; color: #5A6478; }
.venue-cap { margin-left: auto; font-size: 12px; font-weight: 600; color: #FBBF24; }

.matrix-section { padding: 20px 24px; margin-bottom: 20px; }
.group-matrix {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.group-card {
  background: rgba(255,255,255,0.03); border-radius: 12px;
  padding: 14px 16px; border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.2s ease;
}
.group-card:hover {
  border-color: #22D3EE;
  box-shadow: 0 4px 16px rgba(34,211,238,0.1);
}
.group-title {
  font-size: 14px; font-weight: 700; color: #22D3EE;
  margin-bottom: 10px;
  display: inline-block;
  background: rgba(34,211,238,0.08);
  padding: 3px 10px; border-radius: 6px;
}
.group-teams { display: flex; flex-direction: column; gap: 6px; }
.group-team { display: flex; align-items: center; }

@media (max-width: 768px) {
  .map-grid { grid-template-columns: 1fr; }
  .group-matrix { grid-template-columns: repeat(2, 1fr); }
}
</style>
