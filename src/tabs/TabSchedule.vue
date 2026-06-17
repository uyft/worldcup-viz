<template>
  <div class="tab-schedule">
    <!-- 北美三国共襄盛举横幅 -->
    <div class="hero-banner">
      <div class="banner-content">
        <div class="tournament-badge">
          <img src="/dalishenbei.PNG" alt="奖杯" class="trophy-icon" />
        </div>
        <div class="banner-text">
          <h1 class="fifa-title">2026 FIFA WORLD CUP</h1>
          <p class="host-nations">🇺🇸 美国 · 加拿大 🇨🇦 · 墨西哥 🇲🇽</p>
          <div class="date-range">2026.6.11 — 2026.7.19</div>
        </div>
        <div class="slogan">⚽ 足球团结世界 · 北美三国共襄盛举 ⚽</div>
      </div>
    </div>

    <div class="schedule-header">
      <div>
        <h2 class="section-title">{{ sectionTitle }}</h2>
        <div class="data-status" :class="{ 'data-loaded': dataLoaded }">
          <span class="status-icon">{{ dataLoaded ? '✅' : '🔄' }}</span>
          <span>{{ dataLoaded ? `已加载 ${matches.length} 场比赛` : '加载数据中...' }}</span>
        </div>
      </div>
      <div class="header-actions">
        <div class="schedule-filters">
          <button v-for="g in groups" :key="g"
            class="filter-btn" :class="{ active: activeGroup === g }"
            @click="activeGroup = g">{{ g }}</button>
        </div>
        <button class="refresh-btn" @click="refreshData" :disabled="loading">
          🔄 {{ loading ? '刷新中...' : '同步CSV' }}
        </button>
      </div>
    </div>

    <ChartCard
      :title="chartTitle"
      :subtitle="chartSubtitle"
      :height="320"
      :option="calendarOpt"
      :delay="1"
    />

    <div v-if="activeGroup !== '全部'" class="schedule-log card anim-fadeInUp delay-2">
      <div class="schedule-log-header">
        <div>
          <h3 class="section-title">{{ activeGroup === '淘汰赛' ? '淘汰赛对阵' : activeGroup + '组本组对战' }}</h3>
          <p class="schedule-log-subtitle">{{ activeGroup === '淘汰赛' ? '1/16决赛至决赛全部淘汰赛阶段赛程' : '当前组别的赛程对阵，一目了然地展示每场小组赛' }}</p>
        </div>
        <span class="schedule-log-tag">共 {{ groupLogMatches.length }} 场</span>
      </div>
      <div class="fixture-table-wrapper log-table-wrapper">
        <table class="fixture-table log-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>时间</th>
              <th>主队</th>
              <th>客队</th>
              <th>场地</th>
              <th>阶段</th>
              <th>比分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, idx) in logPaginatedMatches" :key="idx" class="fixture-row">
              <td class="fixture-date">
                <div class="date-primary">{{ formatDateDisplay(m.rawDate) }}</div>
              </td>
              <td class="fixture-time">{{ extractTime(m.time) }}</td>
              <td class="fixture-team-name">{{ m.home.name }}</td>
              <td class="fixture-team-name">{{ m.away.name }}</td>
              <td class="fixture-venue">{{ shortenVenue(m.venue) }}</td>
              <td>
                <span :class="['stage-badge', getStageClass(m.stage)]">
                  {{ m.group ? m.group + '组 · ' + m.stage : m.stage }}
                </span>
              </td>
              <td>
                <span :class="['score-value', { 'has-score': m.hasScore }]">
                  {{ formatScore(m) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页控制 -->
      <div class="pagination" v-if="groupLogMatches.length > logPageSize">
        <button class="page-btn" @click="logCurrentPage--" :disabled="logCurrentPage === 1">
          ← 上一页
        </button>
        <span class="page-info">第 {{ logCurrentPage }} / {{ logTotalPages }} 页</span>
        <button class="page-btn" @click="logCurrentPage++" :disabled="logCurrentPage === logTotalPages">
          下一页 →
        </button>
      </div>
    </div>

    <!-- 淘汰赛对阵图 - 统一 Grid 布局（含半决赛→决赛/季军赛分叉） -->
    <div v-if="activeGroup === '淘汰赛'" class="bracket-section card anim-fadeInUp delay-2">
      <div class="bracket-section-header">
        <div>
          <h3 class="section-title">🏆 淘汰赛对阵图</h3>
          <p class="bracket-subtitle">1/16决赛 → 1/8决赛 → 1/4决赛 → 半决赛 → 决赛 / 季军赛</p>
        </div>
        <span class="bracket-match-count">共 {{ totalKnockoutMatches }} 场</span>
      </div>
      <div class="bracket-container">
        <div class="bracket-scroll">
          <div class="bracket-grid" :style="bracketGridStyle">
            <template v-for="(round, ri) in mainBracketRounds" :key="round.name">
              <!-- 轮次标签 -->
              <div class="bracket-col-label" :style="labelGridPos(ri)">
                <span class="round-name">{{ round.label }}</span>
                <span class="round-count">{{ round.matches.length }}场</span>
              </div>
              <!-- 比赛卡片 -->
              <div
                v-for="(match, mi) in round.matches"
                :key="'m-'+ri+'-'+mi"
                class="bracket-match"
                :class="{ 'has-incoming': ri > 0 }"
                :style="matchGridPos(round.matches.length, mi, ri)"
              >
                <div class="bracket-match-teams">
                  <div class="bracket-team home-team">
                    <span class="bracket-team-flag">{{ getTeamFlag(match.home.name) }}</span>
                    <span class="bracket-team-name" :title="match.home.name">{{ shortenName(match.home.name) }}</span>
                  </div>
                  <div class="bracket-vs">VS</div>
                  <div class="bracket-team away-team">
                    <span class="bracket-team-flag">{{ getTeamFlag(match.away.name) }}</span>
                    <span class="bracket-team-name" :title="match.away.name">{{ shortenName(match.away.name) }}</span>
                  </div>
                </div>
                <div class="bracket-match-meta">
                  <span class="bracket-date">{{ formatDateDisplay(match.rawDate) }}</span>
                  <span class="bracket-time">{{ extractTime(match.time) }}</span>
                </div>
                <div class="bracket-match-venue" :title="match.venue">{{ shortenVenue(match.venue) }}</div>
              </div>
              <!-- 常规连线（非最后一轮） -->
              <template v-if="ri < mainBracketRounds.length - 1">
                <div
                  v-for="ci in Math.ceil(round.matches.length / 2)"
                  :key="'c-'+ri+'-'+ci"
                  class="bracket-conn"
                  :style="connGridPos(round.matches.length, ci - 1, ri)"
                >
                  <div class="conn-top"></div>
                  <div class="conn-bot"></div>
                  <div class="conn-vert"></div>
                  <div class="conn-exit"></div>
                </div>
              </template>
            </template>

            <!-- 半决赛 → 决赛/季军赛 分叉连线 -->
            <div v-if="finalRound || thirdPlaceRound" class="bracket-conn bracket-conn-split" :style="splitConnPos">
              <div class="conn-top"></div>
              <div class="conn-bot"></div>
              <div class="conn-vert"></div>
              <div class="conn-exit-up"><span class="conn-label conn-label-winner">胜</span></div>
              <div class="conn-exit-down"><span class="conn-label conn-label-loser">败</span></div>
            </div>

            <!-- 决赛标签 -->
            <div v-if="finalRound" class="bracket-col-label" :style="finalLabelPos">
              <div class="bracket-label-dual">
                <span class="round-name">🏆 决赛</span>
                <span class="round-name-divider">/</span>
                <span class="round-name round-name-third">🥉 季军赛</span>
              </div>
            </div>

            <!-- 决赛卡片（上半区） -->
            <template v-if="finalRound">
              <div
                v-for="(match, fi) in finalRound.matches"
                :key="'f-'+fi"
                class="bracket-match bracket-match-final"
                :style="finalMatchPos"
              >
                <div class="bracket-match-teams">
                  <div class="bracket-team home-team">
                    <span class="bracket-team-flag">{{ getTeamFlag(match.home.name) }}</span>
                    <span class="bracket-team-name" :title="match.home.name">{{ shortenName(match.home.name) }}</span>
                  </div>
                  <div class="bracket-vs">VS</div>
                  <div class="bracket-team away-team">
                    <span class="bracket-team-flag">{{ getTeamFlag(match.away.name) }}</span>
                    <span class="bracket-team-name" :title="match.away.name">{{ shortenName(match.away.name) }}</span>
                  </div>
                </div>
                <div class="bracket-match-meta">
                  <span class="bracket-date">{{ formatDateDisplay(match.rawDate) }}</span>
                  <span class="bracket-time">{{ extractTime(match.time) }}</span>
                </div>
                <div class="bracket-match-venue" :title="match.venue">{{ shortenVenue(match.venue) }}</div>
              </div>
            </template>

            <!-- 季军赛卡片（下半区） -->
            <template v-if="thirdPlaceRound">
              <div
                v-for="(match, ti) in thirdPlaceRound.matches"
                :key="'t-'+ti"
                class="bracket-match bracket-match-third"
                :style="thirdMatchPos"
              >
                <div class="bracket-match-round-label">🥉 季军赛</div>
                <div class="bracket-match-teams">
                  <div class="bracket-team home-team">
                    <span class="bracket-team-flag">{{ getTeamFlag(match.home.name) }}</span>
                    <span class="bracket-team-name" :title="match.home.name">{{ shortenName(match.home.name) }}</span>
                  </div>
                  <div class="bracket-vs">VS</div>
                  <div class="bracket-team away-team">
                    <span class="bracket-team-flag">{{ getTeamFlag(match.away.name) }}</span>
                    <span class="bracket-team-name" :title="match.away.name">{{ shortenName(match.away.name) }}</span>
                  </div>
                </div>
                <div class="bracket-match-meta">
                  <span class="bracket-date">{{ formatDateDisplay(match.rawDate) }}</span>
                  <span class="bracket-time">{{ extractTime(match.time) }}</span>
                </div>
                <div class="bracket-match-venue" :title="match.venue">{{ shortenVenue(match.venue) }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 赛事对阵赛程图 - 全新卡片表格设计 -->
    <div class="schedule-panel">
      <div class="schedule-main">
        <div class="fixture-card">
          <div class="fixture-header">
            <div class="fixture-title-section">
              <h3 class="fixture-title">📅 世界杯对阵赛程图</h3>
              <p class="fixture-subtitle">按日期排序 · 全局预览所有对阵信息</p>
            </div>
            <div class="fixture-stats">
              <span class="stat-badge">
                <span class="stat-icon">🏆</span>
                <span>{{ groupLogMatches.length }} 场比赛</span>
              </span>
              <span class="stat-badge">
                <span class="stat-icon">📌</span>
                <span>{{ activeGroup === '全部' ? '全部组别' : activeGroup === '淘汰赛' ? '淘汰赛阶段' : activeGroup + '组' }}</span>
              </span>
            </div>
          </div>

          <!-- 表格视图 -->
          <div class="fixture-table-wrapper">
            <table class="fixture-table">
              <thead>
                <tr>
                  <th>日期 / 时间</th>
                  <th>对阵</th>
                  <th>比分</th>
                  <th>场地</th>
                  <th>阶段</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(m, idx) in paginatedMatches" :key="idx" class="fixture-row">
                  <td class="fixture-date">
                    <div class="date-primary">{{ formatDateDisplay(m.rawDate) }}</div>
                    <div class="time-secondary">{{ extractTime(m.time) }}</div>
                  </td>
                  <td class="fixture-teams">
                    <div class="team-cell">
                      <div class="team home-team-cell">
                        <FlagTag :code="m.home.code" :name="m.home.name" small />
                      </div>
                      <div class="team-vs">vs</div>
                      <div class="team away-team-cell">
                        <FlagTag :code="m.away.code" :name="m.away.name" small />
                      </div>
                    </div>
                  </td>
                  <td class="fixture-score">
                    <span :class="['score-value', { 'has-score': m.hasScore }]">
                      {{ formatScore(m) }}
                    </span>
                  </td>
                  <td class="fixture-venue">
                    {{ m.venue }}
                  </td>
                  <td class="fixture-stage">
                    <span :class="['stage-badge', getStageClass(m.stage)]">
                      {{ m.group ? m.group + '组 · ' + m.stage : m.stage }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页控制 -->
          <div class="pagination" v-if="groupLogMatches.length > pageSize">
            <button class="page-btn" @click="currentPage--" :disabled="currentPage === 1">
              ← 上一页
            </button>
            <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
            <button class="page-btn" @click="currentPage++" :disabled="currentPage === totalPages">
              下一页 →
            </button>
          </div>
        </div>
      </div>

      <aside class="today-info card anim-fadeInUp delay-3">
        <div class="info-header">
          <h3 class="section-title">📋 当日赛程资讯</h3>
          <p class="flow-tip">根据当前时间实时更新今日比赛状态</p>
        </div>
        <div class="info-content">
          <div class="info-block">
            <div class="info-label">
              <span class="label-icon">⚡</span> 今日比赛
              <span v-if="currentTimeLabel" class="live-clock">{{ currentTimeLabel }}</span>
            </div>
            <div v-if="todayMatchesWithStatus.length" class="info-list">
              <div v-for="(m, idx) in todayMatchesWithStatus" :key="idx" class="today-item">
                <div class="today-match">
                  <FlagTag :code="m.home.code" :name="m.home.name" tiny />
                  <span>vs</span>
                  <FlagTag :code="m.away.code" :name="m.away.name" tiny />
                  <span class="match-score-preview">{{ formatScore(m) }}</span>
                </div>
                <div class="today-meta">
                  {{ extractTime(m.time) }} · {{ shortenVenue(m.venue) }}
                </div>
                <div class="today-status">
                  <span :class="['status-dot', m.status]"></span>
                  <span :class="['status-text', m.status]">{{ statusLabel(m.status) }}</span>
                </div>
              </div>
            </div>
            <div v-else class="info-empty">✨ 今日暂无比赛</div>
          </div>

          <!-- 最新资讯模块 -->
          <div class="info-block news-block">
            <div class="news-block-header">
              <div class="info-label" style="margin-bottom:0">
                <span class="label-icon">📰</span> 最新资讯
              </div>
              <button
                class="news-refresh-btn"
                :class="{ 'is-loading': newsRefreshing }"
                @click="refreshNewsFromScraper"
                :disabled="newsRefreshing"
                title="实时爬取最新资讯"
              >
                <span class="refresh-icon">{{ newsRefreshing ? '⏳' : '🔄' }}</span>
                <span>{{ newsRefreshing ? '抓取中...' : '立即爬取' }}</span>
              </button>
            </div>
            <div v-if="newsLastUpdate" class="news-last-update">
              上次更新：{{ newsLastUpdate }}
            </div>
            <div v-if="displayNews.length" class="news-list">
              <a
                v-for="(n, idx) in displayNews"
                :key="idx"
                :href="n['链接'] || '#'"
                target="_blank"
                rel="noopener"
                class="news-item"
              >
                <div class="news-type-badge" :class="'type-' + n['内容类型']">
                  {{ n['内容类型'] || '资讯' }}
                </div>
                <div class="news-title">{{ n['标题'] }}</div>
                <div class="news-meta">
                  <span>{{ n['来源'] }}</span>
                  <span v-if="n['发布时间']">· {{ n['发布时间'].slice(0, 10) }}</span>
                  <span v-if="n['视频时长']" class="news-duration">⏱ {{ n['视频时长'] }}</span>
                </div>
              </a>
            </div>
            <div v-else class="info-empty">
              {{ newsLoaded ? '暂无今日资讯' : '⏳ 加载资讯中...' }}
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ChartCard from '../components/ChartCard.vue'
import FlagTag from '../components/FlagTag.vue'

// 组别筛选
const groups = ['全部', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', '淘汰赛']
const activeGroup = ref('全部')

// 淘汰赛阶段列表
const knockoutStages = ['1/16决赛', '1/8决赛', '1/4决赛', '半决赛', '季军赛', '决赛']

// 淘汰赛对阵图 - 按轮次分组
const bracketRounds = computed(() => {
  const roundOrder = [
    { name: '1/16决赛', label: '1/16 决赛' },
    { name: '1/8决赛', label: '1/8 决赛' },
    { name: '1/4决赛', label: '1/4 决赛' },
    { name: '半决赛', label: '半决赛' },
    { name: '季军赛', label: '季军赛' },
    { name: '决赛', label: '决赛' }
  ]
  
  const knockout = matches.value.filter(m => knockoutStages.includes(m.stage))
  
  return roundOrder.map(round => ({
    ...round,
    matches: knockout
      .filter(m => m.stage === round.name)
      .sort((a, b) => (a.rawDate || '').localeCompare(b.rawDate || ''))
  })).filter(r => r.matches.length > 0)
})

// 主对阵图轮次（不含决赛和季军赛，这两项在最后一列并行展示）
const mainBracketRounds = computed(() => {
  return bracketRounds.value.filter(r => r.name !== '季军赛' && r.name !== '决赛')
})

// 决赛轮次
const finalRound = computed(() => {
  return bracketRounds.value.find(r => r.name === '决赛') || null
})

// 季军赛轮次
const thirdPlaceRound = computed(() => {
  return bracketRounds.value.find(r => r.name === '季军赛') || null
})

const totalKnockoutMatches = computed(() => {
  return bracketRounds.value.reduce((sum, r) => sum + r.matches.length, 0)
})

// Grid 基础行数 = 首轮比赛数
const firstRoundCount = computed(() => {
  const first = mainBracketRounds.value[0]
  return first ? first.matches.length : 16
})

// 整体 Grid 样式（统一行列定义，保证所有轮次和连线对齐）
const bracketGridStyle = computed(() => {
  const cols = []
  for (let i = 0; i < mainBracketRounds.value.length; i++) {
    cols.push('minmax(140px, 1fr)')  // 比赛列
    if (i < mainBracketRounds.value.length - 1) {
      cols.push('36px')              // 连线列
    }
  }
  // 半决赛 → 决赛/季军赛 分叉连线 + 决赛/季军赛列
  if (finalRound.value || thirdPlaceRound.value) {
    cols.push('36px')                // 分叉连线列
    cols.push('minmax(140px, 1fr)')  // 决赛/季军赛列
  }
  return {
    gridTemplateColumns: cols.join(' '),
    gridTemplateRows: `auto repeat(${firstRoundCount.value}, minmax(56px, 1fr))`
  }
})

// 轮次标签位置（row 1 是标签行）
const labelGridPos = (roundIdx) => ({
  gridColumn: `${roundIdx * 2 + 1}`,
  gridRow: '1'
})

// 比赛卡片位置（row 2 开始是比赛行）
const matchGridPos = (matchCount, matchIdx, roundIdx) => {
  const span = firstRoundCount.value / matchCount
  const rowStart = matchIdx * span + 2  // +2 因为 row 1 是标签
  return {
    gridColumn: `${roundIdx * 2 + 1}`,
    gridRow: `${rowStart} / span ${span}`
  }
}

// 连线元素位置
const connGridPos = (matchCount, connIdx, roundIdx) => {
  const span = firstRoundCount.value / matchCount
  const rowStart = connIdx * 2 * span + 2
  return {
    gridColumn: `${roundIdx * 2 + 2}`,
    gridRow: `${rowStart} / span ${2 * span}`
  }
}

// ===== 半决赛→决赛/季军赛 分叉区域 =====
const splitConnColIdx = computed(() => mainBracketRounds.value.length * 2)
const finalColIdx = computed(() => mainBracketRounds.value.length * 2 + 1)

// 分叉连线位置（跨越整个比赛行区域）
const splitConnPos = computed(() => ({
  gridColumn: `${splitConnColIdx.value}`,
  gridRow: `2 / span ${firstRoundCount.value}`
}))

// 决赛标签位置
const finalLabelPos = computed(() => ({
  gridColumn: `${finalColIdx.value}`,
  gridRow: '1'
}))

// 决赛卡片位置（上半区）
const finalMatchPos = computed(() => {
  const half = Math.ceil(firstRoundCount.value / 2)
  return {
    gridColumn: `${finalColIdx.value}`,
    gridRow: `2 / span ${half}`
  }
})

// 季军赛卡片位置（下半区）
const thirdMatchPos = computed(() => {
  const half = Math.ceil(firstRoundCount.value / 2)
  return {
    gridColumn: `${finalColIdx.value}`,
    gridRow: `${half + 2} / span ${firstRoundCount.value - half}`
  }
})

// 国家队简称映射
const nameAbbrMap = {
  '墨西哥': '墨西哥', '南非': '南非', '韩国': '韩国', '捷克': '捷克',
  '加拿大': '加拿大', '波黑': '波黑', '卡塔尔': '卡塔尔', '瑞士': '瑞士',
  '巴西': '巴西', '摩洛哥': '摩洛哥', '海地': '海地', '苏格兰': '苏格兰',
  '美国': '美国', '巴拉圭': '巴拉圭', '澳大利亚': '澳大利亚', '土耳其': '土耳其',
  '德国': '德国', '库拉索': '库拉索', '科特迪瓦': '科特迪瓦', '厄瓜多尔': '厄瓜多尔',
  '荷兰': '荷兰', '日本': '日本', '瑞典': '瑞典', '突尼斯': '突尼斯',
  '比利时': '比利时', '埃及': '埃及', '伊朗': '伊朗', '新西兰': '新西兰',
  '西班牙': '西班牙', '佛得角': '佛得角', '沙特阿拉伯': '沙特', '乌拉圭': '乌拉圭',
  '法国': '法国', '塞内加尔': '塞内加尔', '伊拉克': '伊拉克', '挪威': '挪威',
  '阿根廷': '阿根廷', '阿尔及利亚': '阿尔及利亚', '奥地利': '奥地利', '约旦': '约旦',
  '葡萄牙': '葡萄牙', '刚果(金)': '刚果(金)', '乌兹别克斯坦': '乌兹别克', '哥伦比亚': '哥伦比亚',
  '英格兰': '英格兰', '克罗地亚': '克罗地亚', '加纳': '加纳', '巴拿马': '巴拿马',
}

const shortenName = (name) => {
  if (!name) return '待定'
  return nameAbbrMap[name] || name
}

const getTeamFlag = (name) => {
  if (!name) return '❓'
  // 占位符：A2, B2, 73胜者, 第3名待定 等
  if (/^[A-Z]\d?$/.test(name)) return '❓'
  if (name.includes('胜者') || name.includes('待定') || /^\d/.test(name)) return '❓'
  // 获取国旗 emoji
  const flagMap = {
    '墨西哥': '🇲🇽', '南非': '🇿🇦', '韩国': '🇰🇷', '捷克': '🇨🇿',
    '加拿大': '🇨🇦', '波黑': '🇧🇦', '卡塔尔': '🇶🇦', '瑞士': '🇨🇭',
    '巴西': '🇧🇷', '摩洛哥': '🇲🇦', '海地': '🇭🇹', '苏格兰': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    '美国': '🇺🇸', '巴拉圭': '🇵🇾', '澳大利亚': '🇦🇺', '土耳其': '🇹🇷',
    '德国': '🇩🇪', '库拉索': '🇨🇼', '科特迪瓦': '🇨🇮', '厄瓜多尔': '🇪🇨',
    '荷兰': '🇳🇱', '日本': '🇯🇵', '瑞典': '🇸🇪', '突尼斯': '🇹🇳',
    '比利时': '🇧🇪', '埃及': '🇪🇬', '伊朗': '🇮🇷', '新西兰': '🇳🇿',
    '西班牙': '🇪🇸', '佛得角': '🇨🇻', '沙特阿拉伯': '🇸🇦', '乌拉圭': '🇺🇾',
    '法国': '🇫🇷', '塞内加尔': '🇸🇳', '伊拉克': '🇮🇶', '挪威': '🇳🇴',
    '阿根廷': '🇦🇷', '阿尔及利亚': '🇩🇿', '奥地利': '🇦🇹', '约旦': '🇯🇴',
    '葡萄牙': '🇵🇹', '刚果(金)': '🇨🇩', '乌兹别克斯坦': '🇺🇿', '哥伦比亚': '🇨🇴',
    '英格兰': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '克罗地亚': '🇭🇷', '加纳': '🇬🇭', '巴拿马': '🇵🇦',
  }
  return flagMap[name] || '🌍'
}
const matches = ref([])
const loading = ref(false)
const dataLoaded = ref(false)

// 资讯相关状态
const newsItems = ref([])
const newsLoaded = ref(false)
const newsRefreshing = ref(false)
const newsLastUpdate = ref('')

// 分页相关 —— 每页 12 场对阵
const currentPage = ref(1)
const pageSize = ref(12)

const totalPages = computed(() => Math.ceil(groupLogMatches.value.length / pageSize.value))

const paginatedMatches = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return groupLogMatches.value.slice(start, end)
})

// 对阵时间表格分页（独立分页状态）
const logCurrentPage = ref(1)
const logPageSize = ref(12)

const logTotalPages = computed(() => Math.ceil(groupLogMatches.value.length / logPageSize.value))

const logPaginatedMatches = computed(() => {
  const start = (logCurrentPage.value - 1) * logPageSize.value
  const end = start + logPageSize.value
  return groupLogMatches.value.slice(start, end)
})

// 监听组别变化重置页码
const resetPagination = () => {
  currentPage.value = 1
}

// 监听 activeGroup 变化
import { watch } from 'vue'
watch(activeGroup, () => {
  resetPagination()
  logCurrentPage.value = 1
})

// 解析 CSV 数据
const parseCSVData = (csvText) => {
  const lines = csvText.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const data = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const row = []
    let inQuote = false
    let current = ''

    for (let ch of line) {
      if (ch === '"') {
        inQuote = !inQuote
      } else if (ch === ',' && !inQuote) {
        row.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    row.push(current.trim())

    if (row.length >= 9) {
      let homeScore = row[5] && row[5] !== '' ? parseInt(row[5]) : null
      let awayScore = row[6] && row[6] !== '' ? parseInt(row[6]) : null

      let dateStr = row[0]
      let timeStr = row[1]
      let displayTime = ''

      if (dateStr && timeStr) {
        const dateParts = dateStr.split('-')
        if (dateParts.length === 3) {
          displayTime = `${parseInt(dateParts[1])}月${parseInt(dateParts[2])}日 ${timeStr}`
        } else {
          displayTime = `${dateStr} ${timeStr}`
        }
      } else {
        displayTime = '待定'
      }

      data.push({
        group: row[2] ? row[2].replace(/组$/, '') : '',
        time: displayTime,
        stage: row[8] || '小组赛',
        home: {
          code: getCountryCode(row[3]),
          name: row[3] || '',
          score: homeScore !== null ? homeScore : 0
        },
        away: {
          code: getCountryCode(row[4]),
          name: row[4] || '',
          score: awayScore !== null ? awayScore : 0
        },
        venue: row[7] || '待定',
        rawDate: row[0],
        hasScore: homeScore !== null && awayScore !== null,
        actualHomeScore: homeScore,
        actualAwayScore: awayScore
      })
    }
  }

  return data
}

// 获取国家代码
const getCountryCode = (countryName) => {
  const codeMap = {
    '墨西哥': 'mx', '南非': 'za', '韩国': 'kr', '捷克': 'cz',
    '加拿大': 'ca', '波黑': 'ba', '卡塔尔': 'qa', '瑞士': 'ch',
    '巴西': 'br', '摩洛哥': 'ma', '海地': 'ht', '苏格兰': 'gb-sct',
    '美国': 'us', '巴拉圭': 'py', '澳大利亚': 'au', '土耳其': 'tr',
    '德国': 'de', '库拉索': 'cw', '科特迪瓦': 'ci', '厄瓜多尔': 'ec',
    '荷兰': 'nl', '日本': 'jp', '瑞典': 'se', '突尼斯': 'tn',
    '比利时': 'be', '埃及': 'eg', '伊朗': 'ir', '新西兰': 'nz',
    '西班牙': 'es', '佛得角': 'cv', '沙特阿拉伯': 'sa', '乌拉圭': 'uy',
    '法国': 'fr', '塞内加尔': 'sn', '伊拉克': 'iq', '挪威': 'no',
    '阿根廷': 'ar', '阿尔及利亚': 'dz', '奥地利': 'at', '约旦': 'jo',
    '葡萄牙': 'pt', '刚果(金)': 'cd', '乌兹别克斯坦': 'uz', '哥伦比亚': 'co',
    '英格兰': 'gb-eng', '克罗地亚': 'hr', '加纳': 'gh', '巴拿马': 'pa',
  }
  return codeMap[countryName] || countryName?.substring(0, 2).toLowerCase() || 'unknown'
}

// 辅助函数
const formatDateDisplay = (rawDate) => {
  if (!rawDate) return '待定'
  const parts = rawDate.split('-')
  if (parts.length === 3) {
    return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
  }
  return rawDate
}

const extractTime = (timeStr) => {
  if (!timeStr) return '待定'
  const match = timeStr.match(/(\d{1,2}:\d{2})/)
  return match ? match[1] : timeStr.split(' ').pop() || '待定'
}

const formatTimeOnly = (timeStr) => {
  return extractTime(timeStr)
}

const shortenVenue = (venue) => {
  if (!venue) return '待定'
  if (venue.length > 18) return venue.slice(0, 15) + '...'
  return venue
}

const getStageClass = (stage) => {
  if (stage === '决赛') return 'stage-final'
  if (stage === '半决赛') return 'stage-semi'
  if (stage === '季军赛') return 'stage-third'
  if (stage.includes('决赛')) return 'stage-knockout'
  if (stage.includes('揭幕战')) return 'stage-opener'
  return 'stage-group'
}

// 加载 CSV 文件
const loadCSVData = async () => {
  loading.value = true

  try {
    let response = null
    const paths = ['./worldcup.csv', '/worldcup.csv', '../worldcup.csv']

    for (const path of paths) {
      try {
        response = await fetch(`${path}?t=${Date.now()}`)
        if (response.ok) break
      } catch (e) {
        continue
      }
    }

    if (!response || !response.ok) {
      throw new Error('无法加载 worldcup.csv 文件')
    }

    const csvText = await response.text()
    const parsedData = parseCSVData(csvText)

    if (parsedData.length > 0) {
      matches.value = parsedData
      dataLoaded.value = true
      console.log(`✅ 成功加载 ${parsedData.length} 场比赛数据`)
    } else {
      console.warn('CSV 文件无有效数据，使用默认数据')
      loadDefaultData()
    }
  } catch (error) {
    console.error('加载 CSV 失败:', error)
    loadDefaultData()
  } finally {
    loading.value = false
  }
}

// 加载默认数据
const loadDefaultData = () => {
  matches.value = [
    { group:'A', time:'6月12日 03:00', stage:'揭幕战', home:{code:'mx',name:'墨西哥',score:0}, away:{code:'za',name:'南非',score:0}, venue:'墨西哥城 阿兹特克体育场', hasScore:false, rawDate:'2026-06-12' },
    { group:'A', time:'6月12日 10:00', stage:'小组赛', home:{code:'kr',name:'韩国',score:0}, away:{code:'cz',name:'捷克',score:0}, venue:'瓜达拉哈拉 阿克伦体育场', hasScore:false, rawDate:'2026-06-12' },
    { group:'B', time:'6月13日 03:00', stage:'小组赛', home:{code:'ca',name:'加拿大',score:0}, away:{code:'ba',name:'波黑',score:0}, venue:'多伦多 BMO球场', hasScore:false, rawDate:'2026-06-13' },
    { group:'B', time:'6月13日 09:00', stage:'小组赛', home:{code:'us',name:'美国',score:0}, away:{code:'qa',name:'卡塔尔',score:0}, venue:'洛杉矶 SoFi体育场', hasScore:false, rawDate:'2026-06-13' },
  ]
  dataLoaded.value = true
}

// 刷新比赛数据
const refreshData = async () => {
  await loadCSVData()
}

// ===================== 世界杯资讯 API =====================

// 从 Flask API 加载资讯
const loadNewsFromAPI = async () => {
  try {
    const response = await fetch(`/api/news?t=${Date.now()}`)
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        newsItems.value = result.data
        newsLoaded.value = true
        if (result.lastUpdate) newsLastUpdate.value = result.lastUpdate
        console.log(`✅ 成功加载 ${result.total} 条资讯`)
        return
      }
    }
  } catch (e) {
    console.warn('API 服务未启动，尝试直接读取 CSV:', e)
  }
  // 兜底：直接读取 public 目录的 CSV
  loadNewsFallback()
}

// 兜底方案：直接读取 worldcup_news.csv
const loadNewsFallback = async () => {
  try {
    const response = await fetch(`./worldcup_news.csv?t=${Date.now()}`)
    if (!response.ok) return
    const csvText = await response.text()
    const text = csvText.replace(/^\uFEFF/, '')
    const lines = text.trim().split(/\r?\n/)
    const result = []
    for (let i = 1; i < lines.length; i++) {
      const row = []
      let inQuote = false, current = ''
      for (let ch of lines[i]) {
        if (ch === '"') { inQuote = !inQuote }
        else if (ch === ',' && !inQuote) { row.push(current.trim()); current = '' }
        else { current += ch }
      }
      row.push(current.trim())
      if (row.length >= 4 && row[0]) {
        result.push({
          '标题': row[0], '链接': row[1], '封面图': row[2],
          '发布时间': row[3], '内容类型': row[4], '简介': row[5],
          '来源': row[6] || '央视网', '内容ID': row[7], '视频时长': row[8]
        })
      }
    }
    if (result.length > 0) {
      newsItems.value = result
      newsLoaded.value = true
      console.log(`✅ 从 CSV 加载 ${result.length} 条资讯`)
    }
  } catch (e) {
    console.warn('本地 CSV 也不存在，请先运行 news_server.py 抓取数据')
  }
}

// 触发实时爬取：POST /api/news/refresh，再轮询直到完成
const refreshNewsFromScraper = async () => {
  if (newsRefreshing.value) return
  newsRefreshing.value = true
  try {
    const res = await fetch('/api/news/refresh', { method: 'POST' })
    const result = await res.json()
    if (!result.success) {
      newsRefreshing.value = false
      return
    }
    // 每 2 秒轮询一次爬虫状态
    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await fetch('/api/news/status')
        const status = await statusRes.json()
        if (!status.running) {
          clearInterval(pollInterval)
          newsRefreshing.value = false
          await loadNewsFromAPI()
        }
      } catch (e) {
        clearInterval(pollInterval)
        newsRefreshing.value = false
      }
    }, 2000)
  } catch (e) {
    newsRefreshing.value = false
    console.warn('请先运行 news_server.py')
  }
}

