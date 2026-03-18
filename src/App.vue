<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import AiChatPanel from './components/AiChatPanel.vue'
import { Bell, Search, Microphone } from '@element-plus/icons-vue'

const isChatOpen = ref(false)
const aiChatPanelRef = ref(null)

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

const openChatWithPrompt = (prompt) => {
  isChatOpen.value = true
  // wait for transition and then trigger
  setTimeout(() => {
    if (aiChatPanelRef.value) {
      aiChatPanelRef.value.triggerPrompt(prompt)
    }
  }, 100)
}

import { provide } from 'vue'
provide('triggerGlobalChat', openChatWithPrompt)
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    
    <main class="main-content">
      <header class="top-header">
        <div class="search-box glass-card">
          <el-icon><Search /></el-icon>
          <input type="text" placeholder="搜索知识点或资源..." />
        </div>
        <div class="actions">
          <div class="notification glass-card">
            <el-badge is-dot color="#ef4444">
              <el-icon><Bell /></el-icon>
            </el-badge>
          </div>
          <el-button type="primary" size="large">同步最新目标</el-button>
        </div>
      </header>

      <div class="content-view">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- 弹出的 AI 对话面板 -->
    <transition name="slide-up">
      <div v-show="isChatOpen" class="chat-panel-wrapper">
        <AiChatPanel ref="aiChatPanelRef" @close="isChatOpen = false" />
      </div>
    </transition>

    <!-- 全局悬浮 AI 对话球 (Floating Orb) -->
    <div class="ai-floating-orb glass-card" @click="toggleChat" :class="{ 'orb-hidden': isChatOpen }">
      <div class="orb-core">
        <div class="orb-glow"></div>
        <el-icon class="orb-icon"><Microphone /></el-icon>
      </div>
    </div>
  </div>
</template>

<style>
/* 全局覆盖 Element Plus */
.el-badge__content.is-fixed.is-dot {
  right: 5px;
  top: 5px;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  padding-right: 20px;
  background-color: #f1f5f9;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  width: 400px;
  height: 48px;
  background: white !important;
}

.search-box input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  outline: none;
  width: 100%;
}

.actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.notification {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  background: white !important;
}

.content-view {
  flex: 1;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 悬浮 AI 语音球 */
.ai-floating-orb {
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  background: white !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ai-floating-orb:hover {
  transform: scale(1.1) translateY(-4px);
}

.orb-core {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--gradient-main);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.orb-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: inherit;
  filter: blur(8px);
  opacity: 0.6;
  animation: breathe 3s ease-in-out infinite alternate;
}

@keyframes breathe {
  0% { transform: scale(0.9); opacity: 0.4; }
  100% { transform: scale(1.2); opacity: 0.8; }
}

.orb-icon {
  font-size: 24px;
  color: white;
  position: relative;
  z-index: 2;
}

.orb-hidden {
  transform: scale(0) !important;
  opacity: 0;
  pointer-events: none;
}

/* 弹出的聊天面板包裹层 */
.chat-panel-wrapper {
  position: fixed;
  right: 40px;
  bottom: 120px;
  z-index: 1000;
  transform-origin: bottom right;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}
</style>
