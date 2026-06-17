// FIFA World Cup 2026 — 本地 API 服务器
// 启动: node server.cjs
// API: http://localhost:3001

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// ========== 原有 API ==========
server.get('/api/qualified', (req, res) => {
  const db = router.db
  res.jsonp(db.get('teams').value())
})

server.get('/api/teams/:continent', (req, res) => {
  const db = router.db
  const teams = db.get('teams').filter({ continent: req.params.continent }).value()
  res.jsonp(teams)
})

server.get('/api/champions', (req, res) => {
  const db = router.db
  res.jsonp(db.get('champions').value())
})

// ========== 图片代理（绕过防盗链） ==========
server.get('/api/image', async (req, res) => {
  const url = req.query.url
  if (!url) return res.status(400).json({ error: 'Missing url' })

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WorldCupViz/1.0)',
      },
    })
    if (!resp.ok) throw new Error(`Upstream ${resp.status}`)

    const contentType = resp.headers.get('content-type') || 'image/jpeg'
    const buffer = await resp.arrayBuffer()

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(Buffer.from(buffer))
  } catch (e) {
    console.error('Image proxy error:', e.message)
    res.status(500).json({ error: 'Image fetch failed' })
  }
})

// ========== AI 球星对话智能体 ==========

// 健康检查
server.get('/api/chat/health', (req, res) => {
  const hasDeepSeek = !!(process.env.DEEPSEEK_API_KEY || 'sk-4c221b9810294d8186c124b24ecd13fa')
  const hasClaude = !!process.env.ANTHROPIC_API_KEY
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  res.json({
    online: true,
    aiBackend: hasDeepSeek ? 'deepseek' : (hasClaude ? 'claude' : (hasOpenAI ? 'openai' : 'local')),
    models: { deepseek: hasDeepSeek, claude: hasClaude, openai: hasOpenAI },
    timestamp: Date.now(),
  })
})

// 对话接口
server.post('/api/chat', async (req, res) => {
  const { player, message, history } = req.body

  if (!player || !message) {
    return res.status(400).json({ error: 'Missing player or message' })
  }

  // DeepSeek API（优先，已配置）
  const deepseekKey = process.env.DEEPSEEK_API_KEY || 'sk-4c221b9810294d8186c124b24ecd13fa'
  try {
    const reply = await callDeepSeekAPI(player, message, history, deepseekKey)
    return res.json({ reply, model: 'deepseek' })
  } catch (e) {
    console.error('DeepSeek error, trying next:', e.message)
  }

  // Anthropic Claude API
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const reply = await callAnthropicAPI(player, message, history)
      return res.json({ reply, model: 'claude' })
    } catch (e) {
      console.error('Claude API error:', e.message)
    }
  }

  // OpenAI API
  if (process.env.OPENAI_API_KEY) {
    try {
      const reply = await callOpenAIAPI(player, message, history)
      return res.json({ reply, model: 'openai' })
    } catch (e) {
      console.error('OpenAI API error:', e.message)
    }
  }

  // 本地智能回复
  const reply = generateLocalReply(player, message)
  res.json({ reply, model: 'local' })
})

// ========== AI API 调用 ==========

// DeepSeek API（OpenAI 兼容接口）
async function callDeepSeekAPI(player, message, history, apiKey) {
  const systemPrompt = buildSystemPrompt(player)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history || []).slice(-8).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || m.text || '',
    })),
    { role: 'user', content: message },
  ]

  const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 400,
      temperature: 0.8,
      messages,
    }),
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`DeepSeek HTTP ${resp.status}: ${err}`)
  }

  const data = await resp.json()
  return data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复，稍后再试。'
}

async function callAnthropicAPI(player, message, history) {
  const systemPrompt = buildSystemPrompt(player)
  const messages = [
    { role: 'user', content: buildConversationContext(player, history) + '\n\n用户最新消息：' + message },
  ]

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    }),
  })

  const data = await resp.json()
  return data.content?.[0]?.text || '抱歉，我暂时无法回复，稍后再试。'
}

async function callOpenAIAPI(player, message, history) {
  const systemPrompt = buildSystemPrompt(player)

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        { role: 'user', content: message },
      ],
    }),
  })

  const data = await resp.json()
  return data.choices?.[0]?.message?.content || '抱歉，我暂时无法回复。'
}

// ========== 智能本地回复 ==========

