<template>
  <div class="tab-map">
    <!-- ========== Intro Splash 全屏遮罩 ========== -->
    <Transition name="intro-dismiss">
      <div v-show="showIntro" class="intro-overlay" @click="dismissIntro">
        <div class="intro-bg"></div>
        <!-- CSS 烟花 -->
        <div class="intro-fireworks" v-show="textureReady">
          <div class="firework fwk-1"><i></i></div>
          <div class="firework fwk-2"><i></i></div>
          <div class="firework fwk-3"><i></i></div>
          <div class="firework fwk-4"><i></i></div>
          <div class="firework fwk-5"><i></i></div>
          <div class="firework fwk-6"><i></i></div>
        </div>
        <!-- 地球（上部） -->
        <div class="intro-globe-wrap">
          <div class="intro-globe-placeholder" v-show="!textureReady"></div>
          <v-chart v-show="textureReady" class="intro-globe-chart" :option="introGlobeOption" autoresize />
        </div>
        <!-- 球员踢球（中部） -->
        <div class="intro-player" v-show="textureReady">
          <span class="intro-player-icon">🏃</span>
          <span class="intro-player-ball">⚽</span>
        </div>
        <!-- 标题区（底部） -->
        <div class="intro-titles" :class="{ 'intro-titles--entered': introTitlesVisible }">
          <h1 class="intro-main-title">
            <span class="intro-year">2026</span>
            <span class="intro-fifa">FIFA WORLD CUP</span>
          </h1>
          <p class="intro-subtitle">United States &middot; Canada &middot; Mexico</p>
        </div>
        <!-- 漂浮足球 -->
        <div class="intro-footballs" v-show="textureReady">
          <span class="intro-fb fb-1">⚽</span><span class="intro-fb fb-2">⚽</span>
          <span class="intro-fb fb-3">⚽</span><span class="intro-fb fb-4">⚽</span>
        </div>
        <div class="intro-hint">
          <span class="intro-hint-text">点击任意位置进入 ▸</span>
        </div>
      </div>
    </Transition>

    <!-- ========== Hero: 平面地图 + 3D 球体 ========== -->
    <div class="map-hero card anim-fadeInUp delay-1">
      <div class="hero-top">
        <div class="hero-titles">
          <h2 class="hero-title">
            <span class="icon-globe">🌍</span> 2026 FIFA World Cup · 全球版图
          </h2>
          <p class="hero-sub">
            <span class="stat-chip">{{ qualifiedTeams.length }} 支参赛队</span>
            <span class="stat-chip">3 个主办国</span>
            <span class="stat-chip">16 座城市</span>
            <span class="stat-chip">6 大洲</span>
          </p>
        </div>
      </div>
      <div class="map-split">
        <!-- 全宽平面世界地图 -->
        <div class="map-left">
          <v-chart ref="flatMapChartRef" class="map-chart" :option="flatMapOption" autoresize @click="onFlatMapClick" @georoam="onFlatMapRoam" />
        </div>
        <!-- 右下角小 3D 球体（叠加层，弹窗时隐藏避免 WebGL 遮挡） -->
        <div class="map-right-corner" v-show="!venueDialogVisible && !countryDialogVisible && !groupDialogVisible && !hostCountryDialogVisible">
          <div class="globe-inset-label">🌐 拖拽旋转</div>
          <v-chart ref="globeChartRef" class="map-chart" :option="globeOption" autoresize @click="onGlobeClick" />
        </div>
      </div>
    </div>

    <!-- ========== 历届冠军时间轴 ========== -->
    <WorldCupWinnersTimeline
      :champions="worldCupChampions"
      @select-champion="onChampionClick"
      class="anim-fadeInUp delay-2"
    />

    <!-- ========== 主办城市卡片行 ========== -->
    <div class="host-row anim-fadeInUp delay-3">
      <div class="host-card usa-card" @click.stop="openHostVenue('美国')">
        <div class="host-flag">🇺🇸</div>
        <div class="host-info"><div class="host-name">美国</div><div class="host-cities">11 座主办城市</div></div>
        <div class="host-badge">东道主</div>
      </div>
      <div class="host-card canada-card" @click.stop="openHostVenue('加拿大')">
        <div class="host-flag">🇨🇦</div>
        <div class="host-info"><div class="host-name">加拿大</div><div class="host-cities">2 座主办城市</div></div>
        <div class="host-badge">东道主</div>
      </div>
      <div class="host-card mexico-card" @click.stop="openHostVenue('墨西哥')">
        <div class="host-flag">🇲🇽</div>
        <div class="host-info"><div class="host-name">墨西哥</div><div class="host-cities">3 座主办城市</div></div>
        <div class="host-badge">东道主</div>
      </div>
    </div>

    <!-- ========== 地图下方两栏 ========== -->
    <div class="bottom-grid">
      <div class="card anim-fadeInUp delay-4 venue-section">
        <div class="section-header">
          <h3 class="section-title">🏟️ 16 座场馆</h3>
          <span class="section-badge">点击查看详情</span>
        </div>
        <div class="venue-list">
          <div v-for="(v, i) in hostCitiesSorted" :key="v.venue" class="venue-item anim-fadeInUp"
            :class="`delay-${Math.min(i + 4, 8)}`" @click.stop="openVenueModal(v)">
            <div class="venue-rank" :class="i < 3 ? 'top3' : ''">{{ i + 1 }}</div>
            <div class="venue-info">
              <div class="venue-name">{{ v.venue }}</div>
              <div class="venue-city">{{ v.name }} · {{ v.country }}</div>
            </div>
            <div class="venue-cap">{{ v.capacity }}</div>
            <span class="venue-arrow">▸</span>
          </div>
        </div>
      </div>
      <!-- 大洲实力对比 — 圆形徽章按钮 -->
      <div class="card anim-fadeInUp delay-4 continent-panel" v-if="!selectedContinent">
        <div class="section-header">
          <h3 class="section-title">🌍 各大洲参赛实力</h3>
          <span class="section-badge">点击徽章查看球队</span>
        </div>
        <div class="continent-emblem-grid">
          <div class="cont-emblem-btn" v-for="c in continentCards" :key="c.key"
            @click="selectContinent(c)" :style="{ '--cont-color': c.color }">
            <div class="ceb-circle" :style="{
              background: `radial-gradient(circle at 40% 35%, ${c.color}cc, ${c.color}55 70%, ${c.color}22 100%)`,
              boxShadow: `0 0 35px ${c.color}44, 0 0 70px ${c.color}18`
            }">
              <span class="ceb-icon">{{ c.icon }}</span>
            </div>
            <div class="ceb-label">{{ c.name }}</div>
            <div class="ceb-count">{{ c.teamCount }}队 · 均#{{ c.avgRank }}</div>
          </div>
        </div>
      </div>

      <!-- 二级菜单：选择分析类型 -->
      <div class="card anim-fadeInUp delay-4 continent-choice" v-if="selectedContinent && !selectedOption && !selectedTeam">
        <button class="back-btn" @click="backToContinents">◂ 返回大洲</button>
        <div class="choice-hero" :style="{ borderColor: selectedContinent.color }">
          <div class="choice-circle" :style="{
            background: `radial-gradient(circle at 40% 35%, ${selectedContinent.color}cc, ${selectedContinent.color}55 70%, ${selectedContinent.color}22 100%)`,
            boxShadow: `0 0 40px ${selectedContinent.color}44`
          }">
            <span class="choice-icon">{{ continentCards.find(c=>c.key===selectedContinent.key)?.icon }}</span>
          </div>
          <h3 class="choice-name" :style="{ color: selectedContinent.color }">{{ selectedContinent.name }}</h3>
          <p class="choice-desc">{{ selectedContinent.teamCount }} 支参赛队 · 平均 FIFA 排名 #{{ selectedContinent.avgRank }}</p>
        </div>
        <div class="choice-buttons">
          <button class="choice-btn overview-btn" @click="selectedOption = 'overview'"
            :style="{ '--btn-color': selectedContinent.color }">
            <span class="cb-icon">📊</span>
            <span class="cb-label">综合实力分析</span>
            <span class="cb-desc">洲际整体数据 · 历史战绩</span>
          </button>
          <button class="choice-btn teams-btn" @click="selectedOption = 'teams'"
            :style="{ '--btn-color': selectedContinent.color }">
            <span class="cb-icon">⚔️</span>
            <span class="cb-label">球队实力分析</span>
            <span class="cb-desc">逐队对比 · 过往成绩</span>
          </button>
        </div>
      </div>

      <!-- 综合实力分析 -->
      <div class="card anim-fadeInUp delay-4 continent-overview" v-if="selectedContinent && selectedOption === 'overview' && !selectedTeam">
        <div class="section-header">
          <button class="back-btn" @click="selectedOption = null">◂ 返回选项</button>
          <h3 class="section-title" :style="{ color: selectedContinent.color }">{{ selectedContinent.name }} · 综合实力</h3>
        </div>
        <div class="overview-stats">
          <div class="ov-stat"><span class="ov-val">{{ selectedContinent.teamCount }}</span><span class="ov-lbl">参赛球队</span></div>
          <div class="ov-stat"><span class="ov-val">#{{ selectedContinent.avgRank }}</span><span class="ov-lbl">平均排名</span></div>
          <div class="ov-stat"><span class="ov-val">{{ continentTotalTitles(selectedContinent.key) }}</span><span class="ov-lbl">世界杯冠军</span></div>
          <div class="ov-stat"><span class="ov-val">{{ selectedContinent.hostCount || 0 }}</span><span class="ov-lbl">东道主</span></div>
        </div>
        <div class="overview-top3">
          <div class="ov-top-title">🏅 排名前三</div>
          <div class="ov-top-list">
            <div class="ov-top-item" v-for="(t,i) in selectedContinent.teams.sort((a,b)=>a.fifaRank-b.fifaRank).slice(0,3)" :key="t.code">
              <span class="ov-top-rank" :style="{ background: getDisplayColor(t.fifaRank) }">#{{ t.fifaRank }}</span>
              <span class="ov-top-name">{{ t.name }}</span>
              <span class="ov-top-record">{{ getTeamRecord(t.code) }}</span>
            </div>
          </div>
        </div>
        <div class="overview-bar-title">📈 六大洲均排对比</div>
        <div class="overview-bar-wrap" v-for="c in continentCards" :key="c.key">
          <div class="ov-bar-label">{{ c.name }}</div>
          <div class="ov-bar-track">
            <div class="ov-bar-fill" :style="{ width: Math.max(5, 100 - c.avgRank * 1.2) + '%', background: c.color }"></div>
          </div>
          <div class="ov-bar-val">均#{{ c.avgRank }}</div>
        </div>
      </div>

      <!-- 球队实力分析（原列表） -->
      <div class="card anim-fadeInUp delay-4 continent-detail" v-if="selectedContinent && selectedOption === 'teams' && !selectedTeam">
        <div class="section-header">
          <button class="back-btn" @click="selectedOption = null">◂ 返回选项</button>
          <h3 class="section-title" :style="{ color: selectedContinent.color }">{{ selectedContinent.name }} · {{ selectedContinent.teamCount }} 支球队</h3>
          <span class="section-badge">均排 #{{ selectedContinent.avgRank }}</span>
        </div>
        <div class="team-compare-grid">
          <div class="team-compare-card" v-for="t in selectedContinent.teams.sort((a,b)=>a.fifaRank-b.fifaRank)" :key="t.code"
            @click="selectTeam(t)" :style="{ borderLeftColor: getDisplayColor(t.fifaRank) }">
            <div class="tc-rank" :style="{ background: getDisplayColor(t.fifaRank) }">#{{ t.fifaRank }}</div>
            <div class="tc-info">
              <div class="tc-name">{{ t.name }} <span class="tc-code">{{ t.code.toUpperCase() }}</span></div>
              <div class="tc-record">{{ getTeamRecord(t.code) }}</div>
            </div>
            <div class="tc-badges">
              <span class="tc-badge wc" v-if="getWorldCups(t.code) !== '暂无'">🏆 {{ getWorldCups(t.code) }}</span>
              <span class="tc-badge host" v-if="t.isHost">⭐ 东道主</span>
            </div>
            <span class="tc-arrow">▸</span>
          </div>
        </div>
      </div>

      <!-- 球队详情卡片 -->
      <div class="card anim-fadeInUp delay-4 team-detail-card" v-if="selectedTeam">
        <div class="section-header">
          <button class="back-btn" @click="selectedTeam = null">◂ 返回 {{ selectedContinent?.name }}</button>
        </div>
        <div class="team-detail-hero" :style="{ background: getDisplayColor(selectedTeam.fifaRank) }">
          <div class="tdh-rank">FIFA #{{ selectedTeam.fifaRank }}</div>
          <div class="tdh-name">{{ selectedTeam.name }}</div>
          <div class="tdh-confed">{{ selectedContinent?.name }}{{ selectedTeam.isHost ? ' · ⭐ 东道主' : '' }}</div>
        </div>
        <div class="team-detail-stats">
          <div class="tds-item">
            <span class="tds-label">世界杯冠军</span>
            <span class="tds-value gold">{{ getWorldCups(selectedTeam.code) }}</span>
          </div>
          <div class="tds-item">
            <span class="tds-label">球队实力</span>
            <span class="tds-value">{{ getTeamRecord(selectedTeam.code) }}</span>
          </div>
          <div class="tds-item">
            <span class="tds-label">FIFA 代码</span>
            <span class="tds-value">{{ selectedTeam.code.toUpperCase() }}</span>
          </div>
          <div class="tds-item">
            <span class="tds-label">所属大洲</span>
            <span class="tds-value" :style="{ color: selectedContinent?.color }">{{ selectedContinent?.name }}</span>
          </div>
        </div>
        <div class="team-detail-desc">
          <p>{{ getCountryDesc(selectedTeam.code) }}</p>
        </div>
        <div class="team-detail-back">
          <button class="back-btn" @click="backToContinents">◂ 返回全部大洲</button>
        </div>
      </div>
    </div>

    <!-- ========== 48 队分组矩阵 ========== -->
    <div class="matrix-section card anim-fadeInUp delay-6">
      <div class="section-header">
        <div>
          <h3 class="section-title">📋 48 队分组矩阵</h3>
          <span class="section-subtitle">12 组 × 4 队 = 48 强 · 点击查看详情</span>
        </div>
        <span class="section-badge preview">分组详情</span>
      </div>
      <div class="group-matrix">
        <div v-for="g in groupMatrix" :key="g.name" class="group-card" @click="openGroupModal(g)">
          <div class="group-title">{{ g.name }} 组</div>
          <div class="group-teams">
            <div v-for="code in g.teams" :key="code" class="group-team">
              <FlagTag :code="code" :name="codeToName[code] || code" small />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 场馆详情弹窗 ========== -->
    <el-dialog v-model="venueDialogVisible" :title="selectedVenue?.venue || '场馆详情'" width="620px" top="8vh" close-on-click-modal center>
      <template #header>
        <div class="modal-header">
          <span class="modal-icon">🏟️</span>
          <span>{{ selectedVenue?.venue }}</span>
        </div>
      </template>
      <div v-if="selectedVenue" class="modal-body">
        <div class="modal-img">
          <img v-if="hasVenueImage(selectedVenue)" :src="getVenueImage(selectedVenue)" :alt="selectedVenue.venue"
            @error="(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }" />
          <div class="modal-img-fallback" :style="{ display: hasVenueImage(selectedVenue) ? 'none' : 'flex' }">
            <span class="fallback-icon">🏟️</span>
            <span class="fallback-name">{{ selectedVenue.venue }}</span>
            <span class="fallback-loc">{{ selectedVenue.name }}, {{ selectedVenue.country }}</span>
          </div>
        </div>
        <div class="modal-stats">
          <div class="modal-stat"><span class="ms-label">📍 城市</span><span class="ms-value">{{ selectedVenue.name }}</span></div>
          <div class="modal-stat"><span class="ms-label">🌎 国家</span><span class="ms-value">{{ selectedVenue.country }}</span></div>
          <div class="modal-stat"><span class="ms-label">🪑 容量</span><span class="ms-value gold">{{ formatCap(selectedVenue.capacity) }}</span></div>
          <div class="modal-stat"><span class="ms-label">🗺️ 坐标</span><span class="ms-value">{{ selectedVenue.lat.toFixed(1) }}°, {{ selectedVenue.lng.toFixed(1) }}°</span></div>
        </div>
        <div class="modal-desc">
          <p><strong>{{ selectedVenue.venue }}</strong> 是 2026 年 FIFA 世界杯的核心比赛场地之一，坐落于 <strong>{{ selectedVenue.country }} {{ selectedVenue.name }}</strong>。</p>
          <p>该场馆将在本届世界杯期间承办多场小组赛及淘汰赛比赛，届时将见证各大洲顶级球队在此为世界杯荣誉而战。</p>
        </div>
      </div>
    </el-dialog>

    <!-- ========== 分组详情弹窗 ========== -->
    <el-dialog v-model="groupDialogVisible" :title="selectedGroupData ? selectedGroupData.name + ' 组' : '分组详情'" width="560px" append-to-body center>
      <template #header>
        <div class="modal-header">
          <span class="modal-icon">⚔️</span>
          <span>{{ selectedGroupData?.name }} 组 · 4 支球队</span>
        </div>
      </template>
      <div v-if="selectedGroupData" class="modal-body">
        <div class="modal-desc">
          <p>小组赛前两名晋级 <strong>32 强淘汰赛</strong>，后两名直接淘汰。组内每队进行 3 场单循环赛。</p>
        </div>
        <div class="modal-group-teams">
          <div v-for="code in selectedGroupData.teams" :key="code" class="modal-team-card">
            <div class="mt-flag-wrap">
              <FlagTag :code="code" :name="codeToName[code] || code" large />
            </div>
            <div class="mt-info">
              <div class="mt-confed">{{ getContinentLabel(code) }}</div>
              <div class="mt-rank">FIFA 排名 #{{ getFifaRank(code) }}</div>
              <div class="mt-record">{{ getTeamRecord(code) }}</div>
            </div>
            <div class="mt-color" :style="{ background: getTeamColor(code) }"></div>
          </div>
        </div>
        <div class="modal-predict">
          <span class="predict-label">🏆 出线预测</span>
          <span class="predict-value">{{ getGroupPrediction(selectedGroupData.teams) }}</span>
        </div>
      </div>
    </el-dialog>

    <!-- ========== 国家详情弹窗 ========== -->
    <el-dialog v-model="countryDialogVisible" :title="selectedCountry?.name || '国家详情'" width="520px" append-to-body center>
      <template #header>
        <div class="modal-header">
          <img v-if="selectedCountry" :src="`https://flagcdn.com/40x30/${selectedCountry.code}.png`" style="border-radius:3px;width:40px;height:30px;" @error="(e) => e.target.style.display='none'" />
          <span>{{ selectedCountry?.name }}</span>
        </div>
      </template>
      <div v-if="selectedCountry" class="modal-body">
        <div class="country-hero" :style="{ background: selectedCountry.code !== 'unknown' ? getDisplayColor(selectedCountry.fifaRank) : '#3A3830' }">
          <div class="ch-rank-label">FIFA 排名</div>
          <div class="ch-rank-num">{{ selectedCountry.code !== 'unknown' ? '#' + selectedCountry.fifaRank : '未参赛' }}</div>
        </div>
        <div class="modal-stats">
          <div class="modal-stat"><span class="ms-label">🌎 大洲</span><span class="ms-value">{{ selectedCountry.continent ? CONTINENT[selectedCountry.continent]?.label || selectedCountry.continent : '—' }}</span></div>
          <div class="modal-stat"><span class="ms-label">🏆 世界杯冠军</span><span class="ms-value gold">{{ selectedCountry.code !== 'unknown' ? getWorldCups(selectedCountry.code) : '—' }}</span></div>
          <div class="modal-stat"><span class="ms-label">👥 FIFA 代码</span><span class="ms-value">{{ selectedCountry.code !== 'unknown' ? selectedCountry.code.toUpperCase() : '—' }}</span></div>
          <div class="modal-stat"><span class="ms-label">{{ selectedCountry.isHost ? '⭐' : '📍' }} 身份</span><span class="ms-value gold">{{ selectedCountry.isHost ? '东道主' : selectedCountry.code !== 'unknown' ? '参赛队' : '非参赛国' }}</span></div>
        </div>
        <div class="modal-desc">
          <p v-if="selectedCountry.code !== 'unknown'"><strong>{{ selectedCountry.name }}</strong> 是 2026 年 FIFA 世界杯{{ selectedCountry.isHost ? '的联合东道主之一' : '的参赛队伍之一' }}，代表 <strong>{{ CONTINENT[selectedCountry.continent]?.label || '所属大洲' }}</strong> 出战。</p>
          <p v-else><strong>{{ selectedCountry.name }}</strong> 未晋级 2026 年 FIFA 世界杯决赛圈。</p>
          <p>{{ selectedCountry.code !== 'unknown' ? getCountryDesc(selectedCountry.code) : '该队在本届世界杯预选赛中未能出线，遗憾缺席。' }}</p>
        </div>
        <div class="country-flag-full" v-if="selectedCountry.code !== 'unknown'">
          <img :src="`https://flagcdn.com/w160/${selectedCountry.code}.png`" :alt="selectedCountry.name"
            style="width:100%;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.3);"
            @error="(e) => e.target.style.display='none'" />
        </div>
      </div>
    </el-dialog>

    <!-- ========== 东道主国家详情弹窗 ========== -->
    <el-dialog v-model="hostCountryDialogVisible" :title="selectedHostCountry?.name || '东道主详情'" width="620px" top="8vh" close-on-click-modal append-to-body center>
      <template #header>
        <div class="modal-header">
          <span class="modal-icon">{{ selectedHostCountry?.flag || '⭐' }}</span>
          <span>{{ selectedHostCountry?.name }} · 东道主</span>
        </div>
      </template>
      <div v-if="selectedHostCountry" class="modal-body">
        <div class="host-hero" :style="{ background: selectedHostCountry.code !== 'unknown' ? getDisplayColor(selectedHostCountry.team?.fifaRank || 40) : '#3A3830' }">
          <div class="ch-rank-label">FIFA 排名</div>
          <div class="ch-rank-num">{{ selectedHostCountry.code !== 'unknown' ? '#' + (selectedHostCountry.team?.fifaRank || '—') : '东道主' }}</div>
        </div>
        <div class="modal-stats">
          <div class="modal-stat"><span class="ms-label">🌎 大洲</span><span class="ms-value">{{ selectedHostCountry.team ? CONTINENT[selectedHostCountry.team.continent]?.label || '—' : '—' }}</span></div>
          <div class="modal-stat"><span class="ms-label">🏟️ 主办城市</span><span class="ms-value gold">{{ selectedHostCountry.cities.length }} 座</span></div>
          <div class="modal-stat"><span class="ms-label">🏆 世界杯冠军</span><span class="ms-value gold">{{ selectedHostCountry.code !== 'unknown' ? getWorldCups(selectedHostCountry.code) : '—' }}</span></div>
          <div class="modal-stat"><span class="ms-label">⭐ 身份</span><span class="ms-value gold">联合东道主</span></div>
        </div>
        <div class="modal-desc">
          <p><strong>{{ selectedHostCountry.name }}</strong> 是 2026 年 FIFA 世界杯的联合东道主之一，共承办 <strong>{{ selectedHostCountry.cities.length }} 座城市</strong> 的比赛。</p>
        </div>
        <!-- 场馆列表 -->
        <div class="host-venue-list-title">🏟️ 主办场馆</div>
        <div class="host-venue-grid">
          <div v-for="c in selectedHostCountry.cities" :key="c.venue" class="host-venue-card" @click="openVenueFromHost(c)">
            <div class="hvc-name">{{ c.venue }}</div>
            <div class="hvc-city">{{ c.name }}</div>
            <div class="hvc-cap">🪑 {{ formatCap(c.capacity) }} 人</div>
            <span class="hvc-arrow">▸</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { MapChart, LinesChart, ScatterChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, VisualMapComponent, GeoComponent } from 'echarts/components'
