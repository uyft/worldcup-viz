<template>
  <div class="chart-card card anim-fadeInUp" :class="`delay-${delay}`">
    <div class="chart-header">
      <div class="chart-titles">
        <h3 class="chart-title">{{ title }}</h3>
        <p v-if="subtitle" class="chart-subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="extra" class="chart-extra">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>
    <div class="chart-body" :style="{ height: height + 'px' }">
      <v-chart class="chart-el" :option="mergedOption" autoresize />
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart, ScatterChart, HeatmapChart, SankeyChart, EffectScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, GeoComponent, RadarComponent, VisualMapComponent, MarkLineComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'

use([CanvasRenderer, BarChart, LineChart, PieChart, RadarChart, ScatterChart, HeatmapChart, SankeyChart, EffectScatterChart,
     GridComponent, TooltipComponent, LegendComponent, TitleComponent, GeoComponent, RadarComponent, VisualMapComponent, MarkLineComponent])

const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  extra: { type: String, default: '' },
  height: { type: Number, default: 360 },
  option: { type: Object, default: () => ({}) },
  delay: { type: Number, default: 1 },
})

const mergedOption = computed(() => ({
  textStyle: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif' },
  tooltip: {
    backgroundColor: 'rgba(20,27,45,0.95)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: { color: '#E8ECF1' },
    padding: [10, 14],
    extraCssText: 'border-radius: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);',
  },
  ...props.option,
}))
</script>

<style scoped>
.chart-card {
  margin-bottom: 20px;
}
.chart-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 20px 24px 0;
  margin-bottom: 8px;
}
.chart-title {
  font-size: 17px; font-weight: 700;
  color: #E8ECF1;
}
.chart-subtitle {
  font-size: 12px; color: #5A6478;
  margin-top: 2px;
}
.chart-extra {
  font-size: 12px; color: #FBBF24; font-weight: 600;
}
.chart-body {
  padding: 0 8px 8px;
}
.chart-el {
  width: 100%; height: 100%;
}
</style>