function buildSystemPrompt(player) {
  const attrNames = { pace: '速度', shooting: '射门', passing: '传球', dribbling: '盘带', defending: '防守', physical: '身体' }
  const bestAttr = Object.entries(player.attributes || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${attrNames[k]}(${v})`)
    .join('、')

  return `你是${player.name}（${player.nameEn}），${player.country}足球运动员，${player.age}岁，效力于${player.club}。
位置：${player.position}，综合评分：${player.overall}/100。
国家队数据：${player.caps}场/${player.goals}球/${player.assists}助攻。
最强三项能力：${bestAttr}。
个人简介：${player.bio || ''}
主要荣誉：${(player.honors || []).join('、')}

请以第一人称语气回复，就像你真的在聊天一样。用中文回复，可以适当使用⚽🏆🔥等emoji。
保持热情、有个性。回答要基于以上真实数据。回复控制在100字以内。`
}

function buildConversationContext(player, history) {
  if (!history || history.length === 0) return '这是新的对话'
  return history.map(m => `${m.role === 'user' ? '球迷' : player.name}：${m.content}`).join('\n')
}

function generateLocalReply(player, message) {
  const q = message.toLowerCase()
  const p = player

  // 夺冠/世界杯
  if (q.includes('夺冠') || q.includes('冠军') || q.includes('世界杯')) {
    const reps = [
      `世界杯是每个球员最大的梦想！我们**${p.country}**队准备得很充分，我和队友们会全力以赴。${(p.overall >= 90) ? '作为球队核心，我会承担起责任！🏆' : '团队合作是取胜的关键！'}`,
      `这届世界杯太激烈了！法国、巴西、英格兰都很强，但我们**${p.country}**也不弱。足球场上，什么都可能发生！⚽`,
      `我每天都在为这个目标训练。在**${p.club}**的经历让我成长了很多，现在该为**${p.country}**战斗了！🔥`,
    ]
    return reps[p.id % reps.length]
  }

  // 职业故事
  if (q.includes('职业') || q.includes('经历') || q.includes('故事')) {
    return `小时候就梦想成为职业球员...现在效力**${p.club}**，代表**${p.country}**出战**${p.caps}场**进**${p.goals}球**。这条路不容易，但每一滴汗水都有意义！💪 ${p.bio ? p.bio.substring(0, 50) + '...' : ''}`
  }

  // 战术
  if (q.includes('战术') || q.includes('打法') || q.includes('踢法') || q.includes('阵型')) {
    const attrs = p.attributes || {}
    const sorted = Object.entries(attrs).sort((a, b) => b[1] - a[1])
    const topAttr = sorted[0]
    const attrNames = { pace: '速度', shooting: '射门', passing: '传球', dribbling: '盘带', defending: '防守', physical: '身体' }
    return `我作为${(p.position || '').split('/')[0]}，最大优势是**${attrNames[topAttr[0]] || '技术'}**（${topAttr[1]}分）。在**${p.club}**我们喜欢控球+快速反击。国家队则更注重整体。灵活应对不同对手是关键！`
  }

  // 建议
  if (q.includes('建议') || q.includes('年轻') || q.includes('新人') || q.includes('学习')) {
    return `三点建议：**第一**，永远保持对足球的热爱！**第二**，坚持每天训练，天赋只能带你走这么远。**第三**，学会面对失败。我${p.age}岁了还在进步，年轻人更要耐心！🔥`
  }

  // 难忘时刻
  if (q.includes('难忘') || q.includes('回忆') || q.includes('时刻') || q.includes('感动')) {
    const honor = (p.honors || [])[0]
    return `最难忘的...每次穿上**${p.country}**球衣，听到国歌，都让我无比自豪！${honor ? `特别是赢得**${honor}**那一刻，终生难忘！` : ''}这些记忆是我最珍贵的财富。`
  }

  // 实力/数据相关
  if (q.includes('实力') || q.includes('数据') || q.includes('评分') || q.includes('能力')) {
    const attrs = p.attributes || {}
    const sorted = Object.entries(attrs).sort((a, b) => b[1] - a[1])
    const attrNames = { pace: '速度', shooting: '射门', passing: '传球', dribbling: '盘带', defending: '防守', physical: '身体' }
    const top3 = sorted.slice(0, 3).map(([k, v]) => `${attrNames[k]}**${v}**`).join('、')
    return `我的综合评分是**${p.overall}**分。最强三项：${top3}。在${p.country}队${p.caps}场进${p.goals}球+${p.assists}助攻。数据不会说谎，但我会用表现说话！⚽`
  }

  // 默认回复
  const defaults = [
    `哈哈，这个问题有意思！作为职业球员，我觉得足球不光是技术，更是心态和团队精神。**${p.country}**加油！⚽`,
    `感谢关心！我最近状态不错，在**${p.club}**踢得挺顺。世界杯是我们的舞台，等着看吧！🔥`,
    `说得对！不过我更相信行动胜于言语。等比赛开始，一切都会揭晓。💪`,
    `每个人都有自己的看法，这很正常。我的任务就是踢好每一场球，为**${p.country}**争光！🏆`,
  ]
  return defaults[p.id % defaults.length]
}

// ========== 静态资源 API ==========
server.use('/api', router)

server.listen(3001, () => {
  console.log('⚽ FIFA World Cup Data + AI Chat API running at http://localhost:3001')
  console.log('   Endpoints:')
  console.log('   GET  /api/teams          — 所有球队')
  console.log('   GET  /api/teams/UEFA     — 按大洲筛选')
  console.log('   GET  /api/venues         — 场馆列表')
  console.log('   GET  /api/champions      — 历届冠军')
  console.log('   GET  /api/matches        — 赛程')
  console.log('   GET  /api/standings      — 积分榜')
  console.log('   GET  /api/chat/health    — AI 智能体状态')
  console.log('   POST /api/chat           — AI 球星对话')
  console.log('')
  console.log('   🤖 AI 智能体：DeepSeek（已内置 Key）')
  console.log('   也可设置 ANTHROPIC_API_KEY / OPENAI_API_KEY 切换模型')
})