// 今日优先，没有今日数据则展示最新 5 条
const displayNews = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  const todayList = newsItems.value.filter(
    n => n['发布时间'] && n['发布时间'].startsWith(today)
  )
  return (todayList.length > 0 ? todayList : newsItems.value).slice(0, 5)
})
// ======================================================

// 日历相关
const calendarDates = computed(() => {
  if (activeGroup.value === '全部' || activeGroup.value === '淘汰赛') {
    const dates = []
    for (let day = 11; day <= 30; day++) dates.push(`6.${day.toString().padStart(2, '0')}`)
    for (let day = 1; day <= 20; day++) dates.push(`7.${day.toString().padStart(2, '0')}`)
    return dates
  }

  const dateSet = new Set()
  matches.value
    .filter(m => m.group === activeGroup.value)
    .forEach(match => {
      if (match.rawDate) {
        const month = parseInt(match.rawDate.substring(5, 7), 10)
        const day = parseInt(match.rawDate.substring(8), 10)
        dateSet.add(`${month}.${day.toString().padStart(2, '0')}`)
      }
    })
  return Array.from(dateSet).sort((a, b) => {
    const [am, ad] = a.split('.').map(Number)
    const [bm, bd] = b.split('.').map(Number)
    return am === bm ? ad - bd : am - bm
  })
})

