<template>
  <div class="commentator-root">
    <!-- 浮动触发按钮 -->
    <button class="cmt-trigger" :class="{ active: isOpen }" @click="togglePanel" title="AI解说员">
      <div class="cmt-trigger-icon">
        <svg v-if="!isOpen" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>
      <span class="cmt-trigger-label">{{ isOpen ? '关闭' : 'AI解说' }}</span>
      <!-- 脉冲环 -->
      <span v-if="!isOpen" class="cmt-pulse"></span>
    </button>

    <!-- 展开面板 -->
    <Transition name="panel-slide">
      <div v-if="isOpen" class="cmt-panel">
        <!-- 头部 -->
        <div class="cmt-header">
          <div class="cmt-header-left">
            <span class="cmt-avatar">🎙️</span>
            <div>
              <div class="cmt-title">AI解说员 · 小世</div>
              <div class="cmt-subtitle">{{ isSpeaking ? '正在播报...' : '在线' }}</div>
            </div>
          </div>
          <div class="cmt-header-actions">
            <button class="cmt-btn-icon" :class="{ active: autoSpeak }" @click="autoSpeak = !autoSpeak" title="自动播报">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path v-if="!autoSpeak" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
          </div>
        </div>

        <!-- Tab切换 -->
        <div class="cmt-tabs">
          <button class="cmt-tab" :class="{ active: activeMode === 'guide' }" @click="activeMode = 'guide'">📋 语音导览</button>
          <button class="cmt-tab" :class="{ active: activeMode === 'chat' }" @click="activeMode = 'chat'">💬 AI问答</button>
        </div>

        <!-- ===== 语音导览模式 ===== -->
        <div v-if="activeMode === 'guide'" class="cmt-body">
          <div class="guide-list">
            <button
              v-for="g in quickGuides"
              :key="g.key"
              class="guide-item"
              :class="{ playing: currentGuide === g.key && isSpeaking }"
              @click="playGuide(g.key)"
            >
              <span class="guide-label">{{ g.label }}</span>
              <span class="guide-status">
                <span v-if="currentGuide === g.key && isSpeaking" class="status-speaking">
                  <span class="wave-dot"></span><span class="wave-dot"></span><span class="wave-dot"></span>
                </span>
                <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </span>
            </button>
          </div>
          <!-- 播放控制 -->
          <div v-if="currentGuide" class="guide-controls">
            <div class="guide-now">{{ commentaryScripts[currentGuide]?.title || '' }}</div>
            <div class="guide-actions">
              <button class="cmt-btn-sm" @click="toggleSpeak">
                {{ isSpeaking ? '⏸ 暂停' : '▶ 继续' }}
              </button>
              <button class="cmt-btn-sm" @click="stopSpeak">⏹ 停止</button>
            </div>
          </div>
        </div>

        <!-- ===== AI问答模式 ===== -->
        <div v-if="activeMode === 'chat'" class="cmt-body">
          <!-- 消息列表 -->
          <div class="chat-messages" ref="chatMsgs">
            <div v-if="chatHistory.length === 0" class="chat-empty">
              <div class="chat-empty-icon">💬</div>
              <p>问我关于世界杯数据可视化的任何问题</p>
              <div class="chat-suggestions">
                <button v-for="q in suggestedQuestions" :key="q" class="chat-suggest" @click="sendMessage(q)">{{ q }}</button>
              </div>
            </div>
            <div v-for="(msg, i) in chatHistory" :key="i" class="chat-msg" :class="msg.role">
              <div class="chat-msg-avatar">{{ msg.role === 'user' ? '👤' : '🎙️' }}</div>
              <div class="chat-msg-bubble" v-text="msg.content"></div>
            </div>
            <div v-if="chatLoading" class="chat-msg assistant">
              <div class="chat-msg-avatar">🎙️</div>
              <div class="chat-msg-bubble typing">
                <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
              </div>
            </div>
          </div>
          <!-- 输入区 -->
          <div class="chat-input-area">
            <input
              v-model="chatInput"
              class="chat-input"
              placeholder="输入问题，如：这个平台有哪些功能？"
              @keydown.enter="sendMessage()"
              :disabled="chatLoading"
            />
            <button class="cmt-btn-send" @click="sendMessage()" :disabled="chatLoading || !chatInput.trim()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
          <!-- API配置提示 -->
          <div v-if="!apiConfigured" class="chat-api-hint">
            ⚠️ 未配置API Key，当前使用本地知识库回复。
            <button @click="showApiConfig = true">配置API</button>
          </div>
        </div>

        <!-- API配置弹窗 -->
        <div v-if="showApiConfig" class="cmt-api-modal">
          <div class="cmt-api-card">
            <div class="cmt-api-title">配置 AI API</div>
            <p class="cmt-api-desc">支持 OpenAI 兼容接口（DeepSeek / 通义千问 / 智谱等）</p>
            <label class="cmt-api-field">
              <span>API Key</span>
              <input v-model="apiKeyInput" type="password" placeholder="sk-..." />
            </label>
            <label class="cmt-api-field">
              <span>Base URL（可选）</span>
              <input v-model="apiBaseInput" placeholder="https://api.deepseek.com/v1" />
            </label>
            <label class="cmt-api-field">
              <span>模型</span>
              <input v-model="apiModelInput" placeholder="deepseek-chat" />
            </label>
            <div class="cmt-api-actions">
              <button class="cmt-btn-sm" @click="showApiConfig = false">取消</button>
              <button class="cmt-btn-sm primary" @click="saveApiConfig">保存</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { commentaryScripts, quickGuides, platformKnowledge } from '../data/commentary.js'

