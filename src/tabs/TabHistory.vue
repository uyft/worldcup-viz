<template>
  <div class="tab-history">
    <!-- 世界杯起源 & 发展历程 科普板块 -->
    <div class="history-intro card anim-fadeInUp delay-1">
      <h3 class="section-title">世界杯 · 起源与发展</h3>
      <div class="intro-content">
        <div class="intro-text">
          <p>世界杯从1930年乌拉圭首届起步，经历几十年成长后，已成为全球最具热度与影响力的足球盛宴。赛事曾因战争两次停办（1942、1946）历史冠军多出自南美与欧洲，巴西5次夺冠最为耀眼，德国、意大利、阿根廷、法国也共同书写世界杯经典。参赛队伍不断扩容，<strong>2026年美加墨世界杯</strong>将首次迎来48支球队，进入全新时代。</p>
        </div>
        <div class="intro-tags">
          <span class="tag">创办：1930年</span>
          <span class="tag">首届举办：乌拉圭</span>
          <span class="tag">停办：二战期间</span>
          <span class="tag">2026扩军：48队</span>
        </div>
      </div>
    </div>

    <!-- 各国总进球排名（已修复国旗问题，纯文本兼容方案） -->
    <div class="bar-race-card card anim-fadeInUp delay-1.5">
      <div class="race-header">
        <h3 class="section-title">世界杯累计进球动态排名</h3>
        <p class="section-subtitle">1930-2022 各国累计进球数动态条形竞速</p>
      </div>
      <div class="race-top">
        <div class="year-display race-year-display">{{ currentYear }}</div>
        <div class="progress-bar race-progress-bar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>
      <div class="controls race-controls">
        <button class="btn btn-play" @click="togglePlay">{{ playLabel }}</button>
        <button class="btn btn-reset" @click="resetAnim">⟳ 重置</button>
        <label class="speed-label">
          速度：
          <select v-model.number="intervalMs" @change="changeSpeed">
            <option value="1800">慢速</option>
            <option value="1100">正常</option>
            <option value="650">快速</option>
            <option value="350">极速</option>
          </select>
        </label>
      </div>
      <div class="year-nav race-year-nav">
        <button
          v-for="y in YEARS"
          :key="y"
          class="year-btn"
          :class="{ active: y === currentYear }"
          @click="selectYear(y)"
        >{{ y }}</button>
      </div>
      <div class="chart-wrap race-chart-wrap">
        <div id="raceInner">
          <div
            v-for="(item, index) in topData"
            :key="item.name"
            class="bar-row"
            :style="{
              top: ROW_START + index * ROW_HEIGHT + 'px',
              opacity: 1
            }"
          >
            <span class="bar-rank">#{{ item.rank }}</span>
            <span class="bar-flag">
              <FlagTag v-if="countryCodes[item.name]" :code="countryCodes[item.name]" small />
              <span v-else>{{ countryFlags[item.name] || '🏳️' }}</span>
            </span>
            <span class="bar-name">{{ item.name }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{
                  width: ((item.val / (topData[0]?.val || 1)) * 100) + '%',
                  background: `linear-gradient(90deg, ${getColor(item.name)}bb, ${getColor(item.name)})`
                }"
              ></div>
            </div>
            <span class="bar-value">{{ item.val }}</span>
          </div>
        </div>
      </div>
      <div class="legend">数据来源：FIFA 官方统计 · 累计历届所有进球数</div>
    </div>

    <!-- 旭日图卡片 - 棱角分明科技感 -->
    <div class="sunburst-wrapper">
      <ChartCard
        title="世界杯冠军归属流向"
        subtitle="洲际冠军分布 + 夺冠年份（点击国家查看详情）"
        :height="480"
        :option="sunburstOpt"
        :events="{ click: onNodeClick }"
        :delay="2"
      />
      <!-- 图例说明 - 硬朗风 -->
      <div class="sunburst-legend">
        <div class="legend-item">
          <span class="legend-color" style="background: #0EA5E9; box-shadow: 0 0 8px #0EA5E9;"></span>
          南美洲 (10冠)
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #8B5CF6; box-shadow: 0 0 8px #8B5CF6;"></span>
          欧洲 (12冠)
        </div>
        <div class="legend-tip">◆ 点击高亮球队查看世界杯冠军详情</div>
      </div>
    </div>

    <!-- 冠军详情卡片 -->
    <ChampionDetailCard
      :country="selectedCountry"
      :visible="showDetail"
      @close="showDetail = false"
    />

    <!-- 历届总进球趋势 -->
    <ChartCard
      title="历届总进球趋势"
      subtitle="1930-2022 每届总进球数"
      :height="340"
      :option="goalsOpt"
      :delay="3"
    />

    <div class="history-grid">
      <ChartCard
        title="参赛国家气泡图"
        subtitle="夺冠次数 / 参赛次数 / 总进球"
        :height="400"
        :option="bubbleOpt"
        :delay="4"
      />
      <div class="champion-timeline card anim-fadeInUp delay-5">
        <h3 class="section-title">历届冠军时间轴</h3>
        <p class="section-subtitle">点击年份查看详情</p>
        <div class="timeline">
          <div
            v-for="(c, i) in timelineData"
            :key="c.year"
            class="timeline-item"
            :class="`anim-fadeInUp delay-${i+6}`"
          >
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
import { ref, computed, onBeforeUnmount } from 'vue'
import ChartCard from '../components/ChartCard.vue'
import FlagTag from '../components/FlagTag.vue'
import ChampionDetailCard from '../components/ChampionDetailCard.vue'

// 详情控制
const selectedCountry = ref('')
const showDetail = ref(false)

// 可点击国家白名单
const clickableCountryList = [
  '巴西', '德国', '意大利', '阿根廷',
  '法国', '乌拉圭', '英格兰', '西班牙'
]

// 点击回调
const onNodeClick = (params) => {
  const nodeName = params.name
  if (clickableCountryList.includes(nodeName)) {
    selectedCountry.value = nodeName
    showDetail.value = true
    setTimeout(() => {
      const el = document.querySelector('.champion-detail')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }
}

// ========== 棱角分明 · 硬核科技感旭日图 ==========
const sunburstOpt = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(2, 6, 23, 0.92)',
    borderColor: '#0EA5E9',
    borderWidth: 1,
    textStyle: { color: '#F0F4FA', fontSize: 12, fontFamily: 'monospace' },
    formatter: (params) => {
      const cupIcon = '◆'
      if (params.treePathInfo && params.treePathInfo.length > 1) {
        const path = params.treePathInfo.map(p => p.name).join(' → ')
        return `<div style="font-size:13px; line-height:1.6">
          <strong style="color:#38BDF8">${cupIcon} ${params.name}</strong><br/>
          ▸ 冠军次数：${params.value}<br/>
          <span style="color:#5A6E8A; font-size:11px">▸ ${path}</span>
        </div>`
      }
      return `${cupIcon} ${params.name}<br/>▸ 冠军：${params.value}次`
    }
  },
  series: [{
    type: 'sunburst',
    center: ['50%', '52%'],
    radius: [0, '92%'],
    
    data: [
      {
        name: '◆ 冠军之冕',
        value: 22,
        itemStyle: { 
          color: 'transparent',
          borderWidth: 0
        },
        children: [
          {
            name: '南美洲',
            value: 10,
            itemStyle: { 
              color: 'rgba(14, 165, 233, 0.12)',
              borderColor: '#0EA5E9',
              borderWidth: 1,
              borderType: 'solid',
              shadowBlur: 12,
              shadowColor: '#0EA5E9'
            },
            children: [
              { 
                name: '巴西', 
                value: 5,
                itemStyle: { 
                  color: 'rgba(56, 189, 248, 0.7)',
                  borderColor: '#7DD3FC',
                  borderWidth: 1.2,
                  borderRadius: 0,
                  shadowBlur: 10,
                  shadowColor: '#38BDF8'
                },
                children: [
                  { name: '1958', value: 1, itemStyle: { color: 'rgba(56, 189, 248, 0.45)', borderWidth: 0.5, borderRadius: 0 } },
                  { name: '1962', value: 1, itemStyle: { color: 'rgba(56, 189, 248, 0.45)', borderWidth: 0.5, borderRadius: 0 } },
                  { name: '1970', value: 1, itemStyle: { color: 'rgba(56, 189, 248, 0.45)', borderWidth: 0.5, borderRadius: 0 } },
                  { name: '1994', value: 1, itemStyle: { color: 'rgba(56, 189, 248, 0.45)', borderWidth: 0.5, borderRadius: 0 } },
                  { name: '2002', value: 1, itemStyle: { color: 'rgba(56, 189, 248, 0.45)', borderWidth: 0.5, borderRadius: 0 } }
                ]
              },
              { 
                name: '阿根廷', 
                value: 3, 
                itemStyle: { 
                  color: 'rgba(96, 165, 250, 0.7)',
                  borderColor: '#93C5FD',
                  borderWidth: 1.2,
                  borderRadius: 0,
                  shadowBlur: 8,
                  shadowColor: '#60A5FA'
                },
                children: [
                  { name: '1978', value: 1, itemStyle: { color: 'rgba(96, 165, 250, 0.45)', borderRadius: 0 } },
                  { name: '1986', value: 1, itemStyle: { color: 'rgba(96, 165, 250, 0.45)', borderRadius: 0 } },
                  { name: '2022', value: 1, itemStyle: { color: 'rgba(96, 165, 250, 0.45)', borderRadius: 0 } }
                ]
              },
              { 
                name: '乌拉圭', 
                value: 2, 
                itemStyle: { 
                  color: 'rgba(34, 211, 238, 0.7)',
                  borderColor: '#67E8F9',
                  borderWidth: 1.2,
                  borderRadius: 0,
                  shadowBlur: 8,
                  shadowColor: '#22D3EE'
                },
                children: [
                  { name: '1930', value: 1, itemStyle: { color: 'rgba(34, 211, 238, 0.45)', borderRadius: 0 } },
                  { name: '1950', value: 1, itemStyle: { color: 'rgba(34, 211, 238, 0.45)', borderRadius: 0 } }
                ]
              }
            ]
          },
          {
            name: '欧洲',
            value: 12,
            itemStyle: { 
              color: 'rgba(139, 92, 246, 0.12)',
              borderColor: '#8B5CF6',
              borderWidth: 1,
              borderType: 'solid',
              shadowBlur: 12,
              shadowColor: '#8B5CF6'
            },
            children: [
              { 
                name: '德国', 
                value: 4, 
                itemStyle: { 
                  color: 'rgba(139, 92, 246, 0.7)',
                  borderColor: '#A78BFA',
                  borderWidth: 1.2,
                  borderRadius: 0,
                  shadowBlur: 8,
                  shadowColor: '#A78BFA'
                },
                children: [
                  { name: '1954', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '1974', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '1990', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '2014', value: 1, itemStyle: { borderRadius: 0 } }
                ]
              },
              { 
                name: '意大利', 
                value: 4, 
                itemStyle: { 
                  color: 'rgba(139, 92, 246, 0.65)',
                  borderColor: '#C084FC',
                  borderWidth: 1.2,
                  borderRadius: 0,
                  shadowBlur: 8
                },
                children: [
                  { name: '1934', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '1938', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '1982', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '2006', value: 1, itemStyle: { borderRadius: 0 } }
                ]
              },
              { 
                name: '法国', 
                value: 2, 
                itemStyle: { 
                  color: 'rgba(167, 139, 250, 0.65)',
                  borderColor: '#C4B5FD',
                  borderWidth: 1.2,
                  borderRadius: 0
                },
                children: [
                  { name: '1998', value: 1, itemStyle: { borderRadius: 0 } },
                  { name: '2018', value: 1, itemStyle: { borderRadius: 0 } }
                ]
              },
              { 
                name: '英格兰', 
                value: 1, 
                itemStyle: { 
                  color: 'rgba(148, 163, 184, 0.6)',
                  borderColor: '#94A3B8',
                  borderWidth: 1,
                  borderRadius: 0
                },
                children: [ { name: '1966', value: 1, itemStyle: { borderRadius: 0 } } ]
              },
              { 
                name: '西班牙', 
                value: 1, 
                itemStyle: { 
                  color: 'rgba(168, 85, 247, 0.72)',
                  borderColor: '#C084FC',
                  borderWidth: 1.2,
                  borderRadius: 0,
                  shadowBlur: 10,
                  shadowColor: 'rgba(168, 85, 247, 0.8)'
                },
                children: [ { name: '2010', value: 1, itemStyle: { borderRadius: 0 } } ]
              }
            ]
          }
        ]
      }
    ],
    
    itemStyle: {
      borderWidth: 0.8,
      borderColor: 'rgba(255, 255, 255, 0.25)',
      borderRadius: 0,
      shadowBlur: 6,
      shadowColor: 'rgba(0, 255, 255, 0.2)',
      cursor: 'pointer'
    },
    
    label: {
      color: '#EBF8FF',
      fontSize: 13,
      fontWeight: 600,
      rotate: 'radial',
      position: 'inside',
      align: 'center',
      textBorderColor: 'rgba(0, 10, 30, 0.75)',
      textBorderWidth: 2,
      textShadowBlur: 6,
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      fontFamily: 'monospace'
    },
    
    emphasis: {
      focus: 'descendant',
      label: {
        show: true,
        fontWeight: 'bold',
        fontSize: 13,
        color: '#FBBF24',
        textShadowBlur: 6,
        textShadowColor: '#FBBF24'
      },
      itemStyle: {
        borderColor: '#22D3EE',
        borderWidth: 2,
        shadowBlur: 24,
        shadowColor: '#0EA5E9',
        brightness: 1.25
      }
    },
    
    levels: [
      {
        r0: '0%',
        r: '10%',
        label: { show: false },
        itemStyle: { color: 'transparent', borderWidth: 0 }
      },
      {
        r0: '10%',
        r: '34%',
        label: { 
          rotate: 'tangential', 
          fontSize: 16,
          fontWeight: '700',
          color: '#D9F0FF',
          textBorderColor: 'rgba(0, 13, 28, 0.8)',
          textBorderWidth: 2,
          textShadowBlur: 6,
          textShadowColor: '#0EA5E9'
        },
        itemStyle: {
          borderWidth: 1.5,
          borderRadius: 0,
          borderColor: 'rgba(14, 165, 233, 0.7)'
        }
      },
      {
        r0: '34%',
        r: '60%',
        label: { 
          rotate: 'radial', 
          fontSize: 13,
          color: '#E2E8F0',
          fontWeight: 600,
          position: 'inside',
          textBorderColor: 'rgba(0, 12, 28, 0.75)',
          textBorderWidth: 1.5
        },
        itemStyle: {
          borderWidth: 1,
          borderRadius: 0,
          borderColor: 'rgba(255, 255, 255, 0.12)'
        }
      },
      {
        r0: '60%',
        r: '78%',
        label: {
          position: 'outside',
          fontSize: 12,
          color: '#D9F0FF',
          rotate: 0,
          offset: [0, 6],
          textBorderColor: 'rgba(0, 13, 28, 0.7)',
          textBorderWidth: 1.5,
          formatter: (params) => `${params.name} [${params.value}]`
        },
        itemStyle: {
          borderWidth: 0.6,
          borderRadius: 0,
          borderColor: 'rgba(100, 116, 139, 0.4)'
        }
      },
      {
        r0: '78%',
        r: '92%',
        label: {
          position: 'outside',
          fontSize: 11,
          color: '#E2E8F0',
          rotate: 0,
          offset: [0, 2],
          textBorderColor: 'rgba(0, 13, 28, 0.7)',
          textBorderWidth: 1.2,
          formatter: (params) => params.name
        },
        itemStyle: {
          borderWidth: 0.3,
          borderRadius: 0,
          borderColor: 'rgba(100, 116, 139, 0.2)'
        }
      }
    ],
    
    breadcrumb: {
      show: true,
      top: 12,
      left: 'center',
      emptyItemWidth: 26,
      itemStyle: {
        color: 'rgba(2, 6, 23, 0.85)',
        borderColor: '#0EA5E9',
        borderWidth: 0.8,
        borderRadius: 0,
        shadowBlur: 4,
        shadowColor: '#0EA5E9'
      },
      textStyle: { 
        color: '#7DD3FC',
        fontSize: 10,
        fontWeight: 500,
        fontFamily: 'monospace'
      },
      emphasis: { 
        textStyle: { color: '#FBBF24' },
        itemStyle: { color: 'rgba(30, 41, 59, 0.95)', borderColor: '#FBBF24' }
      }
    },
    
    nodeClick: 'rootToNode',
    sort: null,
    highlightPolicy: 'ancestor',
    startAngle: 90,
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    animationThreshold: 2000,
    progressive: 200
  }]
})

