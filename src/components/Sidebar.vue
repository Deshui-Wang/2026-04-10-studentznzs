<script setup>
import { 
  ChatDotRound, 
  Reading, 
  Calendar, 
  Switch, 
  Location,
  Setting,
  UserFilled
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { id: 'dashboard', name: '智能大厅 (LUI)', icon: ChatDotRound, path: '/' },
  { id: 'study', name: '学业辅助 (Copilot)', icon: Reading, path: '/study' },
  { id: 'schedule', name: '动态日程 (Scheduler)', icon: Calendar, path: '/schedule' },
  { id: 'services', name: '事务办理 (Services)', icon: Switch, path: '/services' },
  { id: 'navigation', name: '智能空间 (Spatial API)', icon: Location, path: '/navigation' }
]
</script>

<template>
  <div class="sidebar glass-card">
    <div class="logo-area">
      <div class="logo-icon">AI</div>
      <div class="logo-text">Super Agent<br/>校园智能助手</div>
    </div>
    
    <nav class="nav-menu">
      <router-link 
        v-for="item in menuItems" 
        :key="item.id"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="user-profile">
      <el-avatar :icon="UserFilled" :size="32" />
      <div class="info">
        <div class="name">张同学</div>
        <div class="level">LV.12 学习者</div>
      </div>
      <el-icon class="settings"><Setting /></el-icon>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 280px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: #ffffff !important;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--gradient-main);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
}

.logo-text {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--text-primary);
  line-height: 1.3;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-decoration: none;
}

.nav-item i {
  font-size: 20px;
}

.nav-item:hover {
  background: #f1f5f9;
  color: var(--text-primary);
}

.nav-item.active {
  background: #eef2ff;
  color: var(--primary-color);
  font-weight: 600;
}

.user-profile {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-profile .info {
  flex: 1;
}

.user-profile .name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.user-profile .level {
  font-size: 12px;
  color: var(--text-secondary);
}

.settings {
  cursor: pointer;
  color: var(--text-secondary);
}

.settings:hover {
  color: var(--text-primary);
}
</style>