const getDailyMatchCount = computed(() => {
  const dailyCount = {}
  const sourceMatches = activeGroup.value === '全部'
    ? matches.value
    : activeGroup.value === '淘汰赛'
      ? matches.value.filter(m => knockoutStages.includes(m.stage))
      : matches.value.filter(m => m.group === activeGroup.value)

  sourceMatches.forEach(match => {
    if (match.rawDate) {
      const month = parseInt(match.rawDate.substring(5, 7), 10)
      const day = parseInt(match.rawDate.substring(8), 10)
      const dateKey = `${month}.${day.toString().padStart(2, '0')}`
      dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1
    }
  })

  return calendarDates.value.map(date => dailyCount[date] || 0)
})

const chartTitle = computed(() => {
  if (activeGroup.value === '全部') return '赛事日历密度'
  if (activeGroup.value === '淘汰赛') return '淘汰赛阶段比赛分布'
  return `${activeGroup.value}组比赛分布`
})

const chartSubtitle = computed(() => {
  if (activeGroup.value === '全部') return '2026年6月11日 - 7月20日 每日比赛场次'
  if (activeGroup.value === '淘汰赛') return '1/16决赛至决赛 — 32场淘汰赛'
  return `${activeGroup.value}组仅显示该组比赛数据`
})

const sectionTitle = computed(() => {
  if (activeGroup.value === '全部') return '全部赛程'
  if (activeGroup.value === '淘汰赛') return '淘汰赛程'
  return `${activeGroup.value}组赛程`
})

