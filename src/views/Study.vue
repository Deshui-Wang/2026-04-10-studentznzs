<script setup>
import { ref, inject, computed, watch } from 'vue'
import { ChatLineRound, InfoFilled, Connection, PieChart, Reading, EditPen, TrendCharts, DataAnalysis } from '@element-plus/icons-vue'

const triggerGlobalChat = inject('triggerGlobalChat')
const activeView = ref('att') // 'att', 'hw', 'quiz', 'exam', 'diagnosis'

// 学科配置数据
const subjects = ref([
  {
    id: 'math',
    name: '高等数学(下)',
    currentContext: '第四章：定积分的应用',
    progress: 72,
    wrongTopic: '定积分应用 (频次: 4)',
    stats: [
      { id: 'att', name: '日常考勤', score: 98, status: 'excellent' },
      { id: 'hw', name: '课后作业', score: 82, status: 'warning' },
      { id: 'quiz', name: '随堂测试', score: 75, status: 'danger' },
      { id: 'exam', name: '阶段性测验', score: 88, status: 'success' }
    ],
    knowledgePoints: [
      { 
        id: 'k1', 
        title: '定积分计算及其应用', 
        icon: 'Reading',
        tag: '核心考点',
        difficulty: '⭐⭐⭐⭐',
        mastery: 85,
        analysis: '定积分是高等数学的核心概念，是求和的极限。它在几何上表示曲边梯形的面积，在物理上代表变力做功。',
        formula: '∫[a,b] f(x)dx = F(b) - F(a)',
        keyPoints: ['牛顿-莱布尼茨公式', '定积分的线性性质', '区间可加性'],
        commonErrors: [
          { type: '上下限颠倒', desc: '在应用换元法时，忘记同步更新积分上下限。' },
          { type: '奇偶性误用', desc: '在非对称区间上错误使用对称性简化公式。' }
        ],
        examples: [
          { title: '例题 1：求 y=x^2 与 y=x 围成的面积', logic: '交点为(0,0)和(1,1)，积分区间[0,1]，被积函数为 x-x^2' }
        ],
        aiSuggestions: '你目前的计算速度较快但细节易错，建议针对“定积分分部积分法”中的符号变换进行 10 组基础训练。'
      },
      { 
        id: 'k2', 
        title: '换元积分法 - 专项', 
        icon: 'EditPen',
        tag: '计算难点',
        difficulty: '⭐⭐⭐⭐⭐',
        mastery: 45,
        analysis: '换元法旨在将复杂的被积函数简化为基本积分形式。',
        formula: '∫ f[φ(t)]φ\'(t)dt = ∫ f(u)du',
        keyPoints: ['凑微分灵敏度', '三角代换公式(sin/sec/tan)', '单调性要求'],
        commonErrors: [
          { type: '回代缺失', desc: '最后结果忘记回代为原变量 x。' },
          { type: '微分项缺失', desc: '换元时只改了变量，忘记计算 dx = φ\'(t)dt。' }
        ],
        examples: [
          { title: '例题：计算 ∫ 1/(a^2+x^2) dx', logic: '令 x = a*tan(t)，利用 1+tan^2(t)=sec^2(t) 简化' }
        ],
        aiSuggestions: '这是你目前最薄弱的环，建议开启“AI 辅助渐进模式”。'
      }
    ]
  },
  {
    id: 'english',
    name: '大学英语(四)',
    currentContext: 'Unit 5: Cultural Diversity',
    progress: 45,
    wrongTopic: '虚拟语气 (错误率: 35%)',
    stats: [
      { id: 'att', name: '日常考勤', score: 100, status: 'excellent' },
      { id: 'hw', name: '课后作业', score: 92, status: 'excellent' },
      { id: 'quiz', name: '随堂测试', score: 68, status: 'warning' },
      { id: 'exam', name: '阶段性测验', score: 85, status: 'success' }
    ],
    knowledgePoints: [
      { 
        id: 'e1', 
        title: '虚拟语气深度解析', 
        icon: 'Reading',
        tag: '语法重难点',
        difficulty: '⭐⭐⭐⭐',
        mastery: 60,
        analysis: '虚拟语气用于表示说话人的愿望、假设或建议，而非事实。',
        formula: 'If + subject + had done, subject + would have done',
        keyPoints: ['非真实条件句的语气', 'wish引导的宾语从句', 'should省略的情景'],
        commonErrors: [
          { type: '时态错配', desc: '分不清是对现在、过去还是将来的虚拟。' },
          { type: '助动词混淆', desc: 'should, would, could, might的使用场景。' }
        ],
        examples: [
          { title: 'If I were you, I would take the advice.', logic: '与现在事实相反的虚拟。' }
        ],
        aiSuggestions: '你的语感尚可，但规则记忆模糊，建议进行 20 组条件句专项改错。'
      }
    ]
  }
])

