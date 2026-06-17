<template>
  <div v-if="visible" class="champion-detail card anim-fadeInUp delay-1">
    <!-- 头部 -->
    <div class="detail-header">
      <h3 class="detail-title">
        <FlagTag :code="countryCode" :name="countryName" />
        世界杯夺冠详情
      </h3>
      <button class="close-btn" @click="emit('close')">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="detail-content">

      <!-- ① 国家整体荣誉统计横栏 -->
      <div class="honor-bar">
        <div class="honor-item">
          <span class="honor-num">{{ totalChampions }}</span>
          <span class="honor-label">🏆 夺冠次数</span>
        </div>
        <div class="honor-divider"></div>
        <div class="honor-item">
          <span class="honor-num">{{ totalWins }}</span>
          <span class="honor-label">⚡ 总胜场</span>
        </div>
        <div class="honor-divider"></div>
        <div class="honor-item">
          <span class="honor-num">{{ totalGoals }}</span>
          <span class="honor-label">⚽ 总进球</span>
        </div>
        <div class="honor-divider"></div>
        <div class="honor-item">
          <span class="honor-num">{{ winRate }}%</span>
          <span class="honor-label">📊 总胜率</span>
        </div>
        <div class="honor-divider"></div>
        <div class="honor-item">
          <span class="honor-num best-scorer-name">{{ bestScorer }}</span>
          <span class="honor-label">⭐ 历届最佳射手</span>
        </div>
      </div>

      <!-- ② 夺冠年份选择标签 -->
      <div class="title-section">
        <span class="title-icon">🏆</span>
        <h4>夺冠年份 · 点击查看详情</h4>
      </div>
      <div class="year-list">
        <span
          v-for="year in championYears"
          :key="year"
          class="year-tag"
          :class="{ active: selectedYear === year }"
          @click="selectYear(year)"
        >{{ year }}</span>
      </div>

      <!-- ③ 选中年份详情面板 -->
      <transition name="fade-slide">
        <div v-if="activeDetail" :key="selectedYear" class="year-panel">

          <div class="year-detail-main">
            <!-- 合照图片 -->
            <div class="photo-section">
              <div class="photo-wrap">
                <img
                  :src="activeDetail.photo"
                  :alt="`${countryName} ${selectedYear} 夺冠合照`"
                  class="champion-photo"
                  @error="onImgError"
                />
                <div class="photo-label">{{ selectedYear }} · {{ activeDetail.host }} · 夺冠合照</div>
              </div>
            </div>

            <div class="detail-info">
              <!-- 赛事统计数据卡片 -->
              <div class="stats-row">
                <div class="stat-card">
                  <span class="stat-num">{{ activeDetail.stats.matches }}</span>
                  <span class="stat-label">参赛场次</span>
                </div>
                <div class="stat-card wins">
                  <span class="stat-num">{{ activeDetail.stats.wins }}</span>
                  <span class="stat-label">胜场</span>
                </div>
                <div class="stat-card draws">
                  <span class="stat-num">{{ activeDetail.stats.draws }}</span>
                  <span class="stat-label">平局</span>
                </div>
                <div class="stat-card losses">
                  <span class="stat-num">{{ activeDetail.stats.losses }}</span>
                  <span class="stat-label">负场</span>
                </div>
                <div class="stat-card goals">
                  <span class="stat-num">{{ activeDetail.stats.goalsFor }}</span>
                  <span class="stat-label">进球</span>
                </div>
                <div class="stat-card conceded">
                  <span class="stat-num">{{ activeDetail.stats.goalsAgainst }}</span>
                  <span class="stat-label">失球</span>
                </div>
                <div class="stat-card diff">
                  <span class="stat-num">+{{ activeDetail.stats.goalsFor - activeDetail.stats.goalsAgainst }}</span>
                  <span class="stat-label">净胜球</span>
                </div>
                <div class="stat-card scorer">
                  <span class="stat-num scorer-name">{{ activeDetail.stats.topScorer }}</span>
                  <span class="stat-label">本届最佳射手</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 本届亮点 -->
          <div v-if="activeDetail.highlight" class="highlight-bar">
            <span class="highlight-icon">💡</span>
            <span class="highlight-text">{{ activeDetail.highlight }}</span>
          </div>

          <!-- 本届冠军阵容 -->
          <div class="title-section mt-16">
            <span class="title-icon">📌</span>
            <h4>{{ selectedYear }} 冠军阵容</h4>
          </div>
          <div class="players-grid">
            <div v-for="player in activeDetail.players" :key="player.name" class="player-item">
              <span class="player-name">{{ player.name }}</span>
              <span class="player-position">{{ player.position }}</span>
              <span v-if="player.goals" class="player-goals">⚽ {{ player.goals }}球</span>
            </div>
          </div>
        </div>
      </transition>

      <!-- ④ 核心参赛球员（跨届） -->
      <div class="title-section mt-16">
        <span class="title-icon">⭐</span>
        <h4>历届核心球员</h4>
      </div>
      <div class="players-grid">
        <div v-for="player in corePlayers" :key="player.name" class="player-item core">
          <span class="player-name">{{ player.name }}</span>
          <span class="player-position">{{ player.position }}</span>
          <span v-if="player.goals" class="player-goals">⚽ {{ player.goals }}球</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FlagTag from './FlagTag.vue'

