<template>
  <div class="chat-area card anim-fadeInUp" :class="`delay-${delay}`">
    <div class="chat-header">
      <div class="chat-title-row">
        <span class="chat-icon">🤖</span>
        <h3 class="chat-title">AI 球星对话</h3>
        <span class="chat-badge">智能体</span>
        <span class="chat-status" :class="{ online: agentReady }">{{ agentReady ? '● 在线' : '○ 离线本地' }}</span>
      </div>
      <p class="chat-subtitle">选择球员，与AI驱动的智能体聊世界杯、战术和个人生涯</p>
    </div>

    <div class="chat-body" ref="chatBody">
      <!-- 球员选择 -->
      <div class="chat-player-select" v-if="!activePlayer">
        <span class="cps-label">选择对话对象：</span>
        <div class="cps-grid">
          <button v-for="p in topPlayers" :key="p.id" class="cps-chip" @click="selectPlayer(p)">
            <span class="cps-avatar" :style="{ background: avatarBg(p) }">{{ init(p.name) }}</span>
            <span class="cps-name">{{ p.name }}</span>
            <FlagTag :code="p.countryCode" small />
          </button>
        </div>
      </div>

      <!-- 对话 -->
      <div class="chat-messages" v-else>
        <div class="msg system-msg">
          <span class="msg-avatar" :style="{ background: avatarBg(activePlayer) }">{{ init(activePlayer.name) }}</span>
          <div class="msg-bubble">
            <p>👋 你好！我是 <strong>{{ activePlayer.name }}</strong>，{{ activePlayer.club }}的{{ activePlayer.position.split('/')[0].trim() }}。</p>
            <p>我的综合评分是 <strong style="color:#FBBF24">{{ activePlayer.overall }}</strong>，代表{{ activePlayer.country }}出战{{ activePlayer.caps }}场攻入{{ activePlayer.goals }}球。</p>
            <p>想聊什么？战术、世界杯、我的职业生涯，随便问！</p>
          </div>
        </div>

        <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role === 'user' ? 'user-msg' : 'system-msg'">
          <template v-if="m.role === 'assistant'">
            <span class="msg-avatar" :style="{ background: avatarBg(activePlayer) }">{{ init(activePlayer.name) }}</span>
            <div class="msg-bubble"><p v-html="m.text"></p></div>
          </template>
          <template v-else>
            <div class="msg-bubble user-bubble"><p>{{ m.text }}</p></div>
          </template>
        </div>

        <div v-if="isTyping" class="msg system-msg">
          <span class="msg-avatar" :style="{ background: avatarBg(activePlayer) }">{{ init(activePlayer.name) }}</span>
          <div class="msg-bubble typing-bubble">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>

        <div class="quick-questions" v-if="messages.length <= 1">
          <span class="qq-label">💡 试试这些：</span>
          <button v-for="q in quickQs" :key="q" class="qq-btn" @click="askQuestion(q)">{{ q }}</button>
        </div>
      </div>
    </div>

    <div class="chat-input-area" v-if="activePlayer">
      <input v-model="inputText" @keydown.enter="sendMessage"
        :placeholder="`和 ${activePlayer.name} 聊天...`"
        class="chat-input" :disabled="isTyping" />
      <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim() || isTyping">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>

    <div class="chat-switch" v-if="activePlayer">
      <button class="switch-btn" @click="activePlayer = null; messages = []; agentReady = false">← 换一位球员</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import FlagTag from './FlagTag.vue'

const props = defineProps({ players: { type: Array, default: () => [] }, delay: { type: Number, default: 5 } })

const activePlayer = ref(null)
const messages = ref([])
const inputText = ref('')
const isTyping = ref(false)
const agentReady = ref(false)
const chatBody = ref(null)

const topPlayers = computed(() => props.players.slice(0, 12))

const quickQs = [
  '你觉得今年世界杯谁能夺冠？',
  '给我讲讲你的职业生涯故事',
  '你觉得下一场比赛该怎么踢？',
  '你职业生涯最难忘的时刻是什么？',
  '你对年轻球员有什么建议？',
  '分析一下你球队的战术打法',
]

