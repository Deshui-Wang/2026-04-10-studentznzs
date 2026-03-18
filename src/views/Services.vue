<script setup>
import { ref, inject } from 'vue'
import { Document, SuccessFilled, Warning } from '@element-plus/icons-vue'

const triggerGlobalChat = inject('triggerGlobalChat')

const processes = ref([
  {
    id: 'PR-20231024',
    title: '高数课请假单',
    status: '审批中',
    progress: 50,
    steps: [
      { name: 'AI 意图解析', complete: true },
      { name: '教务系统 API 调用', complete: true },
      { name: '辅导员审批', complete: false },
      { name: '挂起相关学习任务', complete: false }
    ]
  }
])

const history = ref([
  { id: 'H-001', title: '校园一卡通充值', date: '2026-03-10', status: '已完成' },
  { id: 'H-002', title: '羽毛球场馆预订', date: '2026-03-08', status: '已关闭' },
  { id: 'H-003', title: '图书馆借书《三三》', date: '2026-03-05', status: '已完成' },
  { id: 'H-004', title: '勤工助学岗位申请', date: '2026-03-01', status: '已完成' },
  { id: 'H-005', title: '校医院挂号预约', date: '2026-02-25', status: '已完成' },
  { id: 'H-006', title: '四六级成绩单补办', date: '2026-02-20', status: '已关闭' },
  { id: 'H-007', title: '学生公寓报修记录', date: '2026-02-15', status: '已完成' },
  { id: 'H-008', title: '讲座时长学分认证', date: '2026-02-08', status: '已完成' },
  { id: 'H-009', title: '学年综合测评自评', date: '2026-02-01', status: '已完成' },
  { id: 'H-010', title: '校园网套餐变更', date: '2026-01-25', status: '已完成' },
  { id: 'H-011', title: '失物招领意向登记', date: '2026-01-20', status: '已关闭' }
])

const handleTagClick = (tagText) => {
  if (triggerGlobalChat) {
    if (tagText) {
      triggerGlobalChat(tagText)
    } else {
      triggerGlobalChat('')
    }
  }
}

const submitTask = (inputVal) => {
  const currentInput = typeof inputVal === 'string' ? inputVal.trim() : ''
  if (!currentInput) return
  
  const newId = `PR-${new Date().getTime().toString().slice(-8)}`
  const newTask = {
    id: newId,
    title: currentInput.length > 20 ? currentInput.substring(0, 20) + '...' : currentInput,
    status: '解析并执行中',
    progress: 25,
    steps: [
      { name: 'AI 意图解析成功', complete: true },
      { name: '跨系统 API 调度匹配', complete: false },
      { name: '表单草稿生成', complete: false },
      { name: '等待二次确认', complete: false }
    ]
  }
  
  processes.value.unshift(newTask)
  
  setTimeout(() => {
    const targetProc = processes.value.find(p => p.id === newId)
    if (targetProc) {
      targetProc.progress = 50
      targetProc.steps[1].complete = true
      targetProc.status = '自动化处理中'
    }
  }, 1000)
}

// 暴露出全局方法，方便 AI 对话框模拟调用
window.__SERVICES_SUBMIT__ = submitTask
</script>

<template>
  <div class="services-container">
    <div class="header-section">
      <h1 class="text-gradient">意图驱动服务引擎 (Services)</h1>
      <p class="subtitle">告别繁琐表单，一句话办理复杂业务，自动解析《学生手册》等海量政策</p>
    </div>

    <div class="main-content">
      <div class="service-board">
        <!-- 快速发起引导 -->
        <div class="suggest-tags">
          <span class="suggest-label">一句话办事，快速发起:</span>
          <div class="tags-wrapper">
            <span class="magic-tag" @click="handleTagClick('校园一卡通充值')">一卡通充值</span>
            <span class="magic-tag" @click="handleTagClick('成绩查询')">成绩查询</span>
            <span class="magic-tag" @click="handleTagClick('实验室预约')">实验室预约</span>
            <span class="magic-tag" @click="handleTagClick('讲座预约')">讲座预约</span>
            <span class="magic-tag" @click="handleTagClick('开具在读证明')">在读证明</span>
            <span class="magic-tag" @click="handleTagClick('预定羽毛球场地')">预定场地</span>
            <span class="magic-tag" @click="handleTagClick('图书馆借书')">图书馆借阅</span>
            <span class="magic-tag" @click="handleTagClick('综合奖学金申报')">奖学金申报</span>
          </div>
        </div>

        <!-- 正在执行的任务 -->
        <div class="process-tracker">
          <div class="section-header">
            <h3 class="section-title">正在执行</h3>
            <span class="count-badge">{{ processes.length }}</span>
          </div>
          <div class="process-cards">
            <el-card 
              v-for="proc in processes" 
              :key="proc.id"
              class="glass-card process-card"
            >
              <div class="proc-header">
                <div class="proc-title">
                  <el-icon><Document /></el-icon>
                  {{ proc.title }}
                </div>
                <el-tag size="small" type="primary" effect="plain" round>{{ proc.status }}</el-tag>
              </div>
              
              <el-progress 
                :percentage="proc.progress" 
                :show-text="false" 
                color="var(--primary-color)"
                class="mt-4 mb-4"
              />
              
              <div class="steps-wrapper">
                <div 
                  v-for="(step, idx) in proc.steps" 
                  :key="idx"
                  class="step-item"
                  :class="{ 'is-active': step.complete }"
                >
                  <el-icon v-if="step.complete"><SuccessFilled /></el-icon>
                  <div v-else class="step-dot"></div>
                  <span class="step-name">{{ step.name }}</span>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="history-section mt-5">
          <div class="section-header">
            <h3 class="section-title">历史记录</h3>
          </div>
          <div class="history-list glass-card">
            <div v-for="item in history" :key="item.id" class="history-item">
              <div class="h-info">
                <span class="h-date">{{ item.date }}</span>
                <span class="h-title">{{ item.title }}</span>
              </div>
              <div class="h-status">
                <el-tag size="small" :type="item.status === '已完成' ? 'success' : 'info'" effect="light">
                  {{ item.status }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.services-container {
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

.main-content {
  flex: 1;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--glass-border);
}

.service-board {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
}

.suggest-tags {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  border: 1px dashed #0ea5e9;
}

.suggest-label {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  font-weight: 500;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.magic-tag {
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid #0ea5e9;
  color: #0ea5e9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  user-select: none;
}

.magic-tag:hover {
  background: var(--gradient-main);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.magic-tag:active {
  transform: translateY(0);
}

.section-title {
  font-size: 16px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.count-badge {
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.process-tracker {
  margin-top: 32px;
}

.process-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.proc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 0px 10px 0px;
}

.proc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
}

.steps-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.step-item.is-active {
  color: var(--text-primary);
  font-weight: 500;
}

.step-item.is-active .el-icon {
  color: var(--success-color);
  font-size: 16px;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  margin-left: 2px;
}

/* 历史记录样式 */
.history-section {
  margin-top: 40px;
}

.history-list {
  background: white;
  padding: 8px 0;
  border-radius: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:hover {
  background: #f8fafc;
}

.h-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.h-date {
  font-size: 13px;
  color: var(--text-secondary);
  font-family: monospace;
  width: 100px;
}

.h-title {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.mt-5 { margin-top: 40px; }
</style>