const props = defineProps({
  country: { type: String, default: '' },
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

// ==================== 数据定义 ====================
// photo 字段：优先放真实图片（public/images/xxx.jpg），找不到时显示占位渐变
const championData = {
  '巴西': {
    code: 'br',
    bestScorer: '罗纳尔多',
    champions: [
      {
        year: 1958, host: '瑞典',
        photo: '/images/brazil_1958.png',
        highlight: '贝利年仅17岁横空出世，成为世界杯史上最年轻冠军球员',
        stats: { matches: 6, wins: 5, draws: 1, losses: 0, goalsFor: 16, goalsAgainst: 4, topScorer: '贝利(6球)' },
        players: [
          { name: '贝利', position: '前锋', goals: 6 },
          { name: '加林查', position: '前锋', goals: 4 },
          { name: '日尔梅', position: '中场', goals: 2 },
          { name: '迪迪', position: '中场', goals: 3 },
          { name: '吉尔马', position: '门将' },
          { name: '尼尔顿·桑托斯', position: '后卫' }
        ]
      },
      {
        year: 1962, host: '智利',
        photo: '/images/brazil_1962.jpg',
        highlight: '加林查在贝利受伤后独撑大局，率队卫冕成功',
        stats: { matches: 6, wins: 5, draws: 1, losses: 0, goalsFor: 14, goalsAgainst: 5, topScorer: '加林查(4球)' },
        players: [
          { name: '加林查', position: '前锋', goals: 4 },
          { name: '瓦瓦', position: '前锋', goals: 4 },
          { name: '扎加洛', position: '中场' },
          { name: '贝利', position: '前锋', goals: 1 },
          { name: '吉尔马', position: '门将' },
          { name: '迪迪', position: '中场', goals: 2 }
        ]
      },
      {
        year: 1970, host: '墨西哥',
        photo: '/images/brazil_1970.jpeg',
        highlight: '史上最华丽的巴西队，贝利第三次夺冠，巴西永久保留雷米特杯',
        stats: { matches: 6, wins: 6, draws: 0, losses: 0, goalsFor: 19, goalsAgainst: 7, topScorer: '雅伊尔津霍(7球)' },
        players: [
          { name: '贝利', position: '前锋', goals: 4 },
          { name: '雅伊尔津霍', position: '前锋', goals: 7 },
          { name: '托斯唐', position: '前锋', goals: 4 },
          { name: '里维利诺', position: '中场', goals: 3 },
          { name: '费利克斯', position: '门将' },
          { name: '卡洛斯·阿尔贝托', position: '后卫', goals: 1 }
        ]
      },
      {
        year: 1994, host: '美国',
        photo: '/images/brazil_1994.jpeg',
        highlight: '24年等待终告结束，罗马里奥+贝贝托锋线无解，决赛点球击败意大利',
        stats: { matches: 7, wins: 5, draws: 2, losses: 0, goalsFor: 11, goalsAgainst: 3, topScorer: '罗马里奥(5球)' },
        players: [
          { name: '罗马里奥', position: '前锋', goals: 5 },
          { name: '贝贝托', position: '前锋', goals: 3 },
          { name: '马济尼奥', position: '中场' },
          { name: '莱奥纳多', position: '中场' },
          { name: '塔法雷尔', position: '门将' },
          { name: '卡福', position: '后卫' }
        ]
      },
      {
        year: 2002, host: '日本/韩国',
        photo: '/images/brazil_2002.jpeg',
        highlight: '大罗复出，与小罗、里瓦尔多共同创造，巴西以全胜战绩第五次登顶',
        stats: { matches: 7, wins: 7, draws: 0, losses: 0, goalsFor: 18, goalsAgainst: 4, topScorer: '罗纳尔多(8球)' },
        players: [
          { name: '罗纳尔多', position: '前锋', goals: 8 },
          { name: '罗纳尔迪尼奥', position: '中场', goals: 2 },
          { name: '里瓦尔多', position: '中场', goals: 5 },
          { name: '卡卡', position: '中场' },
          { name: '卡福', position: '后卫' },
          { name: '马科斯', position: '门将' }
        ]
      }
    ],
    corePlayers: [
      { name: '贝利', position: '前锋', goals: 77 },
      { name: '罗纳尔多', position: '前锋', goals: 15 },
      { name: '加林查', position: '前锋', goals: 12 },
      { name: '卡福', position: '后卫' },
      { name: '罗纳尔迪尼奥', position: '中场', goals: 33 }
    ]
  },

  '德国': {
    code: 'de',
    bestScorer: '克洛泽(16球)',
    champions: [
      {
        year: 1954, host: '瑞士',
        photo: '/images/germany_1954.jpeg',
        highlight: '伯尔尼奇迹！小组赛大比分惨败匈牙利，决赛逆转同一对手夺冠',
        stats: { matches: 6, wins: 5, draws: 0, losses: 1, goalsFor: 25, goalsAgainst: 14, topScorer: '莫洛克(6球)' },
        players: [
          { name: '赫尔穆特·拉恩', position: '前锋', goals: 4 },
          { name: '莫洛克', position: '前锋', goals: 6 },
          { name: '弗里茨·沃尔特', position: '中场', goals: 3 },
          { name: '图雷克', position: '门将' },
          { name: '利布里希', position: '后卫' }
        ]
      },
      {
        year: 1974, host: '西德',
        photo: '/images/germany_1974.jpg',
        highlight: '贝肯鲍尔主场称王，决赛2-1击败荷兰全攻全守，德国队史巅峰',
        stats: { matches: 7, wins: 6, draws: 0, losses: 1, goalsFor: 19, goalsAgainst: 7, topScorer: '盖德·穆勒(4球)' },
        players: [
          { name: '盖德·穆勒', position: '前锋', goals: 4 },
          { name: '贝肯鲍尔', position: '中场/后卫', goals: 1 },
          { name: '博内霍夫', position: '中场' },
          { name: '迈尔', position: '门将' },
          { name: '福格茨', position: '后卫' }
        ]
      },
      {
        year: 1990, host: '意大利',
        photo: '/images/germany_1990.jpg',
        highlight: '马特乌斯率队夺冠，决赛点球点绝杀阿根廷，马拉多纳悲壮落幕',
        stats: { matches: 7, wins: 6, draws: 1, losses: 0, goalsFor: 15, goalsAgainst: 5, topScorer: '克林斯曼(4球)' },
        players: [
          { name: '克林斯曼', position: '前锋', goals: 4 },
          { name: '马特乌斯', position: '中场', goals: 4 },
          { name: '沃勒尔', position: '前锋', goals: 3 },
          { name: '伊尔格纳', position: '门将' },
          { name: '科勒', position: '后卫' }
        ]
      },
      {
        year: 2014, host: '巴西',
        photo: '/images/germany_2014.jpg',
        highlight: '7-1大胜东道主巴西震惊世界，格策补时黄金进球加冕，克洛泽破纪录16球',
        stats: { matches: 7, wins: 6, draws: 1, losses: 0, goalsFor: 18, goalsAgainst: 4, topScorer: '穆勒(5球)' },
        players: [
          { name: '穆勒', position: '前锋', goals: 5 },
          { name: '克洛泽', position: '前锋', goals: 2 },
          { name: '厄齐尔', position: '中场', goals: 1 },
          { name: '诺伊尔', position: '门将' },
          { name: '胡梅尔斯', position: '后卫', goals: 1 },
          { name: '格策', position: '中场', goals: 1 }
        ]
      }
    ],
    corePlayers: [
      { name: '克洛泽', position: '前锋', goals: 16 },
      { name: '贝肯鲍尔', position: '中场/后卫', goals: 5 },
      { name: '马特乌斯', position: '中场', goals: 6 },
      { name: '盖德·穆勒', position: '前锋', goals: 14 },
      { name: '穆勒', position: '前锋', goals: 10 }
    ]
  },

  '意大利': {
    code: 'it',
    bestScorer: '保罗·罗西(6球)',
    champions: [
      {
        year: 1934, host: '意大利',
        photo: '/images/italy_1934.jpeg',
        highlight: '墨索里尼政治助威下，意大利主场夺得首座大力神杯',
        stats: { matches: 5, wins: 4, draws: 1, losses: 0, goalsFor: 12, goalsAgainst: 3, topScorer: '斯基亚维奥(4球)' },
        players: [
          { name: '斯基亚维奥', position: '前锋', goals: 4 },
          { name: '梅阿查', position: '前锋', goals: 2 },
          { name: '鲁伊斯', position: '中场' },
          { name: '坎帕纳蒂', position: '门将' }
        ]
      },
      {
        year: 1938, host: '法国',
        photo: '/images/italy_1938.jpeg',
        highlight: '卫冕成功，梅阿查领衔，成为首支卫冕成功的球队',
        stats: { matches: 4, wins: 4, draws: 0, losses: 0, goalsFor: 11, goalsAgainst: 5, topScorer: '皮奥拉(5球)' },
        players: [
          { name: '皮奥拉', position: '前锋', goals: 5 },
          { name: '梅阿查', position: '前锋', goals: 2 },
          { name: '安德雷奥洛', position: '门将' },
          { name: '比安科尼', position: '中场' }
        ]
      },
      {
        year: 1982, host: '西班牙',
        photo: '/images/italy_1982.jpg',
        highlight: '保罗·罗西小组赛沉寂后突然爆发，4场打进6球，意大利3-2巴西、3-1西德',
        stats: { matches: 7, wins: 4, draws: 3, losses: 0, goalsFor: 12, goalsAgainst: 6, topScorer: '保罗·罗西(6球)' },
        players: [
          { name: '保罗·罗西', position: '前锋', goals: 6 },
          { name: '塔尔德利', position: '中场', goals: 2 },
          { name: '科勒奥尼', position: '中场' },
          { name: '佐夫', position: '门将' },
          { name: '金塔尼', position: '后卫' }
        ]
      },
      {
        year: 2006, host: '德国',
        photo: '/images/italy_2006.jpeg',
        highlight: '卡纳瓦罗铜墙铁壁，决赛点球击败法国，齐达内头撞马特拉齐成永恒记忆',
        stats: { matches: 7, wins: 5, draws: 2, losses: 0, goalsFor: 12, goalsAgainst: 2, topScorer: '托尼(2球)' },
        players: [
          { name: '卡纳瓦罗', position: '后卫' },
          { name: '布冯', position: '门将' },
          { name: '托蒂', position: '前锋', goals: 1 },
          { name: '托尼', position: '前锋', goals: 2 },
          { name: '卡莫拉内西', position: '中场' },
          { name: '皮尔洛', position: '中场' }
        ]
      }
    ],
    corePlayers: [
      { name: '布冯', position: '门将' },
      { name: '卡纳瓦罗', position: '后卫' },
      { name: '保罗·罗西', position: '前锋', goals: 9 },
      { name: '巴乔', position: '前锋', goals: 9 },
      { name: '皮尔洛', position: '中场', goals: 5 }
    ]
  },

  '阿根廷': {
    code: 'ar',
    bestScorer: '梅西(13球)',
    champions: [
      {
        year: 1978, host: '阿根廷',
        photo: '/images/argentina_1978.jpg',
        highlight: '肯佩斯横扫全场6球，主场加冕，阿根廷历史首冠',
        stats: { matches: 7, wins: 5, draws: 1, losses: 1, goalsFor: 15, goalsAgainst: 4, topScorer: '肯佩斯(6球)' },
        players: [
          { name: '肯佩斯', position: '前锋', goals: 6 },
          { name: '帕萨雷拉', position: '后卫', goals: 1 },
          { name: '贝尔托尼', position: '中场' },
          { name: '费利皮', position: '门将' }
        ]
      },
      {
        year: 1986, host: '墨西哥',
        photo: '/images/argentina_1986.jpeg',
        highlight: '马拉多纳神迹之年：上帝之手+世纪进球，个人英雄主义书写传奇',
        stats: { matches: 7, wins: 6, draws: 0, losses: 1, goalsFor: 14, goalsAgainst: 5, topScorer: '马拉多纳(5球)' },
        players: [
          { name: '马拉多纳', position: '中场', goals: 5 },
          { name: '布鲁查加', position: '中场', goals: 5 },
          { name: '巴尔达诺', position: '前锋', goals: 2 },
          { name: '鲁杰里', position: '后卫' },
          { name: '彭佩多', position: '门将' }
        ]
      },
      {
        year: 2022, host: '卡塔尔',
        photo: '/images/argentina_2022.jpeg',
        highlight: '梅西圆梦，史诗决赛加时+点球击败法国，最完美的世界杯收官之作',
        stats: { matches: 7, wins: 5, draws: 2, losses: 0, goalsFor: 15, goalsAgainst: 8, topScorer: '梅西(7球)' },
        players: [
          { name: '梅西', position: '前锋', goals: 7 },
          { name: '迪马利亚', position: '前锋', goals: 3 },
          { name: '阿尔瓦雷斯', position: '前锋', goals: 4 },
          { name: '恩佐', position: '中场', goals: 1 },
          { name: '马丁内斯', position: '门将' },
          { name: '罗梅罗', position: '后卫' }
        ]
      }
    ],
    corePlayers: [
      { name: '梅西', position: '前锋', goals: 13 },
      { name: '马拉多纳', position: '中场', goals: 8 },
      { name: '肯佩斯', position: '前锋', goals: 6 },
      { name: '迪马利亚', position: '前锋', goals: 4 },
      { name: '巴蒂斯图塔', position: '前锋', goals: 10 }
    ]
  },

  '法国': {
    code: 'fr',
    bestScorer: '姆巴佩(12球)',
    champions: [
      {
        year: 1998, host: '法国',
        photo: '/images/france_1998.jpeg',
        highlight: '齐达内决赛双响，亨利板凳生辉，法国主场3-0巴西举起金杯',
        stats: { matches: 7, wins: 6, draws: 1, losses: 0, goalsFor: 15, goalsAgainst: 2, topScorer: '苏格阿纳(6球)' },
        players: [
          { name: '齐达内', position: '中场', goals: 2 },
          { name: '亨利', position: '前锋', goals: 3 },
          { name: '德尚', position: '中场' },
          { name: '巴特斯', position: '门将' },
          { name: '利扎拉祖', position: '后卫' },
          { name: '图拉姆', position: '后卫' }
        ]
      },
      {
        year: 2018, host: '俄罗斯',
        photo: '/images/france_2018.jpeg',
        highlight: '姆巴佩横空出世，多点开花4-2击败克罗地亚，法国20年后再度登顶',
        stats: { matches: 7, wins: 6, draws: 1, losses: 0, goalsFor: 14, goalsAgainst: 6, topScorer: '姆巴佩(4球)' },
        players: [
          { name: '姆巴佩', position: '前锋', goals: 4 },
          { name: '格里兹曼', position: '前锋', goals: 3 },
          { name: '博格巴', position: '中场', goals: 1 },
          { name: '洛里斯', position: '门将' },
          { name: '瓦拉内', position: '后卫' },
          { name: '帕瓦尔', position: '后卫', goals: 1 }
        ]
      }
    ],
    corePlayers: [
      { name: '齐达内', position: '中场', goals: 5 },
      { name: '姆巴佩', position: '前锋', goals: 12 },
      { name: '亨利', position: '前锋', goals: 12 },
      { name: '格里兹曼', position: '前锋', goals: 7 },
      { name: '图拉姆', position: '后卫' }
    ]
  },

  '乌拉圭': {
    code: 'uy',
    bestScorer: '斯卡罗内',
    champions: [
      {
        year: 1930, host: '乌拉圭',
        photo: '/images/uruguay_1930.jpeg',
        highlight: '世界杯历史首届，乌拉圭主场4-2击败阿根廷，奥运双冠夺首届世界杯冠军',
        stats: { matches: 4, wins: 4, draws: 0, losses: 0, goalsFor: 15, goalsAgainst: 3, topScorer: '苏比亚布雷(3球)' },
        players: [
          { name: '斯卡罗内', position: '前锋', goals: 2 },
          { name: '卡斯特罗', position: '前锋', goals: 3 },
          { name: '多拉多', position: '前锋', goals: 2 },
          { name: '纳扎齐', position: '门将' }
        ]
      },
      {
        year: 1950, host: '巴西',
        photo: '/images/uruguay_1950.jpeg',
        highlight: '马拉卡纳惨案！吉吉亚绝杀，巴西主场含泪落败，20万观众沉默',
        stats: { matches: 4, wins: 3, draws: 1, losses: 0, goalsFor: 15, goalsAgainst: 5, topScorer: '斯科乔尼(5球)' },
        players: [
          { name: '吉吉亚', position: '前锋', goals: 4 },
          { name: '斯科乔尼', position: '前锋', goals: 5 },
          { name: '格伦博纳', position: '中场' },
          { name: '马斯波利', position: '门将' }
        ]
      }
    ],
    corePlayers: [
      { name: '斯卡罗内', position: '前锋' },
      { name: '吉吉亚', position: '前锋', goals: 7 },
      { name: '斯科乔尼', position: '前锋', goals: 8 },
      { name: '苏亚雷斯', position: '前锋', goals: 3 }
    ]
  },

  '英格兰': {
    code: 'gb',
    bestScorer: '赫斯特(4球)',
    champions: [
      {
        year: 1966, host: '英格兰',
        photo: '/images/england_1966.jpg',
        highlight: '赫斯特世界杯决赛帽子戏法空前绝后，4-2击败西德，唯一一次夺冠',
        stats: { matches: 6, wins: 5, draws: 1, losses: 0, goalsFor: 11, goalsAgainst: 3, topScorer: '赫斯特(4球)' },
        players: [
          { name: '赫斯特', position: '前锋', goals: 4 },
          { name: '博比·查尔顿', position: '中场', goals: 3 },
          { name: '博比·摩尔', position: '后卫' },
          { name: '班克斯', position: '门将' },
          { name: '彼得斯', position: '中场', goals: 1 }
        ]
      }
    ],
    corePlayers: [
      { name: '博比·查尔顿', position: '中场', goals: 4 },
      { name: '赫斯特', position: '前锋', goals: 4 },
      { name: '博比·摩尔', position: '后卫' },
      { name: '班克斯', position: '门将' }
    ]
  },

  '西班牙': {
    code: 'es',
    bestScorer: '比利亚(9球)',
    champions: [
      {
        year: 2010, host: '南非',
        photo: '/images/spain_2010.jpg',
        highlight: '伊涅斯塔加时绝杀荷兰，Tiki-taka传控足球征服世界，西班牙首次捧杯',
        stats: { matches: 7, wins: 6, draws: 1, losses: 0, goalsFor: 8, goalsAgainst: 2, topScorer: '比利亚(5球)' },
        players: [
          { name: '比利亚', position: '前锋', goals: 5 },
          { name: '伊涅斯塔', position: '中场', goals: 1 },
          { name: '哈维', position: '中场' },
          { name: '卡西利亚斯', position: '门将' },
          { name: '普约尔', position: '后卫' },
          { name: '纳瓦斯', position: '前锋' }
        ]
      }
    ],
    corePlayers: [
      { name: '哈维', position: '中场' },
      { name: '伊涅斯塔', position: '中场', goals: 1 },
      { name: '比利亚', position: '前锋', goals: 9 },
      { name: '卡西利亚斯', position: '门将' },
      { name: '普约尔', position: '后卫' }
    ]
  }
}

// ==================== 响应式状态 ====================
const countryName = ref('')
const countryCode = ref('')
const yearDetails = ref([])
const corePlayers = ref([])
const selectedYear = ref(null)
const bestScorer = ref('')

// 计算属性
const championYears = computed(() => yearDetails.value.map(item => item.year))
const totalChampions = computed(() => yearDetails.value.length)
const totalWins = computed(() => yearDetails.value.reduce((s, i) => s + i.stats.wins, 0))
const totalGoals = computed(() => yearDetails.value.reduce((s, i) => s + i.stats.goalsFor, 0))
const totalMatches = computed(() => yearDetails.value.reduce((s, i) => s + i.stats.matches, 0))
const winRate = computed(() => totalMatches.value > 0 ? Math.round((totalWins.value / totalMatches.value) * 100) : 0)
const activeDetail = computed(() => yearDetails.value.find(i => i.year === selectedYear.value) || null)

// 选择年份
const selectYear = (year) => {
  selectedYear.value = selectedYear.value === year ? null : year
}

// 图片加载失败降级
const onImgError = (e) => {
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  if (parent) {
    parent.style.background = 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.15) 100%)'
    const placeholder = document.createElement('div')
    placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;color:#5A6478;font-size:13px;font-family:monospace;'
    placeholder.textContent = '暂无合照'
    parent.appendChild(placeholder)
  }
}

