<script setup>
import { ref } from 'vue'
import { Location, Search, Guide } from '@element-plus/icons-vue'

const isRouting = ref(false)
const showRouteResult = ref(false)

const handleAIRouting = () => {
  if (isRouting.value) return
  isRouting.value = true
  
  // mock AI delay
  setTimeout(() => {
    isRouting.value = false
    showRouteResult.value = true
  }, 1200)
}
</script>

<template>
  <div class="navigation-container">
    <div class="header-section">
      <h1 class="text-gradient">场景化智能空间 (Spatial AI)</h1>
      <p class="subtitle">Just In Time 的情景导航，物联网驱动的资源寻路</p>
    </div>

    <div class="grid-layout">
      <!-- 主动提醒区 (Just in Time) -->
      <div class="alert-panel">
        <el-card class="glass-card main-alert">
          <div class="alert-icon">
            <el-icon><Guide /></el-icon>
          </div>
          <div class="alert-content">
            <h3>即将上课：高等数学</h3>
            <p class="location-text">主楼 302</p>
            <div class="time-calc">
              <span>距离上课: <b>15 分钟</b></span>
              <span class="divider">|</span>
              <span>当前步行需: <b class="warning-text">12 分钟</b></span>
            </div>
            <p class="suggestion">建议立即出发。</p>
          </div>
        </el-card>

        <!-- 移除了原本的搜索框，沿途功能上移到了此处 -->

        <div class="route-planner glass-card">
          <div class="planner-header">
            <h4>💡 沿途需求规划</h4>
          </div>
          <div class="planner-content">
            <el-input 
              type="textarea" 
              :rows="3" 
              placeholder="例如：路上可能会碰到王同学聊会儿天，另外我还想买瓶水" 
              resize="none"
              class="planning-input"
            />
            <el-button 
              type="primary" 
              size="large" 
              class="planning-btn w-100 mt-4" 
              :loading="isRouting"
              @click="handleAIRouting"
            >
              {{ isRouting ? '正在推演时空坐标...' : 'AI 沿途智能重排' }}
            </el-button>
            
            <div class="route-mock-result mt-4" v-if="showRouteResult">
              <div class="route-step">
                <span class="dot-start"></span>
                <span class="step-text">现在出发 <small>(预估步行速度: 1.2m/s)</small></span>
              </div>
              <div class="route-step action-step">
                <span class="dot-action"></span>
                <span class="step-text">+ 绕行 100m 经过第一食堂超市买水</span>
              </div>
              <div class="route-step action-step">
                <span class="dot-action"></span>
                <span class="step-text">+ 预留 5 mins 社交缓冲时间</span>
              </div>
              <div class="route-step">
                <span class="dot-end"></span>
                <span class="step-text end-text">预计 09:50 踩点抵达主楼 302</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 物联网雷达区 -->
      <div class="radar-panel glass-card">
        <div class="radar-header">
          <h3><el-icon><Location /></el-icon> 校园资源可用性雷达</h3>
        </div>
        <div class="map-placeholder">
          <!-- 模拟地图和热力点 -->
          <div class="ping library">
            <div class="ring"></div>
            <div class="dot"></div>
            <div class="pin-label dest-label">主楼教学楼</div>
            <div class="info-bubble">
              <b>高等数学 授课教室</b><br>
              <span class="text-success">主楼 302</span><br>
              <span class="text-muted">距离您 400 米</span><br>
              <span class="text-muted" style="color: #6366f1;">🧃 一楼大厅有自助售卖机</span>
            </div>
          </div>
          
          <div class="ping lab">
            <div class="ring"></div>
            <div class="dot" style="background:var(--primary-color)"></div>
            <div class="pin-label me-label">我的位置</div>
            <div class="info-bubble">
              <b>导师位置定位</b><br>
              <span>北校区重点实验室</span><br>
              <span class="text-muted">（基于门禁刷卡数据预测）</span>
            </div>
          </div>

          <!-- 图书馆 -->
          <div class="poi-label" style="top: 25%; right: 35%;">图书馆</div>

          <!-- 第一食堂 (左下角灰色区块) -->
          <div class="poi-label" style="top: 71%; left: 10%;">第一食堂</div>

          <!-- 体育场 (左下角绿色区块) -->
          <div class="poi-label" style="top: 85%; left: 45%;">体育场</div>
          
          <!-- 校园矢量图 SVG 抽象层 -->
          <svg class="campus-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(203, 213, 225, 0.4)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            <!-- 道路 -->
            <path d="M-100 300 Q 200 250, 400 350 T 900 200" fill="none" stroke="#e2e8f0" stroke-width="24" stroke-linecap="round"/>
            <path d="M 300 -100 L 400 350 L 550 700" fill="none" stroke="#e2e8f0" stroke-width="16" stroke-linecap="round"/>
            <path d="M 100 600 Q 250 400, 400 350" fill="none" stroke="#e2e8f0" stroke-width="16" stroke-linecap="round"/>
            
            <!-- 教学楼与场馆 (抽象方块组) -->
            <rect x="200" y="150" width="120" height="80" rx="8" fill="#cbd5e1" opacity="0.6"/>
            <rect x="450" y="100" width="160" height="120" rx="12" fill="#94a3b8" opacity="0.5"/> <!-- 主楼 -->
            <rect x="150" y="400" width="100" height="140" rx="8" fill="#cbd5e1" opacity="0.6"/>
            <rect x="550" y="450" width="180" height="100" rx="8" fill="#cbd5e1" opacity="0.6"/> <!-- 体育馆 -->
            
            <!-- 动态虚拟引导路径 (沿途需求重排后的轨迹) -->
            <path v-if="showRouteResult" d="M 530 355 Q 520 480, 200 480 Q 200 360, 295 185" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8,8" class="animated-route" stroke-linecap="round"/>
            <path v-if="showRouteResult" d="M 530 355 Q 520 480, 200 480 Q 200 360, 295 185" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="8,8" class="animated-route" stroke-linecap="round"/>
            
            <!-- 水系/湖泊区 -->
            <path d="M 650 200 Q 750 150, 850 250 Q 780 350, 680 300 Z" fill="#bae6fd" opacity="0.5"/>
            
            <!-- 绿地区域 -->
            <path d="M 50 50 Q 150 20, 180 120 Q 100 180, 20 150 Z" fill="#bbf7d0" opacity="0.5"/>
            <path d="M 300 450 Q 400 420, 450 550 Q 350 580, 280 500 Z" fill="#bbf7d0" opacity="0.5"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navigation-container {
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
  grid-template-columns: 450px 1fr;
  gap: 24px;
  flex: 1;
}