const calendarOpt = computed(() => ({
  backgroundColor: '#0b0c2a',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(11, 12, 42, 0.95)',
    borderColor: '#4e3cc8',
    borderWidth: 1,
    textStyle: { color: '#c2d2ff' },
    extraCssText: 'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); border-radius: 12px;',
  },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '35', containLabel: true },
  xAxis: {
    type: 'category',
    data: calendarDates.value,
    axisLabel: { color: '#c2d2ff', fontSize: 11, rotate: calendarDates.value.length > 20 ? 30 : 0 },
    axisLine: { lineStyle: { color: '#423b80' } },
    axisTick: { alignWithLabel: true },
  },
  yAxis: {
    type: 'value',
    name: '比赛场次',
    nameTextStyle: { color: '#c2d2ff', fontSize: 11 },
    axisLabel: { color: '#c2d2ff' },
    splitLine: { lineStyle: { color: '#201e4a' } },
    axisLine: { lineStyle: { color: '#423b80' } },
  },
  series: [{
    type: 'bar',
    data: getDailyMatchCount.value,
    itemStyle: {
      borderRadius: 0,
      color: 'rgba(110, 80, 255, 0.85)',
      borderColor: '#7c5dff',
      borderWidth: 1,
      shadowColor: 'rgba(110, 80, 255, 0.25)',
      shadowBlur: 12
    },
    barWidth: '45%',
    label: {
      show: true,
      position: 'top',
      color: '#c2d2ff',
      fontSize: 10
    }
  }]
}))