// 监听选中国家变化
watch(() => props.country, (newVal) => {
  if (newVal && championData[newVal]) {
    const data = championData[newVal]
    countryName.value = newVal
    countryCode.value = data.code
    yearDetails.value = data.champions
    corePlayers.value = data.corePlayers
    bestScorer.value = data.bestScorer || '-'
    // 默认选中最近一届
    selectedYear.value = data.champions[data.champions.length - 1].year
  } else {
    countryName.value = ''
    countryCode.value = ''
    yearDetails.value = []
    corePlayers.value = []
    selectedYear.value = null
    bestScorer.value = ''
  }
}, { immediate: true })
</script>

<style scoped>
/* ========== 整体容器 ========== */
.champion-detail {
  margin: 20px 0;
  padding: 24px;
  background: rgba(10, 14, 28, 0.95);
  border-radius: 0px;
  border: 1px solid rgba(14, 165, 233, 0.3);
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.08);
}

/* ========== 头部 ========== */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(14, 165, 233, 0.2);
}
.detail-title {
  font-size: 18px;
  font-weight: 700;
  color: #E8ECF1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
}
.close-btn {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 0px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8892A6;
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: rgba(14, 165, 233, 0.15);
  color: #38BDF8;
  border-color: #38BDF8;
}

/* ========== 荣誉统计横栏 ========== */
.honor-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(90deg, rgba(14,165,233,0.08) 0%, rgba(139,92,246,0.08) 100%);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 0px;
  padding: 16px 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.honor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.honor-num {
  font-size: 22px;
  font-weight: 900;
  color: #FBBF24;
  font-family: monospace;
  text-shadow: 0 0 10px rgba(251,191,36,0.5);
  line-height: 1;
}
.honor-num.best-scorer-name {
  font-size: 14px;
}
.honor-label {
  font-size: 11px;
  color: #5A6478;
  font-family: monospace;
  white-space: nowrap;
}
.honor-divider {
  width: 1px;
  height: 36px;
  background: rgba(14, 165, 233, 0.2);
}

