<script setup>
import { VideoPlay, Edit, Promotion, Lock } from '@element-plus/icons-vue'

const tasks = [
  { 
    id: 1, 
    title: 'Vue 组合式 API 底层原理', 
    duration: '15 min', 
    type: 'video', 
    status: 'learning',
    icon: VideoPlay,
    desc: '深入理解 setup 与响应式原理'
  },
  { 
    id: 2, 
    title: '响应式系统实战练习', 
    duration: '30 min', 
    type: 'exercise', 
    status: 'locked',
    icon: Edit,
    desc: '手动实现一个 Ref 核心逻辑'
  },
  { 
    id: 3, 
    title: '提交练习并自动评测', 
    duration: '5 min', 
    type: 'submit', 
    status: 'locked',
    icon: Promotion,
    desc: '系统将根据单元测试结果自动签发标签'
  }
]
</script>

<template>
  <div class="task-timeline glass-card">
    <div class="card-header">
      <h3>今日任务队列</h3>
      <el-progress :percentage="33" :stroke-width="12" striped striped-flow color="#4f46e5" />
    </div>

    <div class="task-list">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="task-card"
        :class="task.status"
      >
        <div class="task-icon">
          <el-icon><component :is="task.icon" /></el-icon>
        </div>
        <div class="task-info">
          <div class="task-title-row">
            <h4>{{ task.title }}</h4>
            <span class="duration">{{ task.duration }}</span>
          </div>
          <p>{{ task.desc }}</p>
        </div>
        <div class="task-action">
          <el-button 
            v-if="task.status === 'learning'" 
            type="primary" 
            size="small"
            round
          >
            立即学习
          </el-button>
          <el-icon v-else-if="task.status === 'locked'" class="lock-icon">
            <Lock />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-timeline {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-header h3 {
  margin-bottom: 16px;
  color: var(--text-primary);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.task-card.learning {
  border-color: rgba(79, 70, 229, 0.2);
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.05);
}

.task-card.locked {
  opacity: 0.6;
}

.task-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--primary-color);
}

.task-info {
  flex: 1;
}

.task-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.task-title-row h4 {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
}

.duration {
  font-size: 12px;
  color: var(--text-secondary);
}

.task-info p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.lock-icon {
  font-size: 18px;
  color: var(--text-secondary);
}
</style>
