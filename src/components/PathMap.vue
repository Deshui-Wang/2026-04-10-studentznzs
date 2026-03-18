<script setup>
import { onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref(null)
let chart = null

const props = defineProps({
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
      confine: true, // 确保 Tooltip 不会超出容器
      padding: 0,
      backgroundColor: 'transparent',
      borderWidth: 0,
      formatter: (params) => {
        if (params.dataType === 'node') {
          const node = params.data
          let tip = `<div style="padding:12px; background:rgba(255,255,255,0.98); border-radius:12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; min-width:200px; backdrop-filter:blur(10px);">`
          tip += `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">`
          tip += `<b style="font-size:15px; color:#1e293b;">${params.name}</b>`
          tip += `<span style="font-size:12px; color:#64748b;">${params.value}%</span>`
          tip += `</div>`
          
          if (node.isBlocked) {
            tip += `<div style="padding:10px; background:#fff1f2; border:1px solid #ffe4e6; border-radius:8px; color:#e11d48; line-height:1.5;">`
            tip += `<div style="font-weight:bold; margin-bottom:4px; font-size:13px;">⚠️ 学习受阻诊断</div>`
            tip += `<div style="font-size:12px;">${node.blockReason}</div>`
            tip += `</div>`
          } else if (node.isSupporter) {
            tip += `<div style="color:#92400e; font-size:12px; font-weight:700; background:#fffbeb; padding:4px 8px; border-radius:4px; display:inline-block;">${node.hint}</div>`
          }
          
          tip += `</div>`
          return tip
        }
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: (value, params) => params.data.isSupporter ? 50 : 65,
        roam: true,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [5, 12],
        data: props.data.nodes.map(node => ({
          ...node,
          itemStyle: {
            color: node.isBlocked
              ? '#ef4444' 
              : (node.isSupporter 
                ? 'rgba(251, 191, 36, 0.8)' 
                : (node.value > 80 ? '#10b981' : (node.value > 0 ? '#6366f1' : '#f1f5f9'))),
            borderColor: node.isBlocked ? '#fecaca' : (node.isSupporter ? '#fbbf24' : (node.value > 0 ? 'rgba(255,255,255,0.4)' : '#e2e8f0')),
            borderWidth: node.isBlocked ? 4 : (node.isSupporter ? 1 : 3),
            borderType: node.isSupporter ? 'dashed' : 'solid',
            shadowColor: node.isBlocked ? 'rgba(239, 68, 68, 0.6)' : 'rgba(0, 0, 0, 0.1)',
            shadowBlur: node.isBlocked ? 25 : 15
          },
          label: {
            show: true,
            position: 'inside', // 名称始终在内部
            color: (node.isBlocked || node.value > 0) ? '#ffffff' : '#64748b',
            fontWeight: 'bold',
            fontSize: 11
          }
        })),
        // 使用 markPoint 来呈现圆圈上方的警示标签
        markPoint: {
          symbol: 'roundRect',
          symbolSize: [60, 22],
          itemStyle: {
            color: '#ef4444',
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          label: {
            show: true,
            formatter: '⚠️ 受阻点',
            color: '#fff',
            fontSize: 10,
            fontWeight: 'bold'
          },
          data: props.data.nodes.filter(n => n.isBlocked).map(n => ({
            name: '受阻警告',
            coord: [n.x, n.y],
            symbolOffset: [0, -45] // 向上偏移，确保在圆圈上方
          }))
        },
        links: props.data.links.map(link => {
          // 如果起点是阻塞节点，连线变红且透明度降低
          const sourceNode = props.data.nodes.find(n => n.name === link.source)
          const isBlockedLink = sourceNode && sourceNode.isBlocked
          return {
            ...link,
            lineStyle: link.lineStyle || {
              color: isBlockedLink ? 'rgba(239, 68, 68, 0.2)' : 'rgba(148, 163, 184, 0.3)',
              width: isBlockedLink ? 1 : 2,
              type: isBlockedLink ? 'dashed' : 'solid',
              curveness: 0.15
            }
          }
        }),
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4,
            color: '#6366f1'
          }
        }
      }
    ]
  }

  chart.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart && chart.resize())
})

watch(() => props.data, () => {
  initChart()
}, { deep: true })
</script>

<template>
  <div class="chart-wrapper">
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