/* ========== 小节标题 ========== */
.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 12px;
}
.title-section.mt-16 {
  margin-top: 20px;
}
.title-icon { font-size: 16px; }
.title-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: #E8ECF1;
  font-family: monospace;
}

/* ========== 年份标签 ========== */
.year-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}
.year-tag {
  background: rgba(14, 165, 233, 0.1);
  color: #38BDF8;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 14px;
  border: 1px solid rgba(14, 165, 233, 0.35);
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: monospace;
  user-select: none;
}
.year-tag:hover {
  background: rgba(14, 165, 233, 0.2);
  border-color: #38BDF8;
  color: #FFF;
}
.year-tag.active {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  color: #0B0F1A;
  border-color: #FBBF24;
  box-shadow: 0 0 12px rgba(251,191,36,0.4);
}

/* ========== 年份详情面板动画 ========== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ========== 年份面板 ========== */
.year-panel {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(14, 165, 233, 0.15);
  border-radius: 0px;
  padding: 20px;
  margin-bottom: 8px;
}
.year-detail-main {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.detail-info {
  flex: 1 1 320px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.photo-section {
  flex: 0 0 min(520px, 55%);
  margin-bottom: 16px;
}
.photo-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 240px;
  max-height: 420px;
  background: rgba(14, 165, 233, 0.06);
  border: 1px solid rgba(14, 165, 233, 0.2);
  overflow: hidden;
  border-radius: 0px;
}
.champion-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;
}
.photo-wrap:hover .champion-photo {
  transform: scale(1.04);
}
.photo-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 14px;
  background: linear-gradient(0deg, rgba(2,6,23,0.9) 0%, transparent 100%);
  font-size: 12px;
  color: #94A3B8;
  font-family: monospace;
}