// ========== 历届总进球趋势 ==========
const goalsOpt = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line', lineStyle: { color: 'rgba(14,165,233,0.45)' } },
    backgroundColor: 'rgba(15,23,42,0.94)',
    borderColor: 'rgba(56,189,248,0.3)',
    borderWidth: 1,
    textStyle: { color: '#E8ECF1' },
    padding: [10, 14],
  },
  grid: { left: '4%', right: '4%', bottom: '8%', top: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['1930', '1934', '1938', '1950', '1954', '1958', '1962', '1966', '1970', '1974', '1978', '1982', '1986', '1990', '1994', '1998', '2002', '2006', '2010', '2014', '2018', '2022'],
    axisLabel: { color: '#94A3B8', rotate: 45, fontSize: 11, fontFamily: 'monospace' },
    axisLine: { lineStyle: { color: 'rgba(14,165,233,0.35)' } },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    name: '总进球',
    nameTextStyle: { color: '#94A3B8', fontFamily: 'monospace', padding: [0, 0, 10, 0] },
    axisLabel: { color: '#94A3B8' },
    splitLine: { lineStyle: { color: 'rgba(14,165,233,0.12)' } },
    axisLine: { lineStyle: { color: 'rgba(14,165,233,0.2)' } },
    axisTick: { show: false },
  },
  series: [{
    type: 'line',
    data: [70, 70, 84, 88, 140, 126, 89, 89, 95, 97, 102, 146, 132, 115, 141, 171, 161, 147, 145, 171, 169, 172],
    smooth: true,
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: { color: '#38BDF8', width: 3, shadowBlur: 12, shadowColor: 'rgba(56,189,248,0.35)' },
    itemStyle: { color: '#38BDF8', borderColor: '#0F172A', borderWidth: 1.5 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: 'rgba(56,189,248,0.25)' }, { offset: 1, color: 'rgba(56,189,248,0)' }]
      }
    },
    emphasis: {
      scale: true,
      label: { show: true, formatter: '{c}', color: '#E8ECF1', fontSize: 12, fontWeight: 700, backgroundColor: 'rgba(15,23,42,0.85)', padding: [4, 8], borderRadius: 6 }
    },
    markLine: {
      data: [{ type: 'average', name: '平均值' }],
      symbol: ['none', 'none'],
      lineStyle: { color: '#FBBF24', type: 'dashed', width: 1.5 },
      label: { position: 'end', color: '#FBBF24', fontSize: 11, formatter: '平均 {c}' }
    },
    markPoint: {
      data: [
        { type: 'max', name: '最高' },
        { type: 'min', name: '最低' }
      ],
      label: { show: true, color: '#E8ECF1', formatter: '{b}: {c}', fontSize: 10 },
      itemStyle: { color: '#FBBF24' }
    }
  }]
})

