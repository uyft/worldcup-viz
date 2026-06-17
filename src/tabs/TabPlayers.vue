<template>
  <div class="tab-players">
    <!-- ========== Hero ========== -->
    <div class="players-hero">
      <div class="hero-text">
        <h2 class="hero-title"><span class="hero-icon">⚽</span>2026 球星收藏卡</h2>
      </div>
      <div class="hero-badges">
        <span class="badge badge-gold">TOP 40</span>
        <span class="badge badge-cyan">6.11 开幕</span>
      </div>
    </div>

    <!-- ========== 搜索栏（实时筛选） ========== -->
    <div class="search-section anim-fadeInUp delay-1">
      <div class="search-box">
        <svg class="s-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchQuery" type="text"
          placeholder="搜索球员姓名、国家、俱乐部..."
          class="s-input" @input="onSearchInput" />
        <button v-if="searchQuery" class="s-clear" @click="clearSearch">✕</button>
      </div>
      <div class="filter-row">
        <span class="f-label">位置</span>
        <button v-for="pos in positions" :key="pos.value"
          class="f-chip" :class="{ active: activePosition === pos.value }"
          @click="activePosition = activePosition === pos.value ? '' : pos.value">{{ pos.label }}</button>
        <span class="f-divider">|</span>
        <span class="f-label">排序</span>
        <button v-for="s in sorts" :key="s.value"
          class="f-chip" :class="{ active: activeSort === s.value }"
          @click="activeSort = s.value">{{ s.label }}</button>
      </div>
    </div>

    <!-- ========== 动画人物展示区（10人） ========== -->
    <div class="figures-section anim-fadeInUp delay-2">
      <div class="section-bar">
        <h3 class="section-label"><span class="section-dot"></span>精选球星 · 点击观看集锦</h3>
        <span class="section-hint">👆 点击动画人物</span>
      </div>
      <div class="figures-grid">
        <div v-for="(p, i) in featuredPlayers" :key="p.id"
          class="figure-card card"
          :style="{ animationDelay: (0.1 * i) + 's' }"
          @click="playHighlight(p)">
          <!-- 动画人物形象（真实照片 + 独特外观） -->
          <div class="figure-stage" :class="[`figure-pose-${i % 5}`, `figure-build-${p.id % 4}`, `figure-tone-${getSkinTone(p)}`]">
            <div class="figure-body" :style="{ '--fig-height': getFigureHeight(p), '--fig-width': getFigureWidth(p) }">
              <!-- 发型 -->
              <div class="figure-hair" :class="`hair-${p.id % 5}`" :style="{ background: getHairColor(p) }"></div>
              <!-- 头部（真实照片） -->
              <div class="figure-head">
                <img :src="p.image" :alt="p.name" class="figure-face-img"
                  @error="e => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }" />
                <div class="figure-face-fb" :style="{ background: avatarBg(p) }">{{ initials(p.name) }}</div>
              </div>
              <!-- 躯干（球衣） -->
              <div class="figure-torso" :style="{ background: jerseyColor(p) }">
                <span class="figure-number">{{ p.jerseyNumber || p.id }}</span>
              </div>
              <!-- 腿部 -->
              <div class="figure-legs">
                <div class="figure-leg left" :style="{ height: getLegLength(p) }"></div>
                <div class="figure-leg right" :style="{ height: getLegLength(p) }"></div>
              </div>
            </div>
            <!-- 球 -->
            <div class="figure-ball"></div>
            <!-- 光晕 -->
            <div class="figure-aura"></div>
          </div>
          <div class="figure-info">
            <span class="fi-name">{{ p.name }}</span>
            <div class="fi-meta">
              <FlagTag :code="p.countryCode" small />
              <span class="fi-rating" :style="{ color: ratingColor(p.overall) }">{{ p.overall }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 集锦动画层 ========== -->
    <Transition name="hl-fade">
      <div v-if="highlightPlayer" class="highlight-overlay" @click.self="endHighlight">
        <!-- Phase 1: 比赛动画 -->
        <div class="hl-stage" v-if="hlPhase === 'reel'">
          <div class="hl-pitch">
            <!-- 草皮纹理 -->
            <div class="hl-grass-tex"></div>
            <!-- 球场标线 -->
            <div class="hl-pitch-lines">
              <div class="hl-pl-halfline"></div>
              <div class="hl-pl-centercircle"></div>
              <div class="hl-pl-centerdot"></div>
              <div class="hl-pl-box left-box"></div>
              <div class="hl-pl-box right-box"></div>
            </div>
            <!-- 速度线 -->
            <div class="hl-speed-lines" v-if="!hlShowGoal">
              <span v-for="i in 8" :key="i" class="hl-speed-line" :style="{ top: (25 + i * 7) + '%', animationDelay: (i * 0.08) + 's' }"></span>
            </div>
            <!-- 跑动球员 -->
            <div class="hl-player-run" :class="`hl-run-${hlPlayerIndex % 4}`">
              <!-- 球员身体 -->
              <div class="hl-player-body">
                <!-- 头发 -->
                <div class="hl-player-hair" :style="{ background: getHairColor(highlightPlayer) }"></div>
                <!-- 头像圆圈 -->
                <div class="hl-sprite" :style="{ background: avatarBg(highlightPlayer) }">
                  {{ initials(highlightPlayer.name) }}
                </div>
                <!-- 球衣/身体 -->
                <div class="hl-player-torso" :style="{ background: jerseyColor(highlightPlayer) }">
                  <span class="hl-player-num">{{ highlightPlayer.jerseyNumber || highlightPlayer.id }}</span>
                </div>
                <!-- 腿 -->
                <div class="hl-player-legs">
                  <div class="hl-player-leg left"></div>
                  <div class="hl-player-leg right"></div>
                </div>
              </div>
              <!-- 脚下阴影 -->
              <div class="hl-player-shadow"></div>
            </div>
            <!-- 足球 -->
            <div class="hl-football">
              <div class="hl-fb-pentagon"></div>
              <div class="hl-fb-line fb-l1"></div>
              <div class="hl-fb-line fb-l2"></div>
              <div class="hl-fb-line fb-l3"></div>
            </div>
            <!-- 进球闪光 -->
            <div class="hl-goal-flash" v-if="hlShowGoal"></div>
            <!-- 冲击波 -->
            <div class="hl-shockwave" v-if="hlShowGoal"></div>
            <!-- 彩带 -->
            <div class="hl-confetti" v-if="hlShowGoal">
              <span v-for="c in 40" :key="c" class="hl-confetto" :style="confettiStyle(c)"></span>
            </div>
          </div>
          <div class="hl-commentary">
            <span class="hl-commentator">🎙️</span>
            <span class="hl-text">{{ hlCommentary }}</span>
          </div>
          <div class="hl-skip">点击任意位置跳过 →</div>
        </div>

        <!-- Phase 2: 全屏背景装饰 -->
        <div v-if="hlPhase === 'card'" class="hl-card-decor">
          <!-- 左面板：球衣主色 -->
          <div class="hl-decor-left" :style="{ background: 'linear-gradient(90deg, ' + jerseyColor(highlightPlayer) + ' 0%, transparent 100%)' }"></div>
          <!-- 右面板：短裤色 -->
          <div class="hl-decor-right" :style="{ background: 'linear-gradient(270deg, ' + getShortsColor(highlightPlayer) + ' 0%, transparent 100%)' }"></div>
          <!-- 球员ID（模拟球衣号） -->
          <div class="hl-decor-number">{{ highlightPlayer.jerseyNumber || highlightPlayer.id }}</div>
          <!-- 散布星形 -->
          <span v-for="s in 18" :key="s" class="hl-ds" :style="{
            left: (s * 53 + 17) % 88 + '%',
            top: (s * 41 + 11) % 92 + '%',
            animationDelay: (s * 0.3) + 's',
            fontSize: (16 + (s % 5) * 8) + 'px',
          }">★</span>
        </div>

        <!-- Phase 2: 卡片揭幕 -->
        <Transition name="card-pop">
          <div v-if="hlPhase === 'card'" class="hl-card-reveal" @click.stop="openDetail(highlightPlayer)">
            <div class="hl-card-glow"></div>
            <PlayerCard :player="highlightPlayer" :auto-reveal="true" :delay="100" />
            <button class="hl-detail-btn" @click.stop="openDetail(highlightPlayer)">查看完整画像 →</button>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ========== 全部球员网格（搜索时显示搜索结果） ========== -->
    <div class="all-section anim-fadeInUp delay-3">
      <div class="section-bar">
        <h3 class="section-label">
          <span class="section-dot"></span>
          {{ searchQuery ? `搜索结果` : '全部球星收藏卡' }}
          <span class="section-count">共 {{ filteredPlayers.length }} 张</span>
        </h3>
      </div>
      <div class="all-grid" v-if="filteredPlayers.length > 0">
        <div v-for="(p, i) in filteredPlayers" :key="p.id"
          class="all-card-wrap" :style="{ animationDelay: (0.03 * i) + 's' }"
          @click="openDetail(p)">
          <PlayerCard :player="p" :auto-reveal="true" :delay="100 + i * 50" />
        </div>
      </div>
      <div v-else class="empty-state card">
        <span class="empty-icon">🔍</span>
        <p>未找到匹配「{{ searchQuery }}」的球员</p>
        <button class="btn-gold" @click="clearSearch">重置搜索</button>
      </div>
    </div>

    <!-- ========== AI 智能对话 ========== -->
    <ChatAgent :players="players" :delay="5" />

    <!-- ========== 详情弹窗 ========== -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedPlayer" class="modal-overlay" @click.self="closeDetail">
          <Transition name="modal-zoom">
            <div v-if="selectedPlayer" class="modal-content card">
              <button class="modal-close" @click="closeDetail">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
              <!-- Hero -->
              <div class="modal-hero">
                <div class="modal-photo-col">
                  <div class="modal-photo-frame">
                    <img :src="selectedPlayer.image" :alt="selectedPlayer.name" class="modal-photo"
                      @error="e => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }" />
                    <div class="modal-photo-fb" :style="{ background: avatarBg(selectedPlayer) }">{{ initials(selectedPlayer.name) }}</div>
                  </div>
                  <div class="modal-rarity" :class="rarityClass(selectedPlayer.overall)">{{ rarityLabel(selectedPlayer.overall) }}</div>
                </div>
                <div class="modal-info-col">
                  <div class="mi-name-row"><h2>{{ selectedPlayer.name }}</h2><FlagTag :code="selectedPlayer.countryCode" :name="selectedPlayer.country" /></div>
                  <p class="mi-en">{{ selectedPlayer.nameEn }}</p>
                  <div class="mi-tags">
                    <span class="mi-tag">{{ selectedPlayer.position }}</span>
                    <span class="mi-tag">{{ selectedPlayer.club }}</span>
                    <span class="mi-tag">{{ selectedPlayer.age }}岁</span>
                    <span class="mi-tag gold">{{ selectedPlayer.marketValue }}</span>
                  </div>
                  <div class="mi-rating"><span class="mir-num" :style="{ color: ratingColor(selectedPlayer.overall) }">{{ selectedPlayer.overall }}</span><span class="mir-label">综合实力</span></div>
                </div>
              </div>
              <!-- Mid -->
              <div class="modal-mid">
                <div class="mm-radar"><h4>📊 六维能力雷达</h4><v-chart class="mm-chart" :option="detailRadarOpt" autoresize /></div>
                <div class="mm-stats">
                  <h4>📈 核心数据</h4>
                  <div class="mms-grid">
                    <div class="mms-item" v-for="s in playerStats" :key="s.label"><span class="mms-val">{{ s.val }}</span><span class="mms-label">{{ s.label }}</span></div>
                  </div>
                  <div class="mm-attrs">
                    <div class="mma-row" v-for="(val, key) in selectedPlayer.attributes" :key="key">
                      <span class="mma-label">{{ attrLabels[key] }}</span>
                      <div class="mma-track"><div class="mma-fill" :style="{ width: val + '%', background: attrGrad(val) }"></div></div>
                      <span class="mma-val">{{ val }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Bot -->
              <div class="modal-bot">
                <div class="mb-bio"><h4>📝 人物画像</h4><p>{{ selectedPlayer.bio }}</p></div>
                <div class="mb-honors"><h4>🏆 主要荣誉</h4><ul><li v-for="h in selectedPlayer.honors" :key="h"><span>✦</span>{{ h }}</li></ul></div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { RadarComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import FlagTag from '../components/FlagTag.vue'
import PlayerCard from '../components/PlayerCard.vue'
import ChatAgent from '../components/ChatAgent.vue'

use([CanvasRenderer, RadarChart, RadarComponent, TooltipComponent, LegendComponent])

const attrLabels = { pace:'速度',shooting:'射门',passing:'传球',dribbling:'盘带',defending:'防守',physical:'身体' }

// ========== 数据 ==========
const players = ref([])
fetch('/data/players_2026.json').then(r => r.json()).then(d => { players.value = d })

// ========== 筛选状态 ==========
const searchQuery = ref('')
const activePosition = ref('')
const activeSort = ref('overall')
const selectedPlayer = ref(null)

const positions = [
  { label:'全部',value:'' },{ label:'前锋',value:'ST' },{ label:'边锋',value:'W' },
  { label:'中场',value:'M' },{ label:'后腰',value:'CDM' },{ label:'后卫',value:'B' },{ label:'门将',value:'GK' },
]
const sorts = [
  { label:'综合分',value:'overall' },{ label:'进球',value:'goals' },{ label:'身价',value:'market' },
]

// ========== 精选10人 ==========
const featuredPlayers = computed(() => [...players.value].sort((a,b) => b.overall - a.overall).slice(0, 10))

// ========== 实时过滤（搜索+位置+排序） ==========
const filteredPlayers = computed(() => {
  let list = [...players.value]
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q) || p.country.toLowerCase().includes(q) || p.club.toLowerCase().includes(q) || p.countryCode.toLowerCase().includes(q))
  }
  if (activePosition.value) {
    list = list.filter(p => {
      const pos = p.position; const f = activePosition.value
      if (f==='ST') return pos.includes('前锋')||pos.includes('ST')
      if (f==='W') return pos.includes('边锋')||pos.includes('W')
      if (f==='M') return (pos.includes('中场')||pos.includes('CM')||pos.includes('CAM')) && !pos.includes('后腰')
      if (f==='CDM') return pos.includes('后腰')||pos.includes('CDM')
      if (f==='B') return pos.includes('后卫')||pos.includes('B')
      if (f==='GK') return pos.includes('门将')||pos.includes('GK')
      return true
    })
  }
  list.sort((a,b) => {
    if (activeSort.value==='goals') return b.goals - a.goals
    if (activeSort.value==='market') return parseFloat((b.marketValue||'0').replace(/[^0-9.]/g,'')) - parseFloat((a.marketValue||'0').replace(/[^0-9.]/g,''))
    return b.overall - a.overall
  })
  return list
})

