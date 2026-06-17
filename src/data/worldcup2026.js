// ============================================================
// 2026 FIFA World Cup — 参赛国 & 地图数据映射
// ============================================================

// GeoJSON 中的 country name → 我们的映射
// 48 支参赛队（基于 2026 名额分配 + 传统劲旅合理推测）

// 大洲元信息
export const CONTINENT = {
  UEFA:   { key: 'UEFA',   label: '欧洲',   color: '#6098C8', slots: 16 },
  CONMEBOL:{ key: 'CONMEBOL', label: '南美洲', color: '#E8A040', slots: 6 },
  AFC:    { key: 'AFC',    label: '亚洲',   color: '#E87850', slots: 9 },
  CAF:    { key: 'CAF',    label: '非洲',   color: '#D4B850', slots: 10 },
  CONCACAF:{key: 'CONCACAF',label: '中北美',  color: '#80B8D0', slots: 6 },
  OFC:    { key: 'OFC',    label: '大洋洲',  color: '#A8C8D8', slots: 1 },
}

// FIFA 排名分色带 — 覆盖 1-95，从暖到冷渐变
const COLOR_BANDS = [
  { max: 5,  color: '#E07040' },  // 顶级 1-5
  { max: 10, color: '#E89848' },  // 第一梯队 6-10
  { max: 16, color: '#D8B040' },  // 第二梯队 11-16
  { max: 22, color: '#D4C060' },  // 第三梯队 17-22
  { max: 30, color: '#C8C880' },  // 中上游 23-30
  { max: 40, color: '#B8C098' },  // 中游 31-40
  { max: 52, color: '#A0B8B8' },  // 中下游 41-52
  { max: 65, color: '#88B0C0' },  // 下游 53-65
  { max: 80, color: '#70A8C0' },  // 靠后 66-80
  { max: 99, color: '#5898B8' },  // 末尾 81-99
]

export function getDisplayColor(fifaRank) {
  for (const band of COLOR_BANDS) {
    if (fifaRank <= band.max) return band.color
  }
  return '#5888B0'
}