const countryColors = {
  '巴西': '#009C3B', '德国': '#DD0000', '阿根廷': '#74ACDF', '法国': '#003189',
  '意大利': '#0066CC', '西班牙': '#C60B1E', '匈牙利': '#CE2939', '乌拉圭': '#5DADE2',
  '英格兰': '#FFFFFF', '荷兰': '#FF6600', '克罗地亚': '#FF0000', '葡萄牙': '#006600',
  '俄罗斯': '#D52B1E', '瑞典': '#006AA7', '墨西哥': '#006847', '波兰': '#DC143C',
  '美国': '#3C3B6E', '南斯拉夫': '#CC0000', '捷克斯洛伐克': '#CC0000', '奥地利': '#ED2939',
  '罗马尼亚': '#002B7F', '比利时': '#FAE042', '瑞士': '#FF0000', '智利': '#D52B1E',
  '南非': '#007A4D', '韩国': '#003478', '摩洛哥': '#C1272D'
}

const countryCodes = {
  '巴西': 'br', '德国': 'de', '阿根廷': 'ar', '法国': 'fr', '意大利': 'it',
  '西班牙': 'es', '匈牙利': 'hu', '乌拉圭': 'uy', '英格兰': 'gb-eng', '荷兰': 'nl',
  '克罗地亚': 'hr', '葡萄牙': 'pt', '俄罗斯': 'ru', '瑞典': 'se', '墨西哥': 'mx',
  '波兰': 'pl', '美国': 'us', '南斯拉夫': 'rs', '捷克斯洛伐克': 'cz', '奥地利': 'at',
  '罗马尼亚': 'ro', '比利时': 'be', '瑞士': 'ch', '智利': 'cl', '南非': 'za',
  '韩国': 'kr', '摩洛哥': 'ma', '北爱尔兰': 'gb-nir', '苏格兰': 'gb-sct', '威尔士': 'gb-wls',
  '苏联': 'ru', '东德': 'de', '爱尔兰': 'ie', '哥伦比亚': 'co', '丹麦': 'dk',
  '保加利亚': 'bg', '喀麦隆': 'cm', '尼日利亚': 'ng', '沙特阿拉伯': 'sa', '日本': 'jp',
  '塞内加尔': 'sn', '加纳': 'gh', '科特迪瓦': 'ci', '厄瓜多尔': 'ec', '澳大利亚': 'au',
  '伊朗': 'ir', '突尼斯': 'tn', '阿尔及利亚': 'dz', '哥斯达黎加': 'cr', '洪都拉斯': 'hn',
  '巴拉圭': 'py', '秘鲁': 'pe', '玻利维亚': 'bo', '加拿大': 'ca', '卡塔尔': 'qa'
}

