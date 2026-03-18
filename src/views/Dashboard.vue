<script setup>
import { ref } from 'vue'
import { Timer, Location, DataAnalysis, Warning, Monitor, Postcard, SwitchButton } from '@element-plus/icons-vue'
import { inject } from 'vue'

const triggerGlobalChat = inject('triggerGlobalChat')

const handleShortcut = (promptText) => {
  if (triggerGlobalChat) {
    triggerGlobalChat(promptText)
  }
}

// Mock Data
const weather = {
  temp: '22°C',
  desc: '小雨',
  icon: '🌧️'
}

const greetings = ref('🌤️ 早安，张同学。今天有小雨，记得带伞。今天满课，是一场硬仗哦，加油！')

const nextAction = ref({
  type: 'navigation', // 'navigation', 'study', 'service'
  time: '距上课 20 分钟',
  title: '下一节《高等数学》',
  location: '主楼 302',
  desc: '预计步行需 10 分钟',
  actionBtn: '点击查看室内导航',
  icon: Location
})

const timelineTasks = ref([
  { time: '10:00', title: '高等数学', type: 'class', status: 'upcoming' },
  { time: '14:00', title: '文献阅读任务 1/3', type: 'study', status: 'pending' },
  { time: '15:30', title: '导师科研组会', type: 'research', status: 'pending' },
  { time: '19:00', title: '羽毛球社团训练', type: 'activity', status: 'pending' }
])

const shortcuts = [
  { label: '帮我请假', icon: SwitchButton },
  { label: '查今晚空教室', icon: Monitor },
  { label: '找导师报销', icon: Postcard }
]
</script>

<template>
  <div class="proactive-dashboard">
    <!-- 1. 顶部：AI 动态问候与状态感知区 -->
    <div class="briefing-section">
      <div class="greeting-box glass-card">
        <h2 class="greeting-text">{{ greetings }}</h2>
        <div class="weather-tag">
          {{ weather.icon }} {{ weather.desc }} {{ weather.temp }}
        </div>
      </div>
      <div class="alert-bar glass-card">
        <el-icon class="alert-icon"><Warning /></el-icon>
        <span class="alert-text">【科研看板紧急通知】李导师催促：请在下午 14:00 前提交文献综述初稿。</span>
        <el-button type="danger" size="small" plain round>立即前往</el-button>
      </div>
    </div>

    <!-- 核心两列网格 -->
    <div class="main-grid">
      <!-- 左侧：全域日程与经验雷达 -->
      <div class="left-col">
        <!-- 3. 中部左侧：全域日程时间轴 -->
        <el-card class="glass-card timeline-card">
          <template #header>
            <div class="card-header">
              <el-icon><Timer /></el-icon>
              <span>今日全域日程 (Unified Timeline)</span>
            </div>
          </template>
          
          <el-timeline class="custom-timeline">
            <el-timeline-item
              v-for="(task, index) in timelineTasks"
              :key="index"
              :timestamp="task.time"
              :type="task.status === 'upcoming' ? 'primary' : 'info'"
              :hollow="task.status !== 'upcoming'"
            >
              <div class="timeline-content" :class="task.type">
                <div class="t-title">{{ task.title }}</div>
                <div class="t-tag">
                  {{ task.type === 'class' ? '教务课表' : 
                     task.type === 'study' ? '个人学习' : 
                     task.type === 'research' ? '科研项目' : '校园活动' }}
                </div>
              </div>
            </el-timeline-item>
            
            <!-- AI 智能穿插建议 -->
            <el-timeline-item timestamp="16:30 - 17:30" type="warning" hollow>
              <div class="ai-suggestion">
                <span class="sparkle">✨</span> AI 建议：可在此安排 1 小时的 Python 视频学习（来自您的个性化路径）
                <el-button size="small" type="primary" link>一键采纳</el-button>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>

        <!-- 5. 底部：成长与能力沉淀展示 -->
        <el-card class="glass-card feedback-card mt-4">
          <template #header>
            <div class="card-header">
              <el-icon><DataAnalysis /></el-icon>
              <span>成长反馈 (Growth Feedback)</span>
            </div>
          </template>
          <div class="feedback-content">
            <p class="feedback-text">
              📈 本周你的 <b>[团队协作]</b> 标签评分上升了 12%！距离斩获大厂 Offer 的简历又近了一步。
            </p>
            <el-progress :percentage="75" :stroke-width="12" color="var(--primary-color)" class="mt-4" />
          </div>
        </el-card>
      </div>

      <!-- 右侧：Next Action 与高频服务 -->
      <div class="right-col">
        <!-- 2. 核心 C 位：Next Action -->
        <div class="next-action-card glass-card">
          <div class="na-header">
            <span class="na-badge">NOW • {{ nextAction.time }}</span>
          </div>
          <div class="na-content">
            <el-icon class="na-icon"><component :is="nextAction.icon"/></el-icon>
            <h2 class="na-title">{{ nextAction.title }}</h2>
            <p class="na-desc">{{ nextAction.location }} · {{ nextAction.desc }}</p>
            <el-button type="primary" size="large" class="na-btn" @click="$router.push('/navigation')">
              点击前往
            </el-button>
          </div>
        </div>

        <!-- 4. 中部右侧：高频服务“任意门” -->
        <el-card class="glass-card services-card mt-4">
          <template #header>
            <div class="card-header">
              <span>🚀 猜你需要 (Quick Services)</span>
            </div>
          </template>
          
          <div class="smart-services">
            <div class="service-item">
              <div class="s-info">
                <div class="s-title">一卡通当前余额</div>
                <div class="s-val">¥ 24.50</div>
              </div>
              <el-button size="small" type="primary" plain>一键充值</el-button>
            </div>
            <div class="service-item warning-item">
              <div class="s-info">
                <div class="s-title">即将逾期图书</div>
                <div class="s-val">《深入理解计算机系统》</div>
              </div>
              <el-button size="small" type="danger" plain>一键续借</el-button>
            </div>
          </div>

          <div class="shortcuts-area">
            <div class="sc-title">常用 AI 指令</div>
            <div class="sc-grid">
              <el-button 
                v-for="(sc, i) in shortcuts" 
                :key="i"
                class="shortcut-btn"
                @click="handleShortcut(sc.label)"
              >
                <el-icon><component :is="sc.icon" /></el-icon>
                {{ sc.label }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.proactive-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

/* 顶部问候区 */
.briefing-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.greeting-box {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, rgba(255,255,255,0.95), rgba(240,253,250,0.9));
}