const filteredMatches = computed(() => {
  if (activeGroup.value === '全部') return matches.value
  if (activeGroup.value === '淘汰赛') return matches.value.filter(m => knockoutStages.includes(m.stage))
  return matches.value.filter(m => m.group === activeGroup.value)
})

const todayMatches = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return filteredMatches.value.filter(m => m.rawDate === today)
})

// ============ 今日比赛状态（随时间实时更新）============
// 当前时间 ref，每分钟自动刷新，驱动状态变化
const currentTime = ref(new Date())

// 显示当前时间标签
const currentTimeLabel = computed(() => {
  const t = currentTime.value || new Date()
  const hh = t.getHours().toString().padStart(2, '0')
  const mm = t.getMinutes().toString().padStart(2, '0')
  return `${hh}:${mm} 更新`
})

// 解析比赛开始时间（用 rawDate + time 字段）
const parseMatchDateTime = (match) => {
  if (!match.rawDate || !match.time) return null
  const timeMatch = match.time.match(/(\d{1,2}):(\d{2})/)
  if (!timeMatch) return null
  const date = new Date(match.rawDate + 'T00:00:00')
  date.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0)
  return date
}

const statusLabel = (status) => {
  const map = { upcoming: '未开始', live: '正在进行', finished: '已结束' }
  return map[status] || '未开始'
}