const countryFlags = {
  '巴西':'🇧🇷','德国':'🇩🇪','阿根廷':'🇦🇷','法国':'🇫🇷','意大利':'🇮🇹',
  '西班牙':'🇪🇸','匈牙利':'🇭🇺','乌拉圭':'🇺🇾','英格兰':'🏴','荷兰':'🇳🇱',
  '克罗地亚':'🇭🇷','葡萄牙':'🇵🇹','俄罗斯':'🇷🇺','瑞典':'🇸🇪','墨西哥':'🇲🇽',
  '波兰':'🇵🇱','美国':'🇺🇸','南斯拉夫':'🏳️','捷克斯洛伐克':'🏳️','奥地利':'🇦🇹',
  '罗马尼亚':'🇷🇴','比利时':'🇧🇪','瑞士':'🇨🇭','智利':'🇨🇱','南非':'🇿🇦',
  '韩国':'🇰🇷','摩洛哥':'🇲🇦'
}

const YEARS = [1930,1934,1938,1950,1954,1958,1962,1966,1970,1974,1978,1982,1986,1990,1994,1998,2002,2006,2010,2014,2018,2022]
const TOP_N = 12

const rawData = {
  1930: {'乌拉圭':15,'阿根廷':18,'美国':6,'南斯拉夫':7,'智利':4,'法国':4,'巴西':5,'罗马尼亚':3,'比利时':0,'玻利维亚':0,'秘鲁':1,'墨西哥':4,'巴拉圭':1},
  1934: {'德国':11,'意大利':12,'奥地利':10,'捷克斯洛伐克':9,'西班牙':5,'匈牙利':7,'瑞典':4,'瑞士':5,'阿根廷':2,'法国':3,'荷兰':2,'罗马尼亚':1,'巴西':4,'美国':1},
  1938: {'意大利':11,'匈牙利':15,'巴西':14,'法国':5,'捷克斯洛伐克':6,'瑞典':8,'古巴':5,'荷兰':6,'德国':2,'罗马尼亚':2,'波兰':6,'挪威':3,'比利时':1,'瑞士':4},
  1950: {'乌拉圭':15,'巴西':22,'瑞典':11,'西班牙':10,'美国':4,'英格兰':5,'智利':5,'意大利':4,'玻利维亚':0,'墨西哥':2,'巴拉圭':4,'南斯拉夫':7},
  1954: {'德国':25,'匈牙利':27,'奥地利':17,'乌拉圭':11,'瑞士':15,'巴西':17,'英格兰':9,'法国':11,'南斯拉夫':8,'意大利':5,'比利时':5,'土耳其':10,'韩国':0,'苏格兰':0,'墨西哥':2,'捷克斯洛伐克':5},
  1958: {'法国':23,'德国':12,'巴西':16,'瑞典':16,'苏联':9,'北爱尔兰':6,'威尔士':4,'英格兰':8,'奥地利':1,'阿根廷':5,'捷克斯洛伐克':8,'匈牙利':4,'南斯拉夫':7,'巴拉圭':3,'苏格兰':2,'墨西哥':2},
  1962: {'智利':11,'巴西':14,'南斯拉夫':9,'捷克斯洛伐克':9,'苏联':7,'德国':5,'英格兰':9,'意大利':3,'匈牙利':8,'墨西哥':3,'阿根廷':6,'西班牙':5,'乌拉圭':4,'哥伦比亚':5,'保加利亚':1,'瑞士':2},
  1966: {'德国':13,'英格兰':11,'苏联':7,'葡萄牙':15,'匈牙利':7,'阿根廷':4,'西班牙':4,'墨西哥':1,'巴西':4,'意大利':1,'乌拉圭':1,'法国':2,'北朝鲜':5,'智利':2,'保加利亚':1,'瑞士':1},
  1970: {'巴西':19,'德国':10,'意大利':10,'乌拉圭':4,'苏联':4,'英格兰':8,'秘鲁':9,'墨西哥':5,'比利时':2,'罗马尼亚':4,'捷克斯洛伐克':2,'以色列':1,'瑞典':2,'保加利亚':5,'摩洛哥':0,'萨尔瓦多':0},
  1974: {'德国':13,'荷兰':15,'波兰':16,'巴西':6,'阿根廷':7,'东德':4,'南斯拉夫':10,'瑞典':8,'苏联':3,'乌拉圭':1,'意大利':5,'智利':3,'苏格兰':3,'奥地利':4,'澳大利亚':0,'海地':2,'扎伊尔':0,'保加利亚':2},
  1978: {'阿根廷':15,'荷兰':15,'巴西':14,'意大利':9,'德国':8,'奥地利':8,'秘鲁':7,'波兰':8,'法国':5,'突尼斯':3,'瑞典':3,'匈牙利':3,'西班牙':2,'苏格兰':5,'伊朗':2,'墨西哥':2},
  1982: {'德国':12,'法国':14,'意大利':12,'波兰':13,'英格兰':6,'奥地利':3,'比利时':3,'苏联':4,'西班牙':4,'巴西':15,'阿根廷':6,'北爱尔兰':2,'匈牙利':12,'苏格兰':8,'捷克斯洛伐克':4,'洪都拉斯':2,'喀麦隆':1,'萨尔瓦多':1,'科威特':2,'新西兰':2,'秘鲁':4},
  1986: {'德国':8,'阿根廷':14,'法国':9,'比利时':5,'墨西哥':6,'英格兰':7,'苏联':4,'西班牙':5,'巴西':10,'丹麦':10,'摩洛哥':3,'葡萄牙':2,'意大利':5,'保加利亚':2,'波兰':1,'南斯拉夫':4,'伊拉克':1,'加拿大':0,'韩国':4,'阿尔及利亚':2,'乌拉圭':4,'匈牙利':2,'苏格兰':1,'北爱尔兰':2,'美国':0},
  1990: {'德国':15,'意大利':10,'英格兰':8,'阿根廷':5,'南斯拉夫':6,'爱尔兰':2,'巴西':4,'西班牙':6,'哥伦比亚':4,'荷兰':4,'比利时':6,'罗马尼亚':4,'喀麦隆':6,'苏联':4,'韩国':1,'哥斯达黎加':4,'苏格兰':2,'美国':2,'埃及':0},
  1994: {'巴西':11,'意大利':8,'瑞典':15,'保加利亚':6,'德国':9,'荷兰':8,'罗马尼亚':5,'西班牙':8,'阿根廷':6,'比利时':2,'沙特阿拉伯':4,'墨西哥':5,'爱尔兰':2,'美国':5,'俄罗斯':4,'尼日利亚':6,'韩国':3,'摩洛哥':2,'挪威':1,'玻利维亚':0,'喀麦隆':3,'希腊':0},
  1998: {'法国':15,'巴西':14,'克罗地亚':11,'荷兰':13,'德国':8,'阿根廷':10,'意大利':9,'英格兰':5,'丹麦':8,'罗马尼亚':4,'西班牙':8,'尼日利亚':5,'南非':3,'巴拉圭':3,'墨西哥':7,'美国':1,'伊朗':2,'苏格兰':2,'摩洛哥':2,'挪威':3,'韩国':2,'牙买加':3,'突尼斯':1,'日本':1,'喀麦隆':2,'智利':4,'沙特阿拉伯':4,'奥地利':2,'比利时':3},
  2002: {'巴西':18,'德国':14,'土耳其':9,'韩国':8,'英格兰':6,'西班牙':9,'塞内加尔':7,'美国':5,'日本':7,'瑞典':7,'墨西哥':9,'意大利':6,'葡萄牙':6,'丹麦':4,'比利时':6,'俄罗斯':4,'阿根廷':2,'哥斯达黎加':5,'爱尔兰':5,'厄瓜多尔':2,'尼日利亚':1,'波兰':3,'乌拉圭':4,'中国':0,'洪都拉斯':2,'突尼斯':3,'克罗地亚':1,'沙特阿拉伯':0,'喀麦隆':2,'斯洛文尼亚':2},
  2006: {'德国':14,'意大利':12,'法国':9,'葡萄牙':7,'英格兰':6,'阿根廷':11,'西班牙':9,'乌克兰':5,'巴西':10,'加纳':4,'厄瓜多尔':5,'瑞士':4,'美国':4,'墨西哥':5,'荷兰':8,'澳大利亚':5,'克罗地亚':2,'捷克':3,'波兰':2,'韩国':3,'塞尔维亚':2,'日本':2,'伊朗':2,'科特迪瓦':5,'沙特阿拉伯':2,'安哥拉':1,'多哥':1,'突尼斯':3,'哥斯达黎加':3},
  2010: {'德国':16,'乌拉圭':11,'阿根廷':10,'荷兰':12,'西班牙':8,'巴西':8,'英格兰':4,'加纳':5,'美国':5,'巴拉圭':7,'日本':4,'墨西哥':4,'斯洛伐克':4,'葡萄牙':7,'智利':3,'韩国':5,'法国':1,'意大利':5,'科特迪瓦':4,'塞尔维亚':2,'澳大利亚':3,'新西兰':2,'丹麦':3,'尼日利亚':5,'希腊':2,'南非':3,'斯洛文尼亚':3,'阿尔及利亚':0,'喀麦隆':3},
  2014: {'德国':18,'巴西':11,'阿根廷':8,'荷兰':15,'法国':10,'哥伦比亚':12,'比利时':6,'美国':5,'阿尔及利亚':6,'墨西哥':4,'瑞士':7,'希腊':2,'波黑':4,'哥斯达黎加':4,'智利':5,'克罗地亚':6,'厄瓜多尔':3,'伊朗':0,'意大利':2,'日本':2,'英格兰':4,'葡萄牙':4,'尼日利亚':3,'俄罗斯':2,'乌拉圭':4,'洪都拉斯':1,'喀麦隆':1,'韩国':3,'西班牙':4},
  2018: {'法国':12,'克罗地亚':14,'比利时':16,'英格兰':12,'俄罗斯':11,'乌拉圭':7,'巴西':8,'阿根廷':6,'德国':5,'西班牙':8,'葡萄牙':7,'墨西哥':3,'丹麦':3,'哥伦比亚':6,'瑞典':6,'瑞士':5,'日本':6,'韩国':3,'塞内加尔':2,'伊朗':2,'波兰':2,'突尼斯':5,'澳大利亚':2,'冰岛':2,'摩洛哥':2,'尼日利亚':3,'沙特阿拉伯':2,'埃及':2,'巴拿马':2,'秘鲁':2},
  2022: {'法国':16,'阿根廷':15,'摩洛哥':6,'克罗地亚':8,'葡萄牙':12,'英格兰':13,'荷兰':8,'巴西':8,'德国':6,'西班牙':9,'美国':3,'日本':4,'韩国':4,'塞内加尔':5,'波兰':3,'澳大利亚':4,'瑞士':7,'墨西哥':1,'厄瓜多尔':4,'卡塔尔':1,'加拿大':2,'喀麦隆':4,'加纳':5,'塞尔维亚':8,'丹麦':1,'突尼斯':1,'沙特阿拉伯':4,'伊朗':4,'比利时':1,'哥斯达黎加':1}
}