const currentSubjectId = ref('math')
const currentSubject = computed(() => subjects.value.find(s => s.id === currentSubjectId.value))

const activeTopic = ref(currentSubject.value.knowledgePoints[0])

// 监听学科切换，重置部分状态
watch(currentSubjectId, () => {
  activeTopic.value = currentSubject.value.knowledgePoints[0]
  activeView.value = 'att'
})

// 学情诊断数据 (用于日常考勤和默认状态)
const diagnosisContent = ref({
  title: '阶段性学情深度画像',
  description: '基于本月考勤与课堂表现，你的学习状态评级为“活跃”。但在当前章节的知识吸收率略有下滑。',
  points: [
    '课堂出勤率：100% (全勤)',
    '互动频率：高 (主动提问 4 次)',
    '专注度评分：85 (基于平台在线时长分析)'
  ],
  suggestions: '保持现有的学习规律，建议在本周内针对薄弱项预习 15 分钟。'
})

// 课后作业数据同步（此处简化，实际可根据学科动态计算）
const homeworkList = ref([
  { id: 1, title: '课程练习 4.1：核心概念计算', status: '已完成', result: 'correct', score: 'max', analysis: '公式应用准确。' },
  { id: 2, title: '核心考点拔高演练', status: '已完成', result: 'wrong', score: 'low', analysis: '错误原因：计算细节疏忽。' }
])

// 随堂测试数据 (Mock)
const quizList = ref([
  { id: 'q1', title: '随堂测：基础概念', status: '已完成', result: 'correct', score: '5/5', analysis: '掌握良好。' },
  { id: 'q2', title: '随堂测：进阶应用', status: '已完成', result: 'wrong', score: '1/5', analysis: '理解偏差。' }
])

// 阶段性测验数据 (Mock)
const examContent = ref({
  title: '期中模拟测验',
  score: '88/100',
  description: '本次测验你在基础题型上表现稳定，但在复杂应用题中丢分较多。',
  points: [
    '基础题目分：50/50',
    '中档题目分：30/35',
    '挑战题目分：8/15'
  ],
  suggestions: '建议增加综合解题思维训练。',
  questions: [
    { id: 'e1', title: '基础选择题', result: 'correct', score: '5/5', analysis: '概念清晰。' },
    { id: 'e3', title: '深度应用计算', result: 'wrong', score: '5/15', analysis: '计算步骤缺失。' }
  ]
})

const handleAiAsk = (context) => {
  if (triggerGlobalChat) {
    triggerGlobalChat(`在【${currentSubject.value.name}】课程中，关于“${context}”，我需要针对性的讲解和练习建议。`)
  }
}

const switchView = (type) => {
  activeView.value = type
}

const selectTopic = (topic) => {
  activeTopic.value = topic
  activeView.value = 'diagnosis'
}
</script>