function init(n) {
  if (/[一-龥]/.test(n)) return n.length > 2 ? n.slice(-2) : n
  return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function avatarBg(p) {
  const bgs = ['#6366F1', '#F43F5E', '#10B981', '#F59E0B', '#06B6D4', '#EC4899']
  return bgs[p.id % bgs.length]
}

async function selectPlayer(player) {
  activePlayer.value = player
  messages.value = []
  // Try connecting to AI agent backend
  try {
    const res = await fetch('/api/chat/health')
    if (res.ok) agentReady.value = true
  } catch { agentReady.value = false }
  scrollDown()
}

function askQuestion(q) {
  inputText.value = q
  sendMessage()
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isTyping.value) return

  messages.value.push({ role: 'user', text })
  inputText.value = ''
  scrollDown()
  isTyping.value = true

  try {
    if (agentReady.value) {
      // 调用真实 AI 后端
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player: {
            name: activePlayer.value.name,
            nameEn: activePlayer.value.nameEn,
            country: activePlayer.value.country,
            club: activePlayer.value.club,
            position: activePlayer.value.position,
            age: activePlayer.value.age,
            overall: activePlayer.value.overall,
            goals: activePlayer.value.goals,
            assists: activePlayer.value.assists,
            caps: activePlayer.value.caps,
            bio: activePlayer.value.bio,
            honors: activePlayer.value.honors,
            attributes: activePlayer.value.attributes,
          },
          message: text,
          history: messages.value.slice(-6).map(m => ({ role: m.role, content: m.text })),
        }),
      })
      const data = await res.json()
      messages.value.push({ role: 'assistant', text: formatResponse(data.reply) })
    } else {
      // 本地智能回复
      await new Promise(r => setTimeout(r, 600 + Math.random() * 1200))
      messages.value.push({ role: 'assistant', text: formatResponse(localReply(text)) })
    }
  } catch {
    await new Promise(r => setTimeout(r, 400 + Math.random() * 800))
    messages.value.push({ role: 'assistant', text: formatResponse(localReply(text)) })
  }

  isTyping.value = false
  scrollDown()
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/⚽/g, '<span style="font-size:1.2em">⚽</span>')
    .replace(/🏆/g, '<span style="font-size:1.2em">🏆</span>')
    .replace(/🔥/g, '<span style="font-size:1.2em">🔥</span>')
}

function localReply(text) {
  const p = activePlayer.value
  const q = text.toLowerCase()

  // Player-specific responses based on actual data
  if (q.includes('夺冠') || q.includes('冠军') || q.includes('世界杯')) {
    const replies = [
      `这届世界杯竞争太激烈了！**${p.country}**有很强的实力，我们的目标是走得更远。${p.overall >= 90 ? '作为世界顶级球员，我相信我们能创造奇迹！🏆' : '团队合作是最重要的！'}`,
      `冠军是我从小的梦想！我在**${p.club}**踢球积累了很多经验。这届世界杯我们${p.country}准备充分，会一场一场拼。⚽`,
      `看看这些强队：法国、巴西、英格兰...但足球是圆的，什么都可能发生。我现在的状态是**${p.overall}分**，会全力以赴！`,
    ]
    return replies[p.id % replies.length]
  }

  if (q.includes('职业') || q.includes('经历') || q.includes('故事')) {
    return `我从小就开始踢球，梦想就是站上世界之巅。现在效力于**${p.club}**，代表**${p.country}**出战${p.caps}场打进${p.goals}球。${p.bio.substring(0, 60)}...这条路很不容易，但每一滴汗水都值得！💪`
  }

  if (q.includes('战术') || q.includes('打法') || q.includes('踢法')) {
    const pos = p.position.split('/')[0].trim()
    const attrs = p.attributes
    const bestAttr = Object.entries(attrs).sort((a, b) => b[1] - a[1])[0]
    const attrName = { pace: '速度', shooting: '射门', passing: '传球', dribbling: '盘带', defending: '防守', physical: '身体' }[bestAttr[0]]
    return `作为${pos}，我最大的优势是**${attrName}**（${bestAttr[1]}分）。在**${p.club}**我们习惯高压逼抢+快速转换。国家队则更注重整体防守和反击效率。这届世界杯我们会根据对手灵活调整！`
  }

  if (q.includes('建议') || q.includes('年轻') || q.includes('新人')) {
    return `给年轻球员的建议：**第一，永远热爱足球**，这是最重要的动力。**第二，每天都要比昨天更努力**，天赋只能带你走这么远。**第三，学会在困难中成长**，我也经历过低谷。我在${p.age}岁才达到**${p.overall}分**的巅峰，所以要坚持！🔥`
  }

  if (q.includes('难忘') || q.includes('时刻') || q.includes('回忆')) {
    return `最难忘的时刻...太多了！每次穿上**${p.country}**的球衣，听到国歌响起的那一刻，都让我热泪盈眶。${p.honors[0] ? `特别是赢得**${p.honors[0]}**的时候，那是我职业生涯的巅峰时刻之一！` : ''}这些回忆会伴随我一生。`
  }

  // Default replies with player context
  const defaults = [
    `哈，这个问题挺有意思！作为**${p.club}**的球员，我见过不少类似的情况。世界杯的舞台让每个人都充满动力！⚽`,
    `感谢你的提问！足球不仅仅是90分钟的比赛，它代表了团队精神和国家荣誉。我在**${p.country}**队每一场比赛都全力以赴。`,
    `说实话，我更习惯用脚说话！但既然你问了——这届世界杯我状态不错（评分**${p.overall}**），希望能为球队多做贡献。🔥`,
    `每个人都有自己的观点，但我相信行动胜于言语。等比赛开始你就知道了！${p.country}加油！💪`,
  ]
  return defaults[p.id % defaults.length]
}