function buildCumulative() {
  const cum = {}
  const running = {}
  YEARS.forEach((y) => {
    const d = rawData[y] || {}
    Object.keys(d).forEach((c) => {
      running[c] = (running[c] || 0) + (parseInt(d[c], 10) || 0)
    })
    cum[y] = { ...running }
  })
  return cum
}

const cumData = buildCumulative()

function getTopN(year, n) {
  const yearData = cumData[year] || {}
  return Object.entries(yearData)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, value], index) => ({ name, val: value, rank: index + 1 }))
}

function getColor(name) {
  if (countryColors[name]) return countryColors[name]
  let h = 0
  for (let i = 0; i < name.length; i += 1) h = ((h << 5) - h) + name.charCodeAt(i)
  return `hsl(${Math.abs(h) % 360}, 72%, 52%)`
}

// ========== 动态条形竞速状态 ==========
const currentStep = ref(0)
const isPlaying = ref(false)
const intervalMs = ref(1100)
const ROW_HEIGHT = 44
const ROW_START = 10

const currentYear = computed(() => YEARS[currentStep.value])
const topData = computed(() => getTopN(currentYear.value, TOP_N))
const progressPercent = computed(() => YEARS.length > 1 ? ((currentStep.value / (YEARS.length - 1)) * 100) : 0)
const playLabel = computed(() => {
  if (isPlaying.value) return '⏸ 暂停'
  if (currentStep.value >= YEARS.length - 1) return '▶ 重新播放'
  return currentStep.value === 0 ? '▶ 开始播放' : '▶ 继续播放'
})