// ==================== 获取当前页面上下文 ====================
// 通过读取 DOM 中的 data 属性或 URL 判断当前所在页面
function getPageContext() {
  // 尝试从 sidebar 激活状态获取当前 Tab
  const activeTab = document.querySelector('.sidebar .nav-item.active')
  const tabName = activeTab?.textContent?.trim() || '总览'

  const tabContexts = {
    '总览': '用户正在查看"总览"页面。该页面包含：Hero区(2026世界杯开幕倒计时、快捷入口)、8个ECharts交互图表(桑基图展示球队晋级流向、面积折线图展示历届进球趋势、气泡图对比各队攻防实力、雷达图评估球队综合能力、柱状图展示多项数据对比)、战报滚动条、历届冠军卡片、夺冠热门预测。',
    '历史': '用户正在查看"历史"页面。该页面展示1930-2022历届世界杯冠军数据，包含夺冠次数统计、历史对阵记录等。',
    '赛程': '用户正在查看"赛程"页面。该页面展示2026世界杯完整赛程，包含48队12组小组赛安排和32强淘汰赛对阵树。',
    '积分': '用户正在查看"积分"页面。该页面展示12个小组的实时排名表(胜平负/进球/失球/净胜球/积分)，以及攻防散点图、积分分布堆叠柱状图、积分趋势折线图等多维分析图表。',
    '球员': '用户正在查看"球员"页面。该页面展示球员数据统计，包含射手榜、助攻榜等。',
    '地图': '用户正在查看"地图"页面。该页面展示2026世界杯16个主办城市的地理分布(美国11个、加拿大2个、墨西哥3个)，可点击查看场馆信息。'
  }

  return tabContexts[tabName] || tabContexts['总览']
}

// ==================== 面板状态 ====================
const isOpen = ref(false)
const activeMode = ref('guide')
const autoSpeak = ref(true)

function togglePanel() {
  isOpen.value = !isOpen.value
  if (isOpen.value && autoSpeak.value && !currentGuide.value) {
    setTimeout(() => playGuide('welcome'), 500)
  }
  if (!isOpen.value) stopSpeak()
}

// ==================== 语音播报 ====================
const isSpeaking = ref(false)
const currentGuide = ref(null)
let utterance = null

function playGuide(key) {
  stopSpeak()
  currentGuide.value = key
  const script = commentaryScripts[key]
  if (!script) return

  utterance = new SpeechSynthesisUtterance(script.text)
  utterance.lang = 'zh-CN'
  utterance.rate = 0.95
  utterance.pitch = 1.05
  utterance.onstart = () => { isSpeaking.value = true }
  utterance.onend = () => { isSpeaking.value = false; currentGuide.value = null }
  utterance.onerror = () => { isSpeaking.value = false; currentGuide.value = null }
  speechSynthesis.speak(utterance)
}