import 'echarts-gl'
import { GlobeComponent } from 'echarts-gl/components'
import { Scatter3DChart, Lines3DChart, Map3DChart } from 'echarts-gl/charts'
import VChart from 'vue-echarts'
import FlagTag from '../components/FlagTag.vue'
import WorldCupWinnersTimeline from '../components/WorldCupWinnersTimeline.vue'
import worldGeoJSON from '../assets/world.json'
import { qualifiedTeams, hostCities, flightPaths, groupMatrix, codeToName, CONTINENT, getDisplayColor, worldCupChampions } from '../data/worldcup2026.js'

use([CanvasRenderer, MapChart, LinesChart, ScatterChart, TooltipComponent, LegendComponent, VisualMapComponent, GeoComponent, GlobeComponent, Scatter3DChart, Lines3DChart, Map3DChart])
registerMap('world', worldGeoJSON)


// ---- 预计算：GeoJSON 中存在对应区域的参赛队（用于 map3D 数据） ----
const geoNameSet = new Set(worldGeoJSON.features.map(f => f.properties.name))
const qualifiedTeamsOnMap = qualifiedTeams.filter(t => geoNameSet.has(t.geoName))

// ---- 冠军时间轴 → 地图高亮联动 ----
let _highlightTimer = null

// ---- 球体色系（红→橙→绿→青→蓝，均衡过渡） ----
function getGlobeColor(rank) {
  const BANDS = [
    { max: 6,  color: '#FF3D20' },  // 红
    { max: 12, color: '#FF8818' },  // 橙
    { max: 20, color: '#38C048' },  // 绿
    { max: 30, color: '#18B898' },  // 青
    { max: 42, color: '#2890D0' },  // 蓝
    { max: 99, color: '#5878A8' },  // 灰蓝
  ]
  for (const b of BANDS) if (rank <= b.max) return b.color
  return '#5880A0'
}