// ========== 搜索处理 ==========
function onSearchInput() { /* 实时过滤，无需额外处理 */ }
function clearSearch() { searchQuery.value = ''; activePosition.value = ''; activeSort.value = 'overall' }

// ========== 集锦动画 ==========
const highlightPlayer = ref(null)
const hlPhase = ref('reel') // 'reel' | 'card'
const hlPlayerIndex = ref(0)
const hlShowGoal = ref(false)
const hlCommentary = ref('')
const commentaries = [
  '他带球突破了！速度惊人！！',
  '漂亮的盘带！防守球员跟不上他的节奏！',
  '射门！！！GOOOOOOAL！！！⚽🔥',
  '这就是世界级球星的实力！',
  '全场为之沸腾！这颗进球太精彩了！',
]

async function playHighlight(player) {
  highlightPlayer.value = player
  hlPhase.value = 'reel'
  hlShowGoal.value = false
  hlPlayerIndex.value = player.id
  hlCommentary.value = '他拿球了...'

  // 动画序列
  await wait(600)
  hlCommentary.value = commentaries[0]
  await wait(800)
  hlCommentary.value = commentaries[1]
  await wait(900)
  hlCommentary.value = commentaries[2]
  hlShowGoal.value = true
  await wait(300)

  // 进球后展示卡片
  await wait(1200)
  hlPhase.value = 'card'
}