function toggleSpeak() {
  if (isSpeaking.value) {
    speechSynthesis.pause()
    isSpeaking.value = false
  } else {
    speechSynthesis.resume()
    isSpeaking.value = true
  }
}

function stopSpeak() {
  speechSynthesis.cancel()
  isSpeaking.value = false
  currentGuide.value = null
}

onUnmounted(() => stopSpeak())

// ==================== AI对话 ====================
const chatInput = ref('')
const chatHistory = ref([])
const chatLoading = ref(false)
const chatMsgs = ref(null)
const showApiConfig = ref(false)
const apiKeyInput = ref(localStorage.getItem('cmt_api_key') || '')
const apiBaseInput = ref(localStorage.getItem('cmt_api_base') || 'https://api.deepseek.com/v1')
const apiModelInput = ref(localStorage.getItem('cmt_api_model') || 'deepseek-chat')
const apiConfigured = ref(!!apiKeyInput.value)

const suggestedQuestions = [
  '这个平台有哪些功能？',
  '2026世界杯有多少支球队参赛？',
  '积分页面怎么看？',
  '主办城市有哪些？'
]

function saveApiConfig() {
  localStorage.setItem('cmt_api_key', apiKeyInput.value)
  localStorage.setItem('cmt_api_base', apiBaseInput.value)
  localStorage.setItem('cmt_api_model', apiModelInput.value)
  apiConfigured.value = !!apiKeyInput.value
  showApiConfig.value = false
}

async function sendMessage(text) {
  const msg = text || chatInput.value.trim()
  if (!msg || chatLoading.value) return
  chatInput.value = ''

  chatHistory.value.push({ role: 'user', content: msg })
  await scrollToBottom()

  if (apiConfigured.value) {
    await callAI(msg)
  } else {
    await localReply(msg)
  }
}

async function callAI(msg) {
  chatLoading.value = true
  try {
    const pageCtx = getPageContext()
    const systemPrompt = platformKnowledge + '\n\n## 当前页面上下文（重要！）\n' + pageCtx + '\n\n请基于以上上下文回答用户问题。如果用户问"这个"、"当前页面"、"这里"等指代词，请根据当前页面上下文来回答。回答要简洁，不超过150字。'

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.value.map(m => ({ role: m.role, content: m.content }))
    ]

    // 智能拼接 API URL：如果已包含 /chat/completions 则直接使用，否则补全
    let apiUrl = apiBaseInput.value.replace(/\/$/, '')
    if (!apiUrl.endsWith('/chat/completions')) {
      apiUrl += '/chat/completions'
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKeyInput.value
      },
      body: JSON.stringify({
        model: apiModelInput.value,
        messages,
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!res.ok) throw new Error('API请求失败: ' + res.status)
    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'
    chatHistory.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    chatHistory.value.push({ role: 'assistant', content: 'API调用失败：' + e.message + '。请检查API配置或切换本地知识库模式。' })
  } finally {
    chatLoading.value = false
    await scrollToBottom()
  }
}