// 今日比赛 + 状态（未开始 / 正在进行 / 已结束）
const todayMatchesWithStatus = computed(() => {
  const now = currentTime.value || new Date()
  const MATCH_DURATION = 2 * 60 * 60 * 1000 // 比赛时长 2 小时
  const list = todayMatches.value.map(m => {
    const matchDate = parseMatchDateTime(m)
    let status = 'upcoming'
    if (matchDate) {
      const diff = matchDate.getTime() - now.getTime()
      if (diff <= 0 && Math.abs(diff) < MATCH_DURATION) {
        status = 'live'
      } else if (diff <= -MATCH_DURATION) {
        status = 'finished'
      } else {
        status = 'upcoming'
      }
    }
    return { ...m, status }
  })
  // 排序：正在进行 → 未开始 → 已结束
  const order = { live: 0, upcoming: 1, finished: 2 }
  return list.sort((a, b) => order[a.status] - order[b.status])
})
// ======================================================


// nextMatch 已移除 —— 下一场亮点板块已删除

const groupLogMatches = computed(() => {
  const list = filteredMatches.value.slice().sort((a, b) => {
    const da = a.rawDate || ''
    const db = b.rawDate || ''
    if (da !== db) return da.localeCompare(db)
    const ta = a.time || ''
    const tb = b.time || ''
    return ta.localeCompare(tb)
  })
  return list
})

const formatScore = (m) => {
  if (m.hasScore) return `${m.actualHomeScore} - ${m.actualAwayScore}`
  return '-'
}

let autoRefreshInterval = null
let clockInterval = null

onMounted(() => {
  loadCSVData()
  loadNewsFromAPI()

  // 每 30 秒刷新当前时间，驱动今日比赛状态实时更新
  clockInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 30000)

  autoRefreshInterval = setInterval(() => {
    const silentRefresh = async () => {
      try {
        const response = await fetch(`./worldcup.csv?t=${Date.now()}`)
        if (response.ok) {
          const csvText = await response.text()
          const parsedData = parseCSVData(csvText)
          if (parsedData.length > 0 && JSON.stringify(parsedData) !== JSON.stringify(matches.value)) {
            matches.value = parsedData
            console.log('🔄 检测到 CSV 文件更新，已自动同步')
          }
        }
      } catch (e) {
        // 静默失败
      }
    }
    silentRefresh()
  }, 60000)
})

onBeforeUnmount(() => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
  }
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style scoped>
.tab-schedule {
  padding-top: 8px;
}

/* 英雄横幅 */
.hero-banner {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/images/shijiebei.jpg') center/cover no-repeat;
  border-radius: 24px;
  margin-bottom: 24px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.trophy-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
  background: transparent;
  animation: bounce 2s ease-in-out infinite;
}

.tournament-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.fifa-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #FBBF24, #FFD966);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 8px 0 4px;
  letter-spacing: 1px;
}

.host-nations {
  font-size: 1rem;
  color: #cbd5e1;
  margin: 8px 0;
  font-weight: 500;
}

.date-range {
  font-size: 0.85rem;
  color: #E8ECF1;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  margin: 8px 0;
}

.slogan {
  font-size: 0.8rem;
  color: #22D3EE;
  letter-spacing: 1px;
  margin-top: 8px;
}

/* 头部筛选区 */
.schedule-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.schedule-filters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  font-size: 13px;
  font-weight: 600;
  color: #8892A6;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #22D3EE;
  color: #22D3EE;
}