.greeting-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.weather-tag {
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
}

.alert-bar {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fffafa;
}

.alert-icon {
  color: #ef4444;
  font-size: 18px;
}

.alert-text {
  flex: 1;
  font-size: 14px;
  color: #7f1d1d;
  font-weight: 500;
}

/* 主网格 */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  flex: 1;
}

.left-col, .right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary);
}

/* 时间轴区域 */
.timeline-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: max-content;
}

:deep(.timeline-card .el-card__body) {
  overflow-y: auto;
  padding-bottom: 0;
}

.custom-timeline {
  padding: 10px 0 20px 0;
}

.timeline-content {
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-content.class { border-left: 3px solid #3b82f6; }
.timeline-content.study { border-left: 3px solid #10b981; }
.timeline-content.research { border-left: 3px solid #8b5cf6; }
.timeline-content.activity { border-left: 3px solid #f59e0b; }

.t-title {
  font-weight: 600;
  font-size: 14px;
}

.t-tag {
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(0,0,0,0.05);
  padding: 2px 8px;
  border-radius: 10px;
}

.ai-suggestion {
  padding: 16px;
  border: 1px dashed #0ea5e9;
  border-radius: 8px;
  background: rgba(14, 165, 233, 0.05);
  font-size: 13px;
  color: #0c4a6e;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 成长反馈区 */
.feedback-card {
  min-height: 140px;
  flex-shrink: 0;
}
.feedback-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Next Action 核心 C 位 */
.next-action-card {
  padding: 32px;
  background: var(--gradient-main);
  color: white;
  border-radius: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.na-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
}

.na-icon {
  font-size: 48px;
  margin: 24px 0 16px;
}

.na-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
  color: white;
}

.na-desc {
  opacity: 0.9;
  font-size: 15px;
  margin-bottom: 24px;
}

.na-btn {
  background: white !important;
  color: var(--primary-color) !important;
  border: none;
  font-weight: 700;
  padding: 12px 32px;
  border-radius: 12px;
  width: 100%;
}

/* 高频服务区 */
.smart-services {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
}

.s-title {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.s-val {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.warning-item {
  background: #fffafa;
  border-color: #fca5a5;
}

.warning-item .s-val { color: #ef4444; }

.shortcuts-area {
  margin-top: 24px;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.sc-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.sc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.shortcut-btn {
  justify-content: center;
  gap: 6px;
  border-radius: 10px;
  color: var(--text-primary);
}

.shortcut-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