function localReply(msg) {
  chatLoading.value = true
  const q = msg.toLowerCase()
  const pageCtx = getPageContext()
  let reply = ''

  // 指代词检测：如果用户问"这个"、"当前"、"这里"，直接返回页面上下文
  if (/这个|当前|这里|本页|此页/.test(q) && !/功能|介绍|有什么|多少|球队|积分|排名|城市|主办|地图|图表|可视化|赛程|比赛/.test(q)) {
    reply = pageCtx
  } else if (q.includes('功能') || q.includes('介绍') || q.includes('有什么')) {
    reply = '平台包含6大功能模块：📊 总览（8个交互图表+倒计时）、📜 历史（历届冠军数据）、📅 赛程（完整比赛安排+淘汰赛对阵树）、🏆 积分（12组排名+多维分析图表）、⚽ 球员（射手榜/助攻榜）、🗺️ 地图（16个主办城市分布）。点击左侧导航栏即可切换！'
  } else if (q.includes('球队') || q.includes('多少') || q.includes('参赛')) {
    reply = '2026美加墨世界杯共有48支球队参赛，分为12个小组，每组4支球队。这是世界杯历史上首次扩军至48队！小组前两名晋级32强淘汰赛。'
  } else if (q.includes('积分') || q.includes('排名')) {
    reply = '积分页面展示12个小组的实时排名，包含胜平负、进球失球、净胜球和积分数据。还提供攻防散点图、积分分布堆叠图和积分趋势折线图，帮您多维度分析各队表现。点击左侧"积分"Tab即可查看。'
  } else if (q.includes('城市') || q.includes('主办') || q.includes('地图')) {
    reply = '2026世界杯由美国、加拿大、墨西哥三国联合主办，共16个主办城市：美国11个（纽约、洛杉矶、达拉斯等）、加拿大2个（温哥华、多伦多）、墨西哥3个（墨西哥城、瓜达拉哈拉、蒙特雷）。点击"地图"Tab查看详细分布。'
  } else if (q.includes('图表') || q.includes('可视化')) {
    reply = '总览页包含8个ECharts交互图表：桑基图（球队晋级流向）、面积折线图（历届进球趋势）、气泡图（攻防实力对比）、雷达图（球队综合评估）等。鼠标悬停可查看详细数值，所有图表支持缩放和拖拽。'
  } else if (q.includes('赛程') || q.includes('比赛')) {
    reply = '2026世界杯赛程包含小组赛（48队分12组）和淘汰赛（32强→16强→8强→半决赛→决赛）。赛程页面提供完整的比赛时间表和淘汰赛对阵树，一目了然。'
  } else {
    reply = '我是AI解说员小世，可以为您介绍平台功能、世界杯数据、球队信息等。您也可以配置DeepSeek等AI API获得更智能的回答。试试问我"平台有哪些功能"或"主办城市有哪些"吧！'
  }

  setTimeout(() => {
    chatHistory.value.push({ role: 'assistant', content: reply })
    chatLoading.value = false
    scrollToBottom()
  }, 600)
}

async function scrollToBottom() {
  await nextTick()
  if (chatMsgs.value) {
    chatMsgs.value.scrollTop = chatMsgs.value.scrollHeight
  }
}
</script>

<style scoped>
/* ===== 根容器 ===== */
.commentator-root {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 1000;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== 浮动触发按钮 ===== */
.cmt-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%);
  border: none;
  border-radius: 28px;
  padding: 10px 20px;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 24px rgba(34,211,238,0.35);
  transition: all 0.3s ease;
  position: relative;
}
.cmt-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 32px rgba(34,211,238,0.45);
}
.cmt-trigger.active {
  background: linear-gradient(135deg, #5A6B82 0%, #3A4B62 100%);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.cmt-trigger-icon {
  display: flex; align-items: center;
}
.cmt-trigger-label {
  font-size: 13px;
}
.cmt-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 32px;
  border: 2px solid rgba(34,211,238,0.4);
  animation: pulseRing 2s ease-out infinite;
  pointer-events: none;
}
@keyframes pulseRing {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.15); opacity: 0; }
}

/* ===== 面板 ===== */
.cmt-panel {
  position: absolute;
  right: 0;
  bottom: 60px;
  width: 360px;
  max-height: 520px;
  background: rgba(15,20,35,0.97);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

/* 面板滑入动画 */
.panel-slide-enter-active { animation: panelIn 0.3s ease-out; }
.panel-slide-leave-active { animation: panelOut 0.2s ease-in; }
@keyframes panelIn {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes panelOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(16px) scale(0.95); }
}