// FIFA 排名数据来源：2026年4月1日 FIFA 男子世界排名
// -----------------------------------------------------------
// 48 支参赛队
// -----------------------------------------------------------
export const qualifiedTeams = [
  // ===== UEFA (16) =====
  { code:'fr',  name:'法国',         geoName:'France',               continent:'UEFA', fifaRank:2 },
  { code:'es',  name:'西班牙',       geoName:'Spain',                continent:'UEFA', fifaRank:3 },
  { code:'gb-eng', name:'英格兰',    geoName:'United Kingdom',       continent:'UEFA', fifaRank:5 },
  { code:'pt',  name:'葡萄牙',       geoName:'Portugal',             continent:'UEFA', fifaRank:6 },
  { code:'nl',  name:'荷兰',         geoName:'Netherlands',          continent:'UEFA', fifaRank:7 },
  { code:'be',  name:'比利时',       geoName:'Belgium',              continent:'UEFA', fifaRank:8 },
  { code:'de',  name:'德国',         geoName:'Germany',              continent:'UEFA', fifaRank:11 },
  { code:'hr',  name:'克罗地亚',     geoName:'Croatia',              continent:'UEFA', fifaRank:12 },
  { code:'ch',  name:'瑞士',         geoName:'Switzerland',          continent:'UEFA', fifaRank:15 },
  { code:'at',  name:'奥地利',       geoName:'Austria',              continent:'UEFA', fifaRank:22 },
  { code:'se',  name:'瑞典',         geoName:'Sweden',               continent:'UEFA', fifaRank:27 },
  { code:'tr',  name:'土耳其',       geoName:'Turkey',               continent:'UEFA', fifaRank:29 },
  { code:'no',  name:'挪威',         geoName:'Norway',               continent:'UEFA', fifaRank:33 },
  { code:'cz',  name:'捷克',         geoName:'Czechia',              continent:'UEFA', fifaRank:36 },
  { code:'gb-sct', name:'苏格兰',    geoName:'Scotland',             continent:'UEFA', fifaRank:40 },
  { code:'ba',  name:'波黑',         geoName:'Bosnia and Herz.',     continent:'UEFA', fifaRank:52 },

  // ===== CONMEBOL (6) =====
  { code:'ar',  name:'阿根廷',       geoName:'Argentina',            continent:'CONMEBOL', fifaRank:1 },
  { code:'br',  name:'巴西',         geoName:'Brazil',               continent:'CONMEBOL', fifaRank:4 },
  { code:'uy',  name:'乌拉圭',       geoName:'Uruguay',              continent:'CONMEBOL', fifaRank:14 },
  { code:'co',  name:'哥伦比亚',     geoName:'Colombia',             continent:'CONMEBOL', fifaRank:10 },
  { code:'ec',  name:'厄瓜多尔',     geoName:'Ecuador',              continent:'CONMEBOL', fifaRank:26 },
  { code:'py',  name:'巴拉圭',       geoName:'Paraguay',             continent:'CONMEBOL', fifaRank:50 },

  // ===== AFC (9) =====
  { code:'jp',  name:'日本',         geoName:'Japan',                continent:'AFC', fifaRank:16 },
  { code:'ir',  name:'伊朗',         geoName:'Iran',                 continent:'AFC', fifaRank:18 },
  { code:'au',  name:'澳大利亚',     geoName:'Australia',            continent:'AFC', fifaRank:23 },
  { code:'kr',  name:'韩国',         geoName:'South Korea',          continent:'AFC', fifaRank:24 },
  { code:'qa',  name:'卡塔尔',       geoName:'Qatar',                continent:'AFC', fifaRank:38 },
  { code:'sa',  name:'沙特阿拉伯',   geoName:'Saudi Arabia',         continent:'AFC', fifaRank:53 },
  { code:'uz',  name:'乌兹别克斯坦', geoName:'Uzbekistan',           continent:'AFC', fifaRank:58 },
  { code:'iq',  name:'伊拉克',       geoName:'Iraq',                 continent:'AFC', fifaRank:63 },
  { code:'jo',  name:'约旦',         geoName:'Jordan',               continent:'AFC', fifaRank:68 },

  // ===== CAF (10) =====
  { code:'ma',  name:'摩洛哥',       geoName:'Morocco',              continent:'CAF', fifaRank:13 },
  { code:'sn',  name:'塞内加尔',     geoName:'Senegal',              continent:'CAF', fifaRank:20 },
  { code:'eg',  name:'埃及',         geoName:'Egypt',                continent:'CAF', fifaRank:30 },
  { code:'ci',  name:'科特迪瓦',     geoName:"Côte d'Ivoire",        continent:'CAF', fifaRank:35 },
  { code:'dz',  name:'阿尔及利亚',   geoName:'Algeria',              continent:'CAF', fifaRank:37 },
  { code:'tn',  name:'突尼斯',       geoName:'Tunisia',              continent:'CAF', fifaRank:41 },
  { code:'za',  name:'南非',         geoName:'South Africa',         continent:'CAF', fifaRank:56 },
  { code:'gh',  name:'加纳',         geoName:'Ghana',                continent:'CAF', fifaRank:62 },
  { code:'cv',  name:'佛得角',       geoName:'Cabo Verde',           continent:'CAF', fifaRank:72 },
  { code:'cd',  name:'刚果(金)',     geoName:'Dem. Rep. Congo',      continent:'CAF', fifaRank:75 },

  // ===== CONCACAF (6, 含 3 东道主) =====
  { code:'mx',  name:'墨西哥',       geoName:'Mexico',                  continent:'CONCACAF', fifaRank:17, isHost:true },
  { code:'us',  name:'美国',         geoName:'United States of America', continent:'CONCACAF', fifaRank:19, isHost:true },
  { code:'ca',  name:'加拿大',       geoName:'Canada',                  continent:'CONCACAF', fifaRank:31, isHost:true },
  { code:'pa',  name:'巴拿马',       geoName:'Panama',                 continent:'CONCACAF', fifaRank:49 },
  { code:'ht',  name:'海地',         geoName:'Haiti',                 continent:'CONCACAF', fifaRank:74 },
  { code:'cw',  name:'库拉索',       geoName:'Curaçao',               continent:'CONCACAF', fifaRank:80 },

  // ===== OFC (1) =====
  { code:'nz',  name:'新西兰',       geoName:'New Zealand',          continent:'OFC', fifaRank:89 },
]

