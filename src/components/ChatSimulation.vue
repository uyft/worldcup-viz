<template>
  <div class="chat-area card anim-fadeInUp" :class="`delay-${delay}`">
    <div class="chat-header">
      <div class="chat-title-row">
        <span class="chat-icon">💬</span>
        <h3 class="chat-title">与球星对话</h3>
        <span class="chat-badge">AI 模拟</span>
      </div>
      <p class="chat-subtitle">选择一位球员，和他聊聊世界杯吧！</p>
    </div>

    <div class="chat-body" ref="chatBody">
      <!-- 球员选择 -->
      <div class="chat-players" v-if="!activePlayer">
        <span class="chat-prompt">选择对话对象：</span>
        <div class="chat-player-chips">
          <button v-for="p in players" :key="p.id"
            class="chat-chip"
            @click="selectPlayer(p)">
            <span class="cc-initial" :style="{ background: chipBg(p) }">{{ getInitial(p.name) }}</span>
            <span class="cc-name">{{ p.name }}</span>
          </button>
        </div>
      </div>

      <!-- 对话区域 -->
      <div class="chat-messages" v-else>
        <!-- 欢迎消息 -->
        <div class="msg system-msg">
          <span class="msg-avatar" :style="{ background: chipBg(activePlayer) }">{{ getInitial(activePlayer.name) }}</span>
          <div class="msg-bubble">
            <p>Hey! 我是{{ activePlayer.name }}，很高兴和你聊聊足球！你可以问我关于世界杯、我的职业生涯或者其他任何问题。⚽</p>
          </div>
        </div>

        <!-- 聊天记录 -->
        <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role === 'user' ? 'user-msg' : 'system-msg'">
          <template v-if="m.role === 'system'">
            <span class="msg-avatar" :style="{ background: chipBg(activePlayer) }">{{ getInitial(activePlayer.name) }}</span>
            <div class="msg-bubble"><p>{{ m.text }}</p></div>
          </template>
          <template v-else>
            <div class="msg-bubble user-bubble"><p>{{ m.text }}</p></div>
          </template>
        </div>

        <!-- 快捷问题 -->
        <div class="quick-questions" v-if="messages.length === 0">
          <button v-for="q in quickQuestions" :key="q" class="qq-btn" @click="askQuestion(q)">
            {{ q }}
          </button>
        </div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-input-area" v-if="activePlayer">
      <input
        v-model="inputText"
        @keydown.enter="sendMessage"
        :placeholder="`和 ${activePlayer.name} 说点什么...`"
        class="chat-input"
        :disabled="isTyping"
      />
      <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim() || isTyping">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>

    <!-- 切换球员 -->
    <div class="chat-switch" v-if="activePlayer">
      <button class="switch-btn" @click="activePlayer = null; messages = []">
        ← 换一位球员
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  players: { type: Array, default: () => [] },
  delay: { type: Number, default: 6 },
})

const activePlayer = ref(null)
const messages = ref([])
const inputText = ref('')
const isTyping = ref(false)
const chatBody = ref(null)

// 快捷问题
const quickQuestions = [
  '你觉得今年世界杯谁能夺冠？',
  '你职业生涯最难忘的时刻是什么？',
  '你的训练秘诀是什么？',
  '你最喜欢的队友是谁？',
  '你对年轻球员有什么建议？',
]

// 预置回复库
const responses = {
  '冠军': [
    '哈哈，这个问题很难回答！每支球队都很强，但我相信我们的队伍有实力走到最后。关键是保持专注，一场一场去打。',
    '当然是我们的球队！不过说实话，法国、巴西、英格兰都非常强大，这届世界杯充满了悬念。',
    '冠军靠的是团队，不是个人。我相信只要我们团结一致，任何事情都有可能。'
  ],
  '难忘': [
    '那一定是第一次穿上国家队球衣的时刻，国歌响起的时候，那种感觉无法用语言形容。',
    '世界杯的每一场比赛都很难忘，站在世界最大的舞台上为自己的国家而战，这是每个球员的梦想。'
  ],
  '训练': [
    '每天早起，保持自律。天赋只能带你走那么远，但努力和坚持可以带你到任何地方。',
    '最重要的是保持热情！如果你热爱足球，训练就不会觉得辛苦。另外，休息和恢复同样重要。'
  ],
  '队友': [
    '这个问题太难了！我有太多出色的队友，每个人都很特别。我们就像一家人。',
    '在国家队，每一位队友都像兄弟一样。我们一起战斗，一起流汗，这种羁绊是无可替代的。'
  ],
  '建议': [
    '永远不要放弃你的梦想！我也曾被质疑过，但只要相信自己，努力训练，机会总会来的。',
    '享受足球的快乐是最重要的。技术可以练习，但对足球的热爱是无法被训练的。保持初心！'
  ],
  '默认': [
    '这个问题很有意思！让我想想...足球不仅仅是比赛，它连接了全世界的球迷，这才是最美好的部分。',
    '感谢你的提问！对我来说，每次穿上球衣，都代表着为国家荣誉而战，这是最大的动力。',
    '足球是圆的，什么都可能发生。这也是为什么我们都爱这项运动！'
  ]
}