function endHighlight() {
  if (hlPhase.value === 'card') {
    highlightPlayer.value = null
    hlPhase.value = 'reel'
    hlShowGoal.value = false
  }
}

function confettiStyle(i) {
  return {
    '--x': `${Math.random() * 100}%`,
    '--delay': `${Math.random() * 0.5}s`,
    '--color': ['#FBBF24','#22D3EE','#F43F5E','#10B981','#6366F1','#EC4899'][i % 6],
    '--rot': `${Math.random() * 360}deg`,
  }
}

// ========== 弹窗 ==========
function openDetail(p) { selectedPlayer.value = p; document.body.style.overflow = 'hidden' }
function closeDetail() { selectedPlayer.value = null; document.body.style.overflow = '' }

// ========== 工具 ==========
function wait(ms) { return new Promise(r => setTimeout(r, ms)) }
function initials(n) {
  if (/[一-龥]/.test(n)) return n.length > 2 ? n.slice(-2) : n
  return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
}
function avatarBg(p) {
  const bgs = ['linear-gradient(135deg,#6366F1,#8B5CF6)','linear-gradient(135deg,#F43F5E,#FB7185)','linear-gradient(135deg,#10B981,#34D399)','linear-gradient(135deg,#F59E0B,#FBBF24)','linear-gradient(135deg,#06B6D4,#22D3EE)','linear-gradient(135deg,#EC4899,#F472B6)']
  return bgs[p.id % bgs.length]
}
function jerseyColor(p) {
  // 国家球衣主色映射
  const countryColors = {
    fr: '#1A237E', br: '#FDD835', ar: '#75AADB', de: '#FFFFFF', es: '#C60B1E',
    gb: '#FFFFFF', pt: '#C60B1E', no: '#C60B1E', nl: '#F36C21', hr: '#FFFFFF',
    uy: '#75AADB', eg: '#C60B1E', ma: '#C60B1E', us: '#FFFFFF', ca: '#C60B1E',
    mx: '#006847', co: '#FDD835', be: '#C60B1E',
  }
  return countryColors[p.countryCode] || ['#F43F5E','#6366F1','#10B981','#FBBF24','#22D3EE','#EC4899'][p.id % 6]
}
// 国家球衣次要色（短裤色）
function getShortsColor(p) {
  const shorts = { fr: '#FFFFFF', br: '#1A237E', ar: '#FFFFFF', de: '#000000', es: '#1A237E',
    gb: '#1A237E', pt: '#006847', no: '#1A237E', nl: '#FFFFFF', hr: '#1A237E',
    uy: '#000000', eg: '#000000', ma: '#006847', us: '#1A237E', ca: '#FFFFFF',
    mx: '#FFFFFF', co: '#1A237E', be: '#000000',
  }
  return shorts[p.countryCode] || '#1A237E'
}
function getSkinTone(p) {
  // 基于地区的肤色映射
  const tones = {
    br: 'medium', ar: 'light', fr: 'light', de: 'light', es: 'medium',
    gb: 'light', pt: 'medium', no: 'light', nl: 'light', hr: 'light',
    uy: 'medium', eg: 'medium', ma: 'medium', us: 'light', ca: 'medium',
    mx: 'medium', co: 'medium', be: 'light',
  }
  return tones[p.countryCode] || 'light'
}
function getFigureHeight(p) {
  // 基于位置的体型差异：前锋中等，后卫高大，中场中等偏矮
  const pos = p.position
  if (pos.includes('后卫') || pos.includes('CB') || pos.includes('B')) return '72px'
  if (pos.includes('门将') || pos.includes('GK')) return '74px'
  if (pos.includes('前锋') || pos.includes('ST')) return '66px'
  return '64px' // 中场/边锋
}
function getFigureWidth(p) {
  const pos = p.position
  if (pos.includes('后卫') || pos.includes('CB')) return '14px'
  if (pos.includes('后腰') || pos.includes('CDM')) return '13px'
  if (pos.includes('边锋') || pos.includes('W')) return '10px'
  return '12px'
}
function getLegLength(p) {
  const pos = p.position
  if (pos.includes('后卫') || pos.includes('门将')) return '32px'
  if (pos.includes('前锋') || pos.includes('ST')) return '26px'
  return '28px'
}
function getHairColor(p) {
  const colors = ['#1a1a1a','#3d2b1f','#8B4513','#D4A574','#F5DEB3','#2d2d2d','#4a3728','#c4a882','#1c1c1c','#6b4226']
  return colors[p.id % colors.length]
}
function ratingColor(r) { if(r>=93)return'#FBBF24';if(r>=90)return'#22D3EE';if(r>=87)return'#10B981';if(r>=85)return'#6366F1';return'#8892A6' }
function rarityClass(r) { if(r>=93)return'legendary';if(r>=90)return'epic';if(r>=87)return'rare';if(r>=85)return'uncommon';return'common' }
function rarityLabel(r) { const m={legendary:'传奇',epic:'史诗',rare:'稀有',uncommon:'精良',common:'普通'}; return m[rarityClass(r)] }
function attrGrad(v) { if(v>=90)return'linear-gradient(90deg,#F59E0B,#FBBF24)';if(v>=80)return'linear-gradient(90deg,#22D3EE,#06B6D4)';if(v>=70)return'linear-gradient(90deg,#10B981,#34D399)';return'linear-gradient(90deg,#6366F1,#818CF8)' }

