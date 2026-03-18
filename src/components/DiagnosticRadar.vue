<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

const props = defineProps({
  height: {
    type: String,
    default: '400px'
  },
  data: {
    type: Object,
    required: true
  }
})

const initChart = () => {
  if (!chartRef.value) return
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#1e293b' },
      padding: [12, 16],
      extraCssText: 'box-shadow: 0 10px 20px rgba(0,0,0,0.1); border-radius: 12px;'
    },
    legend: {
      data: ['当前能力', '目标要求'],
      bottom: 20,
      itemGap: 30,
      textStyle: { color: '#64748b', fontSize: 13, fontWeight: 500 },
      icon: 'circle'
    },
    radar: {
      indicator: props.data.indicators,
      axisName: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: 'rgba(241, 245, 249, 0.5)',
        borderRadius: 4,
        padding: [4, 8]
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(148, 163, 184, 0.05)',
            'rgba(148, 163, 184, 0.08)',
            'rgba(148, 163, 184, 0.1)',
            'rgba(148, 163, 184, 0.15)',
            'rgba(148, 163, 184, 0.2)'
          ].reverse()
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.01)', 'rgba(241, 245, 249, 0.02)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.2)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        symbol: 'none',
        data: [
          {
            value: props.data.current,
            name: '当前能力',
            itemStyle: { color: '#4f46e5' },
            lineStyle: { width: 3, shadowBlur: 10, shadowColor: 'rgba(79, 70, 229, 0.3)' },
            areaStyle: { 
              color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [
                { offset: 0, color: 'rgba(79, 70, 229, 0.4)' },
                { offset: 1, color: 'rgba(79, 70, 229, 0.1)' }
              ])
            }
          },
          {
            value: props.data.target,
            name: '目标要求',
            itemStyle: { color: '#06b6d4' },
            lineStyle: { type: 'dashed', width: 2, opacity: 0.8 },
            areaStyle: { color: 'transparent' }
          }
        ]
      }
    ]
  }
  chart.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart && chart.resize())
})

// 监听数据变化，重新渲染图表
watch(() => props.data, () => {
  initChart()
}, { deep: true })

</script>

<template>
  <div class="radar-box">
    <div ref="chartRef" :style="{ height: height, width: '100%' }"></div>
  </div>
</template>

<style scoped>
.radar-box {
  width: 100%;
  position: relative;
}
</style>
