<template>
  <div class="match-card card" :class="`anim-fadeInUp delay-${delay}`">
    <div class="match-meta">
      <span class="match-group">{{ group }}</span>
      <span class="match-time">{{ time }}</span>
      <span class="match-stage">{{ stage }}</span>
    </div>
    <div class="match-teams">
      <div class="team home">
        <FlagTag :code="home.code" :name="home.name" />
        <span class="team-score" :class="{ win: home.score > away.score, draw: home.score === away.score }">{{ home.score }}</span>
      </div>
      <span class="vs-mark">VS</span>
      <div class="team away">
        <span class="team-score" :class="{ win: away.score > home.score, draw: home.score === away.score }">{{ away.score }}</span>
        <FlagTag :code="away.code" :name="away.name" />
      </div>
    </div>
    <div class="match-venue">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#5A6478" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
      <span>{{ venue }}</span>
    </div>
  </div>
</template>

<script setup>
import FlagTag from './FlagTag.vue'

defineProps({
  group: { type: String, default: '' },
  time: { type: String, default: '' },
  stage: { type: String, default: '' },
  home: { type: Object, default: () => ({}) },
  away: { type: Object, default: () => ({}) },
  venue: { type: String, default: '' },
  delay: { type: Number, default: 1 },
})
</script>

<style scoped>
.match-card {
  padding: 16px 18px;
  transition: all 0.25s ease;
}
.match-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.4);
}
.match-meta {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}
.match-group {
  background: linear-gradient(135deg,#06B6D4,#22D3EE);
  color: #0B0F1A; font-size: 11px; font-weight: 700;
  padding: 3px 10px; border-radius: 6px;
}
.match-time {
  font-size: 12px; color: #8892A6; font-weight: 500;
}
.match-stage {
  margin-left: auto;
  font-size: 11px; color: #5A6478;
  background: rgba(255,255,255,0.04); padding: 2px 8px;
  border-radius: 4px;
}
.match-teams {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.team { display: flex; align-items: center; gap: 10px; }
.team.home { justify-content: flex-start; }
.team.away { justify-content: flex-end; }
.team-score {
  font-size: 22px; font-weight: 800; color: #E8ECF1;
  min-width: 28px; text-align: center;
}
.team-score.win { color: #22D3EE; }
.team-score.draw { color: #5A6478; }
.vs-mark {
  font-size: 11px; font-weight: 700; color: #FBBF24;
  background: rgba(251,191,36,0.1);
  padding: 4px 10px; border-radius: 8px;
}
.match-venue {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: #5A6478;
  padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);
}
</style>