// -----------------------------------------------------------
// 主办城市（坐标用于地图散点）
// -----------------------------------------------------------
export const hostCities = [
  // 美国 (11)
  { name:'纽约',      country:'美国', lng:-74.006, lat:40.714, venue:'大都会人寿体育场', capacity:'82,500' },
  { name:'洛杉矶',    country:'美国', lng:-118.244, lat:34.052, venue:'SoFi体育场',       capacity:'70,240' },
  { name:'达拉斯',    country:'美国', lng:-96.797,  lat:32.777, venue:'AT&T体育场',       capacity:'80,000' },
  { name:'迈阿密',    country:'美国', lng:-80.194,  lat:25.774, venue:'硬石体育场',        capacity:'64,767' },
  { name:'亚特兰大',  country:'美国', lng:-84.388,  lat:33.749, venue:'梅赛德斯-奔驰体育场', capacity:'71,000' },
  { name:'西雅图',    country:'美国', lng:-122.332, lat:47.606, venue:'流明球场',          capacity:'68,740' },
  { name:'旧金山',    country:'美国', lng:-122.419, lat:37.775, venue:'李维斯体育场',      capacity:'68,500' },
  { name:'波士顿',    country:'美国', lng:-71.059,  lat:42.359, venue:'吉列体育场',        capacity:'65,878' },
  { name:'费城',      country:'美国', lng:-75.164,  lat:39.952, venue:'林肯金融球场',      capacity:'67,594' },
  { name:'华盛顿',    country:'美国', lng:-77.037,  lat:38.907, venue:'联邦快递球场',      capacity:'67,617' },
  { name:'休斯顿',    country:'美国', lng:-95.363,  lat:29.763, venue:'NRG体育场',        capacity:'71,795' },
  // 加拿大 (2)
  { name:'多伦多',    country:'加拿大', lng:-79.383, lat:43.653, venue:'BMO球场',         capacity:'45,736' },
  { name:'温哥华',    country:'加拿大', lng:-123.121,lat:49.283, venue:'BC Place',        capacity:'54,500' },
  // 墨西哥 (3)
  { name:'墨西哥城',  country:'墨西哥', lng:-99.133, lat:19.433, venue:'阿兹特克体育场',   capacity:'87,523' },
  { name:'瓜达拉哈拉',country:'墨西哥', lng:-103.350,lat:20.660, venue:'阿克伦体育场',     capacity:'48,071' },
  { name:'蒙特雷',    country:'墨西哥', lng:-100.316,lat:25.687, venue:'BBVA体育场',      capacity:'53,500' },
]

// -----------------------------------------------------------
// 飞线：从各洲代表飞向主办国
// -----------------------------------------------------------
export const flightPaths = [
  // 欧洲 → 纽约
  { from:'London',           to:'纽约',     coords:[[-0.128,51.507], [-74.006,40.714]] },
  { from:'Paris',            to:'纽约',     coords:[[2.352,48.856],  [-74.006,40.714]] },
  { from:'Madrid',           to:'迈阿密',   coords:[[-3.704,40.417], [-80.194,25.774]] },
  { from:'Berlin',           to:'纽约',     coords:[[13.405,52.520], [-74.006,40.714]] },
  { from:'Rome',             to:'纽约',     coords:[[12.496,41.903], [-74.006,40.714]] },
  // 南美 → 迈阿密 / 达拉斯 / 墨西哥城
  { from:'Brasília',         to:'迈阿密',   coords:[[-47.882,-15.794],[-80.194,25.774]] },
  { from:'Dakar',            to:'达拉斯',   coords:[[-17.444,14.693], [-96.797,32.777]] },
  { from:'Brasília',         to:'墨西哥城', coords:[[-47.882,-15.794],[-99.133,19.433]] },
  // 亚洲 → 西雅图 / 洛杉矶
  { from:'Tokyo',            to:'西雅图',   coords:[[139.692,35.689],[-122.332,47.606]] },
  { from:'Seoul',            to:'洛杉矶',   coords:[[126.978,37.566],[-118.244,34.052]] },
  { from:'Beijing',          to:'温哥华',   coords:[[116.407,39.904],[-123.121,49.283]] },
  // 非洲 → 亚特兰大
  { from:'Nairobi',          to:'亚特兰大', coords:[[36.822,-1.292], [-84.388,33.749]] },
  // 大洋洲 → 洛杉矶
  { from:'Sydney',           to:'洛杉矶',   coords:[[151.209,-33.869],[-118.244,34.052]] },
]