// 模块级纹理缓存
let _cachedGlobeTextureUrl = null
let _cachedMutedGlobeTextureUrl = null
let _cachedNaturalGlobeTextureUrl = null

// ---- 生成球体纹理：鲜艳版（用于页面小地球） ----
function generateGlobeTexture() {
  if (_cachedGlobeTextureUrl) return Promise.resolve(_cachedGlobeTextureUrl)
  const W = 2048, H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0D2040'; ctx.fillRect(0, 0, W, H)

  const project = (lng, lat) => [((lng + 180) / 360) * W, ((90 - lat) / 180) * H]
  const normLng = (l) => { while (l > 180) l -= 360; while (l < -180) l += 360; return l }
  const qualifiedMap = new Map()
  qualifiedTeams.forEach(t => qualifiedMap.set(t.geoName, t))

  worldGeoJSON.features.forEach(f => {
    const team = qualifiedMap.get(f.properties.name)
    ctx.beginPath()
    const geom = f.geometry
    const drawPolygon = (coords) => {
      coords.forEach((ring, ri) => {
        ring.forEach(([lng, lat], i) => {
          const [x, y] = project(normLng(lng), lat)
          if (i === 0 && ri === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
      })
    }
    if (geom.type === 'Polygon') drawPolygon(geom.coordinates)
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(p => drawPolygon(p))
    ctx.fillStyle = team ? getGlobeColor(team.fifaRank) : '#3A3830'
    ctx.fill()
    ctx.strokeStyle = 'rgba(80,75,65,0.35)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  })

  // 东道主金色勾边
  qualifiedTeams.filter(t => t.isHost).forEach(t => {
    const feat = worldGeoJSON.features.find(f => f.properties.name === t.geoName)
    if (!feat) return
    ctx.beginPath()
    const geom = feat.geometry
    const draw = (coords) => { coords.forEach(ring => { ring.forEach(([lng, lat], i) => { const [x, y] = project(normLng(lng), lat); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) }); ctx.closePath() }) }
    if (geom.type === 'Polygon') draw(geom.coordinates)
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(draw)
    ctx.strokeStyle = 'rgba(255,215,0,0.6)'
    ctx.lineWidth = 2; ctx.stroke()
  })

  return new Promise(resolve => canvas.toBlob(b => {
    _cachedGlobeTextureUrl = URL.createObjectURL(b)
    resolve(_cachedGlobeTextureUrl)
  }, 'image/png'))
}

// ---- 生成球体纹理：低饱和版（用于页面小地球，更素雅） ----
function generateMutedGlobeTexture() {
  if (_cachedMutedGlobeTextureUrl) return Promise.resolve(_cachedMutedGlobeTextureUrl)
  const W = 2048, H = 1024
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#0D1E30'; ctx.fillRect(0, 0, W, H)

  const project = (lng, lat) => [((lng + 180) / 360) * W, ((90 - lat) / 180) * H]
  const normLng = (l) => { while (l > 180) l -= 360; while (l < -180) l += 360; return l }
  const qualifiedMap = new Map()
  qualifiedTeams.forEach(t => qualifiedMap.set(t.geoName, t))

  worldGeoJSON.features.forEach(f => {
    const team = qualifiedMap.get(f.properties.name)
    ctx.beginPath()
    const geom = f.geometry
    const drawPolygon = (coords) => {
      coords.forEach((ring, ri) => {
        ring.forEach(([lng, lat], i) => {
          const [x, y] = project(normLng(lng), lat)
          if (i === 0 && ri === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
      })
    }
    if (geom.type === 'Polygon') drawPolygon(geom.coordinates)
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(p => drawPolygon(p))
    // 使用低饱和度色带 (getDisplayColor)
    ctx.fillStyle = team ? getDisplayColor(team.fifaRank) : '#2A2825'
    ctx.fill()
    ctx.strokeStyle = 'rgba(50,45,40,0.3)'
    ctx.lineWidth = 0.4
    ctx.stroke()
  })

  qualifiedTeams.filter(t => t.isHost).forEach(t => {
    const feat = worldGeoJSON.features.find(f => f.properties.name === t.geoName)
    if (!feat) return
    ctx.beginPath()
    const geom = feat.geometry
    const draw = (coords) => { coords.forEach(ring => { ring.forEach(([lng, lat], i) => { const [x, y] = project(normLng(lng), lat); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) }); ctx.closePath() }) }
    if (geom.type === 'Polygon') draw(geom.coordinates)
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(draw)
    ctx.strokeStyle = 'rgba(255,215,0,0.45)'
    ctx.lineWidth = 1.8; ctx.stroke()
  })

  return new Promise(resolve => canvas.toBlob(b => {
    _cachedMutedGlobeTextureUrl = URL.createObjectURL(b)
    resolve(_cachedMutedGlobeTextureUrl)
  }, 'image/png'))
}

// ---- 生成自然地球纹理（蓝海绿地，开场动画用） ----
function generateNaturalGlobeTexture() {
  if (_cachedNaturalGlobeTextureUrl) return Promise.resolve(_cachedNaturalGlobeTextureUrl)
  const W = 1024, H = 512
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#1A5276'; ctx.fillRect(0, 0, W, H)

  const project = (lng, lat) => [((lng + 180) / 360) * W, ((90 - lat) / 180) * H]
  const normLng = (l) => { while (l > 180) l -= 360; while (l < -180) l += 360; return l }

  worldGeoJSON.features.forEach(f => {
    ctx.beginPath()
    const geom = f.geometry
    const drawPolygon = (coords) => {
      coords.forEach((ring, ri) => {
        ring.forEach(([lng, lat], i) => {
          const [x, y] = project(normLng(lng), lat)
          if (i === 0 && ri === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.closePath()
      })
    }
    if (geom.type === 'Polygon') drawPolygon(geom.coordinates)
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(p => drawPolygon(p))
    const seed = f.properties.name?.charCodeAt(0) || 65
    const g = 130 + (seed % 40)
    const r = 50 + (seed % 25)
    const b = 60 + (seed % 20)
    ctx.fillStyle = `rgb(${r},${g},${b})`
    ctx.fill()
    ctx.strokeStyle = 'rgba(30,40,30,0.25)'
    ctx.lineWidth = 0.3
    ctx.stroke()
  })

  return new Promise(resolve => canvas.toBlob(b => {
    _cachedNaturalGlobeTextureUrl = URL.createObjectURL(b)
    resolve(_cachedNaturalGlobeTextureUrl)
  }, 'image/png'))
}

const globeTextureUrl = ref('')       // 页面小地球（鲜艳）
const mutedGlobeTextureUrl = ref('')  // 页面小地球（低饱和）
const introTextureUrl = ref('')       // 开场大地球（蓝绿自然）（SVG data URI，用于平面地图场馆标记）
const FOOTBALL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><radialGradient id="fb" cx="35%" cy="30%"><stop offset="0%" stop-color="#fff"/><stop offset="70%" stop-color="#eee"/><stop offset="100%" stop-color="#ccc"/></radialGradient></defs><circle cx="16" cy="16" r="15" fill="url(#fb)" stroke="#1a1a1a" stroke-width="1.6"/><polygon points="16,8 21,11.5 19,17.5 13,17.5 11,11.5" fill="#1a1a1a"/><polygon points="16,4 20,6.5 18.5,10.5 13.5,10.5 12,6.5" fill="#1a1a1a"/><polygon points="7,13 10,14.5 10.5,19 7,21.5 4.5,17" fill="#1a1a1a"/><polygon points="25,13 22,14.5 21.5,19 25,21.5 27.5,17" fill="#1a1a1a"/><line x1="11" y1="11.5" x2="10" y2="14.5" stroke="#444" stroke-width="0.6"/><line x1="21" y1="11.5" x2="22" y2="14.5" stroke="#444" stroke-width="0.6"/><line x1="13.5" y1="10.5" x2="10.5" y2="19" stroke="#444" stroke-width="0.5" opacity="0.5"/><line x1="18.5" y1="10.5" x2="21.5" y2="19" stroke="#444" stroke-width="0.5" opacity="0.5"/></svg>'
const FOOTBALL_ICON = `image://data:image/svg+xml;base64,${btoa(FOOTBALL_SVG)}`

// ---- Intro splash state ----
const showIntro = ref(true)
const introTitlesVisible = ref(false)
const textureReady = ref(false)   // 纹理就绪后才显示地球，避免 WebGL 白闪
let introTitleTimer = null
function dismissIntro() { showIntro.value = false }

// ---- 所有国家数据（含非参赛国，全可点击） ----
const allCountriesData = worldGeoJSON.features.map(f => {
  const team = qualifiedTeams.find(t => t.geoName === f.properties.name)
  return { name: f.properties.name, team: team || null }
})

// ---- 飞线：按大洲着色（低饱和） ----
// 飞线色系刻意避开地图的暖橙→蓝渐变，选用低饱和冷紫/青/玫瑰调
const CONTINENT_LINE_COLORS = {
  UEFA:      '#9B8EC0',  // 欧洲 — 淡紫
  CONMEBOL:  '#6AAA98',  // 南美 — 薄荷
  AFC:       '#C88898',  // 亚洲 — 灰玫
  CAF:       '#A09860',  // 非洲 — 橄榄
  CONCACAF:  '#6AA0B8',  // 中北美 — 湖蓝（比地图蓝更偏青）
  OFC:       '#80B0A0',  // 大洋洲 — 海沫绿
}

// 飞线起点城市 → 大洲映射
function getContinentForFlight(fromCity) {
  const europe = ['London','Paris','Madrid','Berlin','Rome']
  const southAmerica = ['Brasília','Buenos Aires','Rio de Janeiro']
  const africa = ['Dakar','Nairobi','Cairo','Lagos']
  const asia = ['Tokyo','Seoul','Beijing','Shanghai']
  const oceania = ['Sydney','Auckland','Melbourne']
  if (europe.includes(fromCity)) return 'UEFA'
  if (southAmerica.includes(fromCity)) return 'CONMEBOL'
  if (africa.includes(fromCity)) return 'CAF'
  if (asia.includes(fromCity)) return 'AFC'
  if (oceania.includes(fromCity)) return 'OFC'
  return 'CONCACAF'
}

// 按大洲分组的飞线数据
const continentFlightLines = computed(() => {
  const groups = { UEFA:[], CONMEBOL:[], AFC:[], CAF:[], CONCACAF:[], OFC:[] }
  flightPaths.forEach(fp => {
    const continent = getContinentForFlight(fp.from)
    groups[continent].push({ coords: fp.coords, from: fp.from, to: fp.to })
  })
  return groups
})

// ---- 2D 平面地图配置（低饱和橙黄白蓝 + visualMap 强度滑块） ----
const flatMapOption = computed(() => ({
  backgroundColor: 'transparent',
  visualMap: {
    type: 'continuous',
    min: 1,
    max: 50,
    text: ['FIFA #1', 'FIFA #50'],
    textStyle: { color: '#8898B0', fontSize: 10 },
    realtime: true,
    calculable: true,
    hoverLink: true,
    orient: 'horizontal',
    left: 'center',
    bottom: 8,
    itemWidth: 14,
    itemHeight: 180,
    // 暖橙(1/3)→米白(1/3)→浅蓝(1/3) — 三色段各占 4 档，均衡分布
    inRange: { color: ['#E87850','#E89048','#E8A040','#D8B840','#D0C060','#C8C080','#C4C098','#C0B8A8','#B0B8B8','#A0B8C4','#90B0C8','#80A8C0'] },
    outOfRange: { color: ['#3A3830'] },
    handleStyle: { borderColor: '#E8A040', borderWidth: 2, borderType: 'solid' },
    indicatorStyle: { borderColor: '#8898B0', borderWidth: 1 },
  },
  tooltip: {
    show: true,
    trigger: 'item',
    backgroundColor: 'rgba(10,14,24,0.95)',
    borderColor: 'rgba(232,160,64,0.4)',
    borderWidth: 1,
    textStyle: { color: '#D8DCE8', fontSize: 12 },
    formatter(params) {
      if (params.data?.team) {
        const t = params.data.team
        return `<b style="color:#E8A040;">${t.name}（${t.code.toUpperCase()}）</b><br/><span style="color:#8898B0;font-size:11px;">FIFA #${t.fifaRank} · ${CONTINENT[t.continent].label}${t.isHost ? ' · ⭐ 东道主' : ''}</span>`
      }
      return `<span style="color:#8898B0;">${params.name || '未知地区'}</span>`
    },
  },
  geo: {
    map: 'world',
    roam: true,
    zoom: flatMapZoom.value,
    center: flatMapCenter.value,
    aspectScale: 0.75,
    layoutCenter: ['50%', '48%'],
    layoutSize: '100%',
    itemStyle: {
      areaColor: '#3A3830',
      borderColor: 'rgba(80,70,55,0.4)',
      borderWidth: 0.4,
    },
    emphasis: {
      itemStyle: { areaColor: '#FFD700', borderColor: '#FFA000', borderWidth: 2, shadowBlur: 16, shadowColor: 'rgba(255,215,0,0.5)' },
      label: { show: true, color: '#FFFFFF', fontSize: 12, fontWeight: 800, textShadowBlur: 6, textShadowColor: 'rgba(0,0,0,0.6)' },
    },
  },
  series: [{
    type: 'map',
    map: 'world',
    geoIndex: 0,
    data: allCountriesData.map(c => ({
      name: c.name,
      value: c.team ? c.team.fifaRank : 55,
      team: c.team,
    })),
    emphasis: {
      itemStyle: { areaColor: '#FFD700', borderColor: '#FFA000', borderWidth: 3, shadowBlur: 24, shadowColor: 'rgba(255,215,0,0.7)' },
      label: { show: true, color: '#FFFFFF', fontSize: 13, fontWeight: 800, textShadowBlur: 6, textShadowColor: 'rgba(0,0,0,0.6)' },
    },
    selectedMode: false,
  }, {
    // 16 座场馆散点标记（可点击，足球图标）
    type: 'scatter',
    coordinateSystem: 'geo',
    geoIndex: 0,
    data: hostCities.map(c => ({
      name: `${c.name}（${c.venue}）`,
      value: [c.lng, c.lat],
      venueData: c,
      country: c.country,
      capacity: c.capacity,
    })),
    symbol: FOOTBALL_ICON,
    symbolSize: Math.max(8, Math.round(20 * flatMapZoom.value / 1.3)), // 随地图缩放等比变化
    itemStyle: {
      color: '#FFF',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    emphasis: {
      scale: 1.6,
      itemStyle: {
        color: '#FFF',
        borderColor: '#FFD080',
        borderWidth: 1.5,
        shadowBlur: 12,
        shadowColor: 'rgba(232,160,64,0.6)',
      },
      label: {
        show: true,
        formatter: p => p.name,
        color: '#FFF',
        fontSize: 11,
        fontWeight: 700,
        distance: 8,
      },
    },
    zlevel: 2,
  },
  // ---- 各大洲飞线（低饱和，带流动光效） ----
  ...Object.entries(continentFlightLines.value).filter(([, lines]) => lines.length > 0).map(([continent, lines]) => ({
    type: 'lines',
    coordinateSystem: 'geo',
    geoIndex: 0,
    polyline: false,
    data: lines.map(l => ({ coords: l.coords })),
    lineStyle: {
      color: CONTINENT_LINE_COLORS[continent],
      width: 0.8,
      opacity: 0.55,
      curveness: 0.18,
    },
    effect: {
      show: true,
      period: 6,
      trailLength: 0.25,
      symbol: 'arrow',
      symbolSize: 5,
      color: CONTINENT_LINE_COLORS[continent],
    },
    emphasis: {
      lineStyle: {
        width: 1.4,
        opacity: 0.85,
      },
    },
    zlevel: 1,
  })),
]}))

// ---- 3D 地球配置（纹理着色 + map3D 交互） ----
const globeOption = computed(() => {
  const scatterData = hostCities.map(c => ({ name: `${c.name}（${c.venue}）`, value: [c.lng, c.lat], country: c.country, capacity: c.capacity }))
  const linesData = flightPaths.map(f => ({ coords: f.coords }))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(10,14,24,0.95)',
      borderColor: 'rgba(232,160,64,0.4)',
      borderWidth: 1,
      textStyle: { color: '#D8DCE8', fontSize: 12 },
      formatter(params) {
        if (params.seriesType === 'scatter3D') {
          return `<b style="color:#E8A040;">${params.name}</b><br/><span style="color:#8898B0;font-size:11px;">${params.data.country} · ${params.data.capacity}人</span>`
        }
        if (params.seriesType === 'map3D' && params.data?.team) {
          const t = params.data.team
          return `<b style="color:#E8A040;">${t.name}（${t.code.toUpperCase()}）</b><br/><span style="color:#8898B0;font-size:11px;">FIFA #${t.fifaRank} · ${t.isHost ? '⭐ 东道主' : '参赛队'}</span>`
        }
        return ''
      },
    },
    globe: {
      baseTexture: globeTextureUrl.value || undefined,
      environment: null,
      shading: 'lambert',
      globeRadius: 70,
      atmosphere: { show: false },
      viewControl: {
        autoRotate: true, autoRotateSpeed: 0.8,
        targetCoord: [-90, 28],
        zoomSensitivity: 0.8,
        minDistance: 180, maxDistance: 400,
        rotateSensitivity: 0.6,
      },
      light: { ambient: { intensity: 0.85 }, main: { intensity: 0.45, alpha: 30, beta: 40 } },
      postEffect: { enable: false },
    },
    series: [
      // map3D 半透明交互层（颜色由纹理提供，此层负责点击）
      {
        type: 'map3D', map: 'world', coordinateSystem: 'globe',
        data: qualifiedTeamsOnMap.map(t => ({ name: t.geoName, team: t })),
        itemStyle: { areaColor: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.04)', borderWidth: 0.15 },
        emphasis: {
          itemStyle: { areaColor: 'rgba(255,224,64,0.4)', borderColor: '#FFA040', borderWidth: 2 },
          label: { show: true, color: '#FFF', fontSize: 10, fontWeight: 700, distance: 3 },
        },
        silent: false,
        z: 10,
      },
      {
        type: 'scatter3D', coordinateSystem: 'globe', data: scatterData,
        symbol: 'pin', symbolSize: 5,
        itemStyle: { color: '#FF6040', borderColor: '#FFD080', borderWidth: 1, shadowBlur: 4, shadowColor: 'rgba(255,96,64,0.4)' },
        label: { show: false },
        emphasis: { itemStyle: { color: '#FF8850', borderColor: '#FFF', borderWidth: 2 }, scale: 1.5 },
      },
      {
        type: 'lines3D', coordinateSystem: 'globe', data: linesData,
        lineStyle: { color: 'rgba(255,200,140,0.2)', width: 0.4 },
        effect: { show: true, period: 5, trailLength: 0.15, symbol: 'arrow', symbolSize: 3, color: 'rgba(255,200,130,0.35)' },
        blendMode: 'lighter',
      },
    ],
  }
})

// ---- 开场大地球（全屏遮罩，旋转展示，点击关闭） ----
const introGlobeOption = computed(() => {
  const scatterData = hostCities.map(c => ({ name: `${c.name}（${c.venue}）`, value: [c.lng, c.lat], country: c.country, capacity: c.capacity }))
  const linesData = flightPaths.map(f => ({ coords: f.coords }))

  return {
    backgroundColor: 'transparent',
    globe: {
      baseTexture: introTextureUrl.value || undefined,
      environment: null,
      shading: 'lambert',
      globeRadius: 110,
      atmosphere: {
        show: true,
        color: 'rgba(30, 60, 120, 0.25)',
      },
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 1.2,
        targetCoord: [-90, 28],
        zoomSensitivity: 0,
        minDistance: 280,
        maxDistance: 280,
        rotateSensitivity: 0,
      },
      light: {
        ambient: { intensity: 1.0 },
        main: { intensity: 0.6, alpha: 30, beta: 40 },
      },
      postEffect: { enable: false },
    },
    series: [
      {
        type: 'scatter3D', coordinateSystem: 'globe', data: scatterData,
        symbol: 'pin', symbolSize: 6,
        itemStyle: { color: '#FF6040', borderColor: '#FFD080', borderWidth: 1.5, shadowBlur: 6, shadowColor: 'rgba(255,96,64,0.5)' },
        label: { show: false },
      },
      {
        type: 'lines3D', coordinateSystem: 'globe', data: linesData,
        lineStyle: { color: 'rgba(255,200,140,0.2)', width: 0.5 },
        effect: { show: true, period: 5, trailLength: 0.15, symbol: 'arrow', symbolSize: 4, color: 'rgba(255,200,130,0.35)' },
        blendMode: 'lighter',
      },
    ],
    tooltip: { show: false },
  }
})

const continentCards = computed(() => {
  const entries = Object.entries(CONTINENT)
  const ICONS = { UEFA:'🏰', CONMEBOL:'🦅', AFC:'🏯', CAF:'🦁', CONCACAF:'🌵', OFC:'🌊' }
  return entries.map(([key, meta]) => {
    const teams = qualifiedTeams.filter(t => t.continent === key)
    const ranks = teams.map(t => t.fifaRank)
    const avgRank = Math.round(ranks.reduce((a, b) => a + b, 0) / ranks.length)
    const topTeam = teams.sort((a, b) => a.fifaRank - b.fifaRank)[0]
    const hostCount = teams.filter(t => t.isHost).length
    return {
      key, name: meta.label, color: meta.color, teams,
      avgRank, topTeam, teamCount: teams.length, hostCount,
      icon: ICONS[key],
    }
  })
})

const selectedContinent = ref(null)
const selectedTeam = ref(null)
const selectedOption = ref(null)  // null=选择菜单, 'overview'=综合实力, 'teams'=球队分析
function selectContinent(c) { selectedContinent.value = c; selectedTeam.value = null; selectedOption.value = null }
function selectTeam(t) { selectedTeam.value = t }
function backToContinents() { selectedContinent.value = null; selectedTeam.value = null; selectedOption.value = null }

const hostCitiesSorted = computed(() => {
  return [...hostCities].sort((a, b) => {
    const capA = parseInt(String(a.capacity).replace(/,/g, ''), 10)
    const capB = parseInt(String(b.capacity).replace(/,/g, ''), 10)
    return capB - capA
  })
})

onMounted(async () => {
  // 并行生成三种纹理
  const [globe, muted, natural] = await Promise.all([
    generateGlobeTexture(),
    generateMutedGlobeTexture(),
    generateNaturalGlobeTexture(),
  ])
  globeTextureUrl.value = globe
  mutedGlobeTextureUrl.value = muted
  introTextureUrl.value = natural
  textureReady.value = true
  // 纹理就绪后 0.6s 标题淡入
  introTitleTimer = setTimeout(() => { introTitlesVisible.value = true }, 600)
})
onBeforeUnmount(() => {
  if (introTitleTimer) clearTimeout(introTitleTimer)
  if (_highlightTimer) clearTimeout(_highlightTimer)
})

// ---- 交互 ----
const venueDialogVisible = ref(false); const selectedVenue = ref(null)
const groupDialogVisible = ref(false); const selectedGroupData = ref(null)
const countryDialogVisible = ref(false); const selectedCountry = ref(null)
const hostCountryDialogVisible = ref(false); const selectedHostCountry = ref(null)
const flatMapChartRef = ref(null)
const flatMapZoom = ref(1.3)        // 当前地图缩放级别，初始 1.3 与 geo.zoom 对齐
const flatMapCenter = ref([10, 18]) // 当前地图中心经纬度

function onFlatMapRoam(event) {
  if (event.zoom != null) flatMapZoom.value = event.zoom
  if (event.center != null) flatMapCenter.value = event.center
}

function onGlobeClick(p) {
  if (p.seriesType === 'scatter3D' && p.data) {
    const cityName = p.name?.split('（')[0]
    const v = hostCities.find(c => c.name === cityName)
    if (v) openVenueModal(v)
  }
  if (p.seriesType === 'map3D' && p.data?.team) {
    selectedCountry.value = p.data.team
    countryDialogVisible.value = true
  }
}
function onFlatMapClick(params) {
  // 场馆散点点击 → 打开场馆详情弹窗
  if (params.seriesType === 'scatter' && params.data?.venueData) {
    openVenueModal(params.data.venueData)
    return
  }
  if (params.data?.team) {
    selectedCountry.value = params.data.team
    countryDialogVisible.value = true
  } else if (params.name) {
    // 非参赛国也弹窗显示基本信息
    selectedCountry.value = {
      name: params.name,
      code: 'unknown',
      fifaRank: 99,
      continent: '',
      geoName: params.name,
    }
    countryDialogVisible.value = true
  }
}
// ---- 冠军时间轴交互 ----
// 非参赛冠军国的 geoName 映射
const CHAMPION_GEO_NAME = {
  'it': 'Italy',
  'uy': 'Uruguay',
  'de': 'Germany',
  'ar': 'Argentina',
  'br': 'Brazil',
  'fr': 'France',
  'gb-eng': 'United Kingdom',
  'es': 'Spain',
}

function onChampionClick(champ) {
  // 查找对应国家在地图上的名称
  let geoName = CHAMPION_GEO_NAME[champ.winnerCode]
  if (!geoName) {
    const team = qualifiedTeams.find(t => t.code === champ.winnerCode)
    geoName = team?.geoName || champ.winnerName
  }

  // 地图变色 + 平移
  highlightCountryOnMap(geoName)
}

// 冠军国地理中心（手动校正，避免海外领土 / 复杂多边形的偏差）
const CHAMPION_CENTERS = {
  'France':               [2.3, 46.6],
  'Germany':              [10.4, 51.1],
  'Italy':                [12.5, 41.9],
  'Spain':                [-3.7, 40.4],
  'United Kingdom':       [-3.4, 55.4],
  'Brazil':               [-53.1, -10.8],
  'Argentina':            [-65.0, -35.5],
  'Uruguay':              [-55.8, -32.5],
}

// 国家中心坐标缓存（从 GeoJSON 计算，取最大多边形环的重心）
const _countryCenters = {}
function getCountryCenter(geoName) {
  // 优先使用手动校正的坐标
  if (CHAMPION_CENTERS[geoName]) return CHAMPION_CENTERS[geoName]
  if (_countryCenters[geoName]) return _countryCenters[geoName]

  const feature = worldGeoJSON.features.find(f => f.properties.name === geoName)
  if (!feature) return null

  const geom = feature.geometry
  // 收集全部多边形环，取坐标最多的那个（通常是本土）
  let allRings = []
  if (geom.type === 'Polygon') allRings = geom.coordinates
  else if (geom.type === 'MultiPolygon') allRings = geom.coordinates.flat()

  if (!allRings.length) return null
  // 选最长的环（坐标数最多 = 本土主要多边形）
  const ring = allRings.reduce((a, b) => a.length >= b.length ? a : b)

  let sumLng = 0, sumLat = 0
  for (const [lng, lat] of ring) { sumLng += lng; sumLat += lat }
  const center = [sumLng / ring.length, sumLat / ring.length]
  _countryCenters[geoName] = center
  return center
}

// 地图高亮：update refs 触发 computed 平移 → 用 dispatchAction 让国家变金色
function highlightCountryOnMap(geoName) {
  const chart = flatMapChartRef.value?.chart
  if (!chart) return

  // 清除旧高亮
  if (_highlightTimer) clearTimeout(_highlightTimer)
  chart.dispatchAction({ type: 'downplay', seriesIndex: 0 })

  // 先更新地图中心/缩放（这会触发 computed 重算 → setOption）
  const center = getCountryCenter(geoName)
  if (center) {
    flatMapCenter.value = center
    flatMapZoom.value = Math.max(flatMapZoom.value, 2.2)
  }

  // 等 computed → vue-echarts → setOption 完成后，再高亮国家
  //（否则 setOption 会清除 dispatchAction 的高亮状态）
  nextTick(() => {
    chart.dispatchAction({ type: 'highlight', seriesIndex: 0, name: geoName })
  })

  // 8 秒后还原
  _highlightTimer = setTimeout(() => {
    chart.dispatchAction({ type: 'downplay', seriesIndex: 0 })
    _highlightTimer = null
  }, 8000)
}

function openVenueModal(v) {
  selectedVenue.value = v
  venueDialogVisible.value = true
}
function onVenueDialogClosed() {
  selectedVenue.value = null
  // 确保 body 滚动恢复
  document.body.style.overflow = ''
}
function openGroupModal(g) { selectedGroupData.value = g; groupDialogVisible.value = true }
function openHostVenue(countryName) {
  const countryTeam = qualifiedTeams.find(t => t.name === countryName)
  const cities = hostCities.filter(c => c.country === countryName)
  const flagMap = { '美国': '🇺🇸', '加拿大': '🇨🇦', '墨西哥': '🇲🇽' }
  selectedHostCountry.value = {
    name: countryName,
    flag: flagMap[countryName] || '⭐',
    code: countryTeam?.code || 'unknown',
    team: countryTeam || null,
    cities: cities,
  }
  hostCountryDialogVisible.value = true
}
function openVenueFromHost(v) {
  hostCountryDialogVisible.value = false
  // 稍微延迟打开，确保上一个弹窗完全关闭
  setTimeout(() => { openVenueModal(v) }, 150)
}

// ---- 场馆图片（全部 16 座已下载到 public/images/sport_venues/） ----
const VENUE_LOCAL_MAP = {
  'AT&T体育场':'AT&T.jpg','阿兹特克体育场':'阿兹特克.jpg','BBVA体育场':'BBVA.jpg',
  'BMO球场':'BMO.jpg','硬石体育场':'硬石.jpg','李维斯体育场':'李维斯.jpg','NRG体育场':'NRG.jpg',
  '大都会人寿体育场':'大都会.jpg','SoFi体育场':'SoFi.jpg','梅赛德斯-奔驰体育场':'梅赛德斯.jpg',
  'BC Place':'bc-place.jpg','流明球场':'流明.jpg','吉列体育场':'吉列.jpg',
  '林肯金融球场':'林肯.jpg','联邦快递球场':'联邦快递.jpg','阿克伦体育场':'阿克伦.jpg',
}
function getVenueImage(v) {
  const localFile = VENUE_LOCAL_MAP[v.venue]
  return localFile ? `/images/sport_venues/${localFile}` : ''
}
function hasVenueImage(v) {
  return !!VENUE_LOCAL_MAP[v.venue]
}

function formatCap(c) { return typeof c === 'string' ? c : Number(c).toLocaleString() }
function getContinentLabel(code) { const t = qualifiedTeams.find(t => t.code === code); return t ? CONTINENT[t.continent].label : '' }
function getFifaRank(code) { const t = qualifiedTeams.find(t => t.code === code); return t ? t.fifaRank : '?' }
function getTeamColor(code) { const t = qualifiedTeams.find(t => t.code === code); return t ? getDisplayColor(t.fifaRank) : '#555' }
function getTeamRecord(code) {
  const r = { 'ar':'🏆 3 冠 · 卫冕冠军','br':'🏆 5 冠 · 足球王国','de':'🏆 4 冠 · 日耳曼战车','fr':'🏆 2 冠 · 高卢雄鸡','gb-eng':'🏆 1 冠 · 三狮军团','it':'🏆 4 冠 · 蓝衣军团','es':'🏆 1 冠 · 斗牛士','nl':'🥈 无冕之王','pt':'⚽ C罗领衔','be':'⚡ 黄金一代','hr':'🥈 2018 亚军','uy':'🏆 2 冠 · 天蓝军团','us':'⭐ 东道主','mx':'⭐ 东道主','ca':'⭐ 东道主','jp':'🔵 蓝武士','kr':'🐯 太极虎','ma':'🦁 北非之狮','sn':'🦁 特兰加之狮' }
  return r[code] || '⚽ 实力劲旅'
}
function getGroupPrediction(teams) {
  const ranked = teams.map(c => ({ c, r: getFifaRank(c) })).sort((a, b) => a.r - b.r)
  const top2 = ranked.slice(0, 2).map(t => codeToName[t.c] || t.c)
  return `🏆 预测出线：${top2[0]} / ${top2[1]}（基于 FIFA 排名）`
}
function getWorldCups(code) {
  const wc = { 'br':5, 'de':4, 'it':4, 'ar':3, 'fr':2, 'uy':2, 'gb-eng':1, 'es':1 }
  return wc[code] ? `${wc[code]} 次` : '暂无'
}
function continentTotalTitles(continentKey) {
  const teams = qualifiedTeams.filter(t => t.continent === continentKey)
  const wc = { 'br':5, 'de':4, 'it':4, 'ar':3, 'fr':2, 'uy':2, 'gb-eng':1, 'es':1 }
  let total = 0
  teams.forEach(t => { if (wc[t.code]) total += wc[t.code] })
  return total > 0 ? `${total} 次` : '暂无'
}
function getCountryDesc(code) {
  const d = {
    'ar': '阿根廷是南美足球强国，拥有梅西等传奇球星，2022 年卡塔尔世界杯夺冠后士气正盛。',
    'br': '巴西是世界杯历史上最成功的球队（5 冠），被誉为"足球王国"，盛产天才球员。',
    'de': '德国队以纪律和团队配合著称，4 次夺冠，是欧洲足坛的顶级劲旅。',
    'fr': '法国队近年实力强劲，2018 年夺冠、2022 年亚军，拥有姆巴佩等超级球星。',
    'gb-eng': '英格兰是现代足球发源地，1966 年在本土夺冠，近年人才井喷实力大增。',
    'us': '美国是 2026 世界杯东道主之一，足球运动近年快速发展，拥有 11 座主办城市。',
    'mx': '墨西哥是世界杯常客，两次主办世界杯（1970、1986），2026 年第三次成为东道主。',
    'ca': '加拿大首次成为世界杯东道主，足球运动正在北美蓬勃兴起。',
    'jp': '日本是亚洲足球的代表之一，技术流打法独树一帜，多次闯入淘汰赛。',
    'kr': '韩国队以顽强斗志著称，2002 年闯入四强创造亚洲历史。',
    'nl': '荷兰以全攻全守战术闻名，虽未夺世界杯但被称为"无冕之王"。',
    'pt': '葡萄牙近年实力强劲，拥有 C 罗等传奇球星，2016 年欧洲杯夺冠。',
    'es': '西班牙以传控足球著称，2010 年南非世界杯夺冠登顶世界之巅。',
    'uy': '乌拉圭是世界杯史上首个冠军（1930年），2 次夺冠，以顽强防守和高效反击著称，2026年再度参赛。',
    'it': '意大利 4 次夺冠，防守反击战术闻名于世，是欧洲传统豪门。',
    'hr': '克罗地亚 2018 年闯入决赛获得亚军，以莫德里奇为核心的中场实力雄厚。',
    'ma': '摩洛哥 2022 年闯入四强创造非洲历史，防守反击极具威胁。',
  }
  return d[code] || `${codeToName[code] || '该队'}是 2026 年世界杯的参赛队伍之一，将力争在小组赛中取得佳绩。`
}
</script>

<style scoped>
.tab-map { padding-top: 0; margin-left: -24px; margin-right: -24px; }

/* ===== Hero Map ===== */
.map-hero {
  margin-bottom: 20px; overflow: hidden; border-radius: 0;
  border-left: none; border-right: none; position: relative; isolation: isolate;
  background: radial-gradient(ellipse at 50% 30%, #101830 0%, #080E1E 50%, #040810 100%);
}
/* 星空 */
.map-hero::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(2px 2px at 8% 12%, rgba(255,255,255,0.95), transparent),
    radial-gradient(2.5px 2.5px at 22% 6%, rgba(220,235,255,0.9), transparent),
    radial-gradient(1.5px 1.5px at 38% 18%, rgba(255,255,255,0.85), transparent),
    radial-gradient(2px 2px at 52% 8%, rgba(200,220,255,0.9), transparent),
    radial-gradient(2.5px 2.5px at 68% 22%, rgba(230,240,255,0.95), transparent),
    radial-gradient(1.5px 1.5px at 82% 10%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 92% 16%, rgba(210,225,250,0.85), transparent),
    radial-gradient(1.5px 1.5px at 15% 30%, rgba(255,255,255,0.75), transparent),
    radial-gradient(2px 2px at 28% 42%, rgba(220,235,255,0.7), transparent),
    radial-gradient(2.5px 2.5px at 45% 35%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1.5px 1.5px at 60% 28%, rgba(210,225,245,0.75), transparent),
    radial-gradient(2px 2px at 75% 40%, rgba(235,240,255,0.8), transparent),
    radial-gradient(2px 2px at 88% 32%, rgba(200,220,240,0.7), transparent),
    radial-gradient(1.5px 1.5px at 5% 50%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 32% 56%, rgba(220,230,250,0.65), transparent),
    radial-gradient(1.5px 1.5px at 55% 48%, rgba(255,255,255,0.55), transparent),
    radial-gradient(2.5px 2.5px at 70% 52%, rgba(240,245,255,0.7), transparent),
    radial-gradient(0.8px 0.8px at 3% 20%, rgba(180,200,220,0.5), transparent),
    radial-gradient(0.8px 0.8px at 12% 45%, rgba(200,210,230,0.4), transparent),
    radial-gradient(0.8px 0.8px at 19% 28%, rgba(190,205,225,0.45), transparent),
    radial-gradient(0.8px 0.8px at 25% 52%, rgba(200,215,235,0.4), transparent),
    radial-gradient(0.8px 0.8px at 33% 14%, rgba(180,195,215,0.5), transparent),
    radial-gradient(0.8px 0.8px at 41% 38%, rgba(190,210,225,0.4), transparent),
    radial-gradient(0.8px 0.8px at 48% 58%, rgba(200,215,230,0.35), transparent),
    radial-gradient(0.8px 0.8px at 55% 22%, rgba(185,200,220,0.45), transparent),
    radial-gradient(0.8px 0.8px at 63% 44%, rgba(195,210,230,0.4), transparent),
    radial-gradient(0.8px 0.8px at 72% 18%, rgba(190,205,220,0.5), transparent),
    radial-gradient(0.8px 0.8px at 78% 55%, rgba(200,215,235,0.35), transparent),
    radial-gradient(0.8px 0.8px at 85% 26%, rgba(180,200,215,0.45), transparent),
    radial-gradient(0.8px 0.8px at 94% 48%, rgba(200,215,230,0.35), transparent),
    radial-gradient(0.8px 0.8px at 7% 62%, rgba(190,205,220,0.3), transparent),
    radial-gradient(0.8px 0.8px at 36% 65%, rgba(200,215,230,0.3), transparent),
    radial-gradient(0.8px 0.8px at 58% 62%, rgba(185,200,220,0.35), transparent),
    radial-gradient(0.8px 0.8px at 80% 60%, rgba(195,215,230,0.3), transparent);
}
.map-hero > * { position: relative; z-index: 1; }
.hero-top { display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 24px 0; flex-wrap: wrap; gap: 8px; }
.hero-title { font-size: 20px; font-weight: 700; color: #E8ECF1; display: flex; align-items: center; gap: 8px; }
.icon-globe { font-size: 24px; }
.hero-sub { display: flex; gap: 6px; margin-top: 4px; flex-wrap: wrap; }
.stat-chip { font-size: 11px; padding: 2px 8px; border-radius: 20px; background: rgba(180,160,130,0.12); color: #B8A890; font-weight: 600; border: 1px solid rgba(180,160,130,0.2); }

/* ===== Split Map Layout ===== */
.map-split { height: 520px; margin-top: 6px; position: relative; z-index: 1; }
.map-left { position: absolute; inset: 0; }
/* 暗色星空底 */
.map-left::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(1.5px 1.5px at 10% 15%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 25% 8%, rgba(200,220,255,0.6), transparent),
    radial-gradient(2px 2px at 40% 22%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 55% 12%, rgba(220,235,255,0.65), transparent),
    radial-gradient(1.5px 1.5px at 70% 25%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 85% 10%, rgba(200,220,240,0.55), transparent),
    radial-gradient(2px 2px at 15% 40%, rgba(230,240,255,0.6), transparent),
    radial-gradient(1.5px 1.5px at 35% 55%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 50% 35%, rgba(210,230,250,0.55), transparent),
    radial-gradient(2px 2px at 65% 50%, rgba(240,245,255,0.6), transparent),
    radial-gradient(1px 1px at 80% 38%, rgba(200,220,235,0.5), transparent),
    radial-gradient(1.5px 1.5px at 90% 55%, rgba(255,255,255,0.55), transparent),
    radial-gradient(1px 1px at 5% 60%, rgba(190,210,230,0.4), transparent),
    radial-gradient(1.5px 1.5px at 20% 70%, rgba(220,230,250,0.45), transparent),
    radial-gradient(1px 1px at 42% 62%, rgba(200,220,240,0.4), transparent),
    radial-gradient(2px 2px at 60% 68%, rgba(230,240,255,0.5), transparent),
    radial-gradient(1px 1px at 75% 58%, rgba(190,210,225,0.45), transparent),
    radial-gradient(1.5px 1.5px at 88% 72%, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 12% 80%, rgba(200,215,235,0.35), transparent),
    radial-gradient(1.5px 1.5px at 30% 78%, rgba(220,230,250,0.4), transparent),
    radial-gradient(1px 1px at 48% 82%, rgba(200,220,235,0.35), transparent),
    radial-gradient(2px 2px at 68% 75%, rgba(240,245,255,0.45), transparent),
    radial-gradient(1px 1px at 82% 85%, rgba(200,215,230,0.3), transparent),
    radial-gradient(1.5px 1.5px at 95% 78%, rgba(255,255,255,0.35), transparent);
}

/* ===== 右下角 3D 球体（叠加） ===== */
.map-right-corner {
  position: absolute; bottom: 12px; right: 12px;
  width: 260px; height: 260px;
  z-index: 5;
  border-radius: 50%;
  overflow: hidden;
  background: radial-gradient(circle, rgba(8,14,30,0.85), rgba(4,8,16,0.95));
  border: 2px solid rgba(255,255,255,0.10);
  box-shadow: 0 0 24px rgba(0,0,0,0.5), 0 0 60px rgba(20,40,80,0.3);
  transition: all 0.3s;
}
.map-right-corner:hover {
  border-color: rgba(232,160,64,0.3);
  box-shadow: 0 0 32px rgba(0,0,0,0.6), 0 0 80px rgba(232,160,64,0.15);
}
.globe-inset-label {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  font-size: 10px; color: rgba(180,170,150,0.55); font-weight: 600;
  z-index: 6; pointer-events: none; white-space: nowrap;
}
.map-label {
  position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
  font-size: 11px; color: rgba(180,170,150,0.6); font-weight: 600;
  z-index: 2; pointer-events: none; white-space: nowrap;
}
.map-chart { width: 100%; height: 100%; }
.map-left .map-chart { position: relative; z-index: 1; }

/* ===== Host Row ===== */
.host-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; position: relative; z-index: 10; }
.host-card { background: #141B2D; border-radius: 14px; border: 1px solid rgba(255,255,255,0.06); padding: 18px 20px; display: flex; align-items: center; gap: 14px; transition: all 0.3s; position: relative; z-index: 20; overflow: hidden; cursor: pointer; pointer-events: auto; }
.host-card::before { content:''; position:absolute; top:-30px; right:-30px; width:80px; height:80px; border-radius:50%; opacity:0.08; }
.usa-card { border-left:4px solid #8098C8; } .usa-card::before { background:#8098C8; }
.canada-card { border-left:4px solid #E87850; } .canada-card::before { background:#E87850; }
.mexico-card { border-left:4px solid #80B8A0; } .mexico-card::before { background:#80B8A0; }
.host-card:hover { transform:translateY(-3px); border-color:rgba(255,255,255,0.14); box-shadow:0 8px 32px rgba(0,0,0,0.4); }
.host-flag { font-size:32px; flex-shrink:0; }
.host-info { flex:1; }
.host-name { font-size:16px; font-weight:700; color:#E8ECF1; margin-bottom:2px; }
.host-cities { font-size:12px; color:#5A6478; }
.host-badge { font-size:11px; padding:4px 10px; border-radius:20px; background:linear-gradient(135deg,#F59E0B,#FBBF24); color:#0B0F1A; font-weight:700; flex-shrink:0; }

/* ===== Bottom Grid ===== */
.bottom-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:16px; margin-bottom:20px; }
.venue-section { padding:20px 24px; }

/* ===== Continent Emblem Buttons ===== */
.continent-panel { padding:20px 24px; }
.continent-emblem-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
.cont-emblem-btn {
  cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:10px;
  transition:all 0.3s ease; padding:8px 4px;
}
.cont-emblem-btn:hover { transform:translateY(-5px); }
.cont-emblem-btn:active { transform:scale(0.94); }
.ceb-circle {
  width:80px; height:80px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  transition:all 0.4s ease;
  position:relative; overflow:hidden;
}
/* 足球花纹叠加层（简洁分散） */
.ceb-circle::after {
  content:''; position:absolute; inset:0; border-radius:50%; pointer-events:none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpolygon points='40,24 48,29 46,40 34,40 32,29' fill='none' stroke='rgba(0,0,0,0.18)' stroke-width='0.9'/%3E%3Cpolygon points='22,38 28,41 28,50 22,54 16,48' fill='none' stroke='rgba(0,0,0,0.14)' stroke-width='0.8'/%3E%3Cpolygon points='58,38 52,41 52,50 58,54 64,48' fill='none' stroke='rgba(0,0,0,0.14)' stroke-width='0.8'/%3E%3C/svg%3E");
  background-size:cover; background-position:center;
}
.cont-emblem-btn:hover .ceb-circle {
  transform:scale(1.12);
  box-shadow: 0 0 50px var(--cont-color, #888)66, 0 0 100px var(--cont-color, #888)33 !important;
}
.ceb-icon { font-size:30px; position:relative; z-index:1; filter:drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
.ceb-label { font-size:13px; font-weight:700; color:#C0C8D4; }
.ceb-count { font-size:10px; color:#5A6478; }

/* ===== Continent Choice Menu ===== */
.continent-choice { padding:24px; text-align:center; }
.choice-hero { padding:20px 0; border-bottom:1px solid rgba(255,255,255,0.06); margin-bottom:20px; }
.choice-circle { width:70px; height:70px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; }
.choice-icon { font-size:28px; }
.choice-name { font-size:20px; font-weight:800; margin-bottom:4px; }
.choice-desc { font-size:12px; color:#8892A6; }
.choice-buttons { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.choice-btn {
  display:flex; flex-direction:column; align-items:center; gap:6px;
  padding:20px 16px; border-radius:14px; cursor:pointer; border:1px solid rgba(255,255,255,0.08);
  background:rgba(255,255,255,0.02); transition:all 0.3s;
}
.choice-btn:hover { background:rgba(255,255,255,0.05); border-color:var(--btn-color,#888); transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.3); }
.cb-icon { font-size:28px; }
.cb-label { font-size:14px; font-weight:700; color:#E8ECF1; }
.cb-desc { font-size:11px; color:#5A6478; }

/* ===== Continent Overview ===== */
.continent-overview { padding:20px 24px; }
.overview-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:16px 0; }
.ov-stat { background:rgba(255,255,255,0.02); border-radius:12px; padding:14px 10px; text-align:center; display:flex; flex-direction:column; gap:4px; }
.ov-val { font-size:22px; font-weight:900; color:#E8ECF1; }
.ov-lbl { font-size:10px; color:#5A6478; }
.overview-top3 { margin:16px 0; }
.ov-top-title { font-size:13px; font-weight:700; color:#C0C8D4; margin-bottom:10px; }
.ov-top-list { display:flex; flex-direction:column; gap:6px; }
.ov-top-item { display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(255,255,255,0.02); border-radius:10px; }
.ov-top-rank { font-size:11px; font-weight:800; color:#FFF; padding:3px 10px; border-radius:6px; flex-shrink:0; }
.ov-top-name { font-size:13px; font-weight:600; color:#E8ECF1; flex:1; }
.ov-top-record { font-size:11px; color:#8892A6; }
.overview-bar-title { font-size:13px; font-weight:700; color:#C0C8D4; margin:20px 0 12px; }
.overview-bar-wrap { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.ov-bar-label { width:50px; font-size:11px; font-weight:600; color:#8892A6; text-align:right; flex-shrink:0; }
.ov-bar-track { flex:1; height:10px; background:rgba(255,255,255,0.04); border-radius:5px; overflow:hidden; }
.ov-bar-fill { height:100%; border-radius:5px; transition:width 0.8s ease; min-width:4px; }
.ov-bar-val { width:48px; font-size:10px; color:#5A6478; flex-shrink:0; }

/* ===== Continent Detail (Team List) ===== */
.continent-detail { padding:20px 24px; }
.back-btn {
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#8892A6;
  padding:6px 14px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer;
  transition:all 0.2s;
}
.back-btn:hover { background:rgba(255,255,255,0.08); color:#E8A040; border-color:rgba(232,160,64,0.3); }
.team-compare-grid { display:flex; flex-direction:column; gap:8px; margin-top:8px; max-height:400px; overflow-y:auto; }
.team-compare-card {
  display:flex; align-items:center; gap:12px; padding:12px 14px;
  background:rgba(255,255,255,0.02); border-left:3px solid #555;
  border-radius:0 10px 10px 0; cursor:pointer; transition:all 0.2s;
}
.team-compare-card:hover { background:rgba(255,255,255,0.05); transform:translateX(3px); }
.tc-rank { font-size:12px; font-weight:800; color:#FFF; padding:4px 10px; border-radius:6px; flex-shrink:0; min-width:44px; text-align:center; }
.tc-info { flex:1; min-width:0; }
.tc-name { font-size:14px; font-weight:600; color:#E8ECF1; }
.tc-code { font-size:10px; color:#5A6478; }
.tc-record { font-size:11px; color:#8892A6; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.tc-badges { display:flex; gap:4px; flex-shrink:0; }
.tc-badge { font-size:10px; padding:2px 8px; border-radius:10px; font-weight:600; }
.tc-badge.wc { background:rgba(255,215,0,0.1); color:#FFD700; }
.tc-badge.host { background:rgba(255,150,50,0.1); color:#FFA030; }
.tc-arrow { font-size:14px; color:#6A7078; transition:all 0.2s; }
.team-compare-card:hover .tc-arrow { color:#E8A040; transform:translateX(2px); }

/* ===== Team Detail Card ===== */
.team-detail-card { padding:20px 24px; }
.team-detail-hero { border-radius:14px; padding:24px; text-align:center; margin-bottom:16px; color:#FFF; }
.tdh-rank { font-size:12px; color:rgba(255,255,255,0.7); margin-bottom:4px; }
.tdh-name { font-size:28px; font-weight:900; text-shadow:0 2px 8px rgba(0,0,0,0.3); }
.tdh-confed { font-size:13px; color:rgba(255,255,255,0.65); margin-top:4px; }
.team-detail-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:16px; }
.tds-item { background:rgba(255,255,255,0.03); border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:4px; }
.tds-label { font-size:11px; color:#5A6478; }
.tds-value { font-size:14px; font-weight:600; color:#E8ECF1; }
.tds-value.gold { color:#E8A040; }
.team-detail-desc { font-size:13px; line-height:1.8; color:#8892A6; }
.team-detail-desc strong { color:#E8A040; }
.team-detail-back { margin-top:16px; }
.section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.section-title { font-size:17px; font-weight:700; color:#E8ECF1; }
.section-subtitle { font-size:12px; color:#5A6478; }
.section-badge { font-size:11px; padding:3px 10px; border-radius:20px; background:rgba(251,191,36,0.1); color:#FBBF24; font-weight:600; }
.section-badge.preview { background:rgba(34,211,238,0.1); color:#22D3EE; }
.venue-list { display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto; }
.venue-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; background:rgba(255,255,255,0.02); transition:all 0.2s; cursor:pointer; user-select:none; }
.venue-item:hover { background:rgba(255,255,255,0.06); transform:translateX(3px); }
.venue-arrow { font-size:12px; color:#6A7078; transition:all 0.25s; flex-shrink:0; }
.venue-item:hover .venue-arrow { transform:translateX(3px); color:#E8A040; }
.venue-rank { width:26px; height:26px; border-radius:8px; background:#1A2340; color:#8892A6; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.venue-rank.top3 { background:linear-gradient(135deg,#F59E0B,#FBBF24); color:#0B0F1A; }
.venue-info { flex:1; min-width:0; }
.venue-name { font-size:13px; font-weight:600; color:#E8ECF1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.venue-city { font-size:11px; color:#5A6478; }
.venue-cap { margin-left:auto; font-size:12px; font-weight:600; color:#FBBF24; flex-shrink:0; }

/* ===== Group Matrix ===== */
.matrix-section { padding:20px 24px; margin-bottom:20px; }
.group-matrix { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.group-card { background:rgba(255,255,255,0.02); border-radius:12px; padding:14px 16px; border:1px solid rgba(255,255,255,0.06); transition:all 0.2s; cursor:pointer; }
.group-card:hover { border-color:#E8A040; box-shadow:0 4px 16px rgba(232,160,64,0.12); transform:translateY(-2px); }
.group-title { font-size:13px; font-weight:700; color:#E8A040; margin-bottom:10px; display:inline-block; background:rgba(232,160,64,0.1); padding:2px 10px; border-radius:6px; }
.group-teams { display:flex; flex-direction:column; gap:5px; }

/* ===== Modal ===== */
.modal-header { display:flex; align-items:center; gap:8px; color:#E8ECF1; font-size:18px; font-weight:700; }
.modal-icon { font-size:26px; }
.modal-body { color:#C0C8D4; }
.modal-img { width:100%; height:260px; border-radius:14px; overflow:hidden; margin-bottom:18px; background:linear-gradient(135deg,#0D1528,#141B2D); }
.modal-img img { width:100%; height:100%; object-fit:cover; }
.modal-img-fallback { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:6px; }
.fallback-icon { font-size:56px; }
.fallback-name { font-size:16px; font-weight:700; color:#E8A040; }
.fallback-loc { font-size:13px; color:#5A6478; }
.modal-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:16px; }
.modal-stat { background:rgba(255,255,255,0.03); border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:4px; }
.ms-label { font-size:11px; color:#5A6478; }
.ms-value { font-size:14px; font-weight:600; color:#E8ECF1; }
.ms-value.gold { color:#E8A040; }
.modal-desc { font-size:13px; line-height:1.9; color:#8892A6; }
.modal-desc strong { color:#E8A040; }
.modal-group-teams { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:16px; }
.modal-team-card { background:rgba(255,255,255,0.03); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; position:relative; }
.mt-flag-wrap { flex-shrink:0; }
.mt-info { flex:1; display:flex; flex-direction:column; gap:3px; min-width:0; }
.mt-confed { font-size:12px; font-weight:600; color:#E8A040; }
.mt-rank { font-size:11px; color:#8892A6; }
.mt-record { font-size:10px; color:#5A6478; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.mt-color { width:6px; border-radius:3px; align-self:stretch; flex-shrink:0; }
.modal-predict { background:rgba(232,160,64,0.08); border:1px solid rgba(232,160,64,0.2); border-radius:10px; padding:14px 18px; display:flex; align-items:center; gap:12px; }
.predict-label { font-size:13px; font-weight:700; color:#E8A040; flex-shrink:0; }
.predict-value { font-size:13px; color:#C0C8D4; }
.country-hero { border-radius:14px; padding:24px; text-align:center; margin-bottom:16px; }
.ch-rank-label { font-size:12px; color:rgba(255,255,255,0.7); margin-bottom:4px; }
.ch-rank-num { font-size:42px; font-weight:800; color:#FFF; text-shadow:0 2px 8px rgba(0,0,0,0.3); }
.country-flag-full { margin-top:14px; }
.host-hero { border-radius:14px; padding:24px; text-align:center; margin-bottom:16px; }
.host-venue-list-title { font-size:15px; font-weight:700; color:#E8ECF1; margin-bottom:12px; }
.host-venue-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.host-venue-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:14px 16px; display:flex; flex-direction:column; gap:4px; cursor:pointer; transition:all 0.2s; position:relative; }
.host-venue-card:hover { background:rgba(255,255,255,0.06); border-color:rgba(232,160,64,0.3); transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,0.3); }
.hvc-name { font-size:13px; font-weight:700; color:#E8A040; }
.hvc-city { font-size:11px; color:#8892A6; }
.hvc-cap { font-size:11px; color:#5A6478; }
.hvc-arrow { position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:14px; color:#6A7078; transition:all 0.2s; }
.host-venue-card:hover .hvc-arrow { color:#E8A040; transform:translateY(-50%) translateX(3px); }

/* ===== Responsive ===== */
@media (max-width:1024px) {
  .bottom-grid { grid-template-columns:1fr; }
  .group-matrix { grid-template-columns:repeat(3,1fr); }
  .host-row { grid-template-columns:1fr; }
  .tab-map { margin-left:-12px; margin-right:-12px; }
  .modal-group-teams { grid-template-columns:1fr; }
  .map-split { height: 400px; }
  .map-right-corner { width: 200px; height: 200px; bottom: 8px; right: 8px; }
}
@media (max-width:768px) {
  .group-matrix { grid-template-columns:repeat(2,1fr); }
  .hero-top { flex-direction:column; }
  .tab-map { margin-left:-6px; margin-right:-6px; }
  .modal-stats { grid-template-columns:1fr; }
  .host-venue-grid { grid-template-columns:1fr; }
  .map-split { height: 320px; }
  .map-right-corner { width: 160px; height: 160px; bottom: 6px; right: 6px; }
  .globe-inset-label { display: none; }
  .continent-emblem-grid { grid-template-columns:repeat(2,1fr); }
  .team-detail-stats { grid-template-columns:1fr; }
  .choice-buttons { grid-template-columns:1fr; }
  .overview-stats { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:500px) {
  .group-matrix { grid-template-columns:1fr; }
  .tab-map { margin-left:0; margin-right:0; }
  .map-split { height: 260px; }
  .map-right-corner { width: 120px; height: 120px; bottom: 4px; right: 4px; border-radius: 40%; }
}
</style>

<style>
.el-dialog { background:#141B2D !important; border:1px solid rgba(255,255,255,0.08) !important; border-radius:16px !important; box-shadow:0 16px 64px rgba(0,0,0,0.6) !important; z-index: 10000 !important; }
.el-dialog__header { border-bottom:1px solid rgba(255,255,255,0.06); padding:20px 24px 16px !important; margin:0 !important; }
.el-dialog__body { padding:20px 24px !important; }
.el-dialog__close { color:#6A7078 !important; font-size:18px !important; }
.el-dialog__close:hover { color:#E8A040 !important; }
.el-overlay { background:rgba(0,0,0,0.7) !important; z-index: 9999 !important; }

/* ===== Intro Splash Overlay ===== */
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #040810;
}

.intro-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(8, 14, 30, 0.7) 0%, #040810 70%),
    radial-gradient(2px 2px at 8% 12%, rgba(255,255,255,0.95), transparent),
    radial-gradient(2.5px 2.5px at 22% 6%, rgba(220,235,255,0.9), transparent),
    radial-gradient(1.5px 1.5px at 38% 18%, rgba(255,255,255,0.85), transparent),
    radial-gradient(2px 2px at 52% 8%, rgba(200,220,255,0.9), transparent),
    radial-gradient(2.5px 2.5px at 68% 22%, rgba(230,240,255,0.95), transparent),
    radial-gradient(1.5px 1.5px at 82% 10%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 92% 16%, rgba(210,225,250,0.85), transparent),
    radial-gradient(1.5px 1.5px at 15% 30%, rgba(255,255,255,0.75), transparent),
    radial-gradient(2px 2px at 28% 42%, rgba(220,235,255,0.7), transparent),
    radial-gradient(2.5px 2.5px at 45% 35%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1.5px 1.5px at 60% 28%, rgba(210,225,245,0.75), transparent),
    radial-gradient(2px 2px at 75% 40%, rgba(235,240,255,0.8), transparent),
    radial-gradient(2px 2px at 88% 32%, rgba(200,220,240,0.7), transparent),
    radial-gradient(1.5px 1.5px at 5% 50%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 32% 56%, rgba(220,230,250,0.65), transparent),
    radial-gradient(1.5px 1.5px at 55% 48%, rgba(255,255,255,0.55), transparent),
    radial-gradient(2.5px 2.5px at 70% 52%, rgba(240,245,255,0.7), transparent);
}

.intro-globe-wrap {
  position: absolute;
  inset: 0;
  padding: 0% 15% 30%;
  box-sizing: border-box;
}

.intro-globe-chart {
  width: 100%;
  height: 100%;
  animation: globeFadeIn 0.5s ease-out;
}

@keyframes globeFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* 纹理加载前的暗色占位球 */
.intro-globe-placeholder {
  position: absolute;
  inset: 0;
  margin: auto;
  width: min(70vh, 70vw);
  height: min(70vh, 70vw);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #1E3A50, #0B1A2E 70%, #040810 100%);
  box-shadow: 0 0 80px rgba(20, 60, 100, 0.25), 0 0 200px rgba(10, 30, 60, 0.15);
  animation: globePulse 2s ease-in-out infinite;
}

@keyframes globePulse {
  0%, 100% { box-shadow: 0 0 80px rgba(20, 60, 100, 0.25), 0 0 200px rgba(10, 30, 60, 0.15); }
  50%      { box-shadow: 0 0 100px rgba(30, 70, 120, 0.35), 0 0 240px rgba(15, 40, 80, 0.2); }
}

/* Title block — bottom area */
.intro-titles {
  position: absolute; bottom:12%; left:0; right:0;
  z-index: 2;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s ease-out, transform 1s ease-out;
}

.intro-titles--entered {
  opacity: 1;
  transform: translateY(0);
}

.intro-main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.intro-year {
  font-size: 72px;
  font-weight: 900;
  letter-spacing: 12px;
  color: #E8A040;
  text-shadow: 0 0 40px rgba(232, 160, 64, 0.4), 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1;
}

.intro-fifa {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 8px;
  color: #E8ECF1;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.intro-subtitle {
  font-size: 14px;
  color: rgba(180, 170, 150, 0.7);
  letter-spacing: 4px;
  margin-top: 12px;
  font-weight: 500;
}

/* Hint text */
.intro-hint {
  position: absolute; bottom:3%; left:0; right:0;
  z-index: 2;
  pointer-events: none;
  text-align:center;
}

.intro-hint-text {
  font-size: 14px;
  color: rgba(180, 170, 150, 0.6);
  letter-spacing: 2px;
  animation: pulseHint 2s ease-in-out infinite;
}

@keyframes pulseHint {
  0%, 100% { opacity: 0.4; transform: translateY(0); }
  50%      { opacity: 1.0; transform: translateY(-4px); }
}

/* Dismiss transition */
.intro-dismiss-leave-active {
  transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.intro-dismiss-leave-to {
  opacity: 0;
}

.intro-dismiss-leave-active .intro-globe-wrap {
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.intro-dismiss-leave-to .intro-globe-wrap {
  transform: scale(0.8);
}

/* ===== CSS 烟花（大号射线扩散） ===== */
.intro-fireworks { position:absolute; inset:0; pointer-events:none; z-index:1; }
.firework { position:absolute; width:10px; height:10px; border-radius:50%; }
.firework i { position:absolute; inset:0; border-radius:50%; }
.fwk-1 { top:10%; left:16%; }
.fwk-1,.fwk-1 i { background:#FF4060; box-shadow:
  35px 15px 0 #FF6040, -30px -20px 0 #FF3060, 20px -35px 0 #FF5070,
  -38px 12px 0 #FF2050, -15px 38px 0 #FF4070, 40px -12px 0 #FF6080,
  10px 45px 0 #FF3050, -42px -8px 0 #FF5060; animation:fwBoom 2.5s ease-out 0s infinite; }
.fwk-2 { top:6%; right:18%; }
.fwk-2,.fwk-2 i { background:#FFB830; box-shadow:
  32px -18px 0 #FFC040, -34px 15px 0 #FFA020, -18px -38px 0 #FFD050,
  38px 10px 0 #FFB830, 14px 40px 0 #FFC850, -40px -10px 0 #FFA840,
  -12px -44px 0 #FFC060, 42px -8px 0 #FFB020; animation:fwBoom 2.8s ease-out 0.6s infinite; }
.fwk-3 { top:22%; left:6%; }
.fwk-3,.fwk-3 i { background:#40D080; box-shadow:
  38px -14px 0 #30E090, -30px 18px 0 #50C070, 15px 38px 0 #40E080,
  -40px -10px 0 #30C060, -14px -40px 0 #50D090, 34px 26px 0 #40C870,
  42px 8px 0 #30D070, -28px -34px 0 #50E0A0; animation:fwBoom 3s ease-out 1.2s infinite; }
.fwk-4 { top:18%; right:8%; }
.fwk-4,.fwk-4 i { background:#E050D0; box-shadow:
  28px -30px 0 #D040E0, -36px 14px 0 #E060C0, -18px 36px 0 #D050E0,
  34px 18px 0 #E040D0, 18px -36px 0 #D060F0, -34px -14px 0 #E050C0,
  -10px 42px 0 #D040E0, 40px -8px 0 #E060D0; animation:fwBoom 2.6s ease-out 1.8s infinite; }
.fwk-5 { bottom:20%; left:12%; }
.fwk-5,.fwk-5 i { background:#4098FF; box-shadow:
  30px 18px 0 #50A8FF, -34px -14px 0 #3088FF, 14px -34px 0 #60B0FF,
  -36px 14px 0 #4090F0, -14px 36px 0 #50A0FF, 40px -10px 0 #3088F0,
  10px 42px 0 #60A8FF, -42px -8px 0 #4098E0; animation:fwBoom 2.9s ease-out 0.3s infinite; }
.fwk-6 { bottom:15%; right:15%; }
.fwk-6,.fwk-6 i { background:#FFD040; box-shadow:
  28px 28px 0 #FFE050, -28px -28px 0 #FFC030, 36px -16px 0 #FFE060,
  -36px 18px 0 #FFD040, 18px -40px 0 #FFC850, -18px 40px 0 #FFE070,
  44px 10px 0 #FFD830, -44px -10px 0 #FFC040; animation:fwBoom 2.7s ease-out 2.2s infinite; }

@keyframes fwBoom {
  0%   { transform:scale(0); opacity:0; }
  10%  { transform:scale(0.4); opacity:1; }
  40%  { transform:scale(1.5); opacity:0.7; }
  70%  { transform:scale(2.2); opacity:0.2; }
  100% { transform:scale(3); opacity:0; }
}

/* ===== Intro 漂浮足球 ===== */
.intro-footballs { position:absolute; inset:0; pointer-events:none; z-index:1; }
.intro-fb { position:absolute; font-size:28px; opacity:0.5;
  animation: fbFloat 6s ease-in-out infinite; }
.fb-1 { top:15%; left:10%; animation-delay:0s; font-size:32px; }
.fb-2 { top:25%; right:12%; animation-delay:1.5s; font-size:22px; }
.fb-3 { bottom:30%; left:8%; animation-delay:3s; font-size:26px; }
.fb-4 { bottom:20%; right:15%; animation-delay:4.5s; font-size:20px; }
.fb-5 { top:60%; right:8%; animation-delay:2s; font-size:24px; }

@keyframes fbFloat {
  0%,100% { transform:translateY(0) rotate(0deg); opacity:0.4; }
  25%     { transform:translateY(-25px) rotate(90deg); opacity:0.6; }
  50%     { transform:translateY(-10px) rotate(180deg); opacity:0.45; }
  75%     { transform:translateY(-30px) rotate(270deg); opacity:0.55; }
}

/* ===== Intro 球员踢球（地球下方、标题上方） ===== */
.intro-player { position:absolute; top:55%; left:50%; transform:translateX(-50%); pointer-events:none; z-index:2; display:flex; align-items:flex-end; gap:6px; }
.intro-player-icon { font-size:72px; animation: playerRun 0.5s ease-in-out infinite alternate; }
.intro-player-ball { font-size:32px; animation: ballKick 0.5s ease-in-out infinite alternate; }

@keyframes playerRun {
  0%   { transform:translateY(0) rotate(-5deg); }
  100% { transform:translateY(-6px) rotate(5deg); }
}
@keyframes ballKick {
  0%   { transform:translateX(0) translateY(0); }
  100% { transform:translateX(20px) translateY(-15px); }
}

/* Responsive */
@media (max-width: 768px) {
  .intro-year { font-size: 48px; letter-spacing: 8px; }
  .intro-fifa { font-size: 20px; letter-spacing: 4px; }
  .intro-subtitle { font-size: 12px; letter-spacing: 2px; }
  .intro-titles { bottom:10%; }
  .intro-globe-wrap { padding: 5% 8% 35%; }
  .intro-hint-text { font-size: 12px; }
  .intro-player-icon { font-size:48px; }
  .intro-player-ball { font-size:22px; }
  .intro-player { top:52%; }
  .ceb-circle { width:60px; height:60px; }
  .ceb-icon { font-size:26px; }
}
@media (max-width: 500px) {
  .intro-year { font-size: 36px; letter-spacing: 6px; }
  .intro-fifa { font-size: 16px; letter-spacing: 2px; }
  .intro-subtitle { font-size: 11px; }
  .intro-titles { bottom:8%; }
  .intro-globe-wrap { padding: 5% 5% 40%; }
  .intro-player-icon { font-size:38px; }
  .intro-player-ball { font-size:18px; }
  .intro-player { top:48%; }
}
</style>
