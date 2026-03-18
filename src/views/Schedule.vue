<script setup>
import { ref } from 'vue'
import { Calendar, Timer, WarnTriangleFilled } from '@element-plus/icons-vue'

const timelineTasks = ref({
  '今天': [
    {
      time: '08:00 - 09:35',
      title: '高等数学 (教务处固定课表)',
      type: 'fixed',
      location: '主楼 302',
      conflict: false,
      source: '教学系统'
    },
    {
      time: '10:00 - 10:45',
      title: '文献阅读任务 1/3 (AI排期)',
      type: 'ai',
      location: '图书馆',
      conflict: false,
      desc: '系统检测此时间段空闲，已自动为你安排《区块链智能合约》前10页阅读',
      source: '个性化学习路径规划系统'
    },
    {
      time: '14:00 - 16:00',
      title: '导师科研组会 vs 选修课考试',
      type: 'conflict',
      location: '多地点',
      conflict: true,
      desc: '科研任务与教务处考试安排冲突！',
      source: '科研项目管理系统'
    }
  ],
  '明天': [
    {
      time: '09:00 - 11:30',
      title: '大学物理实验',
      type: 'fixed',
      location: '实验楼 405',
      conflict: false,
      source: '教学系统'
    },
    {
      time: '15:00 - 16:30',
      title: '算法练习：动态规划 (AI排期)',
      type: 'ai',
      location: '任意自习室',
      conflict: false,
      desc: '根据错题本记录，已自动安排薄弱点突破训练',
      source: '个性化学习路径规划系统'
    }
  ],
  '周四': [
    {
      time: '10:00 - 12:00',
      title: '创新创业项目路演彩排',
      type: 'fixed',
      location: '创新中心路演厅',
      conflict: false,
      source: '科研项目管理系统'
    },
    {
      time: '14:00 - 15:35',
      title: '面向对象程序设计',
      type: 'fixed',
      location: '计科楼 201',
      conflict: false,
      source: '教学系统'
    },
    {
      time: '19:00 - 20:00',
      title: '前沿技术讲座：AIGC应用',
      type: 'ai',
      location: '学术报告厅',
      conflict: false,
      desc: '根据你的兴趣标签推荐的校园公开活动',
      source: '校园活动资讯系统'
    }
  ]
})
</script>

<template>
  <div class="schedule-container">
    <div class="header-section">
      <h1 class="text-gradient">全域动态日程引擎 (Scheduler)</h1>
      <p class="subtitle">自动聚合教务、自导学习与科研任务，AI 智能穿插排期，防冲突预警</p>
    </div>

    <div class="command-bar glass-card">
      <el-input 
        placeholder="用一句话安排任务，例如：“下周四前我要看完这份30页的文献”" 
        size="large"
        class="magic-input"
      >
        <template #append>
          <el-button type="primary">AI 魔法排期</el-button>
        </template>
      </el-input>
    </div>

    <div class="calendar-grid">
      <div class="day-col" v-for="day in ['今天', '明天', '周四']" :key="day">
        <div class="day-header">{{ day }}</div>
        
        <div class="timeline-wrapper" v-if="timelineTasks[day] && timelineTasks[day].length > 0">
          <div 
            v-for="(task, index) in timelineTasks[day]" 
            :key="index"
            class="task-card"
            :class="[task.type, { 'has-conflict': task.conflict }]"
          >
            <div class="task-time">
              <el-icon><Timer /></el-icon> {{ task.time }}
            </div>
            <div class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-meta">
                <el-icon><Calendar /></el-icon> {{ task.location }}
              </div>
              <div class="task-source">
                来自：{{ task.source }}
              </div>
              <div class="task-desc" v-if="task.desc">{{ task.desc }}</div>
              
              <div class="conflict-actions" v-if="task.conflict">
                <el-button size="small" type="danger" plain>建议: 将组会延期</el-button>
                <el-button size="small" type="info" plain>手动处理</el-button>
              </div>
            </div>
            
            <div class="conflict-badge" v-if="task.conflict">
              <el-icon><WarnTriangleFilled /></el-icon>
            </div>
          </div>
        </div>
        
        <div class="timeline-empty" v-else>
          <div class="empty-text">系统正在持续监控空闲时间槽...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-section {
  margin-bottom: 24px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 8px;
}

.command-bar {
  padding: 16px;
  margin-bottom: 24px;
}

.magic-input {
  --el-input-bg-color: transparent;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
}

.day-col {
  background: white;
  border-radius: 16px;
  border: 1px solid var(--glass-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.day-header {
  padding: 16px;
  text-align: center;
  font-weight: 600;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.timeline-wrapper {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.task-card {
  position: relative;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
  background: #f8fafc;
  transition: transform 0.2s;
}

.task-card:hover {
  transform: translateX(4px);
}

.task-card.fixed {
  border-left-color: #94a3b8;
}

.task-card.ai {
  border-left-color: var(--success-color);
  background: #ecfdf5;
}

.task-card.conflict {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.task-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 600;
}

.task-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
}

.task-meta {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-source {
  margin-top: 4px;
  font-size: 11px;
  color: var(--primary-color);
  background: rgba(14, 165, 233, 0.05);
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(14, 165, 233, 0.1);
}

.task-desc {
  margin-top: 10px;
  font-size: 12px;
  color: var(--success-color);
  background: rgba(16, 185, 129, 0.1);
  padding: 8px;
  border-radius: 6px;
}

.task-card.conflict .task-desc {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.conflict-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #ef4444;
  font-size: 20px;
}

.conflict-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.timeline-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 13px;
}
</style>