.alert-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-alert {
  background: var(--gradient-main);
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
}

.main-alert::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  filter: blur(20px);
}

.alert-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.9;
}

.alert-content h3 {
  color: white;
  font-size: 24px;
  margin-bottom: 8px;
}

.location-text {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.time-calc {
  display: flex;
  gap: 12px;
  background: rgba(0,0,0,0.2);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}

.warning-text {
  color: #fbbf24;
}

.suggestion {
  font-weight: bold;
  font-size: 16px;
}

.route-planner {
  padding: 32px 28px;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.planner-header h4 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  font-weight: 800;
}

.w-100 {
  width: 100%;
}

.planning-input :deep(.el-textarea__inner) {
  padding: 16px;
  border-radius: 12px;
  background: #f8fafc;
  border-color: var(--glass-border);
  font-size: 15px;
  line-height: 1.6;
}

.planning-input :deep(.el-textarea__inner):focus {
  background: white;
}

.planning-btn {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  border-radius: 12px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.route-mock-result {
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
}

.route-step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
}

.route-step:last-child {
  margin-bottom: 0;
}

.route-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 20px;
  bottom: -20px;
  width: 2px;
  background: #cbd5e1;
}

.dot-start, .dot-end, .dot-action {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
  z-index: 1;
}

.dot-start { background: var(--primary-color); }
.dot-end { background: var(--success-color); }
.dot-action { 
  background: white; 
  border: 3px solid var(--primary-color); 
}

.step-text {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.4;
}

.step-text small {
  color: var(--text-secondary);
  font-size: 12px;
  margin-left: 8px;
}

.action-step .step-text {
  color: var(--primary-color);
  font-weight: 600;
}

.end-text {
  font-weight: bold;
  color: var(--success-color);
}

.radar-panel {
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.radar-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.map-placeholder {
  flex: 1;
  background: #f1f5f9;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.map-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #cbd5e1;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 2px;
}

.animated-route {
  animation: marching-ants 1.5s linear infinite;
}

@keyframes marching-ants {
  to { stroke-dashoffset: -20; }
}

.campus-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 脉冲点动画效果 */
.ping {
  position: absolute;
  z-index: 10;
}

.library {
  top: 30%;
  left: 30%;
}

.lab {
  top: 60%;
  right: 25%;
}

.poi-label {
  position: absolute;
  z-index: 5;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  pointer-events: none;
}

.dot {
  width: 16px;
  height: 16px;
  background: var(--success-color);
  border-radius: 50%;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.ring {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--success-color);
  opacity: 0;
  animation: pulse 2s infinite;
}

.lab .ring {
  background: var(--primary-color);
}

@keyframes pulse {
  0% { transform: scale(0.5); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

.pin-label {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  pointer-events: none;
}

.pin-label::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 4px 4px 0;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.me-label {
  color: var(--primary-color);
}

.dest-label {
  color: var(--success-color);
}

.info-bubble {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  white-space: nowrap;
  font-size: 13px;
  line-height: 1.5;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.ping:hover .info-bubble {
  opacity: 1;
}

.text-success { color: var(--success-color); }
.text-muted { color: var(--text-secondary); font-size: 12px; }
</style>