function getInitial(name) {
  if (/[一-龥]/.test(name)) return name.length > 2 ? name.slice(-2) : name
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function chipBg(p) {
  const bgs = ['#6366F1', '#F43F5E', '#10B981', '#F59E0B', '#06B6D4', '#EC4899']
  return bgs[p.id % bgs.length]
}

function selectPlayer(player) {
  activePlayer.value = player
  messages.value = []
  scrollToBottom()
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
  scrollToBottom()

  // 模拟打字
  isTyping.value = true
  const delay = 800 + Math.random() * 1500
  await new Promise(r => setTimeout(r, delay))

  // 匹配回复
  const reply = generateReply(text)
  messages.value.push({ role: 'system', text: reply })
  isTyping.value = false
  scrollToBottom()
}

function generateReply(text) {
  for (const [key, replies] of Object.entries(responses)) {
    if (key === '默认') continue
    if (text.includes(key)) {
      return replies[Math.floor(Math.random() * replies.length)]
    }
  }
  const def = responses['默认']
  return def[Math.floor(Math.random() * def.length)]
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-area {
  padding: 0; margin-bottom: 20px;
}

.chat-header {
  padding: 20px 24px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.chat-title-row {
  display: flex; align-items: center; gap: 8px; margin-bottom: 4px;
}
.chat-icon { font-size: 20px; }
.chat-title { font-size: 16px; font-weight: 700; color: #E8ECF1; }
.chat-badge {
  padding: 2px 8px; border-radius: 10px;
  font-size: 10px; font-weight: 600;
  background: rgba(34,211,238,0.15); color: #22D3EE;
}
.chat-subtitle { font-size: 12px; color: #5A6478; }

/* 球员选择 */
.chat-body { padding: 16px 24px; max-height: 300px; overflow-y: auto; }
.chat-prompt { font-size: 13px; color: #8892A6; display: block; margin-bottom: 10px; }
.chat-player-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chat-chip {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px 6px 6px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px; cursor: pointer;
  transition: all 0.25s;
}
.chat-chip:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(34,211,238,0.3);
}
.cc-initial {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #fff;
}
.cc-name { font-size: 12px; color: #E8ECF1; }

/* 消息 */
.chat-messages { display: flex; flex-direction: column; gap: 12px; }
.msg { display: flex; gap: 8px; align-items: flex-start; max-width: 90%; }
.system-msg { align-self: flex-start; }
.user-msg { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}
.msg-bubble {
  padding: 10px 14px; border-radius: 14px;
  font-size: 13px; line-height: 1.6;
  background: rgba(255,255,255,0.04); color: #E8ECF1;
  border: 1px solid rgba(255,255,255,0.06);
  border-top-left-radius: 4px;
}
.user-bubble {
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  color: #0B0F1A; border: none;
  border-top-right-radius: 4px; border-top-left-radius: 14px;
}

/* 快捷问题 */
.quick-questions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.qq-btn {
  padding: 5px 12px; border-radius: 14px;
  font-size: 11px; color: #22D3EE;
  background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.15);
  cursor: pointer; transition: all 0.2s;
}
.qq-btn:hover {
  background: rgba(34,211,238,0.12);
  border-color: rgba(34,211,238,0.3);
}

/* 输入区 */
.chat-input-area {
  display: flex; gap: 8px; padding: 12px 24px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.chat-input {
  flex: 1; padding: 10px 16px;
  background: #0F1525; border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px; outline: none;
  font-size: 13px; color: #E8ECF1;
}
.chat-input::placeholder { color: #5A6478; }
.chat-input:focus { border-color: rgba(34,211,238,0.4); }
.send-btn {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #06B6D4, #22D3EE);
  border: none; color: #0B0F1A; cursor: pointer;
  transition: all 0.25s;
}
.send-btn:hover:not(:disabled) { transform: scale(1.05); }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.chat-switch { padding: 8px 24px 16px; }
.switch-btn {
  font-size: 12px; color: #5A6478; background: none; border: none;
  cursor: pointer; transition: color 0.2s;
}
.switch-btn:hover { color: #E8ECF1; }
</style>