function scrollDown() {
  nextTick(() => {
    if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
  })
}
</script>

<style scoped>
.chat-area { padding: 0; margin-bottom: 20px; }
.chat-header { padding: 20px 24px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.chat-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
.chat-icon { font-size: 20px; }
.chat-title { font-size: 16px; font-weight: 700; color: #E8ECF1; }
.chat-badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; background: rgba(34,211,238,0.15); color: #22D3EE; }
.chat-status { font-size: 10px; color: #5A6478; margin-left: 4px; }
.chat-status.online { color: #10B981; }
.chat-subtitle { font-size: 12px; color: #5A6478; }

/* Player select */
.chat-body { padding: 16px 24px; max-height: 320px; overflow-y: auto; }
.cps-label { font-size: 13px; color: #8892A6; display: block; margin-bottom: 10px; }
.cps-grid { display: flex; gap: 6px; flex-wrap: wrap; }
.cps-chip { display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; cursor: pointer; transition: all 0.25s; }
.cps-chip:hover { background: rgba(255,255,255,0.08); border-color: rgba(34,211,238,0.3); }
.cps-avatar { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; }
.cps-name { font-size: 12px; color: #E8ECF1; }

/* Messages */
.chat-messages { display: flex; flex-direction: column; gap: 12px; }
.msg { display: flex; gap: 8px; align-items: flex-start; max-width: 88%; }
.system-msg { align-self: flex-start; }
.user-msg { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; }
.msg-bubble { padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.7; background: rgba(255,255,255,0.04); color: #E8ECF1; border: 1px solid rgba(255,255,255,0.06); border-top-left-radius: 4px; }
.user-bubble { background: linear-gradient(135deg, #06B6D4, #22D3EE); color: #0B0F1A; border: none; border-top-right-radius: 4px; border-top-left-radius: 14px; }
.typing-bubble { display: flex; gap: 4px; padding: 14px 18px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: #5A6478; animation: dotBounce 1.4s ease-in-out infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotBounce { 0%,80%,100% { transform: scale(0.6); } 40% { transform: scale(1); } }

/* Quick Qs */
.qq-label { font-size: 11px; color: #5A6478; display: block; margin-bottom: 6px; }
.quick-questions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.qq-btn { padding: 5px 12px; border-radius: 14px; font-size: 11px; color: #22D3EE; background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.15); cursor: pointer; transition: all 0.2s; }
.qq-btn:hover { background: rgba(34,211,238,0.12); border-color: rgba(34,211,238,0.3); }

/* Input */
.chat-input-area { display: flex; gap: 8px; padding: 12px 24px; border-top: 1px solid rgba(255,255,255,0.06); }
.chat-input { flex: 1; padding: 10px 16px; background: #0F1525; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; outline: none; font-size: 13px; color: #E8ECF1; }
.chat-input::placeholder { color: #5A6478; }
.chat-input:focus { border-color: rgba(34,211,238,0.4); }
.send-btn { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #06B6D4, #22D3EE); border: none; color: #0B0F1A; cursor: pointer; transition: all 0.25s; }
.send-btn:hover:not(:disabled) { transform: scale(1.05); }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.chat-switch { padding: 8px 24px 16px; }
.switch-btn { font-size: 12px; color: #5A6478; background: none; border: none; cursor: pointer; transition: color 0.2s; }
.switch-btn:hover { color: #E8ECF1; }
</style>