let timer = null
function stopPlay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isPlaying.value = false
}
function startPlay() {
  stopPlay()
  isPlaying.value = true
  timer = setInterval(() => {
    if (currentStep.value >= YEARS.length - 1) {
      stopPlay()
      return
    }
    currentStep.value += 1
  }, intervalMs.value)
}
function togglePlay() {
  if (isPlaying.value) {
    stopPlay()
  } else {
    if (currentStep.value >= YEARS.length - 1) currentStep.value = 0
    startPlay()
  }
}
function resetAnim() {
  stopPlay()
  currentStep.value = 0
}
function changeSpeed() {
  if (isPlaying.value) {
    startPlay()
  }
}
function selectYear(year) {
  stopPlay()
  currentStep.value = YEARS.indexOf(year)
}
onBeforeUnmount(() => {
  stopPlay()
})

// ========== 参赛国家气泡图 ==========
const bubbleOpt = ref({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    formatter: (p) => `<span style="color:#38BDF8">${p.data[3]}</span><br/>▸ 夺冠: ${p.data[0]}次 | 参赛: ${p.data[1]}届 | 进球: ${p.data[2]}`,
    backgroundColor: 'rgba(2,6,23,0.92)',
    borderColor: '#0EA5E9',
    borderWidth: 0.8
  },
  grid: { left: '3%', right: '8%', bottom: '3%', top: '8%', containLabel: true },
  xAxis: {
    name: '夺冠次数', nameTextStyle: { color: '#5A6478', fontFamily: 'monospace' },
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(14,165,233,0.08)' } },
    axisLine: { lineStyle: { color: 'rgba(14,165,233,0.3)' } },
  },
  yAxis: {
    name: '参赛次数', nameTextStyle: { color: '#5A6478' },
    axisLabel: { color: '#5A6478' },
    splitLine: { lineStyle: { color: 'rgba(14,165,233,0.08)' } },
  },
  series: [{
    type: 'scatter',
    symbolSize: (d) => Math.sqrt(d[2]) * 2.6,
    symbol: 'diamond',
    data: [
      [5, 22, 237, '巴西', '#0EA5E9'],
      [4, 20, 232, '德国', '#8B5CF6'],
      [4, 18, 128, '意大利', '#A78BFA'],
      [3, 18, 152, '阿根廷', '#22D3EE'],
      [2, 16, 136, '法国', '#3B82F6'],
      [2, 14, 89, '乌拉圭', '#06B6D4'],
      [1, 16, 104, '英格兰', '#F59E0B'],
      [1, 16, 110, '西班牙', '#F43F5E'],
      [0, 11, 55, '荷兰', '#F97316'],
      [0, 8, 43, '葡萄牙', '#F43F5E'],
    ],
    itemStyle: {
      color: (p) => p.data[4],
      borderColor: '#0F172A', borderWidth: 1.2,
      shadowBlur: 10, shadowColor: 'rgba(14,165,233,0.5)'
    },
    label: { show: true, formatter: (p) => p.data[3], position: 'right', color: '#CBD5E1', fontSize: 9, fontFamily: 'monospace' }
  }]
})