const playerStats = computed(() => {
  if (!selectedPlayer.value) return []
  const p = selectedPlayer.value
  return [{val:p.overall,label:'综合评分'},{val:p.goals,label:'国家队进球'},{val:p.assists,label:'国家队助攻'},{val:p.caps,label:'出场次数'},{val:p.age,label:'年龄'},{val:p.marketValue,label:'市场身价'}]
})

const detailRadarOpt = computed(() => {
  if (!selectedPlayer.value) return {}
  const a = selectedPlayer.value.attributes
  return {
    radar:{center:['50%','55%'],radius:'68%',indicator:[{name:'速度',max:100},{name:'射门',max:100},{name:'传球',max:100},{name:'盘带',max:100},{name:'防守',max:100},{name:'身体',max:100}],axisName:{color:'#8892A6',fontSize:12},splitArea:{areaStyle:{color:['rgba(255,255,255,0.02)','rgba(255,255,255,0.05)']}},splitLine:{lineStyle:{color:'rgba(255,255,255,0.08)'}},axisLine:{lineStyle:{color:'rgba(255,255,255,0.1)'}}},
    series:[{type:'radar',data:[{value:[a.pace,a.shooting,a.passing,a.dribbling,a.defending,a.physical],areaStyle:{opacity:0.2,color:ratingColor(selectedPlayer.value.overall)},lineStyle:{color:ratingColor(selectedPlayer.value.overall),width:2.5},itemStyle:{color:ratingColor(selectedPlayer.value.overall)},symbol:'circle',symbolSize:6}]}],
  }
})
</script>

<style scoped>
.tab-players { padding-top: 8px; }