<template>
  <div class="study-container">
    <div class="header-section">
      <h1 class="text-gradient">学业辅助大脑 (Study Copilot)</h1>
      <p class="subtitle">深度打通学习平台数据，实现全链路学情感知与精准补强</p>
    </div>

    <div class="grid-layout">
      <!-- 左侧：目录与摘要区 -->
      <div class="left-panel">
        <!-- 学科快速切换 -->
        <el-card class="glass-card subject-card">
          <div class="subject-row">
            <span class="subject-label">当前关注学科:</span>
            <el-select v-model="currentSubjectId" placeholder="选择科目" size="default" class="subject-selector">
              <el-option
                v-for="sub in subjects"
                :key="sub.id"
                :label="sub.name"
                :value="sub.id"
              />
            </el-select>
          </div>
        </el-card>

        <!-- 上下文感知 -->
        <el-card class="glass-card context-card mt-4">
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>实时学习上下文感知 ({{ currentSubject.name }})</span>
            </div>
          </template>
          <div class="context-body">
            <div class="status-item">
              <span class="label">当前锚点:</span>
              <el-tag type="primary" effect="light" round>{{ currentSubject.currentContext }}</el-tag>
            </div>
            <div class="status-item">
              <span class="label">本周错题聚集:</span>
              <el-tag type="danger" effect="light" round>{{ currentSubject.wrongTopic }}</el-tag>
            </div>
            <div class="status-item mt-2">
              <div class="progress-info">
                <span class="label">课程学习进度:</span>
                <span class="progress-val">{{ currentSubject.progress }}%</span>
              </div>
              <el-progress :percentage="currentSubject.progress" :stroke-width="10" status="success" />
            </div>
          </div>
        </el-card>

        <!-- 学情数据摘要 -->
        <el-card class="glass-card stats-card mt-4">
          <template #header>
            <div class="card-header">
              <el-icon><PieChart /></el-icon>
              <span>学习平台学情摘要</span>
            </div>
          </template>
          <div class="stats-grid">
            <div 
              v-for="item in currentSubject.stats" 
              :key="item.id" 
              class="stat-item" 
              :class="[item.status, { 'active-stat': activeView === item.id }]"
              @click="switchView(item.id)"
            >
              <div class="stat-label">{{ item.name }}</div>
              <div class="stat-value">{{ item.score }}<span class="unit">分</span></div>
              <div class="click-tip">点击查看明细</div>
            </div>
          </div>
        </el-card>

         <!-- 知识图谱/目录 -->
        <el-card class="glass-card graph-card mt-4">
          <template #header>
            <div class="card-header">
              <el-icon><Connection /></el-icon>
              <span>知识体系图谱</span>
            </div>
          </template>
          <div class="knowledge-tree">
            <div 
              v-for="topic in currentSubject.knowledgePoints" 
              :key="topic.id" 
              class="tree-item-complex" 
              :class="{ active: activeView === 'diagnosis' && activeTopic.id === topic.id }" 
              @click="selectTopic(topic)"
            >
              <div class="tree-main">
                <el-icon class="topic-icon"><component :is="{ Reading, EditPen, TrendCharts }[topic.icon]" /></el-icon>
                <div class="topic-info">
                  <span class="topic-title">{{ topic.title }}</span>
                  <div class="topic-meta">
                    <span class="difficulty">难度：{{ topic.difficulty }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧：详情展示区 -->
      <div class="right-panel detail-view glass-card">
        <!-- 诊断/知识点解析视图 -->
        <template v-if="activeView === 'diagnosis' || activeView === 'att'">
          <div class="detail-header">
            <div class="header-main">
              <h2 class="detail-title">{{ activeView === 'att' ? diagnosisContent.title : activeTopic.title }}</h2>
              <div class="header-badges">
                <el-tag :type="activeView === 'att' ? 'info' : 'primary'" effect="dark">
                  {{ activeView === 'att' ? '考勤大数据' : activeTopic.tag }}
                </el-tag>
                <el-tag v-if="activeView !== 'att'" type="warning" effect="plain" class="ml-2">难度: {{ activeTopic.difficulty }}</el-tag>
              </div>
            </div>
            <el-button type="primary" :icon="ChatLineRound" class="ai-ask-btn" @click="handleAiAsk(activeView === 'att' ? diagnosisContent.title : activeTopic.title)">
              {{ activeView === 'att' ? '总结提问 AI' : '深度讲解此知识点' }}
            </el-button>
          </div>

          <div class="detail-body overflow-y-auto">
            <div class="overview-section knowledge-header-box">
              <div class="section-label"><el-icon><DataAnalysis /></el-icon> 
                {{ activeView === 'att' ? '考勤诊断综述' : '核心内涵解析' }}
              </div>
              <p class="summary-text">{{ activeView === 'att' ? diagnosisContent.description : activeTopic.analysis }}</p>
              
              <div v-if="activeView !== 'att'" class="formula-banner mt-4">
                <span class="formula-label">核心公式：</span>
                <code class="formula-text">{{ activeTopic.formula }}</code>
              </div>
            </div>

            <div class="analysis-grid mt-5">
              <div class="analysis-card">
                <h4>{{ activeView === 'att' ? '核心指标分析' : '关键考查维度' }}</h4>
                <ul class="point-list">
                  <li v-for="p in (activeView === 'att' ? diagnosisContent.points : activeTopic.keyPoints)" :key="p">{{ p }}</li>
                </ul>
              </div>
              
              <div class="analysis-card" :class="activeView === 'att' ? 'highlighted' : 'error-card'">
                <h4>{{ activeView === 'att' ? 'AI 智能补强建议' : '避坑指南 (易错点)' }}</h4>
                <div v-if="activeView === 'att'">
                  <p class="suggestion-text">{{ diagnosisContent.suggestions }}</p>
                </div>
                <div v-else class="error-list">
                  <div v-for="err in activeTopic.commonErrors" :key="err.type" class="error-item">
                    <span class="err-type">【{{ err.type }}】</span>
                    <span class="err-desc">{{ err.desc }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 经典例题区 (仅知识点视图显示) -->
            <div v-if="activeView !== 'att'" class="example-section mt-5">
              <div class="section-label"><el-icon><Reading /></el-icon> 经典例题复盘</div>
              <div class="example-card-inner" v-for="ex in activeTopic.examples" :key="ex.title">
                <div class="ex-title">{{ ex.title }}</div>
                <div class="ex-logic">
                  <span class="logic-tag">解题逻辑：</span>{{ ex.logic }}
                </div>
                <el-button link type="primary" size="small" class="mt-2" @click="handleAiAsk(`详细讲解例题：${ex.title}`)">让 AI 逐步拆解该题 >> </el-button>
              </div>
              
              <div class="ai-final-tip mt-5">
                <el-icon><InfoFilled /></el-icon>
                <span>{{ activeTopic.aiSuggestions }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 情况 2：展示课后作业明细 -->
        <template v-else-if="activeView === 'hw'">
          <div class="detail-header">
            <div class="header-main">
              <h2 class="detail-title">近期课后作业明细</h2>
              <el-tag type="warning">近3次作业记录</el-tag>
            </div>
          </div>

          <div class="detail-body">
            <div class="homework-list-wrapper">
              <div v-for="hw in homeworkList" :key="hw.id" class="hw-detail-item" :class="hw.result">
                <div class="hw-main-info">
                  <div class="hw-top">
                    <span class="hw-title">{{ hw.title }}</span>
                    <div class="hw-badges">
                      <el-tag size="small" :type="hw.result === 'correct' ? 'success' : (hw.result === 'wrong' ? 'danger' : 'info')">
                        {{ hw.score }}
                      </el-tag>
                      <el-tag size="small" effect="plain">{{ hw.status }}</el-tag>
                    </div>
                  </div>
                  <p class="hw-analysis">{{ hw.analysis }}</p>
                </div>
                <div class="hw-action">
                  <el-button type="primary" plain size="small" :icon="ChatLineRound" @click="handleAiAsk(hw.title)">针对此题提问 AI</el-button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 情况 3：随堂测试明细 -->
        <template v-else-if="activeView === 'quiz'">
          <div class="detail-header">
            <div class="header-main">
              <h2 class="detail-title">随堂测试表现回顾</h2>
              <el-tag type="danger">本月 3 次随堂测</el-tag>
            </div>
          </div>

          <div class="detail-body">
            <div class="homework-list-wrapper">
              <div v-for="q in quizList" :key="q.id" class="hw-detail-item" :class="q.result">
                <div class="hw-main-info">
                  <div class="hw-top">
                    <span class="hw-title">{{ q.title }}</span>
                    <div class="hw-badges">
                      <el-tag size="small" :type="q.result === 'correct' ? 'success' : 'danger'">
                        {{ q.score }}
                      </el-tag>
                    </div>
                  </div>
                  <p class="hw-analysis">{{ q.analysis }}</p>
                </div>
                <div class="hw-action">
                  <el-button type="primary" plain size="small" :icon="ChatLineRound" @click="handleAiAsk(q.title)">提问此测点</el-button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 情况 4：阶段性测验诊断 -->
        <template v-else-if="activeView === 'exam'">
           <div class="detail-header">
            <div class="header-main">
              <h2 class="detail-title">{{ examContent.title }}</h2>
              <el-tag type="success" effect="dark">得分：{{ examContent.score }}</el-tag>
            </div>
            <el-button type="primary" :icon="ChatLineRound" class="ai-ask-btn" @click="handleAiAsk(examContent.title)">解析整卷 AI</el-button>
          </div>

          <div class="detail-body overflow-y-auto">
            <div class="overview-section">
              <div class="section-label"><el-icon><TrendCharts /></el-icon> 测验综述</div>
              <p class="summary-text">{{ examContent.description }}</p>
            </div>

            <div class="analysis-grid mt-5">
              <div class="analysis-card">
                <h4>分值分布与掌握度</h4>
                <ul class="point-list">
                  <li v-for="p in examContent.points" :key="p">{{ p }}</li>
                </ul>
              </div>
              <div class="analysis-card highlighted">
                <h4>AI 备考建议</h4>
                <p class="suggestion-text">{{ examContent.suggestions }}</p>
              </div>
            </div>

            <!-- 试卷题目明细 -->
            <div class="exam-questions-section mt-5">
              <div class="section-label"><el-icon><EditPen /></el-icon> 试卷题目明细</div>
              <div class="homework-list-wrapper">
                <div v-for="eq in examContent.questions" :key="eq.id" class="hw-detail-item" :class="eq.result">
                  <div class="hw-main-info">
                    <div class="hw-top">
                      <span class="hw-title">{{ eq.title }}</span>
                      <div class="hw-badges">
                        <el-tag size="small" :type="eq.result === 'correct' ? 'success' : 'danger'">
                          得分：{{ eq.score }}
                        </el-tag>
                      </div>
                    </div>
                    <p class="hw-analysis">{{ eq.analysis }}</p>
                  </div>
                  <div class="hw-action">
                    <el-button 
                      type="primary" 
                      plain 
                      size="small" 
                      :icon="ChatLineRound"
                      @click="handleAiAsk(`月考错题分析：${eq.title}`)"
                    >
                      申请 AI 详解
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.study-container {
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

.grid-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  flex: 1;
  min-height: 0;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Adjusted gap since we use mt-4 */
}

.subject-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.subject-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.subject-selector {
  flex: 1;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.progress-val {
  font-size: 14px;
  font-weight: bold;
  color: #10b981;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.context-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item .label {
  font-size: 13px;
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.stat-item:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.stat-item.active-stat {
  background: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
}

.stat-item.active-stat.excellent { border-left-color: #10b981; }
.stat-item.active-stat.warning { border-left-color: #f59e0b; }
.stat-item.active-stat.danger { border-left-color: #ef4444; }
.stat-item.active-stat.success { border-left-color: #3b82f6; }

.click-tip {
  font-size: 10px;
  color: var(--primary-color);
  margin-top: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-value .unit {
  font-size: 12px;
  font-weight: normal;
  margin-left: 2px;
}

.knowledge-tree {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tree-item-complex {
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.tree-item-complex:hover {
  background: white;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #e2e8f0;
}

.tree-item-complex.active {
  background: white;
  border-color: var(--primary-color);
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.1);
}

.tree-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.topic-icon {
  font-size: 20px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.tree-item-complex.active .topic-icon {
  color: var(--primary-color);
}

.topic-info {
  flex: 1;
}

.topic-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 6px;
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.difficulty {
  font-size: 10px;
  color: #f59e0b;
  white-space: nowrap;
}

.mini-progress {
  flex: 1;
}

/* Detail View Styles */
.detail-view {
  background: white !important;
  display: flex;
  flex-direction: column;
  padding: 32px;
  overflow: hidden; /* Important for internal scroll */
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-title {
  font-size: 24px;
  margin-bottom: 8px;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.detail-body::-webkit-scrollbar {
  width: 6px;
}

.detail-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.overview-section {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.knowledge-header-box {
  border-left: 4px solid var(--primary-color);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 12px;
  color: var(--primary-color);
}

.summary-text {
  line-height: 1.8;
  color: var(--text-primary);
}

.formula-banner {
  background: #0f172a;
  color: #38bdf8;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Courier New', Courier, monospace;
}

.formula-label {
  font-size: 12px;
  color: #94a3b8;
  margin-right: 8px;
}

.formula-text {
  font-size: 15px;
  font-weight: bold;
}

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.analysis-card {
  padding: 24px;
  border-radius: 16px;
  background: white;
  border: 1px solid #f1f5f9;
}

.analysis-card h4 {
  margin-bottom: 16px;
  font-size: 15px;
}

.analysis-card.highlighted {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-color: #bae6fd;
}

.error-card {
  border-color: #fecaca;
  background: #fffbfa;
}

.error-card h4 {
  color: #dc2626;
}

.point-list {
  padding-left: 18px;
  color: var(--text-secondary);
  font-size: 14px;
}

.point-list li {
  margin-bottom: 8px;
}

.suggestion-text {
  font-size: 14px;
  line-height: 1.6;
  color: #0369a1;
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-item {
  font-size: 13px;
  line-height: 1.5;
}

.err-type {
  color: #dc2626;
  font-weight: bold;
}

.err-desc {
  color: #7f1d1d;
}

.example-card-inner {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 12px;
}

.ex-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.ex-logic {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.logic-tag {
  color: var(--primary-color);
  font-weight: 600;
}

.ai-final-tip {
  background: #f0f9ff;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #bae6fd;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #0369a1;
}

.ai-final-tip i { font-size: 18px; }

/* Homework Detail Styles */
.homework-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hw-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 5px solid #e2e8f0;
}

.hw-detail-item.correct { border-left-color: #10b981; }
.hw-detail-item.wrong { border-left-color: #ef4444; background: #fff1f2; }
.hw-detail-item.pending { border-left-color: #cbd5e1; }

.hw-main-info { flex: 1; }
.hw-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.hw-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--text-primary);
}

.hw-badges { display: flex; gap: 8px; }
.hw-analysis {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.hw-action { margin-left: 20px; }
.mt-5 { margin-top: 32px; }
.ml-2 { margin-left: 8px; }
</style>