// ========== 历届冠军时间轴数据 ==========
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
.tab-history {
  padding-top: 8px;
}

/* 起源卡片 - 直角硬朗边框 */
.history-intro {
  padding: 20px 24px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(6, 12, 28, 0.75) 100%), url('/images/lishi1.jpg') center/cover no-repeat;
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 0px;
}

.intro-content {
  margin-top: 12px;
}

.intro-text p {
  color: #E8ECF1;
  line-height: 1.8;
  font-size: 14px;
  margin: 8px 0;
  text-align: justify;
}

.intro-text p strong {
  color: #FBBF24;
  font-weight: 600;
  text-shadow: 0 0 4px #FBBF24;
}

.intro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.tag {
  padding: 4px 12px;
  background: rgba(14, 165, 233, 0.12);
  color: #38BDF8;
  font-size: 12px;
  border: 0.5px solid rgba(14, 165, 233, 0.5);
  font-family: monospace;
  border-radius: 0px;
}

/* 旭日图包装器 - 棱角光晕 */
.sunburst-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.sunburst-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 88%;
  height: 88%;
  background: radial-gradient(circle at 30% 30%, rgba(14,165,233,0.08) 0%, rgba(139,92,246,0.04) 35%, rgba(0,0,0,0) 75%);
  filter: blur(18px);
  pointer-events: none;
  z-index: 0;
}