// -----------------------------------------------------------
// 构建 GeoJSON name → 参赛队映射
// -----------------------------------------------------------
export function buildCountryMap() {
  const map = new Map()
  qualifiedTeams.forEach(t => map.set(t.geoName, t))
  return map
}

// -----------------------------------------------------------
// 分组矩阵（12组 × 4队 = 48队，模拟分组）
// -----------------------------------------------------------
export const groupMatrix = [
  { name:'A', teams:['mx','za','kr','cz'] },
  { name:'B', teams:['ca','ba','qa','ch'] },
  { name:'C', teams:['br','ma','ht','gb-sct'] },
  { name:'D', teams:['us','py','au','tr'] },
  { name:'E', teams:['de','cw','ci','ec'] },
  { name:'F', teams:['nl','jp','se','tn'] },
  { name:'G', teams:['be','eg','ir','nz'] },
  { name:'H', teams:['es','cv','sa','uy'] },
  { name:'I', teams:['fr','sn','iq','no'] },
  { name:'J', teams:['ar','dz','at','jo'] },
  { name:'K', teams:['pt','cd','uz','co'] },
  { name:'L', teams:['gb-eng','hr','gh','pa'] },
]

// -----------------------------------------------------------
// 历届世界杯冠军（1930-2022）
// -----------------------------------------------------------
export const worldCupChampions = [
  { year: 1930, winnerCode: 'uy', winnerName: '乌拉圭', host: '乌拉圭', runnerUp: '阿根廷' },
  { year: 1934, winnerCode: 'it', winnerName: '意大利', host: '意大利', runnerUp: '捷克斯洛伐克' },
  { year: 1938, winnerCode: 'it', winnerName: '意大利', host: '法国', runnerUp: '匈牙利' },
  { year: 1950, winnerCode: 'uy', winnerName: '乌拉圭', host: '巴西', runnerUp: '巴西' },
  { year: 1954, winnerCode: 'de', winnerName: '德国', host: '瑞士', runnerUp: '匈牙利' },
  { year: 1958, winnerCode: 'br', winnerName: '巴西', host: '瑞典', runnerUp: '瑞典' },
  { year: 1962, winnerCode: 'br', winnerName: '巴西', host: '智利', runnerUp: '捷克斯洛伐克' },
  { year: 1966, winnerCode: 'gb-eng', winnerName: '英格兰', host: '英格兰', runnerUp: '德国' },
  { year: 1970, winnerCode: 'br', winnerName: '巴西', host: '墨西哥', runnerUp: '意大利' },
  { year: 1974, winnerCode: 'de', winnerName: '德国', host: '德国', runnerUp: '荷兰' },
  { year: 1978, winnerCode: 'ar', winnerName: '阿根廷', host: '阿根廷', runnerUp: '荷兰' },
  { year: 1982, winnerCode: 'it', winnerName: '意大利', host: '西班牙', runnerUp: '德国' },
  { year: 1986, winnerCode: 'ar', winnerName: '阿根廷', host: '墨西哥', runnerUp: '德国' },
  { year: 1990, winnerCode: 'de', winnerName: '德国', host: '意大利', runnerUp: '阿根廷' },
  { year: 1994, winnerCode: 'br', winnerName: '巴西', host: '美国', runnerUp: '意大利' },
  { year: 1998, winnerCode: 'fr', winnerName: '法国', host: '法国', runnerUp: '巴西' },
  { year: 2002, winnerCode: 'br', winnerName: '巴西', host: '韩国/日本', runnerUp: '德国' },
  { year: 2006, winnerCode: 'it', winnerName: '意大利', host: '德国', runnerUp: '法国' },
  { year: 2010, winnerCode: 'es', winnerName: '西班牙', host: '南非', runnerUp: '荷兰' },
  { year: 2014, winnerCode: 'de', winnerName: '德国', host: '巴西', runnerUp: '阿根廷' },
  { year: 2018, winnerCode: 'fr', winnerName: '法国', host: '俄罗斯', runnerUp: '克罗地亚' },
  { year: 2022, winnerCode: 'ar', winnerName: '阿根廷', host: '卡塔尔', runnerUp: '法国' },
]

// 简易 code→name 查找
export const codeToName = {}
qualifiedTeams.forEach(t => { codeToName[t.code] = t.name })