.filter-btn.active {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A;
  border-color: transparent;
  box-shadow: 0 2px 12px rgba(34,211,238,0.25);
}

.refresh-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(34,211,238,0.3);
  background: rgba(34,211,238,0.1);
  font-size: 13px;
  font-weight: 600;
  color: #22D3EE;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(34,211,238,0.2);
  border-color: #22D3EE;
}

.data-status {
  font-size: 12px;
  color: #5A6478;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.data-status.data-loaded {
  color: #22D3EE;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #E8ECF1;
  margin: 0 0 4px;
}

/* 赛程卡片表格 */
.fixture-card {
  background: linear-gradient(180deg, rgba(15, 22, 43, 0.95), rgba(8, 12, 22, 0.98));
  border: 1px solid rgba(34, 211, 238, 0.16);
  border-radius: 20px;
  overflow: hidden;
}

.schedule-log {
  background: rgba(10, 18, 36, 0.95);
  border: 1px solid rgba(34, 211, 238, 0.12);
  border-radius: 20px;
  padding: 20px 24px;
  margin-bottom: 20px;
}

.schedule-log-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.schedule-log-subtitle {
  margin: 6px 0 0;
  color: #8B99B8;
  font-size: 0.85rem;
}

.schedule-log-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 211, 238, 0.1);
  color: #22D3EE;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 700;
}

.log-table-wrapper {
  overflow-x: auto;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 16px;
  overflow: hidden;
}

.log-table thead th {
  padding: 14px 18px;
  background: rgba(34, 211, 238, 0.08);
  color: #CFFAFE;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.18);
}

.log-table tbody tr {
  transition: background 0.2s ease;
}

.log-table tbody tr:hover {
  background: rgba(34, 211, 238, 0.05);
}

.log-table td {
  padding: 14px 18px;
  color: #E8ECF1;
  font-size: 0.88rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.fixture-team-name {
  color: #E8ECF1;
  font-weight: 600;
}

.fixture-time {
  color: #7B8BB4;
}

.log-table td .score-value {
  margin-left: 0;
}

.fixture-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 16px;
}

.fixture-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #E8ECF1;
  margin: 0 0 4px;
}

.fixture-subtitle {
  font-size: 0.85rem;
  color: #8B99B8;
  margin: 0;
}

