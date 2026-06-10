<template>
  <div class="tab-overview">

    <!-- ===== 顶部双栏：Hero + 快捷入口 ===== -->
    <div class="top-grid">
      <!-- Hero 左侧 -->
      <div class="hero-block anim-fadeInUp">
        <div class="hero-bg-glow"></div>
        <!-- 右侧图片 -->
        <div class="hero-img-wrap">
          <img src="/images/hero-bg.jpg" alt="2026 FIFA World Cup" class="hero-inner-img" />
        </div>
        <!-- 图片左侧频谱条装饰 -->
        <div class="spectrum-decor">
          <span class="sp-bar" style="height: 18%"></span>
          <span class="sp-bar" style="height: 42%"></span>
          <span class="sp-bar" style="height: 65%"></span>
          <span class="sp-bar" style="height: 35%"></span>
          <span class="sp-bar" style="height: 82%"></span>
          <span class="sp-bar" style="height: 55%"></span>
          <span class="sp-bar" style="height: 72%"></span>
          <span class="sp-bar" style="height: 28%"></span>
          <span class="sp-bar" style="height: 60%"></span>
          <span class="sp-bar" style="height: 45%"></span>
          <span class="sp-bar" style="height: 78%"></span>
          <span class="sp-bar" style="height: 38%"></span>
        </div>
        <!-- 中间浮动标签 -->
        <div class="mid-float-badges">
          <span class="mfb-item">🏆 史上首届48强</span>
          <span class="mfb-item">🌎 跨三大洲</span>
          <span class="mfb-item">⚽ 全新赛制</span>
        </div>
        <!-- 左下角足球轮廓 -->
        <svg class="ball-outline" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="56" stroke="rgba(34,211,238,0.12)" stroke-width="1.5"/>
          <path d="M60 4 L60 116 M4 60 L116 60" stroke="rgba(34,211,238,0.08)" stroke-width="1"/>
          <circle cx="60" cy="60" r="20" stroke="rgba(34,211,238,0.10)" stroke-width="1"/>
          <circle cx="60" cy="60" r="8" fill="rgba(34,211,238,0.06)"/>
          <polygon points="60,25 72,45 60,38 48,45" stroke="rgba(34,211,238,0.10)" stroke-width="0.8" fill="none"/>
        </svg>
        <!-- 底部扫描线 -->
        <div class="hero-scanline"></div>
        <div class="hero-eyebrow">
          <span class="live-dot"></span>
          <span class="live-text">LIVE · 距开幕</span>
        </div>
        <h1 class="hero-title">2026 <span class="title-accent">FIFA</span> World Cup</h1>
        <p class="hero-sub">美国 · 加拿大 · 墨西哥 | 48强 · 104场</p>
        <div class="countdown-row">
          <div v-for="item in countdown" :key="item.label" class="cd-block" :class="{ changed: item.changed }">
            <span class="cd-num">{{ item.value }}</span>
            <span class="cd-lbl">{{ item.label }}</span>
          </div>
        </div>
        <!-- 小数据条 -->
        <div class="mini-stats-row">
          <div class="mini-stat">
            <span class="ms-val cyan">48</span>
            <span class="ms-lbl">参赛队</span>
          </div>
          <div class="ms-divider"></div>
          <div class="mini-stat">
            <span class="ms-val gold">104</span>
            <span class="ms-lbl">场次</span>
          </div>
          <div class="ms-divider"></div>
          <div class="mini-stat">
            <span class="ms-val rose">16</span>
            <span class="ms-lbl">城市</span>
          </div>
          <div class="ms-divider"></div>
          <div class="mini-stat">
            <span class="ms-val green">6</span>
            <span class="ms-lbl">大洲</span>
          </div>
        </div>
        <!-- 音乐播放器 -->
        <div class="music-player">
          <audio ref="audioEl" src="/audio/M5000037Os1f1NXVmJ.mp3" loop preload="auto"></audio>
          <button class="music-btn" :class="{ playing: isPlaying }" @click="toggleMusic" title="播放/暂停">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            <span class="music-label">{{ isPlaying ? '心墙' : '播放主题曲' }}</span>
            <div v-if="isPlaying" class="music-bars">
              <span class="mb"></span><span class="mb"></span><span class="mb"></span><span class="mb"></span>
            </div>
          </button>
        </div>
        <!-- 大力神杯背景装饰 -->
        <div class="trophy-bg-decor">
          <img src="/images/trophy.png" alt="" class="trophy-bg-img" />
          <div class="trophy-bg-glow"></div>
        </div>
      </div>

      <!-- 右侧：快捷入口 2×2 -->
      <div class="entry-grid anim-fadeInUp delay-2">
        <div v-for="(item, i) in entries" :key="item.label"
          class="entry-card" :style="{ '--ec-color': item.color, '--ec-glow': item.glow }"
          :class="`delay-${i+2}`"
          @click="emit('navigate', item.target)">
          <!-- 背景图 -->
          <div class="ec-bg-img" :style="{ backgroundImage: `url(${item.image})` }"></div>
          <!-- 四角装饰 -->
          <span class="corner c-tl"></span>
          <span class="corner c-tr"></span>
          <span class="corner c-bl"></span>
          <span class="corner c-br"></span>
          <!-- 内框线 -->
          <div class="ec-inner-border"></div>
          <!-- 顶部发光线 -->
          <div class="ec-top-glow"></div>
          <div class="ec-inner">
            <div class="ec-icon-wrap">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path :d="item.path" /></svg>
            </div>
            <div class="ec-info">
              <span class="ec-label">{{ item.label }}</span>
              <span class="ec-desc">{{ item.desc }}</span>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--ec-color)" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 战报滚动条 ===== -->
    <div class="ticker-bar anim-fadeInUp delay-2">
      <span class="ticker-tag">⚡ 最新战报</span>
      <div class="ticker-track-wrap">
        <div class="ticker-track">
          <span v-for="(t, i) in tickerItems" :key="i" class="ticker-item">
            <FlagTag :code="t.h" small />
            <span class="ticker-score">{{ t.sh }} <em>:</em> {{ t.sa }}</span>
            <FlagTag :code="t.a" small />
            <span class="ticker-sep">·</span>
          </span>
          <!-- 重复一遍实现无缝滚动 -->
          <span v-for="(t, i) in tickerItems" :key="'dup'+i" class="ticker-item">
            <FlagTag :code="t.h" small />
            <span class="ticker-score">{{ t.sh }} <em>:</em> {{ t.sa }}</span>
            <FlagTag :code="t.a" small />
            <span class="ticker-sep">·</span>
          </span>
        </div>
      </div>
    </div>

    <!-- ===== 轮播 Banner ===== -->
    <PeekCarousel />

    <!-- ===== 冠军历史卡片横排 ===== -->
    <div class="section-head anim-fadeInUp delay-3">
      <h2 class="sec-title">🏆 历届冠军</h2>
      <span class="sec-badge gold">1930 – 2022</span>
    </div>
    <div class="champions-scroll anim-fadeInUp delay-3">
      <div v-for="(c, i) in allChampions" :key="c.year"
        class="champ-card" :style="{ '--cc-hue': c.hue }">
        <div class="cc-year">{{ c.year }}</div>
        <img :src="`https://flagcdn.com/48x36/${c.code}.png`"
          :alt="c.name" class="cc-flag"
          @error="($event.target).style.display='none'" />
        <div class="cc-name">{{ c.name }}</div>
        <div class="cc-host">{{ c.host }}</div>
        <div class="cc-glow-line"></div>
      </div>
    </div>

    <!-- ===== 三列图表区：进球折线 + 洲际饼图 + 夺冠热门 ===== -->
    <div class="triple-grid anim-fadeInUp delay-4">
      <!-- 左：历届进球折线 -->
      <div class="card chart-panel">
        <div class="panel-head">
          <span class="panel-title">历届总进球趋势</span>
          <span class="panel-sub">1930–2022</span>
        </div>
        <div class="chart-wrap">
          <v-chart :option="goalsOpt" autoresize />
        </div>
      </div>

      <!-- 中：洲际配额饼图 -->
      <div class="card chart-panel">
        <div class="panel-head">
          <span class="panel-title">洲际参赛名额</span>
          <span class="panel-sub">2026 分配方案</span>
        </div>
        <div class="chart-wrap">
          <v-chart :option="quotaOpt" autoresize />
        </div>
      </div>

      <!-- 右：夺冠热门预测 -->
      <div class="card hot-panel">
        <div class="panel-head">
          <span class="panel-title">🔥 夺冠热门</span>
          <span class="panel-sub">预测胜率</span>
        </div>
        <div class="hot-list">
          <div v-for="(h, i) in hotTeams" :key="h.name" class="hot-row" :class="{ 'top1': i === 0 }">
            <span class="hot-rank" :class="['hr1','hr2','hr3'][i] || 'hrn'">{{ i + 1 }}</span>
            <img :src="`https://flagcdn.com/32x24/${h.code}.png`" class="hot-flag" :alt="h.name"
              @error="($event.target).style.display='none'" />
            <span class="hot-name">{{ h.name }}</span>
            <div class="hot-bar-wrap">
              <div class="hot-bar" :style="{ width: h.pct + '%', background: hotBarBg(i) }"></div>
            </div>
            <span class="hot-pct" :class="{ 'gold-text': i === 0 }">{{ h.pct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 双栏：冠军榜 + 焦点对决 ===== -->
    <div class="dual-grid anim-fadeInUp delay-5">
      <!-- 左：冠军旭日图 -->
      <div class="card chart-panel">
        <div class="panel-head">
          <span class="panel-title">🏆 冠军版图</span>
          <span class="panel-sub">1930–2022</span>
        </div>
        <div class="chart-wrap">
          <v-chart :option="sunburstOpt" autoresize />
        </div>
      </div>

      <!-- 右：焦点对决 -->
      <div class="card matches-panel">
        <div class="panel-head">
          <span class="panel-title">⚡ 焦点对决</span>
          <span class="sec-badge red">即将开始</span>
        </div>
        <div class="match-cards timeline">
          <div v-for="(m, i) in hotMatches" :key="i" class="timeline-item" :class="`delay-${i+6}`">
            <div class="tl-dot"></div>
            <div class="tl-line" v-if="i < hotMatches.length - 1"></div>
            <div class="match-card-item">
              <div class="mci-header">
                <span class="mci-tag">{{ m.tag }}</span>
                <span class="mci-group">{{ m.group }}</span>
                <span class="mci-date">{{ m.date }}</span>
              </div>
              <div class="mci-body">
                <div class="mci-team">
                  <img :src="`https://flagcdn.com/32x24/${m.home.code}.png`" class="mci-flag" :alt="m.home.name"
                    @error="($event.target).style.display='none'" />
                  <span class="mci-name">{{ m.home.name }}</span>
                </div>
                <div class="mci-vs">
                  <span class="vs-label">VS</span>
                </div>
                <div class="mci-team right">
                  <span class="mci-name">{{ m.away.name }}</span>
                  <img :src="`https://flagcdn.com/32x24/${m.away.code}.png`" class="mci-flag" :alt="m.away.name"
                    @error="($event.target).style.display='none'" />
                </div>
              </div>
              <div class="mci-venue">📍 {{ m.venue }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 进球王名人堂 ===== -->
    <div class="section-head anim-fadeInUp delay-6">
      <h2 class="sec-title">⚽ 世界杯进球王名人堂</h2>
      <span class="sec-badge gold">历史 TOP 射手</span>
    </div>
    <div class="legends-scroll anim-fadeInUp delay-6">
      <div v-for="(p, i) in legends" :key="p.name" class="legend-card" :style="{ '--lg-hue': p.hue }">
        <div class="lg-rank">{{ i + 1 }}</div>
        <div class="lg-body">
          <div class="lg-top-row">
            <img :src="`https://flagcdn.com/32x24/${p.code}.png`" class="lg-flag" :alt="p.country"
              @error="($event.target).style.display='none'" />
            <span class="lg-name">{{ p.name }}</span>
          </div>
          <div class="lg-stats">
            <span class="lg-goals">{{ p.goals }} <small>球</small></span>
            <span class="lg-wc">{{ p.worldCups }}届</span>
            <span class="lg-best">{{ p.bestResult }}</span>
          </div>
        </div>
        <div class="lg-bar-wrap">
          <div class="lg-bar" :style="{ width: (p.goals / legends[0].goals * 100) + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- ===== 互动小游戏：点球大战 ===== -->
    <div class="section-head anim-fadeInUp delay-6 penalty-section-head">
      <h2 class="sec-title">🎮 互动体验区</h2>
      <span class="sec-badge cyan">点球大战小游戏</span>
    </div>
    <div class="penalty-game anim-fadeInUp delay-6">
      <div class="game-header">
        <div>
          <div class="game-label">Football Mini Game</div>
          <h2>世界杯点球大战 <span class="keeper-version">人形守门员版</span></h2>
          <p>点击球门左、中、右区域完成射门，5 次机会挑战高分</p>
        </div>

        <div class="game-score-board">
          <div class="gs-item">
            <span>{{ gameScore }}</span>
            <p>进球</p>
          </div>
          <div class="gs-item">
            <span>{{ gameShots }}</span>
            <p>射门</p>
          </div>
          <div class="gs-item">
            <span>{{ leftPenaltyShots }}</span>
            <p>剩余</p>
          </div>
        </div>
      </div>

      <div class="game-stage">
        <div class="game-stadium-glow glow-left"></div>
        <div class="game-stadium-glow glow-right"></div>
        <div class="game-sky-grid"></div>

        <div class="goal-click-area" @click="shootPenalty">
          <div class="penalty-goal" :class="{ shaking: netShaking }">
            <div class="goal-depth"></div>
            <div class="goal-net"></div>
            <div class="goal-line-light"></div>

            <div class="target-zone zone-left"></div>
            <div class="target-zone zone-center"></div>
            <div class="target-zone zone-right"></div>

            <div class="keeper-human" :class="keeperClass">
              <div class="keeper-head">
                <span class="keeper-hair"></span>
                <span class="keeper-eye eye-left"></span>
                <span class="keeper-eye eye-right"></span>
              </div>
              <div class="keeper-body">
                <span class="keeper-number">1</span>
              </div>
              <div class="keeper-arm keeper-arm-left"></div>
              <div class="keeper-arm keeper-arm-right"></div>
              <div class="keeper-leg keeper-leg-left"></div>
              <div class="keeper-leg keeper-leg-right"></div>
            </div>

            <div v-if="showGoalText" class="goal-result goal-success">GOAL!</div>
            <div v-if="showSaveText" class="goal-result goal-save">SAVED!</div>
          </div>
        </div>

        <div class="ball-shadow" :class="ballClass"></div>
        <div class="game-football" :class="ballClass">
          <div class="ball-core">
            <span class="ball-patch patch-1"></span>
            <span class="ball-patch patch-2"></span>
            <span class="ball-patch patch-3"></span>
            <span class="ball-patch patch-4"></span>
            <span class="ball-patch patch-5"></span>
            <span class="ball-seam seam-1"></span>
            <span class="ball-seam seam-2"></span>
            <span class="ball-seam seam-3"></span>
          </div>
        </div>

        <div v-if="!gameStarted" class="game-start-panel">
          <div class="start-cup">🏆</div>
          <h3>准备挑战点球大战</h3>
          <p>选择射门方向，避开守门员扑救</p>
          <button @click.stop="startPenaltyGame">开始游戏</button>
        </div>

        <div v-else-if="!gameShooting && !gameOver" class="target-hint">
          点击球门区域射门
        </div>

        <div v-if="gameOver" class="game-over-panel">
          <div class="game-over-card">
            <div class="game-over-title">比赛结束</div>
            <p>你一共打进了 <strong>{{ gameScore }}</strong> 球</p>
            <button @click.stop="restartPenaltyGame">再来一局</button>
          </div>
        </div>
      </div>

      <div class="game-control-bar">
        <button v-if="gameStarted" @click="restartPenaltyGame">重新开始</button>
        <span>规则：射门方向和守门员方向不同即为进球</span>
      </div>
    </div>


    <!-- AI解说员 -->
    <AICommentator />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AICommentator from '../components/AICommentator.vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, SunburstChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import FlagTag from '../components/FlagTag.vue'
import PeekCarousel from '../components/PeekCarousel.vue'

use([CanvasRenderer, BarChart, LineChart, PieChart, SunburstChart, GridComponent, TooltipComponent, LegendComponent])

const emit = defineEmits(['navigate'])

// ——— 音乐播放器 ———
const audioEl = ref(null)
const isPlaying = ref(false)
function toggleMusic() {
  if (!audioEl.value) return
  if (isPlaying.value) {
    audioEl.value.pause()
    isPlaying.value = false
  } else {
    audioEl.value.play().then(() => { isPlaying.value = true }).catch(() => {})
  }
}

// ——— 倒计时 ———
const countdown = ref([
  { label: '天', value: '00', changed: false },
  { label: '时', value: '00', changed: false },
  { label: '分', value: '00', changed: false },
  { label: '秒', value: '00', changed: false },
])
let cdTimer = null
function updateCd() {
  const target = new Date('2026-06-12T20:00:00')
  const now = new Date()
  const diff = target - now
  const src = diff > 0 ? diff : Math.abs(diff)
  const d = Math.floor(src / 86400000)
  const h = Math.floor((src % 86400000) / 3600000)
  const m = Math.floor((src % 3600000) / 60000)
  const s = Math.floor((src % 60000) / 1000)
  const vals = [d, h, m, s].map(v => String(v).padStart(2, '0'))
  countdown.value.forEach((item, i) => {
    if (item.value !== vals[i]) {
      item.value = vals[i]; item.changed = true
      setTimeout(() => item.changed = false, 300)
    }
  })
}
onMounted(() => { updateCd(); cdTimer = setInterval(updateCd, 1000) })
onUnmounted(() => { clearInterval(cdTimer); if (audioEl.value) audioEl.value.pause() })

// ——— 战报滚动条 ———
const tickerItems = [
  { h: 'ar', a: 'fr', sh: 3, sa: 1 },
  { h: 'br', a: 'de', sh: 2, sa: 0 },
  { h: 'es', a: 'pt', sh: 1, sa: 1 },
  { h: 'us', a: 'mx', sh: 2, sa: 2 },
  { h: 'gb-eng', a: 'nl', sh: 3, sa: 0 },
  { h: 'it', a: 'hr', sh: 1, sa: 2 },
  { h: 'jp', a: 'kr', sh: 0, sa: 1 },
  { h: 'ma', a: 'sn', sh: 2, sa: 1 },
]

// ——— 快捷入口 ———
const entries = [
  { label: '赛程', desc: '104场完整赛程', target: 'schedule', color: '#22D3EE', glow: 'rgba(34,211,238,0.25)',
    image: '/images/entry-schedule.png',
    path: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  { label: '积分榜', desc: '12组实时积分', target: 'standings', color: '#FBBF24', glow: 'rgba(251,191,36,0.25)',
    image: '/images/entry-standings.png',
    path: 'M6 20h4v-8H6v8zm8-12h4v12h-4V8zM2 14h4v6H2v-6zm16-6h4v12h-4V8z' },
  { label: '射手榜', desc: '历史神射手', target: 'players', color: '#F43F5E', glow: 'rgba(244,63,94,0.25)',
    image: '/images/entry-players.png',
    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { label: '历史', desc: '世界杯历史长廊', target: 'history', color: '#34D399', glow: 'rgba(52,211,153,0.25)',
    image: '/images/entry-history.png',
    path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
]

// ——— 历届冠军 ———
const allChampions = [
  { year:'2022', code:'ar', name:'阿根廷', host:'卡塔尔', hue: 45 },
  { year:'2018', code:'fr', name:'法国', host:'俄罗斯', hue: 210 },
  { year:'2014', code:'de', name:'德国', host:'巴西', hue: 30 },
  { year:'2010', code:'es', name:'西班牙', host:'南非', hue: 0 },
  { year:'2006', code:'it', name:'意大利', host:'德国', hue: 210 },
  { year:'2002', code:'br', name:'巴西', host:'韩日', hue: 130 },
  { year:'1998', code:'fr', name:'法国', host:'法国', hue: 220 },
  { year:'1994', code:'br', name:'巴西', host:'美国', hue: 130 },
  { year:'1990', code:'de', name:'德国', host:'意大利', hue: 30 },
  { year:'1986', code:'ar', name:'阿根廷', host:'墨西哥', hue: 45 },
  { year:'1982', code:'it', name:'意大利', host:'西班牙', hue: 0 },
  { year:'1978', code:'ar', name:'阿根廷', host:'阿根廷', hue: 185 },
]

// ——— 夺冠热门 ———
const hotTeams = [
  { name: '巴西', code: 'br', pct: 22 },
  { name: '法国', code: 'fr', pct: 18 },
  { name: '阿根廷', code: 'ar', pct: 15 },
  { name: '英格兰', code: 'gb-eng', pct: 12 },
  { name: '德国', code: 'de', pct: 10 },
  { name: '西班牙', code: 'es', pct: 9 },
  { name: '葡萄牙', code: 'pt', pct: 6 },
  { name: '荷兰', code: 'nl', pct: 5 },
]
function hotBarBg(i) {
  if (i === 0) return 'linear-gradient(90deg, #FBBF24, #F59E0B)'
  if (i === 1) return 'linear-gradient(90deg, #94A3B8, #64748B)'
  if (i === 2) return 'linear-gradient(90deg, #CD7F32, #A05C1C)'
  return 'linear-gradient(90deg, #22D3EE, #0891B2)'
}

// ——— 冠军旭日图 ———
const sunburstOpt = ref({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(20,27,45,0.95)', borderColor: 'rgba(255,255,255,0.08)', textStyle: { color: '#E8ECF1' }, formatter: '{b}' },
  series: [{
    type: 'sunburst',
    radius: [0, '95%'],
    center: ['50%', '50%'],
    sort: null,
    emphasis: { focus: 'ancestor' },
    data: [
      { name: '巴西', itemStyle: { color: '#22D3EE' }, children: [
        { name: '2002', value: 1, itemStyle: { color: '#22D3EE' } },
        { name: '1994', value: 1, itemStyle: { color: '#22D3EE' } },
        { name: '1970', value: 1, itemStyle: { color: '#22D3EE' } },
        { name: '1962', value: 1, itemStyle: { color: '#22D3EE' } },
        { name: '1958', value: 1, itemStyle: { color: '#22D3EE' } },
      ]},
      { name: '德国', itemStyle: { color: '#FBBF24' }, children: [
        { name: '2014', value: 1, itemStyle: { color: '#FBBF24' } },
        { name: '1990', value: 1, itemStyle: { color: '#FBBF24' } },
        { name: '1974', value: 1, itemStyle: { color: '#FBBF24' } },
        { name: '1954', value: 1, itemStyle: { color: '#FBBF24' } },
      ]},
      { name: '意大利', itemStyle: { color: '#F43F5E' }, children: [
        { name: '2006', value: 1, itemStyle: { color: '#F43F5E' } },
        { name: '1982', value: 1, itemStyle: { color: '#F43F5E' } },
        { name: '1938', value: 1, itemStyle: { color: '#F43F5E' } },
        { name: '1934', value: 1, itemStyle: { color: '#F43F5E' } },
      ]},
      { name: '阿根廷', itemStyle: { color: '#34D399' }, children: [
        { name: '2022', value: 1, itemStyle: { color: '#34D399' } },
        { name: '1986', value: 1, itemStyle: { color: '#34D399' } },
        { name: '1978', value: 1, itemStyle: { color: '#34D399' } },
      ]},
      { name: '法国', itemStyle: { color: '#A78BFA' }, children: [
        { name: '2018', value: 1, itemStyle: { color: '#A78BFA' } },
        { name: '1998', value: 1, itemStyle: { color: '#A78BFA' } },
      ]},
      { name: '乌拉圭', itemStyle: { color: '#FB923C' }, children: [
        { name: '1950', value: 1, itemStyle: { color: '#FB923C' } },
        { name: '1930', value: 1, itemStyle: { color: '#FB923C' } },
      ]},
      { name: '英格兰', itemStyle: { color: '#E2E8F0' }, children: [
        { name: '1966', value: 1, itemStyle: { color: '#E2E8F0' } },
      ]},
      { name: '西班牙', itemStyle: { color: '#38BDF8' }, children: [
        { name: '2010', value: 1, itemStyle: { color: '#38BDF8' } },
      ]},
    ],
    label: { rotate: 'radial', fontSize: 9, color: '#E8ECF1', fontWeight: 600 },
    itemStyle: { borderColor: '#0B0F1A', borderWidth: 2 },
    levels: [
      {},
      { r0: '0%', r: '40%', label: { rotate: 'tangential', fontSize: 11, fontWeight: 700 } },
      { r0: '40%', r: '85%', label: { align: 'right', fontSize: 9 } },
    ]
  }]
})

// ——— 冠军榜 ———
// ——— 焦点对决 ———
const hotMatches = [
  { date: '6月12日 20:00', group: '揭幕战', venue: '洛杉矶', tag: '🌎 北美德比', home: { code: 'us', name: '美国' }, away: { code: 'mx', name: '墨西哥' } },
  { date: '6月14日 22:00', group: 'A组', venue: '纽约', tag: '🔥 冠军预演', home: { code: 'ar', name: '阿根廷' }, away: { code: 'fr', name: '法国' } },
  { date: '6月17日 03:00', group: 'B组', venue: '迈阿密', tag: '⚡ 宿敌重逢', home: { code: 'br', name: '巴西' }, away: { code: 'de', name: '德国' } },
  { date: '6月20日 22:00', group: 'C组', venue: '达拉斯', tag: '🌟 伊比利亚德比', home: { code: 'es', name: '西班牙' }, away: { code: 'pt', name: '葡萄牙' } },
]

// ——— 进球王名人堂（来自 players.json） ———
const legends = [
  { name: '克洛泽', country: '德国', code: 'de', goals: 16, worldCups: 4, bestResult: '冠军', hue: 30 },
  { name: '罗纳尔多', country: '巴西', code: 'br', goals: 15, worldCups: 3, bestResult: '冠军', hue: 130 },
  { name: '盖德·穆勒', country: '西德', code: 'de', goals: 14, worldCups: 2, bestResult: '冠军', hue: 30 },
  { name: '梅西', country: '阿根廷', code: 'ar', goals: 13, worldCups: 5, bestResult: '冠军', hue: 45 },
  { name: '方丹', country: '法国', code: 'fr', goals: 13, worldCups: 1, bestResult: '季军', hue: 210 },
  { name: '贝利', country: '巴西', code: 'br', goals: 12, worldCups: 4, bestResult: '冠军', hue: 130 },
  { name: '柯奇士', country: '匈牙利', code: 'hu', goals: 11, worldCups: 1, bestResult: '亚军', hue: 270 },
  { name: '克林斯曼', country: '德国', code: 'de', goals: 11, worldCups: 3, bestResult: '冠军', hue: 30 },
  { name: '拉恩', country: '巴西', code: 'br', goals: 10, worldCups: 4, bestResult: '冠军', hue: 130 },
  { name: '穆勒(托马斯)', country: '德国', code: 'de', goals: 10, worldCups: 2, bestResult: '冠军', hue: 30 },
  { name: '巴蒂斯图塔', country: '阿根廷', code: 'ar', goals: 10, worldCups: 3, bestResult: '八强', hue: 45 },
  { name: '拉托', country: '波兰', code: 'pl', goals: 10, worldCups: 3, bestResult: '季军', hue: 280 },
  { name: '莱因克尔', country: '英格兰', code: 'gb-eng', goals: 10, worldCups: 2, bestResult: '八强', hue: 0 },
  { name: 'C罗', country: '葡萄牙', code: 'pt', goals: 8, worldCups: 5, bestResult: '四强', hue: 160 },
  { name: 'J·冯托里奥', country: '巴西', code: 'br', goals: 8, worldCups: 2, bestResult: '冠军', hue: 130 },
]


// ——— 点球大战小游戏 ———
const gameStarted = ref(false)
const gameShooting = ref(false)
const gameOver = ref(false)
const gameScore = ref(0)
const gameShots = ref(0)
const maxPenaltyShots = 5
const ballDirection = ref('')
const keeperDirection = ref('')
const showGoalText = ref(false)
const showSaveText = ref(false)
const netShaking = ref(false)

const leftPenaltyShots = computed(() => Math.max(maxPenaltyShots - gameShots.value, 0))
const ballClass = computed(() => ({
  shooting: gameShooting.value,
  'shoot-left': ballDirection.value === 'left',
  'shoot-center': ballDirection.value === 'center',
  'shoot-right': ballDirection.value === 'right',
  scored: showGoalText.value
}))
const keeperClass = computed(() => ({
  'keeper-left': keeperDirection.value === 'left',
  'keeper-center': keeperDirection.value === 'center',
  'keeper-right': keeperDirection.value === 'right'
}))

function startPenaltyGame() {
  gameStarted.value = true
  gameOver.value = false
  gameScore.value = 0
  gameShots.value = 0
  resetPenaltyRound()
}

function restartPenaltyGame() {
  gameStarted.value = true
  gameOver.value = false
  gameScore.value = 0
  gameShots.value = 0
  resetPenaltyRound()
}

function shootPenalty(event) {
  if (!gameStarted.value || gameShooting.value || gameOver.value) return

  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percent = clickX / rect.width

  if (percent < 0.33) {
    ballDirection.value = 'left'
  } else if (percent < 0.66) {
    ballDirection.value = 'center'
  } else {
    ballDirection.value = 'right'
  }

  const directions = ['left', 'center', 'right']
  keeperDirection.value = directions[Math.floor(Math.random() * directions.length)]
  gameShooting.value = true
  gameShots.value += 1

  setTimeout(() => {
    const isGoal = ballDirection.value !== keeperDirection.value
    if (isGoal) {
      gameScore.value += 1
      showGoalText.value = true
      netShaking.value = true
      setTimeout(() => { netShaking.value = false }, 450)
    } else {
      showSaveText.value = true
    }
  }, 780)

  setTimeout(() => {
    if (gameShots.value >= maxPenaltyShots) {
      gameShooting.value = false
      gameOver.value = true
      return
    }
    resetPenaltyRound()
  }, 1650)
}

function resetPenaltyRound() {
  gameShooting.value = false
  ballDirection.value = ''
  keeperDirection.value = ''
  showGoalText.value = false
  showSaveText.value = false
  netShaking.value = false
}

// ——— ECharts：历届进球 ———
const goalsOpt = ref({
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(20,27,45,0.95)', borderColor: 'rgba(255,255,255,0.08)', textStyle: { color: '#E8ECF1' } },
  grid: { left: '4%', right: '4%', bottom: '10%', top: '12px', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['1930','1950','1966','1970','1982','1990','1998','2002','2010','2014','2018','2022'],
    axisLabel: { color: '#6B7B92', fontSize: 10 },
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#6B7B92', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
  },
  series: [{
    type: 'line',
    data: [70, 88, 89, 95, 146, 115, 171, 161, 145, 171, 169, 172],
    smooth: true,
    symbol: 'circle', symbolSize: 5,
    lineStyle: { width: 2.5, color: '#FBBF24' },
    itemStyle: { color: '#FBBF24' },
    areaStyle: {
      color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [{ offset: 0, color: 'rgba(251,191,36,0.25)' }, { offset: 1, color: 'rgba(251,191,36,0.01)' }] }
    }
  }]
})

// ——— ECharts：洲际名额南丁格尔玫瑰图 ———
const quotaOpt = ref({
  tooltip: { trigger: 'item', backgroundColor: 'rgba(20,27,45,0.95)', borderColor: 'rgba(255,255,255,0.08)', textStyle: { color: '#E8ECF1' }, formatter: '{b}: {c}席 ({d}%)' },
  legend: { orient: 'vertical', right: 6, top: 'center', textStyle: { color: '#8892A6', fontSize: 10 } },
  series: [{
    type: 'pie',
    roseType: 'area',
    radius: ['15%', '72%'],
    center: ['38%', '50%'],
    data: [
      { name: '欧洲UEFA', value: 16, itemStyle: { color: '#22D3EE' } },
      { name: '南美CONMEBOL', value: 6, itemStyle: { color: '#FBBF24' } },
      { name: '非洲CAF', value: 9, itemStyle: { color: '#F43F5E' } },
      { name: '亚洲AFC', value: 8, itemStyle: { color: '#34D399' } },
      { name: '北中美CONCACAF', value: 6, itemStyle: { color: '#A78BFA' } },
      { name: '大洋洲OFC', value: 1, itemStyle: { color: '#FB923C' } },
      { name: '东道主', value: 2, itemStyle: { color: '#E2E8F0' } },
    ],
    label: { show: false },
    emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold' } },
  }]
})
</script>

<style scoped>
.tab-overview { padding-top: 8px; }

/* ========== 顶部双栏 ========== */
.top-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  margin-bottom: 16px;
}

/* Hero 块 */
.hero-block {
  background: linear-gradient(135deg, #0B0F1A 0%, #0E1B40 45%, #132D60 100%);
  border-radius: 20px;
  padding: 32px 36px;
  border: 1px solid rgba(255,255,255,0.07);
  position: relative;
  overflow: hidden;
}
/* Hero 内右侧图片 */
.hero-img-wrap {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 260px;
  height: 210px;
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}
.hero-inner-img {
  width: 100%; height: 100%;
  object-fit: contain;
  filter: saturate(1.1) brightness(0.95);
}
/* 频谱条装饰 */
.spectrum-decor {
  position: absolute;
  right: 300px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 140px;
  z-index: 0;
  pointer-events: none;
}
.sp-bar {
  width: 4px;
  border-radius: 2px;
  background: linear-gradient(to top, rgba(34,211,238,0.25), rgba(34,211,238,0.05));
  animation: sp-bounce 2s ease-in-out infinite;
}
.sp-bar:nth-child(1) { animation-delay: 0.0s; }
.sp-bar:nth-child(2) { animation-delay: 0.2s; }
.sp-bar:nth-child(3) { animation-delay: 0.5s; }
.sp-bar:nth-child(4) { animation-delay: 0.1s; }
.sp-bar:nth-child(5) { animation-delay: 0.4s; }
.sp-bar:nth-child(6) { animation-delay: 0.3s; }
.sp-bar:nth-child(7) { animation-delay: 0.15s; }
.sp-bar:nth-child(8) { animation-delay: 0.6s; }
.sp-bar:nth-child(9) { animation-delay: 0.25s; }
.sp-bar:nth-child(10) { animation-delay: 0.45s; }
.sp-bar:nth-child(11) { animation-delay: 0.35s; }
.sp-bar:nth-child(12) { animation-delay: 0.55s; }
@keyframes sp-bounce {
  0%, 100% { transform: scaleY(1); opacity: 0.4; }
  50% { transform: scaleY(1.25); opacity: 0.8; }
}
/* 中间浮动标签 */
.mid-float-badges {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
  pointer-events: none;
}
.mfb-item {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 4px 12px;
  white-space: nowrap;
  backdrop-filter: blur(4px);
}
/* 足球轮廓 */
.ball-outline {
  position: absolute;
  left: -10px;
  bottom: -15px;
  width: 130px;
  height: 130px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}
/* 底部扫描线 */
.hero-scanline {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(34,211,238,0.15) 20%, rgba(251,191,36,0.15) 50%, rgba(34,211,238,0.15) 80%, transparent 100%);
  z-index: 2;
  pointer-events: none;
}
.hero-scanline::after {
  content: '';
  position: absolute;
  top: 0; left: -20%;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  animation: scanMove 4s linear infinite;
}
@keyframes scanMove {
  0% { left: -40%; }
  100% { left: 100%; }
}
.hero-bg-glow {
  position: absolute; top: -60px; right: -60px;
  width: 340px; height: 340px;
  background: radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 65%);
  pointer-events: none;
}
.hero-eyebrow {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 10px;
}
.live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #F43F5E;
  box-shadow: 0 0 8px rgba(244,63,94,0.7);
  animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.live-text { font-size: 14px; font-weight: 700; color: #F43F5E; letter-spacing: 2px; text-transform: uppercase; }
.hero-title {
  font-size: 38px; font-weight: 900; color: #E8ECF1;
  letter-spacing: 1px; margin-bottom: 8px;
  line-height: 1.15;
}
.title-accent {
  background: linear-gradient(135deg, #22D3EE, #06B6D4);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-sub { font-size: 15px; color: #5A6B82; margin-bottom: 24px; }

/* 倒计时 */
.countdown-row { display: flex; gap: 10px; margin-bottom: 20px; }
.cd-block {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  transition: all 0.3s ease;
}
.cd-num {
  display: block;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(34,211,238,0.18);
  border-radius: 12px;
  padding: 8px 18px;
  min-width: 62px; text-align: center;
  font-size: 26px; font-weight: 800; color: #22D3EE;
  font-variant-numeric: tabular-nums;
  transition: all 0.3s ease;
}
.cd-block.changed .cd-num {
  color: #FBBF24;
  border-color: rgba(251,191,36,0.4);
  box-shadow: 0 0 14px rgba(251,191,36,0.2);
}
.cd-lbl { font-size: 12px; color: #4A5568; font-weight: 600; }

/* 小数据条 */
.mini-stats-row { display: flex; align-items: center; gap: 0; }
.mini-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 0 20px; }
.ms-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.08); }
.ms-val { font-size: 26px; font-weight: 800; }
.ms-val.cyan { color: #22D3EE; }
.ms-val.gold { color: #FBBF24; }
.ms-val.rose { color: #F43F5E; }
.ms-val.green { color: #34D399; }
.ms-lbl { font-size: 12px; color: #5A6B82; font-weight: 600; }

/* 音乐播放器 */
.music-player { margin-top: 16px; }
.music-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 24px;
  padding: 8px 18px;
  cursor: pointer;
  color: #8892A6;
  font-size: 13px; font-weight: 600;
  transition: all 0.3s ease;
  position: relative; overflow: hidden;
}
.music-btn:hover {
  border-color: rgba(34,211,238,0.4);
  color: #22D3EE;
  box-shadow: 0 4px 16px rgba(34,211,238,0.15);
}
.music-btn.playing {
  border-color: rgba(251,191,36,0.4);
  color: #FBBF24;
  box-shadow: 0 4px 16px rgba(251,191,36,0.15);
}
.music-label {
  font-size: 13px; font-weight: 600;
}
.music-bars {
  display: flex; align-items: flex-end; gap: 2px; height: 14px;
}
.music-bars .mb {
  width: 3px; border-radius: 1px;
  background: #FBBF24;
  animation: barPulse 0.8s ease-in-out infinite;
}
.music-bars .mb:nth-child(1) { height: 40%; animation-delay: 0s; }
.music-bars .mb:nth-child(2) { height: 70%; animation-delay: 0.15s; }
.music-bars .mb:nth-child(3) { height: 50%; animation-delay: 0.3s; }
.music-bars .mb:nth-child(4) { height: 80%; animation-delay: 0.45s; }
@keyframes barPulse {
  0%, 100% { transform: scaleY(1); opacity: 0.6; }
  50% { transform: scaleY(1.4); opacity: 1; }
}

/* 大力神杯背景装饰 */
.trophy-bg-decor {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 240px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
  animation: trophyBgFloat 6s ease-in-out infinite;
}
.trophy-bg-img {
  width: 100%;
  filter: brightness(1.2) drop-shadow(0 0 40px rgba(251,191,36,0.3));
}
.trophy-bg-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
  pointer-events: none;
}
@keyframes trophyBgFloat {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -53%) scale(1.03); }
}

/* 快捷入口 */
.entry-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.entry-card {
  position: relative;
  background: rgba(11,15,26,0.6);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  padding: 24px;
  display: flex; align-items: center; gap: 18px;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 0 0 transparent,
              inset 0 0 20px rgba(0,0,0,0.3);
}
.ec-bg-img {
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 45%;
  background-size: cover;
  background-position: center;
  opacity: 0.35;
  mask-image: linear-gradient(to left, rgba(0,0,0,1) 30%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 30%, transparent 100%);
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.entry-card:hover .ec-bg-img {
  opacity: 0.5;
}
.entry-card:hover {
  transform: translateY(-3px);
  border-color: var(--ec-color, #22D3EE);
  box-shadow: 0 0 20px var(--ec-glow, rgba(34,211,238,0.12)),
              0 0 40px var(--ec-glow, rgba(34,211,238,0.06));
}

/* 四角折角装饰 */
.corner {
  position: absolute;
  width: 14px; height: 14px;
  border-color: var(--ec-color, #22D3EE);
  border-style: solid;
  opacity: 0.8;
  transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
  pointer-events: none;
  filter: drop-shadow(0 0 4px var(--ec-glow, rgba(34,211,238,0.5)));
}
.entry-card:hover .corner {
  opacity: 1;
  width: 18px; height: 18px;
  filter: drop-shadow(0 0 8px var(--ec-glow, rgba(34,211,238,0.8)));
}
.c-tl { top: -1px; left: -1px; border-width: 2.5px 0 0 2.5px; border-radius: 12px 0 0 0; }
.c-tr { top: -1px; right: -1px; border-width: 2.5px 2.5px 0 0; border-radius: 0 12px 0 0; }
.c-bl { bottom: -1px; left: -1px; border-width: 0 0 2.5px 2.5px; border-radius: 0 0 0 12px; }
.c-br { bottom: -1px; right: -1px; border-width: 0 2.5px 2.5px 0; border-radius: 0 0 12px 0; }

/* 内框线 */
.ec-inner-border {
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
  pointer-events: none;
  z-index: 0;
  transition: border-color 0.3s ease;
}
.entry-card:hover .ec-inner-border {
  border-color: rgba(255,255,255,0.1);
}

/* 顶部横向发光扫描线 */
.ec-top-glow {
  position: absolute;
  top: -1px; left: 16px; right: 16px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--ec-color, #22D3EE), transparent);
  opacity: 0.4;
  transition: opacity 0.3s ease, left 0.3s ease, right 0.3s ease;
  pointer-events: none;
}
.entry-card:hover .ec-top-glow {
  opacity: 0.9;
  left: 6px; right: 6px;
}

/* 图标区 */
.ec-icon-wrap {
  width: 52px; height: 52px; flex-shrink: 0;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ec-color, #22D3EE);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.3s ease;
}
.ec-icon-wrap svg {
  width: 28px; height: 28px;
}
.entry-card:hover .ec-icon-wrap {
  background: var(--ec-color, #22D3EE);
  color: #0B0F1A;
  border-color: transparent;
  box-shadow: 0 0 14px var(--ec-glow, rgba(34,211,238,0.35));
}

/* 文字 */
.ec-info { flex: 1; }
.ec-label { display: block; font-size: 18px; font-weight: 700; color: #E8ECF1; }
.ec-desc { display: block; font-size: 13px; color: #5A6B82; margin-top: 4px; }

/* 箭头 */
.entry-card > svg:last-child {
  width: 18px; height: 18px;
  color: #3A4560;
  transition: all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
  flex-shrink: 0;
}
.entry-card:hover > svg:last-child {
  color: var(--ec-color, #22D3EE);
  transform: translateX(4px);
}

/* ========== 战报条 ========== */
.ticker-bar {
  display: flex; align-items: center; gap: 0;
  background: linear-gradient(135deg, #141B2D, #0F1829);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  margin-bottom: 20px;
  overflow: hidden;
  height: 48px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.2);
  position: relative;
}
.ticker-bar::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 5%, rgba(244,63,94,0.4) 20%, rgba(251,191,36,0.3) 50%, rgba(34,211,238,0.4) 80%, transparent 95%);
}
.ticker-tag {
  flex-shrink: 0;
  background: linear-gradient(135deg, #F43F5E, #FB7185);
  color: #fff; font-size: 13px; font-weight: 800;
  padding: 0 18px; height: 48px;
  display: flex; align-items: center; gap: 6px;
  letter-spacing: 1px;
  position: relative;
}
.ticker-tag::after {
  content: '';
  position: absolute; right: -8px; top: 50%; transform: translateY(-50%);
  width: 0; height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #FB7185;
}
.ticker-track-wrap { flex: 1; overflow: hidden; padding-left: 12px; }
.ticker-track {
  display: flex; align-items: center; gap: 6px;
  white-space: nowrap;
  animation: tickerScroll 28s linear infinite;
  width: max-content;
}
@keyframes tickerScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-item {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 4px 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.04);
}
.ticker-score {
  font-size: 15px; font-weight: 800;
  color: #E8ECF1;
}
.ticker-score em {
  color: #FBBF24; font-style: normal; margin: 0 3px;
}
.ticker-sep { color: rgba(255,255,255,0.15); font-size: 20px; }

/* ========== 区段标题 ========== */
.section-head {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}
.sec-title { font-size: 18px; font-weight: 800; color: #E8ECF1; }
.sec-badge {
  font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
}
.sec-badge.gold { background: linear-gradient(135deg,#F59E0B,#FBBF24); color: #0B0F1A; }
.sec-badge.red { background: linear-gradient(135deg,#EF4444,#F87171); color: #fff; }

/* ========== 冠军横排 ========== */
.champions-scroll {
  display: flex; gap: 12px;
  overflow-x: auto; padding-bottom: 10px;
  margin-bottom: 20px;
  scrollbar-width: thin;
}
.champions-scroll::-webkit-scrollbar { height: 4px; }
.champions-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
.champ-card {
  flex-shrink: 0;
  background: linear-gradient(160deg, rgba(20,27,45,0.95), rgba(15,21,38,0.98));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 18px 18px 14px;
  width: 124px;
  text-align: center;
  cursor: default;
  position: relative; overflow: hidden;
  transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
}
.champ-card:hover {
  transform: translateY(-5px);
  border-color: hsl(var(--cc-hue, 200), 60%, 50%);
  box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 0 20px hsla(var(--cc-hue,200),60%,50%,0.1);
}
.champ-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, hsl(var(--cc-hue, 200), 80%, 60%), transparent);
}
.champ-card::after {
  content: '';
  position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px;
  background: linear-gradient(90deg, transparent, hsl(var(--cc-hue,200),70%,50%), transparent);
  opacity: 0.3;
  transition: opacity 0.3s ease;
}
.champ-card:hover::after { opacity: 0.6; }
.cc-year { font-size: 12px; font-weight: 800; color: hsl(var(--cc-hue,200),70%,65%); margin-bottom: 10px; }
.cc-flag { width: 48px; height: 36px; object-fit: cover; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); margin-bottom: 10px; transition: transform 0.3s ease; }
.champ-card:hover .cc-flag { transform: scale(1.08); }
.cc-name { font-size: 14px; font-weight: 700; color: #E8ECF1; margin-bottom: 3px; }
.cc-host { font-size: 12px; color: #5A6B82; }
.cc-glow-line {
  position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, hsl(var(--cc-hue,200),70%,50%), transparent);
  opacity: 0.4;
}

/* ========== 三列图表区 ========== */
.triple-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; margin-bottom: 16px;
}
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
.chart-panel { padding: 0; display: flex; flex-direction: column; }
.panel-head { flex-shrink: 0; }
.panel-head {
  display: flex; align-items: baseline; gap: 10px;
  padding: 18px 22px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  margin-bottom: 0;
}
.panel-title { font-size: 16px; font-weight: 700; color: #E8ECF1; }
.panel-sub { font-size: 12px; color: #5A6478; font-weight: 500; }
.chart-wrap { padding: 0 10px; line-height: 0; flex: 1; min-height: 180px; }
.chart-wrap > * { width: 100%; height: 100%; }

.gold-text { color: #FBBF24 !important; }

/* 夺冠热门面板 */
.hot-panel { padding: 0 0 18px; }
.hot-list { padding: 4px 18px 0; display: flex; flex-direction: column; gap: 8px; }
.hot-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.03);
  transition: all 0.25s ease;
}
.hot-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); }
.hot-row.top1 { background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.15); }
.hot-rank {
  font-size: 13px; font-weight: 800; min-width: 22px; text-align: center; color: #4A5568;
}
.hot-rank.hr1 { color: #FBBF24; }
.hot-rank.hr2 { color: #94A3B8; }
.hot-rank.hr3 { color: #CD7F32; }
.hot-flag { width: 26px; height: 20px; border-radius: 3px; object-fit: cover; flex-shrink: 0; }
.hot-name { font-size: 13px; font-weight: 600; color: #CDD5E0; min-width: 52px; }
.hot-bar-wrap { flex: 1; height: 7px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
.hot-bar { height: 100%; border-radius: 4px; transition: width 1s ease; }
.hot-pct { font-size: 13px; font-weight: 700; color: #6B7B92; min-width: 34px; text-align: right; }

/* ========== 双栏：旭日图 + 焦点对决 ========== */
.dual-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px; margin-bottom: 16px;
}
.rank-panel, .matches-panel { padding: 0 0 18px; }

/* 冠军榜 */
/* 焦点对决 */
.match-cards.timeline {
  padding: 4px 4px 0 28px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.timeline-item {
  position: relative;
  padding-bottom: 4px;
}
.timeline-item .tl-line {
  position: absolute;
  left: 7px; top: 18px; bottom: -4px;
  width: 1.5px;
  background: linear-gradient(to bottom, rgba(34,211,238,0.35), rgba(34,211,238,0.06));
  z-index: 0;
}
.tl-dot {
  position: absolute;
  left: 2px; top: 5px;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #0B0F1A;
  border: 2px solid rgba(34,211,238,0.45);
  z-index: 1;
  transition: all 0.3s ease;
}
.timeline-item:hover .tl-dot {
  border-color: #22D3EE;
  box-shadow: 0 0 10px rgba(34,211,238,0.4);
  transform: scale(1.25);
}
.timeline-item .match-card-item {
  margin-left: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}
.timeline-item .match-card-item:hover { background: rgba(255,255,255,0.06); border-color: rgba(34,211,238,0.25); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
.mci-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 10px; flex-wrap: wrap;
}
.mci-tag {
  font-size: 11px; font-weight: 600;
  color: #FBBF24;
  background: rgba(251,191,36,0.10);
  border: 1px solid rgba(251,191,36,0.18);
  border-radius: 10px;
  padding: 2px 8px;
  white-space: nowrap;
}
.mci-group { font-size: 12px; font-weight: 700; color: #22D3EE; background: rgba(34,211,238,0.12); padding: 3px 10px; border-radius: 6px; }
.mci-date { font-size: 12px; color: #5A6B82; margin-left: auto; }
.mci-body { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.mci-team { display: flex; align-items: center; gap: 10px; flex: 1; }
.mci-team.right { justify-content: flex-end; flex-direction: row-reverse; }
.mci-flag { width: 32px; height: 24px; border-radius: 4px; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
.mci-name { font-size: 14px; font-weight: 700; color: #E8ECF1; }
.mci-vs { display: flex; align-items: center; justify-content: center; width: 40px; flex-shrink: 0; }
.vs-label { font-size: 12px; font-weight: 800; color: #FBBF24; background: rgba(251,191,36,0.12); padding: 4px 8px; border-radius: 6px; }
.mci-venue { font-size: 12px; color: #4A5568; }

/* ========== 进球王名人堂 ========== */
.legends-scroll {
  display: flex; gap: 12px;
  overflow-x: auto; padding-bottom: 10px;
  scrollbar-width: thin;
}
.legends-scroll::-webkit-scrollbar { height: 4px; }
.legends-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
.legend-card {
  flex-shrink: 0;
  background: linear-gradient(160deg, rgba(20,27,45,0.95), rgba(15,21,38,0.98));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 18px 18px 14px;
  width: 158px;
  position: relative; overflow: hidden;
  transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
  cursor: default;
}
.legend-card:hover {
  transform: translateY(-5px);
  border-color: hsl(var(--lg-hue, 200), 60%, 50%);
  box-shadow: 0 8px 28px rgba(0,0,0,0.35), 0 0 20px hsla(var(--lg-hue,200),60%,50%,0.1);
}
.legend-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, hsl(var(--lg-hue, 200), 75%, 55%), transparent);
}
.lg-rank {
  position: absolute; top: 8px; right: 10px;
  font-size: 11px; font-weight: 800; color: #3A4560;
}
.lg-body { margin-bottom: 10px; }
.lg-top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.lg-flag { width: 30px; height: 22px; border-radius: 4px; object-fit: cover; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
.lg-name { font-size: 14px; font-weight: 700; color: #E8ECF1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lg-stats { display: flex; align-items: baseline; gap: 8px; }
.lg-goals { font-size: 24px; font-weight: 800; color: hsl(var(--lg-hue, 200), 75%, 60%); }
.lg-goals small { font-size: 12px; font-weight: 500; }
.lg-wc { font-size: 11px; color: #5A6B82; }
.lg-best { font-size: 11px; color: #5A6B82; margin-left: auto; }
.lg-bar-wrap { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.lg-bar {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, hsl(var(--lg-hue, 200), 70%, 55%), hsl(var(--lg-hue, 200), 70%, 40%));
  transition: width 1.2s ease;
}

/* ========== 响应式 ========== */
@media (max-width: 1200px) {
  .top-grid { grid-template-columns: 1fr; }
}
@media (max-width: 1024px) {
  .triple-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .top-grid { grid-template-columns: 1fr; }
  .triple-grid { grid-template-columns: 1fr; }
  .dual-grid { grid-template-columns: 1fr; }
  .entry-grid { grid-template-columns: 1fr 1fr; }
  .hero-title { font-size: 22px; }
  .champions-scroll { gap: 8px; }
  .legends-scroll { gap: 8px; }
}

/* ========== 互动小游戏：点球大战 ========== */
.penalty-section-head { margin-top: 4px; }
.sec-badge.cyan {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #061225;
}
.penalty-game {
  margin-bottom: 20px;
  padding: 22px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  color: #E8ECF1;
  background:
    radial-gradient(circle at 18% 12%, rgba(34,211,238,0.16), transparent 28%),
    radial-gradient(circle at 86% 20%, rgba(251,191,36,0.10), transparent 30%),
    linear-gradient(135deg, rgba(11,15,26,0.98), rgba(12,27,64,0.96));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 18px 48px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04);
}
.penalty-game::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(34,211,238,0.05), transparent);
  transform: translateX(-100%);
  animation: gameSweep 6s linear infinite;
  pointer-events: none;
}
@keyframes gameSweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
}
.game-label {
  color: #22D3EE;
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 800;
  text-transform: uppercase;
}
.game-header h2 {
  margin: 5px 0 4px;
  font-size: 24px;
  font-weight: 900;
  color: #fff;
}
.game-header p {
  margin: 0;
  font-size: 13px;
  color: #6B7B92;
}
.game-score-board {
  display: flex;
  gap: 10px;
}
.gs-item {
  width: 70px;
  height: 62px;
  border-radius: 14px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(34,211,238,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: inset 0 0 18px rgba(34,211,238,0.04);
}
.gs-item span {
  color: #22D3EE;
  font-size: 23px;
  font-weight: 900;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.gs-item p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #5A6B82;
  font-weight: 700;
}
.game-stage {
  height: 430px;
  border-radius: 18px;
  position: relative;
  overflow: hidden;
  cursor: crosshair;
  border: 1px solid rgba(255,255,255,0.06);
  background:
    linear-gradient(to bottom, rgba(8,20,52,0.35), rgba(5,13,31,0.82)),
    radial-gradient(circle at center 18%, rgba(34,211,238,0.18), transparent 34%),
    linear-gradient(to bottom, #071834 0%, #092344 48%, #0b3f2d 100%);
}
.game-stage::before {
  content: '';
  position: absolute;
  left: -12%;
  right: -12%;
  bottom: -95px;
  height: 250px;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 78px, rgba(0,0,0,0.08) 78px, rgba(0,0,0,0.08) 156px),
    linear-gradient(to top, rgba(34,197,94,0.38), rgba(34,197,94,0.08));
  transform: perspective(520px) rotateX(58deg);
  transform-origin: bottom;
  z-index: 0;
}
.game-stage::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: 360px;
  height: 130px;
  border: 2px solid rgba(255,255,255,0.22);
  border-bottom: none;
  border-radius: 180px 180px 0 0;
  transform: translateX(-50%);
  z-index: 1;
}
.game-sky-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px);
  background-size: 46px 46px;
  opacity: 0.28;
  mask-image: linear-gradient(to bottom, #000, transparent 58%);
  -webkit-mask-image: linear-gradient(to bottom, #000, transparent 58%);
}
.game-stadium-glow {
  position: absolute;
  top: 30px;
  width: 260px;
  height: 150px;
  filter: blur(12px);
  opacity: 0.8;
  background: radial-gradient(circle, rgba(34,211,238,0.35), transparent 62%);
}
.glow-left { left: -80px; }
.glow-right { right: -80px; }
.goal-click-area {
  position: absolute;
  left: 50%;
  top: 56px;
  width: 430px;
  height: 210px;
  transform: translateX(-50%);
  z-index: 10;
  cursor: crosshair;
}
.penalty-goal {
  position: absolute;
  inset: 0;
  border: 8px solid rgba(255,255,255,0.88);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 34px rgba(255,255,255,0.18), inset 0 0 32px rgba(34,211,238,0.10);
}
.penalty-goal.shaking {
  animation: goalShake 0.42s ease;
}
@keyframes goalShake {
  0%, 100% { transform: translate3d(0,0,0); }
  25% { transform: translate3d(-5px,2px,0); }
  50% { transform: translate3d(5px,-2px,0); }
  75% { transform: translate3d(-3px,1px,0); }
}
.goal-depth {
  position: absolute;
  left: 18px;
  right: 18px;
  top: 18px;
  height: 185px;
  border: 1px solid rgba(255,255,255,0.13);
  transform: perspective(420px) rotateX(18deg) translateY(8px);
  transform-origin: top;
  opacity: 0.7;
}
.goal-net {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.68;
}
.goal-line-light {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #22D3EE, transparent);
  box-shadow: 0 0 18px rgba(34,211,238,0.55);
}
.target-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 33.333%;
  z-index: 7;
  transition: background 0.2s ease;
}
.zone-left { left: 0; }
.zone-center { left: 33.333%; }
.zone-right { right: 0; }
.target-zone:hover {
  background: rgba(34, 211, 238, 0.10);
}
.keeper-human {
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 78px;
  height: 118px;
  transform: translateX(-50%);
  z-index: 9;
  transition: all 0.45s cubic-bezier(.18,.89,.32,1.28);
  filter: drop-shadow(0 12px 14px rgba(0,0,0,0.45)) drop-shadow(0 0 12px rgba(34,211,238,0.25));
  pointer-events: none;
}
.keeper-head {
  position: absolute;
  left: 50%;
  top: 0;
  width: 28px;
  height: 28px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD1A3, #B76B38);
  border: 2px solid rgba(255,255,255,0.20);
}
.keeper-body {
  position: absolute;
  left: 50%;
  top: 30px;
  width: 46px;
  height: 50px;
  transform: translateX(-50%);
  border-radius: 14px 14px 12px 12px;
  background: linear-gradient(135deg, #8B5CF6, #EC4899);
  box-shadow: inset 0 0 12px rgba(255,255,255,0.18), 0 0 16px rgba(236,72,153,0.18);
}
.keeper-arm {
  position: absolute;
  top: 34px;
  width: 16px;
  height: 54px;
  border-radius: 999px;
  background: linear-gradient(135deg, #A78BFA, #F472B6);
  transform-origin: top center;
  transition: transform 0.45s cubic-bezier(.18,.89,.32,1.28);
}
.keeper-arm-left { left: 4px; transform: rotate(32deg); }
.keeper-arm-right { right: 4px; transform: rotate(-32deg); }
.keeper-leg {
  position: absolute;
  top: 76px;
  width: 16px;
  height: 44px;
  border-radius: 999px;
  background: linear-gradient(135deg, #38BDF8, #2563EB);
  transform-origin: top center;
  transition: transform 0.45s cubic-bezier(.18,.89,.32,1.28);
}
.keeper-leg-left { left: 22px; transform: rotate(8deg); }
.keeper-leg-right { right: 22px; transform: rotate(-8deg); }
.keeper-left {
  left: 20%;
  transform: translateX(-50%) translateY(-20px) rotate(-28deg) scale(1.08);
}
.keeper-left .keeper-arm-left { transform: rotate(-100deg); }
.keeper-left .keeper-arm-right { transform: rotate(-44deg); }
.keeper-left .keeper-leg-left { transform: rotate(28deg); }
.keeper-left .keeper-leg-right { transform: rotate(-12deg); }
.keeper-center {
  left: 50%;
  transform: translateX(-50%) translateY(-18px) scale(1.08);
}
.keeper-center .keeper-arm-left { transform: rotate(-75deg); }
.keeper-center .keeper-arm-right { transform: rotate(75deg); }
.keeper-right {
  left: 80%;
  transform: translateX(-50%) translateY(-20px) rotate(28deg) scale(1.08);
}
.keeper-right .keeper-arm-left { transform: rotate(44deg); }
.keeper-right .keeper-arm-right { transform: rotate(100deg); }
.keeper-right .keeper-leg-left { transform: rotate(12deg); }
.keeper-right .keeper-leg-right { transform: rotate(-28deg); }
.game-football {
  position: absolute;
  left: 50%;
  bottom: 46px;
  width: 74px;
  height: 74px;
  margin-left: -37px;
  z-index: 12;
  perspective: 900px;
  transform-style: preserve-3d;
}
.ball-core {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background:
    radial-gradient(circle at 32% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0.88) 18%, rgba(226,232,240,0.95) 42%, rgba(148,163,184,0.86) 76%, rgba(15,23,42,0.95) 100%);
  box-shadow:
    inset -16px -20px 25px rgba(0,0,0,0.36),
    inset 9px 8px 16px rgba(255,255,255,0.55),
    0 18px 26px rgba(0,0,0,0.45),
    0 0 20px rgba(34,211,238,0.35);
  transform-style: preserve-3d;
  animation: ballIdle 2.2s ease-in-out infinite;
}
.ball-core::before {
  content: '';
  position: absolute;
  inset: -18%;
  border-radius: 50%;
  background:
    conic-gradient(from 20deg, transparent 0 8%, rgba(8,10,15,0.95) 8% 15%, transparent 15% 25%, rgba(8,10,15,0.95) 25% 32%, transparent 32% 48%, rgba(8,10,15,0.95) 48% 57%, transparent 57% 72%, rgba(8,10,15,0.95) 72% 79%, transparent 79% 100%);
  opacity: 0.78;
  animation: textureSpin 1.1s linear infinite;
}
.ball-core::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 28% 20%, rgba(255,255,255,0.9), transparent 22%),
    radial-gradient(circle at 75% 72%, rgba(0,0,0,0.35), transparent 38%),
    linear-gradient(125deg, rgba(255,255,255,0.20), transparent 42%, rgba(34,211,238,0.22) 100%);
  pointer-events: none;
}
.ball-patch {
  position: absolute;
  width: 21px;
  height: 21px;
  background: #080A0F;
  clip-path: polygon(50% 0%, 98% 35%, 80% 100%, 20% 100%, 2% 35%);
  z-index: 2;
  opacity: 0.94;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.45));
}
.patch-1 { left: 28px; top: 25px; transform: scale(1.15); }
.patch-2 { left: 8px; top: 15px; transform: scale(0.72) rotate(-18deg); opacity: 0.7; }
.patch-3 { right: 8px; top: 14px; transform: scale(0.68) rotate(16deg); opacity: 0.66; }
.patch-4 { left: 14px; bottom: 9px; transform: scale(0.62) rotate(22deg); opacity: 0.62; }
.patch-5 { right: 12px; bottom: 10px; transform: scale(0.68) rotate(-22deg); opacity: 0.68; }
.ball-seam {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 1.5px solid rgba(8,10,15,0.30);
  z-index: 3;
}
.seam-1 { transform: rotate(26deg) scaleX(0.72); }
.seam-2 { transform: rotate(-34deg) scaleX(0.58); }
.seam-3 { transform: rotate(88deg) scaleX(0.56); opacity: 0.5; }
@keyframes textureSpin {
  0% { transform: rotate(0deg) translateX(0); }
  100% { transform: rotate(360deg) translateX(0); }
}
@keyframes ballIdle {
  0%, 100% { transform: rotateX(0deg) rotateY(0deg) translateZ(0); }
  50% { transform: rotateX(8deg) rotateY(-10deg) translateZ(10px); }
}
.game-football.shooting {
  animation-duration: 0.9s;
  animation-timing-function: cubic-bezier(.12,.82,.28,1);
  animation-fill-mode: forwards;
}
.game-football.shooting .ball-core {
  animation: realBallSpin 0.55s linear infinite;
}
@keyframes realBallSpin {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  100% { transform: rotateX(520deg) rotateY(-360deg) rotateZ(250deg); }
}
.game-football.shoot-left { animation-name: gameShootLeft; }
.game-football.shoot-center { animation-name: gameShootCenter; }
.game-football.shoot-right { animation-name: gameShootRight; }
@keyframes gameShootLeft {
  0% { transform: translate3d(0,0,0) scale(1); }
  38% { transform: translate3d(-110px,-130px,130px) scale(0.86); }
  72% { transform: translate3d(-178px,-225px,40px) scale(0.46); }
  100% { transform: translate3d(-168px,-250px,-120px) scale(0.34); }
}
@keyframes gameShootCenter {
  0% { transform: translate3d(0,0,0) scale(1); }
  38% { transform: translate3d(0,-150px,150px) scale(0.88); }
  72% { transform: translate3d(0,-235px,45px) scale(0.46); }
  100% { transform: translate3d(0,-263px,-120px) scale(0.34); }
}
@keyframes gameShootRight {
  0% { transform: translate3d(0,0,0) scale(1); }
  38% { transform: translate3d(110px,-130px,130px) scale(0.86); }
  72% { transform: translate3d(178px,-225px,40px) scale(0.46); }
  100% { transform: translate3d(168px,-250px,-120px) scale(0.34); }
}
.ball-shadow {
  position: absolute;
  left: 50%;
  bottom: 28px;
  width: 72px;
  height: 18px;
  margin-left: -36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  filter: blur(6px);
  z-index: 2;
  transition: all 0.5s ease;
}
.ball-shadow.shooting { opacity: 0; transform: scale(0.3); }
.target-hint {
  position: absolute;
  left: 50%;
  bottom: 150px;
  z-index: 20;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 999px;
  color: #B9D7FF;
  background: rgba(8,18,44,0.66);
  border: 1px solid rgba(34,211,238,0.25);
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 0 20px rgba(34,211,238,0.10);
}
.goal-result {
  position: absolute;
  left: 50%;
  top: 43%;
  z-index: 22;
  transform: translate(-50%, -50%);
  font-size: 54px;
  font-weight: 1000;
  letter-spacing: 4px;
  animation: gamePopText 0.72s ease both;
}
.goal-success {
  color: #22F59A;
  text-shadow: 0 0 22px rgba(34,245,154,0.75), 0 0 48px rgba(34,245,154,0.35);
}
.goal-save {
  color: #FF4D7D;
  text-shadow: 0 0 22px rgba(255,77,125,0.75), 0 0 48px rgba(255,77,125,0.35);
}
@keyframes gamePopText {
  0% { transform: translate(-50%, -50%) scale(0.35); opacity: 0; }
  70% { transform: translate(-50%, -50%) scale(1.18); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
.game-start-panel,
.game-over-panel {
  position: absolute;
  inset: 0;
  z-index: 30;
  background: rgba(4,10,26,0.58);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.start-cup { font-size: 46px; margin-bottom: 10px; filter: drop-shadow(0 0 16px rgba(251,191,36,0.45)); }
.game-start-panel h3,
.game-over-title {
  font-size: 30px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 8px;
}
.game-start-panel p,
.game-over-card p {
  color: #9FB4D8;
  font-size: 15px;
  margin: 0 0 18px;
}
.game-start-panel button,
.game-over-card button,
.game-control-bar button {
  height: 42px;
  padding: 0 26px;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  color: #061225;
  font-weight: 900;
  font-size: 14px;
  background: linear-gradient(135deg, #22D3EE, #3B82F6);
  box-shadow: 0 0 22px rgba(34,211,238,0.35);
  transition: all 0.25s ease;
}
.game-start-panel button:hover,
.game-over-card button:hover,
.game-control-bar button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(34,211,238,0.55);
}
.game-over-card {
  min-width: 280px;
  padding: 28px 32px;
  border-radius: 18px;
  background: rgba(11,15,26,0.86);
  border: 1px solid rgba(34,211,238,0.18);
  box-shadow: 0 20px 48px rgba(0,0,0,0.35);
}
.game-over-card strong { color: #FBBF24; font-size: 24px; }
.game-control-bar {
  position: relative;
  z-index: 2;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #6B7B92;
  font-size: 13px;
}
@media (max-width: 900px) {
  .game-header { flex-direction: column; align-items: flex-start; }
  .game-score-board { width: 100%; }
  .gs-item { flex: 1; }
  .goal-click-area { width: 82%; }
}

/* ===== 人形守门员最终增强：如果看到“人形守门员版”，说明替换的是正确文件 ===== */
.keeper-version {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 12px;
  vertical-align: middle;
  color: #061225;
  background: linear-gradient(135deg, #22D3EE, #34D399);
}

.keeper-head {
  overflow: hidden;
}

.keeper-hair {
  position: absolute;
  left: 3px;
  right: 3px;
  top: -2px;
  height: 10px;
  border-radius: 999px 999px 8px 8px;
  background: #1f2937;
}

.keeper-eye {
  position: absolute;
  top: 13px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #111827;
  z-index: 2;
}

.eye-left {
  left: 8px;
}

.eye-right {
  right: 8px;
}

.keeper-number {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  color: rgba(255,255,255,0.95);
  font-size: 18px;
  font-weight: 1000;
  text-shadow: 0 0 8px rgba(255,255,255,0.45);
}

.keeper-human::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 72px;
  height: 14px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: rgba(0,0,0,0.32);
  filter: blur(8px);
  z-index: -1;
}

/* 防止旧版手套节点误显示：如果页面里还有 .keeper 旧节点，直接隐藏 */
.keeper {
  display: none !important;
}


/* ===== 修正版：守门员改成明显人形，避免看起来像紫色手套 ===== */
.keeper-version {
  display: inline-flex;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: #061225;
  background: linear-gradient(135deg, #22D3EE, #34D399);
  vertical-align: middle;
}

/* 把提示文字移到球门下面，避免挡住守门员 */
.penalty-game .target-hint {
  left: 50% !important;
  top: 310px !important;
  bottom: auto !important;
  transform: translateX(-50%) !important;
  z-index: 18 !important;
  pointer-events: none;
}

/* 守门员整体 */
.keeper-human {
  position: absolute !important;
  left: 50%;
  bottom: 14px;
  width: 92px !important;
  height: 146px !important;
  transform: translateX(-50%);
  z-index: 15 !important;
  transition: all 0.42s cubic-bezier(.18,.89,.32,1.28);
  filter:
    drop-shadow(0 12px 18px rgba(0,0,0,0.52))
    drop-shadow(0 0 14px rgba(34,211,238,0.28));
}

/* 头部 */
.keeper-human .keeper-head {
  position: absolute !important;
  left: 50%;
  top: 0;
  width: 34px !important;
  height: 34px !important;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD0A3 0%, #D99258 100%);
  border: 2px solid rgba(255,255,255,0.35);
  box-shadow: inset -5px -5px 8px rgba(0,0,0,0.18);
  overflow: hidden;
  z-index: 4;
}

.keeper-human .keeper-hair {
  position: absolute;
  left: 1px;
  right: 1px;
  top: -4px;
  height: 13px;
  border-radius: 999px 999px 8px 8px;
  background: #111827;
}

.keeper-human .keeper-eye {
  position: absolute;
  top: 16px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #111827;
  z-index: 5;
}

.keeper-human .eye-left {
  left: 9px;
}

.keeper-human .eye-right {
  right: 9px;
}

/* 身体：做成球衣，而不是手套形状 */
.keeper-human .keeper-body {
  position: absolute !important;
  left: 50%;
  top: 38px;
  width: 58px !important;
  height: 62px !important;
  transform: translateX(-50%);
  border-radius: 14px 14px 18px 18px;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 56px, rgba(255,255,255,0.18) 56px 58px),
    linear-gradient(135deg, #06B6D4 0%, #2563EB 46%, #7C3AED 100%) !important;
  border: 2px solid rgba(255,255,255,0.24);
  box-shadow:
    inset 0 0 16px rgba(255,255,255,0.18),
    0 0 18px rgba(34,211,238,0.25);
  z-index: 3;
}

.keeper-human .keeper-number {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  color: rgba(255,255,255,0.96);
  font-size: 24px !important;
  font-weight: 1000;
  line-height: 1;
  text-shadow: 0 0 8px rgba(255,255,255,0.55);
}

/* 手臂：改成细长的手臂 + 手套，避免整体像一只手 */
.keeper-human .keeper-arm {
  position: absolute !important;
  top: 46px;
  width: 16px !important;
  height: 60px !important;
  border-radius: 999px;
  background: linear-gradient(180deg, #38BDF8 0%, #2563EB 100%) !important;
  transform-origin: top center;
  z-index: 2;
}

.keeper-human .keeper-arm::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12px;
  width: 22px;
  height: 18px;
  transform: translateX(-50%);
  border-radius: 10px 10px 14px 14px;
  background: linear-gradient(135deg, #FACC15, #F97316);
  box-shadow: 0 0 8px rgba(250,204,21,0.35);
}

.keeper-human .keeper-arm-left {
  left: 10px !important;
  transform: rotate(35deg);
}

.keeper-human .keeper-arm-right {
  right: 10px !important;
  transform: rotate(-35deg);
}

/* 腿部 */
.keeper-human .keeper-leg {
  position: absolute !important;
  top: 96px;
  width: 18px !important;
  height: 48px !important;
  border-radius: 999px;
  background: linear-gradient(180deg, #0F172A 0%, #1E293B 72%, #38BDF8 100%) !important;
  transform-origin: top center;
  z-index: 1;
}

.keeper-human .keeper-leg::after {
  content: '';
  position: absolute;
  bottom: -7px;
  width: 24px;
  height: 9px;
  border-radius: 999px;
  background: #E5E7EB;
}

.keeper-human .keeper-leg-left {
  left: 28px !important;
  transform: rotate(8deg);
}

.keeper-human .keeper-leg-left::after {
  left: -5px;
}

.keeper-human .keeper-leg-right {
  right: 28px !important;
  transform: rotate(-8deg);
}

.keeper-human .keeper-leg-right::after {
  right: -5px;
}

/* 待机动作 */
.keeper-human:not(.keeper-left):not(.keeper-center):not(.keeper-right) {
  animation: keeperHumanIdle 1.15s ease-in-out infinite;
}

@keyframes keeperHumanIdle {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-4px);
  }
}

/* 扑救动作 */
.keeper-human.keeper-left {
  left: 20% !important;
  transform: translateX(-50%) translateY(-26px) rotate(-24deg) scale(1.08);
}

.keeper-human.keeper-left .keeper-arm-left {
  transform: rotate(-95deg);
}

.keeper-human.keeper-left .keeper-arm-right {
  transform: rotate(-35deg);
}

.keeper-human.keeper-left .keeper-leg-left {
  transform: rotate(34deg);
}

.keeper-human.keeper-left .keeper-leg-right {
  transform: rotate(-18deg);
}

.keeper-human.keeper-center {
  left: 50% !important;
  transform: translateX(-50%) translateY(-24px) scale(1.08);
}

.keeper-human.keeper-center .keeper-arm-left {
  transform: rotate(-72deg);
}

.keeper-human.keeper-center .keeper-arm-right {
  transform: rotate(72deg);
}

.keeper-human.keeper-right {
  left: 80% !important;
  transform: translateX(-50%) translateY(-26px) rotate(24deg) scale(1.08);
}

.keeper-human.keeper-right .keeper-arm-left {
  transform: rotate(35deg);
}

.keeper-human.keeper-right .keeper-arm-right {
  transform: rotate(95deg);
}

.keeper-human.keeper-right .keeper-leg-left {
  transform: rotate(18deg);
}

.keeper-human.keeper-right .keeper-leg-right {
  transform: rotate(-34deg);
}

/* 旧版手套兜底隐藏 */
.keeper,
.glove,
.goalkeeper-glove {
  display: none !important;
}

</style>