/* Hero */
.players-hero { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.hero-title { font-size:24px; font-weight:800; color:#E8ECF1; display:flex; align-items:center; gap:8px; }
.hero-icon { font-size:28px; }
.hero-sub { font-size:13px; color:#5A6478; margin-top:4px; }
.hero-badges { display:flex; gap:8px; flex-shrink:0; }
.badge-cyan { background:linear-gradient(135deg,#06B6D4,#22D3EE); color:#0B0F1A; }

/* Search */
.search-section { margin-bottom:24px; }
.search-box { display:flex; align-items:center; gap:10px; padding:10px 10px 10px 18px; background:#141B2D; border:1px solid rgba(255,255,255,0.1); border-radius:16px; margin-bottom:12px; transition:border-color 0.3s; }
.search-box:focus-within { border-color:rgba(34,211,238,0.5); box-shadow:0 0 24px rgba(34,211,238,0.08); }
.s-icon { color:#5A6478; flex-shrink:0; }
.s-input { flex:1; background:none; border:none; outline:none; font-size:15px; color:#E8ECF1; }
.s-input::placeholder { color:#5A6478; }
.s-clear { width:26px; height:26px; border-radius:50%; border:none; background:rgba(255,255,255,0.08); color:#8892A6; cursor:pointer; font-size:12px; }
.filter-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.f-label { font-size:11px; color:#5A6478; font-weight:600; }
.f-chip { padding:4px 12px; border-radius:14px; font-size:11px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); color:#8892A6; cursor:pointer; transition:all 0.2s; }
.f-chip:hover { border-color:rgba(255,255,255,0.14); color:#E8ECF1; }
.f-chip.active { background:linear-gradient(135deg,#06B6D4,#22D3EE); color:#0B0F1A; border-color:transparent; font-weight:700; }
.f-divider { color:rgba(255,255,255,0.06); font-size:16px; margin:0 4px; }

/* Section */
.section-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.section-label { font-size:17px; font-weight:700; color:#E8ECF1; display:flex; align-items:center; gap:8px; }
.section-dot { width:8px; height:8px; border-radius:50%; background:#22D3EE; }
.section-count { font-size:12px; font-weight:500; color:#5A6478; }
.section-hint { font-size:12px; color:#5A6478; animation:pulse 2s ease-in-out infinite; }

/* ========== 动画人物 ========== */
.figures-section { margin-bottom:28px; }
.figures-grid { display:grid; grid-template-columns:repeat(5, 1fr); gap:14px; }

.figure-card {
  padding:16px 10px 12px; cursor:pointer; text-align:center;
  border:1px solid rgba(255,255,255,0.06);
  animation:fadeInUp 0.5s ease-out forwards; opacity:0;
  transition:all 0.3s;
}
.figure-card:hover {
  transform:translateY(-8px);
  border-color:rgba(34,211,238,0.3);
  box-shadow:0 12px 40px rgba(0,0,0,0.5);
}

/* 人物舞台 */
.figure-stage { position:relative; width:100%; height:140px; display:flex; align-items:center; justify-content:center; }
.figure-body { display:flex; flex-direction:column; align-items:center; z-index:1; }

/* 发型 */
.figure-hair {
  width:48px; height:14px; border-radius:50% 50% 0 0;
  position:relative; z-index:2; margin-bottom:-5px;
}
.hair-0 { border-radius:50% 50% 0 0; height:12px; } /* 短发 */
.hair-1 { border-radius:50% 50% 30% 30%; height:16px; transform:scale(1.05); } /* 蓬松 */
.hair-2 { border-radius:40% 40% 0 0; height:10px; width:44px; } /* 板寸 */
.hair-3 { border-radius:50% 50% 20% 20%; height:15px; } /* 卷发 */
.hair-4 { border-radius:50% 50% 10% 10%; height:13px; width:50px; } /* 中长发 */

/* 头部 */
.figure-head { margin-bottom:-2px; position:relative; }
.figure-face-img {
  width:44px; height:44px; border-radius:50%; object-fit:cover;
  border:2px solid rgba(255,255,255,0.2); box-shadow:0 2px 8px rgba(0,0,0,0.3);
}
.figure-face-fb {
  width:44px; height:44px; border-radius:50%; display:none;
  align-items:center; justify-content:center;
  font-size:14px; font-weight:800; color:#fff;
  border:2px solid rgba(255,255,255,0.2);
}

/* 躯干 */
.figure-torso {
  width:34px; height:36px; border-radius:6px 6px 0 0;
  display:flex; align-items:center; justify-content:center;
  position:relative;
}
.figure-number { font-size:10px; font-weight:800; color:rgba(255,255,255,0.9); text-shadow:0 1px 2px rgba(0,0,0,0.3); }

/* 腿部 */
.figure-legs { display:flex; gap:6px; margin-top:-1px; }
.figure-leg { width:10px; height:28px; background:#1A2340; border-radius:0 0 4px 4px; }

/* 不同体型 */
.figure-build-0 .figure-torso { width:30px; height:32px; } /* 瘦削：边锋型 */
.figure-build-0 .figure-leg { width:8px; }
.figure-build-1 .figure-torso { width:36px; height:38px; } /* 健壮：前锋型 */
.figure-build-1 .figure-leg { width:11px; height:30px; }
.figure-build-2 .figure-torso { width:34px; height:40px; } /* 高大：后卫型 */
.figure-build-2 .figure-leg { width:10px; height:32px; }
.figure-build-3 .figure-torso { width:32px; height:34px; } /* 匀称：中场型 */
.figure-build-3 .figure-leg { width:9px; height:28px; }

/* 肤色微调（通过亮度和对比度） */
.figure-tone-medium .figure-face-img { filter: brightness(0.9) saturate(1.1); }
.figure-tone-light .figure-face-img { filter: brightness(1.05) saturate(0.95); }

/* 不同姿态 */
.figure-pose-0 .figure-body { animation:poseIdle 2s ease-in-out infinite; }
.figure-pose-1 .figure-body { animation:poseDribble 1.8s ease-in-out infinite; }
.figure-pose-2 .figure-body { animation:poseJuggle 2.2s ease-in-out infinite; }
.figure-pose-3 .figure-body { animation:poseReady 1.5s ease-in-out infinite; }
.figure-pose-4 .figure-body { animation:poseCelebrate 2.5s ease-in-out infinite; }

@keyframes poseIdle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes poseDribble { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-3px) rotate(-3deg)} 75%{transform:translateY(-3px) rotate(3deg)} }
@keyframes poseJuggle { 0%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} 60%{transform:translateY(-3px)} }
@keyframes poseReady { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-2px) scale(1.05)} }
@keyframes poseCelebrate { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-10px) rotate(-5deg)} 50%{transform:translateY(-5px) rotate(0deg)} 75%{transform:translateY(-12px) rotate(5deg)} }

/* 球 */
.figure-ball {
  position:absolute; bottom:20px; width:14px; height:14px; border-radius:50%;
  background:radial-gradient(circle at 35% 35%, #fff, #E8ECF1 50%, #8892A6 100%);
  z-index:0; animation:ballFloat 1.5s ease-in-out infinite;
}
@keyframes ballFloat { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-20px) translateX(8px)} }

.figure-aura {
  position:absolute; top:50%; left:50%; width:80px; height:80px; border-radius:50%;
  background:radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%);
  transform:translate(-50%,-50%); animation:auraPulse 2s ease-in-out infinite; pointer-events:none;
}
@keyframes auraPulse { 0%,100%{transform:translate(-50%,-50%) scale(1); opacity:0.5} 50%{transform:translate(-50%,-50%) scale(1.3); opacity:1} }

.figure-info { margin-top:8px; }
.fi-name { font-size:14px; font-weight:600; color:#E8ECF1; display:block; }
.fi-meta { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:4px; }
.fi-rating { font-size:13px; font-weight:800; }

/* ========== 集锦动画 ========== */
.highlight-overlay {
  position:fixed; inset:0; z-index:900;
  background:rgba(0,0,0,0.9); backdrop-filter:blur(12px);
  display:flex; align-items:center; justify-content:center;
  flex-direction:column;
}
.hl-stage { width:100%; max-width:800px; text-align:center; position:relative; }
.hl-pitch {
  position:relative; width:100%; height:420px; margin:0 auto;
  background:linear-gradient(180deg, #1a6b30 0%, #155a26 30%, #0f4a1e 60%, #0b3a16 100%);
  border-radius:20px; border:3px solid rgba(255,255,255,0.15);
  overflow:hidden;
  box-shadow: 0 0 60px rgba(16,185,129,0.12), inset 0 0 80px rgba(0,0,0,0.2);
}

/* 草皮纹理 */
.hl-grass-tex {
  position:absolute; inset:0; pointer-events:none;
  background: repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(255,255,255,0.02) 16px, rgba(255,255,255,0.02) 18px);
}

/* 球场标线 */
.hl-pitch-lines { position:absolute; inset:0; pointer-events:none; }
.hl-pl-halfline {
  position:absolute; left:50%; top:0; bottom:0; width:2px;
  background:rgba(255,255,255,0.2);
}
.hl-pl-centercircle {
  position:absolute; left:50%; top:50%; width:80px; height:80px;
  border:2px solid rgba(255,255,255,0.2); border-radius:50%;
  transform:translate(-50%,-50%);
}
.hl-pl-centerdot {
  position:absolute; left:50%; top:50%; width:8px; height:8px;
  background:rgba(255,255,255,0.25); border-radius:50%;
  transform:translate(-50%,-50%);
}
.hl-pl-box {
  position:absolute; top:15%; bottom:15%; width:60px;
  border:2px solid rgba(255,255,255,0.12); border-radius:4px;
}
.left-box { left:6%; border-right: none; }
.right-box { right:6%; border-left: none; }

/* 速度线 */
.hl-speed-lines { position:absolute; inset:0; pointer-events:none; }
.hl-speed-line {
  position:absolute; left:18%; width:40px; height:1.5px;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,0.25));
  animation:speedLine 0.8s ease-out forwards;
}
@keyframes speedLine {
  0% { opacity:1; transform:translateX(0); }
  100% { opacity:0; transform:translateX(-30px); }
}

/* ========== 跑动球员 ========== */
.hl-player-run {
  position:absolute; top:28%; left:8%; z-index:5;
  animation:hlRun 2.2s cubic-bezier(0.25,0.1,0.25,1) forwards;
}
/* 球员组合体 */
.hl-player-body {
  display:flex; flex-direction:column; align-items:center;
  animation:playerBounce 0.4s ease-in-out infinite;
}
@keyframes playerBounce {
  0%, 100% { transform:translateY(0); }
  50% { transform:translateY(-6px); }
}

/* 头发 */
.hl-player-hair {
  width:52px; height:16px; border-radius:50% 50% 0 0;
  position:relative; z-index:2; margin-bottom:-6px;
}

/* 头像 */
.hl-sprite {
  width:70px; height:70px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:24px; font-weight:900; color:#fff;
  border:3px solid rgba(255,255,255,0.35);
  box-shadow:0 0 30px rgba(34,211,238,0.4), 0 4px 16px rgba(0,0,0,0.4);
  position:relative; z-index:1;
}

/* 球衣/躯干 */
.hl-player-torso {
  width:46px; height:50px; border-radius:6px 6px 0 0;
  display:flex; align-items:center; justify-content:center;
  position:relative; margin-top:-3px;
  box-shadow:0 4px 12px rgba(0,0,0,0.3);
}
.hl-player-torso::before {
  content:''; position:absolute; top:0; left:50%; width:2px; height:100%;
  background:rgba(255,255,255,0.12); transform:translateX(-50%);
}
.hl-player-num {
  font-size:16px; font-weight:900; color:rgba(255,255,255,0.85);
  text-shadow:0 1px 3px rgba(0,0,0,0.3);
}

/* 腿 */
.hl-player-legs { display:flex; gap:8px; margin-top:-1px; }
.hl-player-leg {
  width:12px; height:28px; background:#1a1a2e;
  border-radius:0 0 4px 4px;
  animation:legSwing 0.3s ease-in-out infinite alternate;
}
.hl-player-leg.right { animation-delay:-0.15s; }
@keyframes legSwing {
  0% { transform:rotate(-8deg); }
  100% { transform:rotate(8deg); }
}

/* 脚下阴影 */
.hl-player-shadow {
  width:40px; height:8px; border-radius:50%;
  background:rgba(0,0,0,0.35);
  margin-top:2px; filter:blur(2px);
}

/* 跑动轨迹 */
@keyframes hlRun {
  0% { left:6%; top:30%; transform:scale(1); }
  25% { left:30%; top:24%; transform:scale(1.05); }
  50% { left:52%; top:30%; transform:scale(1.08); }
  75% { left:70%; top:26%; transform:scale(1.04); }
  100% { left:86%; top:30%; transform:scale(1); }
}

/* ========== 足球 ========== */
.hl-football {
  position:absolute; width:32px; height:32px; border-radius:50%; z-index:4;
  background:radial-gradient(circle at 35% 30%, #fff 0%, #e8e8e8 60%, #c0c0c0 100%);
  box-shadow:0 0 12px rgba(255,255,255,0.4), inset 0 2px 4px rgba(0,0,0,0.1);
  animation:hlBall 2.2s cubic-bezier(0.25,0.1,0.25,1) forwards, ballSpin 0.6s linear infinite;
}
/* 足球中心五边形 */
.hl-fb-pentagon {
  position:absolute; top:50%; left:50%; width:12px; height:12px;
  background:#1a1a1a; clip-path:polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  transform:translate(-50%,-50%);
}
/* 五边形连线 */
.hl-fb-line {
  position:absolute; top:50%; left:50%; height:1.5px;
  background:rgba(0,0,0,0.15);
  transform-origin:0 0;
}
.fb-l1 { width:18px; transform:translate(-50%,-50%) rotate(0deg); }
.fb-l2 { width:18px; transform:translate(-50%,-50%) rotate(72deg); }
.fb-l3 { width:18px; transform:translate(-50%,-50%) rotate(144deg); }

@keyframes ballSpin {
  0% { transform:rotate(0deg); }
  100% { transform:rotate(360deg); }
}
@keyframes hlBall {
  0% { left:12%; top:34%; }
  30% { left:38%; top:22%; }
  60% { left:58%; top:36%; }
  85% { left:78%; top:24%; }
  100% { left:90%; top:32%; }
}

/* ========== 进球效果 ========== */
/* 闪光 */
.hl-goal-flash {
  position:absolute; inset:0; z-index:6;
  background:radial-gradient(circle at 80% 30%, rgba(255,255,255,0.8), rgba(251,191,36,0.3) 40%, transparent 70%);
  animation:goalFlash 1s ease-out forwards;
}
@keyframes goalFlash {
  0% { opacity:0; transform:scale(0.5); }
  30% { opacity:1; transform:scale(1.2); }
  100% { opacity:0; transform:scale(1.5); }
}

/* 冲击波 */
.hl-shockwave {
  position:absolute; top:30%; left:80%; z-index:5;
  width:20px; height:20px; border-radius:50%;
  border:3px solid rgba(255,255,255,0.5);
  transform:translate(-50%,-50%);
  animation:shockwave 1s ease-out forwards;
}
@keyframes shockwave {
  0% { width:10px; height:10px; opacity:1; }
  100% { width:300px; height:300px; opacity:0; }
}

/* 彩带 */
.hl-confetti { position:absolute; inset:0; overflow:hidden; pointer-events:none; z-index:7; }
.hl-confetto {
  position:absolute; top:-10px; left:var(--x);
  width:6px; height:12px; background:var(--color);
  animation:confettiFall 2.5s ease-out var(--delay) forwards;
  transform:rotate(var(--rot));
}
@keyframes confettiFall {
  0% { top:-10px; opacity:1; transform:rotate(var(--rot)); }
  100% { top:110%; opacity:0; transform:rotate(calc(var(--rot) + 360deg)); }
}

.hl-commentary { margin-top:20px; display:flex; align-items:center; justify-content:center; gap:10px; }
.hl-commentator { font-size:24px; }
.hl-text { font-size:20px; font-weight:700; color:#FBBF24; animation:pulse 1s ease-in-out infinite; }
.hl-skip { margin-top:16px; font-size:12px; color:#5A6478; }

/* Card reveal in highlight */
.hl-card-reveal {
  display:flex; flex-direction:column; align-items:center; gap:16px;
  position: relative; z-index: 2;
}
.hl-card-glow { position:absolute; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%); pointer-events:none; }
.hl-detail-btn {
  padding:12px 32px; border-radius:14px; border:1px solid rgba(34,211,238,0.4);
  background:rgba(34,211,238,0.1); color:#22D3EE; font-size:15px; cursor:pointer;
  transition:all 0.25s; z-index: 2;
}
.hl-detail-btn:hover { background:rgba(34,211,238,0.2); }

/* ---- 全屏背景装饰 ---- */
.hl-card-decor {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  overflow: hidden;
}

/* 左右国旗色大面板 */
.hl-decor-left, .hl-decor-right {
  position: absolute; top: 0; bottom: 0; width: 22%; opacity: 0.18;
}
.hl-decor-left { left: 0; }
.hl-decor-right { right: 0; }

/* 球员ID — 模拟球衣号码 */
.hl-decor-number {
  position: absolute; top: 12%; right: 24%;
  font-size: 180px; font-weight: 900; line-height: 1;
  color: rgba(255,255,255,0.06);
  font-family: 'Impact', 'Arial Black', sans-serif;
  pointer-events: none; user-select: none;
}

/* 散布星形 */
.hl-ds {
  position: absolute;
  color: rgba(255,255,255,0.18);
  animation: dsTwinkle 2.5s ease-in-out infinite;
}
@keyframes dsTwinkle {
  0%, 100% { opacity: 0.5; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.4); }
}

/* Transitions */
.hl-fade-enter-active { transition:opacity 0.4s; }
.hl-fade-leave-active { transition:opacity 0.3s; }
.hl-fade-enter-from,.hl-fade-leave-to { opacity:0; }
.card-pop-enter-active { transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.card-pop-enter-from { opacity:0; transform:scale(0.7) translateY(40px); }

/* ========== All Grid ========== */
.all-section { margin-bottom:24px; }
.all-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:20px; justify-items:center; }
.all-card-wrap { animation:fadeInUp 0.5s ease-out forwards; opacity:0; }
.empty-state { padding:60px; text-align:center; color:#5A6478; margin:20px 0; }
.empty-icon { font-size:48px; display:block; margin-bottom:12px; }
.empty-state p { margin-bottom:16px; }

/* ========== Modal ========== */
.modal-overlay { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.75); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto; }
.modal-content { position:relative; max-width:780px; width:100%; max-height:90vh; overflow-y:auto; padding:0; border:1px solid rgba(255,255,255,0.1); }
.modal-close { position:sticky; top:14px; right:14px; z-index:10; float:right; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:#8892A6; cursor:pointer; transition:all 0.25s; }
.modal-close:hover { background:rgba(255,255,255,0.12); color:#E8ECF1; }
.modal-fade-enter-active{transition:opacity 0.3s}.modal-fade-leave-active{transition:opacity 0.2s}.modal-fade-enter-from,.modal-fade-leave-to{opacity:0}
.modal-zoom-enter-active{transition:all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)}.modal-zoom-leave-active{transition:all 0.2s ease-in}.modal-zoom-enter-from{opacity:0;transform:scale(0.92) translateY(20px)}.modal-zoom-leave-to{opacity:0;transform:scale(0.95)}
.modal-hero{display:flex;gap:24px;padding:32px 32px 20px;border-bottom:1px solid rgba(255,255,255,0.06)}
.modal-photo-col{display:flex;flex-direction:column;align-items:center;gap:8px}
.modal-photo-frame{width:110px;height:110px;border-radius:50%;overflow:hidden;background:#1A2340;border:3px solid rgba(255,255,255,0.12)}
.modal-photo{width:100%;height:100%;object-fit:cover}.modal-photo-fb{width:100%;height:100%;display:none;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff}
.modal-rarity{padding:3px 14px;border-radius:12px;font-size:11px;font-weight:700}
.modal-rarity.legendary{color:#FBBF24;background:rgba(251,191,36,0.12);border:1px solid rgba(251,191,36,0.2)}
.modal-rarity.epic{color:#22D3EE;background:rgba(34,211,238,0.12);border:1px solid rgba(34,211,238,0.2)}
.modal-rarity.rare{color:#818CF8;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.2)}
.modal-rarity.uncommon{color:#34D399;background:rgba(16,185,129,0.12)}
.modal-rarity.common{color:#9CA3AF}
.modal-info-col{flex:1}.mi-name-row{display:flex;align-items:center;gap:10px;margin-bottom:4px}.mi-name-row h2{font-size:24px;font-weight:800;color:#E8ECF1}
.mi-en{font-size:13px;color:#5A6478;margin-bottom:12px}.mi-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.mi-tag{padding:4px 12px;border-radius:20px;font-size:12px;background:rgba(255,255,255,0.05);color:#8892A6}.mi-tag.gold{background:rgba(251,191,36,0.12);color:#FBBF24}
.mi-rating{display:flex;align-items:baseline;gap:8px}.mir-num{font-size:48px;font-weight:900;line-height:1}.mir-label{font-size:13px;color:#5A6478}
.modal-mid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px 32px;border-bottom:1px solid rgba(255,255,255,0.06)}
.mm-radar h4,.mm-stats h4{font-size:14px;font-weight:700;color:#E8ECF1;margin-bottom:10px}
.mm-chart{width:100%;height:260px}.mms-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px}
.mms-item{padding:10px 8px;text-align:center;background:#0F1525;border-radius:10px;border:1px solid rgba(255,255,255,0.04)}
.mms-val{font-size:18px;font-weight:800;color:#E8ECF1;display:block}.mms-label{font-size:10px;color:#5A6478}
.mm-attrs{display:flex;flex-direction:column;gap:7px}.mma-row{display:flex;align-items:center;gap:8px}
.mma-label{font-size:11px;color:#8892A6;width:28px}.mma-track{flex:1;height:5px;background:rgba(255,255,255,0.05);border-radius:3px;overflow:hidden}
.mma-fill{height:100%;border-radius:3px;transition:width 0.6s ease}.mma-val{font-size:11px;font-weight:700;color:#E8ECF1;width:20px;text-align:right}
.modal-bot{display:grid;grid-template-columns:1.2fr 0.8fr;gap:24px;padding:20px 32px 32px}
.mb-bio h4,.mb-honors h4{font-size:14px;font-weight:700;color:#E8ECF1;margin-bottom:10px}
.mb-bio p{font-size:13px;line-height:1.8;color:#8892A6}.mb-honors ul{list-style:none;display:flex;flex-direction:column;gap:7px}
.mb-honors li{font-size:12px;color:#8892A6;display:flex;gap:8px;align-items:flex-start}.mb-honors li span{color:#FBBF24}

/* ========== Responsive ========== */
@media (max-width:1024px) {
  .figures-grid{grid-template-columns:repeat(5,1fr);gap:10px}
  .modal-mid,.modal-bot{grid-template-columns:1fr}
  .modal-hero{flex-direction:column;align-items:center;text-align:center}
  .mi-name-row{justify-content:center}.mi-tags{justify-content:center}.mi-rating{justify-content:center}
}
@media (max-width:768px) {
  .figures-grid{grid-template-columns:repeat(3,1fr)}
  .all-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}
  .hero-title{font-size:20px}
  .hl-pitch{height:280px}
  .hl-sprite{width:50px;height:50px;font-size:18px}
  .hl-player-torso{width:34px;height:38px}
  .hl-player-leg{width:9px;height:22px}
  .hl-football{width:24px;height:24px}
  .hl-fb-pentagon{width:9px;height:9px}
  .hl-fb-line{width:13px}
  .modal-content{margin:8px;max-height:95vh}
  .modal-hero,.modal-mid,.modal-bot{padding:16px}
}
</style>