/* ===== 头部 ===== */
.cmt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.cmt-header-left {
  display: flex; align-items: center; gap: 10px;
}
.cmt-avatar { font-size: 24px; }
.cmt-title { font-size: 14px; font-weight: 700; color: #E8ECF1; }
.cmt-subtitle { font-size: 11px; color: #22D3EE; font-weight: 500; }
.cmt-btn-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #8892A6;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.cmt-btn-icon:hover, .cmt-btn-icon.active { color: #22D3EE; border-color: rgba(34,211,238,0.3); }

/* ===== Tab切换 ===== */
.cmt-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.cmt-tab {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #5A6B82;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.cmt-tab.active {
  background: rgba(34,211,238,0.1);
  color: #22D3EE;
}
.cmt-tab:hover:not(.active) { color: #8892A6; }

/* ===== 语音导览列表 ===== */
.cmt-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.guide-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.guide-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #A0AEC0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.guide-item:hover {
  background: rgba(255,255,255,0.04);
  color: #E8ECF1;
}
.guide-item.playing {
  background: rgba(251,191,36,0.08);
  color: #FBBF24;
}
.guide-status {
  display: flex; align-items: center;
  color: #5A6B82;
}
.guide-item.playing .guide-status { color: #FBBF24; }

/* 波形动画 */
.status-speaking {
  display: flex; align-items: flex-end; gap: 2px; height: 14px;
}
.wave-dot {
  width: 3px; border-radius: 1px;
  background: #FBBF24;
  animation: waveAnim 0.6s ease-in-out infinite;
}
.wave-dot:nth-child(1) { height: 40%; animation-delay: 0s; }
.wave-dot:nth-child(2) { height: 70%; animation-delay: 0.15s; }
.wave-dot:nth-child(3) { height: 50%; animation-delay: 0.3s; }
@keyframes waveAnim {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.8); }
}

/* 播放控制 */
.guide-controls {
  padding: 10px 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: space-between;
}
.guide-now { font-size: 12px; color: #FBBF24; font-weight: 600; }
.guide-actions { display: flex; gap: 6px; }
.cmt-btn-sm {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #A0AEC0;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.cmt-btn-sm:hover { border-color: rgba(34,211,238,0.3); color: #22D3EE; }
.cmt-btn-sm.primary { background: rgba(34,211,238,0.15); border-color: rgba(34,211,238,0.3); color: #22D3EE; }

/* ===== AI对话 ===== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
}
.chat-empty {
  text-align: center;
  padding: 24px 0;
  color: #5A6B82;
}
.chat-empty-icon { font-size: 32px; margin-bottom: 8px; }
.chat-empty p { font-size: 13px; margin-bottom: 12px; }
.chat-suggestions {
  display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
}
.chat-suggest {
  padding: 6px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  color: #8892A6;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.chat-suggest:hover { border-color: rgba(34,211,238,0.3); color: #22D3EE; }

.chat-msg {
  display: flex; gap: 8px;
  align-items: flex-start;
}
.chat-msg.user { flex-direction: row-reverse; }
.chat-msg-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.chat-msg-bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #E8ECF1;
}
.chat-msg.user .chat-msg-bubble {
  background: rgba(34,211,238,0.12);
  border-bottom-right-radius: 4px;
}
.chat-msg.assistant .chat-msg-bubble {
  background: rgba(255,255,255,0.05);
  border-bottom-left-radius: 4px;
}

/* 打字动画 */
.typing {
  display: flex; gap: 4px; padding: 10px 14px;
}
.typing-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #5A6B82;
  animation: typingBounce 1.4s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* 输入区 */
.chat-input-area {
  display: flex; gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.chat-input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #E8ECF1;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus { border-color: rgba(34,211,238,0.3); }
.chat-input::placeholder { color: #5A6B82; }
.cmt-btn-send {
  width: 36px; height: 36px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #22D3EE, #0EA5E9);
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.cmt-btn-send:hover:not(:disabled) { transform: scale(1.05); }
.cmt-btn-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* API提示 */
.chat-api-hint {
  padding: 8px 12px;
  font-size: 11px;
  color: #FBBF24;
  background: rgba(251,191,36,0.06);
  border-top: 1px solid rgba(251,191,36,0.1);
  display: flex; align-items: center; justify-content: space-between;
}
.chat-api-hint button {
  background: none; border: none;
  color: #22D3EE; font-size: 11px; cursor: pointer; text-decoration: underline;
}

/* API配置弹窗 */
.cmt-api-modal {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
  border-radius: 16px;
}
.cmt-api-card {
  width: 280px;
  padding: 20px;
  background: rgba(20,28,45,0.98);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
}
.cmt-api-title { font-size: 15px; font-weight: 700; color: #E8ECF1; margin-bottom: 4px; }
.cmt-api-desc { font-size: 11px; color: #5A6B82; margin-bottom: 14px; }
.cmt-api-field {
  display: flex; flex-direction: column; gap: 4px;
  margin-bottom: 10px;
}
.cmt-api-field span { font-size: 11px; color: #8892A6; }
.cmt-api-field input {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: #E8ECF1;
  font-size: 12px;
  outline: none;
}
.cmt-api-field input:focus { border-color: rgba(34,211,238,0.3); }
.cmt-api-actions {
  display: flex; gap: 8px; justify-content: flex-end;
  margin-top: 14px;
}
</style>