/* 旭日图图例 - 直角硬朗 */
.sunburst-legend {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 8px 24px;
  background: rgba(2, 6, 23, 0.7);
  font-size: 12px;
  border: 0.5px solid rgba(14, 165, 233, 0.35);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94A3B8;
  font-family: monospace;
}

.legend-color {
  width: 14px;
  height: 14px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}

.legend-tip {
  color: #FBBF24;
  font-size: 11px;
  border-left: 1px solid rgba(251, 191, 36, 0.4);
  padding-left: 20px;
  margin-left: 4px;
  letter-spacing: 0.5px;
}

/* 网格布局 */
.history-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;
  margin-top: 20px;
}

.bar-race-card {
  padding: 20px 24px;
  margin-bottom: 20px;
  background: rgba(2, 6, 23, 0.82);
  border: 1px solid rgba(59, 130, 246, 0.18);
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
}
.bar-race-card .race-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.bar-race-card .race-header .section-title {
  margin: 0;
  font-size: 1rem;
}
.bar-race-card .race-header .section-subtitle {
  margin: 6px 0 0;
  color: #94A3B8;
  font-size: 0.92rem;
}
.bar-race-card .race-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.race-year-display {
  font-size: 3rem;
  font-weight: 900;
  color: #FFD700;
  letter-spacing: 8px;
  margin: 0;
  user-select: none;
  text-shadow: 0 0 18px rgba(255, 215, 0, 0.25);
}
.bar-race-card .race-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;
}
.bar-race-card .btn {
  padding: 10px 24px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
  min-width: 110px;
  border: 1px solid transparent;
}
.bar-race-card .btn-play {
  background: linear-gradient(135deg, #FFD700, #FF9B33);
  color: #1a1a2e;
  box-shadow: 0 10px 24px rgba(255, 181, 28, 0.25);
}
.bar-race-card .btn-play:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(255, 181, 28, 0.35);
}
.bar-race-card .btn-reset {
  background: rgba(255,255,255,0.08);
  color: #e2e8f0;
  border-color: rgba(255,255,255,0.18);
}
.bar-race-card .btn-reset:hover {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.3);
}
.bar-race-card .speed-label {
  color: #cbd5e1;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.bar-race-card .speed-label select {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #f8fafc;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
  cursor: pointer;
  min-width: 96px;
}
.bar-race-card .year-nav {
  margin-bottom: 14px;
}
.bar-race-card .year-btn {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,215,0,0.18);
  background: rgba(255,255,255,0.04);
  color: #97a6ba;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.18s;
}
.bar-race-card .year-btn:hover {
  background: rgba(255,215,0,0.12);
  color: #ffd700;
  border-color: rgba(255,215,0,0.3);
}
.bar-race-card .year-btn.active {
  background: rgba(255,215,0,0.26);
  color: #fff;
  border-color: #ffd700;
  box-shadow: 0 0 0 1px rgba(255,215,0,0.15);
}
.race-chart-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding-top: 8px;
  position: relative;
}
#raceInner {
  position: relative;
  min-height: calc(44px * 12 + 20px);
}
.bar-row {
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 38px;
  transition: top 0.8s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease, transform 0.8s cubic-bezier(0.25,0.8,0.25,1);
  transform: translateZ(0);
  will-change: top, opacity, transform;
}
.bar-row:hover {
  transform: translateY(-1px);
}
.bar-rank {
  width: 28px;
  text-align: right;
  font-size: 0.75rem;
  color: #97a6ba;
  margin-right: 8px;
  flex-shrink: 0;
}
.bar-flag {
  width: 28px;
  font-size: 1.3rem;
  text-align: center;
  flex-shrink: 0;
  margin-right: 6px;
}
.bar-name {
  width: 110px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #f8fafc;
  text-align: right;
  padding-right: 10px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bar-track {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border-radius: 4px;
  height: 28px;
  overflow: hidden;
  position: relative;
}
.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.22,1,0.36,1), background 0.3s ease;
  min-width: 3px;
  position: relative;
  box-shadow: inset 0 0 18px rgba(255,255,255,0.08), 0 2px 10px rgba(0,0,0,0.08);
}
.bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: rgba(255,255,255,0.16);
  border-radius: 4px 4px 0 0;
  mix-blend-mode: screen;
}
.bar-value {
  width: 46px;
  text-align: right;
  font-size: 0.83rem;
  font-weight: 700;
  color: #FFD700;
  margin-left: 7px;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

/* 时间轴样式 - 直角硬朗 */
.champion-timeline {
  padding: 20px 24px;
  background: rgba(2, 6, 23, 0.65);
  border: 0.5px solid rgba(14, 165, 233, 0.25);
  border-radius: 0px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 20px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 1.5px;
  background: linear-gradient(180deg, #0EA5E9, rgba(14, 165, 233, 0.2));
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 10px 0;
  position: relative;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  background: #0EA5E9;
  border: 1px solid #0F172A;
  box-shadow: 0 0 0 2px #0EA5E9;
  position: absolute;
  left: -19px;
  top: 14px;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transform: rotate(45deg);
}

.timeline-dot.gold {
  background: #FBBF24;
  box-shadow: 0 0 0 2px #FBBF24, 0 0 12px rgba(251, 191, 36, 0.5);
}

.timeline-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.timeline-year {
  font-size: 14px;
  font-weight: 800;
  color: #22D3EE;
  min-width: 40px;
  font-family: monospace;
}

.timeline-host {
  font-size: 12px;
  color: #5A6478;
  margin-left: auto;
  font-family: monospace;
}

/* 响应式 */
@media (max-width: 768px) {
  .history-grid {
    grid-template-columns: 1fr;
  }
  .sunburst-legend {
    flex-wrap: wrap;
    gap: 12px;
  }
}
</style>