/* ========== 统计数据行 ========== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}
@media (min-width: 1000px) {
  .stats-row {
    grid-template-columns: repeat(4, 1fr);
  }
}
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 0px;
  text-align: center;
}
.stat-card.wins { border-color: rgba(34,211,238,0.3); }
.stat-card.goals { border-color: rgba(251,191,36,0.3); }
.stat-card.diff { border-color: rgba(139,92,246,0.3); }
.stat-card.scorer { border-color: rgba(248,113,113,0.3); grid-column: span 2; }
.stat-num {
  font-size: 20px;
  font-weight: 900;
  color: #38BDF8;
  font-family: monospace;
  line-height: 1;
}
.stat-card.wins .stat-num { color: #22D3EE; }
.stat-card.draws .stat-num { color: #94A3B8; }
.stat-card.losses .stat-num { color: #F87171; }
.stat-card.goals .stat-num { color: #FBBF24; }
.stat-card.conceded .stat-num { color: #FB923C; }
.stat-card.diff .stat-num { color: #A78BFA; }
.stat-card.scorer .stat-num { font-size: 13px; color: #F9A8D4; }
.scorer-name { font-size: 13px !important; }
.stat-label {
  font-size: 10px;
  color: #4A5568;
  font-family: monospace;
  white-space: nowrap;
}

/* ========== 本届亮点 ========== */
.highlight-bar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(251,191,36,0.06);
  border-left: 3px solid #FBBF24;
  margin-bottom: 4px;
}
.highlight-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
.highlight-text {
  font-size: 13px;
  color: #CBD5E1;
  line-height: 1.6;
  font-style: italic;
}

/* ========== 球员网格 ========== */
.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}
.player-item {
  background: rgba(255,255,255,0.04);
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 0px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: border-color 0.2s;
}
.player-item:hover { border-color: rgba(14,165,233,0.3); }
.player-item.core { border-color: rgba(139,92,246,0.2); }
.player-name {
  font-size: 13px;
  font-weight: 600;
  color: #E8ECF1;
}
.player-position {
  font-size: 11px;
  color: #5A6478;
}
.player-goals {
  font-size: 11px;
  color: #FBBF24;
  font-family: monospace;
}

/* ========== 响应式 ========== */
@media (max-width: 600px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .stat-card.scorer { grid-column: span 2; }
  .honor-bar { gap: 8px; }
  .honor-divider { display: none; }
  .photo-wrap { height: 150px; }
}
</style>