.fixture-stats {
  display: flex;
  gap: 12px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 0.85rem;
  color: #9CA3AF;
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.stat-icon {
  font-size: 1rem;
}

/* 表格样式 */
.fixture-table-wrapper {
  overflow-x: auto;
}

.fixture-table {
  width: 100%;
  border-collapse: collapse;
}

.fixture-table thead th {
  text-align: left;
  padding: 14px 20px;
  background: rgba(34, 211, 238, 0.05);
  color: #22D3EE;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(34, 211, 238, 0.2);
}

.fixture-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.fixture-row:hover {
  background: rgba(34, 211, 238, 0.04);
}

.fixture-row td {
  padding: 16px 20px;
  color: #E8ECF1;
  font-size: 0.9rem;
}

/* 日期列 */
.fixture-date {
  min-width: 100px;
}

.date-primary {
  font-weight: 600;
  color: #FBBF24;
}

.time-secondary {
  font-size: 0.75rem;
  color: #7B8BB4;
  margin-top: 4px;
}

/* 对阵列 */
.fixture-teams {
  min-width: 240px;
}

.team-cell {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.team {
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-team-cell {
  justify-content: flex-end;
}

.team-vs {
  font-size: 0.95rem;
  font-weight: 700;
  color: #FBBF24;
  background: rgba(251, 191, 36, 0.18);
  padding: 4px 10px;
  border-radius: 14px;
}

.team-name {
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
}

/* 比分列 */
.fixture-score {
  text-align: left;
  min-width: 70px;
}

.score-value {
  font-weight: 700;
  font-size: 1rem;
  color: #9CA3AF;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  margin-left: 0;
}

.score-value.has-score {
  color: #22D3EE;
  background: rgba(34, 211, 238, 0.1);
}

/* 场地列 */
.fixture-venue {
  min-width: 160px;
  font-size: 0.75rem;
  color: #9CA3AF;
}

.venue-icon {
  display: none;
}

/* 阶段列 */
.fixture-stage {
  min-width: 120px;
}

.stage-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
}

.stage-group {
  background: rgba(96, 165, 250, 0.15);
  color: #60A5FA;
}

.stage-knockout {
  background: rgba(139, 92, 246, 0.15);
  color: #A78BFA;
}

.stage-semi {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.stage-final {
  background: linear-gradient(135deg, #FBBF24, #FFD966);
  color: #0B0F1A;
}

.stage-third {
  background: rgba(205, 158, 100, 0.18);
  color: #CD9E64;
}

.stage-opener {
  background: rgba(34, 211, 238, 0.2);
  color: #22D3EE;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.page-btn {
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  background: rgba(34, 211, 238, 0.1);
  color: #22D3EE;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.page-btn:hover:not(:disabled) {
  background: rgba(34, 211, 238, 0.2);
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  color: #8B99B8;
  font-size: 0.85rem;
}

/* 右侧资讯栏 */
.schedule-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.9fr);
  grid-template-rows: 1fr;
  align-items: stretch;
  gap: 20px;
  margin-bottom: 20px;
}

.schedule-main {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
}

.today-info {
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.today-info {
  padding: 20px;
  background: linear-gradient(180deg, rgba(8, 12, 22, 0.92), rgba(15, 22, 43, 0.98));
  border: 1px solid rgba(34, 211, 238, 0.18);
  border-radius: 20px;
  height: fit-content;
}

.info-header {
  margin-bottom: 20px;
}

.info-header .flow-tip {
  margin: 6px 0 0;
  color: #7B8BB4;
  font-size: 0.8rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #60A5FA;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.label-icon {
  font-size: 1rem;
}

.today-item {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
}

.today-match {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #E8ECF1;
  font-size: 0.9rem;
}

.match-score-preview {
  margin-left: auto;
  color: #FBBF24;
  font-size: 0.85rem;
}

.today-meta {
  font-size: 0.75rem;
  color: #7B8BB4;
  margin-top: 6px;
}

/* 下一场卡片 */
.next-match-card {
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.08), rgba(34, 211, 238, 0.02));
  border: 1px solid rgba(34, 211, 238, 0.2);
  border-radius: 16px;
  padding: 16px;
}

.next-match-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.next-team {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.next-team:first-child {
  justify-content: flex-end;
}

.next-team-name {
  font-weight: 700;
  color: #E8ECF1;
}

.next-vs {
  font-size: 0.8rem;
  font-weight: 700;
  color: #FBBF24;
  background: rgba(251, 191, 36, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
}

.next-match-info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.7rem;
  color: #7B8BB4;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.info-empty {
  color: #7B8BB4;
  font-size: 0.85rem;
  padding: 20px;
  text-align: center;
}

/* ===== 资讯模块 ===== */
.news-block {
  padding-top: 4px;
}

.news-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.news-last-update {
  font-size: 0.68rem;
  color: #4A5468;
  margin-bottom: 10px;
  padding-left: 2px;
}

.news-refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid rgba(34, 211, 238, 0.3);
  background: rgba(34, 211, 238, 0.08);
  color: #22D3EE;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.news-refresh-btn:hover:not(:disabled) {
  background: rgba(34, 211, 238, 0.18);
  border-color: #22D3EE;
}

.news-refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.news-refresh-btn.is-loading .refresh-icon {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-item {
  display: block;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  cursor: pointer;
}

.news-item:hover {
  background: rgba(34, 211, 238, 0.06);
  border-color: rgba(34, 211, 238, 0.2);
}

.news-type-badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  margin-bottom: 5px;
  background: rgba(96, 165, 250, 0.15);
  color: #60A5FA;
}

.type-视频 {
  background: rgba(139, 92, 246, 0.18);
  color: #A78BFA;
}

.type-图集 {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.news-title {
  font-size: 0.82rem;
  color: #D1D9EC;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.7rem;
  color: #5A6478;
  margin-top: 5px;
}

.news-duration {
  color: #A78BFA;
}

/* ===== 今日比赛状态 ===== */
.live-clock {
  margin-left: auto;
  font-size: 0.68rem;
  color: #4A5468;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

.today-status {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.live {
  background: #EF4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
  animation: pulse-dot 1.2s ease-in-out infinite;
}

.status-dot.upcoming {
  background: #60A5FA;
}

.status-dot.finished {
  background: #6B7280;
}

.status-text {
  font-size: 0.7rem;
  font-weight: 600;
}

.status-text.live {
  color: #EF4444;
}

.status-text.upcoming {
  color: #60A5FA;
}

.status-text.finished {
  color: #6B7280;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}

/* ===== 淘汰赛对阵图 Bracket（统一 Grid 布局） ===== */
.bracket-section {
  background: linear-gradient(180deg, rgba(15, 22, 43, 0.95), rgba(8, 12, 22, 0.98));
  border: 1px solid rgba(34, 211, 238, 0.14);
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 20px;
  overflow: visible;
}

.bracket-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 10px;
}

.bracket-subtitle {
  margin: 4px 0 0;
  color: #8B99B8;
  font-size: 0.78rem;
}

.bracket-match-count {
  display: inline-flex;
  align-items: center;
  background: rgba(251, 191, 36, 0.1);
  color: #FBBF24;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 700;
}

.bracket-container {
  overflow-x: auto;
  overflow-y: visible;
  padding-bottom: 6px;
}

.bracket-scroll {
  min-width: max-content;
}

/* 统一 CSS Grid：所有轮次、连线共享行列定义 */
.bracket-grid {
  display: grid;
  column-gap: 0;
  row-gap: 0;
}

/* 轮次标签 */
.bracket-col-label {
  text-align: center;
  padding: 6px 4px 10px;
  border-bottom: 2px solid rgba(34, 211, 238, 0.18);
}

.round-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #CFFAFE;
}

.round-count {
  display: inline-block;
  margin-left: 6px;
  font-size: 0.68rem;
  color: #7B8BB4;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

/* 连线容器 */
.bracket-conn {
  position: relative;
  height: 100%;
}

/* 连线：上方水平线 */
.conn-top {
  position: absolute;
  top: 25%;
  left: 0;
  width: 55%;
  height: 0;
  border-top: 2px solid rgba(34, 211, 238, 0.35);
}

/* 连线：下方水平线 */
.conn-bot {
  position: absolute;
  top: 75%;
  left: 0;
  width: 55%;
  height: 0;
  border-top: 2px solid rgba(34, 211, 238, 0.35);
}

/* 连线：垂直线 */
.conn-vert {
  position: absolute;
  top: 25%;
  left: 55%;
  height: 50%;
  width: 0;
  border-left: 2px solid rgba(34, 211, 238, 0.35);
}

/* 连线：中点出口水平线 */
.conn-exit {
  position: absolute;
  top: 50%;
  left: 55%;
  width: 45%;
  height: 0;
  border-top: 2px solid rgba(34, 211, 238, 0.35);
}

/* ===== 分叉连线：半决赛→决赛(胜)/季军赛(败) ===== */
.bracket-conn-split .conn-exit {
  display: none;
}

.bracket-conn-split .conn-exit-up {
  position: absolute;
  top: 25%;
  left: 55%;
  width: 45%;
  height: 0;
  border-top: 2px solid rgba(251, 191, 36, 0.45);
}

.bracket-conn-split .conn-exit-down {
  position: absolute;
  top: 75%;
  left: 55%;
  width: 45%;
  height: 0;
  border-top: 2px solid rgba(205, 158, 100, 0.35);
}

/* 分叉连线标签 */
.conn-label {
  position: absolute;
  right: -2px;
  top: -8px;
  font-size: 0.55rem;
  font-weight: 700;
  line-height: 1;
  padding: 1px 3px;
  border-radius: 3px;
}

.conn-label-winner {
  color: #FBBF24;
  background: rgba(251, 191, 36, 0.15);
}

.conn-label-loser {
  color: #CD9E64;
  background: rgba(205, 158, 100, 0.12);
}

/* 决赛/季军赛双标签 */
.bracket-label-dual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.round-name-third {
  color: #CD9E64;
}

.round-name-divider {
  color: #5A6478;
  font-size: 0.7rem;
}

/* 比赛卡片 */
.bracket-match {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 6px 8px;
  transition: all 0.2s ease;
  position: relative;
  align-self: center;
  justify-self: stretch;
  margin: 2px 4px;
}

.bracket-match:hover {
  background: rgba(34, 211, 238, 0.06);
  border-color: rgba(34, 211, 238, 0.2);
  transform: scale(1.03);
}

.bracket-match-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.bracket-team {
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.home-team { justify-content: flex-end; }
.away-team { justify-content: flex-start; }

.bracket-team-flag {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.bracket-team-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #E8ECF1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70px;
}

.bracket-vs {
  font-size: 0.6rem;
  font-weight: 700;
  color: #FBBF24;
  background: rgba(251, 191, 36, 0.12);
  padding: 2px 6px;
  border-radius: 8px;
  flex-shrink: 0;
}

.bracket-match-meta {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
}

.bracket-date {
  font-size: 0.65rem;
  font-weight: 600;
  color: #FBBF24;
}

.bracket-time {
  font-size: 0.65rem;
  color: #7B8BB4;
}

.bracket-match-venue {
  font-size: 0.6rem;
  color: #5A6478;
  text-align: center;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 决赛卡片（上半区，金色高亮） */
.bracket-match-final {
  border-color: rgba(251, 191, 36, 0.2);
  background: rgba(251, 191, 36, 0.04);
}

.bracket-match-final:hover {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.35);
}

/* 季军赛卡片（下半区，铜色高亮） */
.bracket-match-third {
  border-color: rgba(205, 158, 100, 0.2);
  background: rgba(205, 158, 100, 0.04);
}

.bracket-match-third:hover {
  background: rgba(205, 158, 100, 0.1);
  border-color: rgba(205, 158, 100, 0.35);
}

/* 季军赛卡片内轮次标签 */
.bracket-match-round-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #CD9E64;
  text-align: center;
  margin-bottom: 3px;
}

/* ======================= */

/* 响应式 */
@media (max-width: 1000px) {
  .schedule-panel {
    grid-template-columns: 1fr;
  }
  
  .fixture-table thead th,
  .fixture-row td {
    padding: 12px 16px;
  }
  
  .team-cell {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .fixture-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .fixture-table thead th:nth-child(4),
  .fixture-row td:nth-child(4) {
    display: none;
  }
  
  .fifa-title {
    font-size: 1.3rem;
  }
  
  .host-nations {
    font-size: 0.8rem;
  }
  
  .schedule-filters {
    order: 1;
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }
}
</style>