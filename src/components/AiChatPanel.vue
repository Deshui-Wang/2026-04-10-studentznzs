<script setup>
import { ref, watch, nextTick } from 'vue'
import { ChatLineRound, Promotion, Picture, Microphone, Close } from '@element-plus/icons-vue'

const emit = defineEmits(['close'])

const messageList = ref([
  {
    role: 'ai',
    content: '你好，张同学。我是你的校园智能助理 (Super Agent)。\n\n你可以向我提问学术问题、安排日程，或者让我帮你办理校园事务。'
  }
])

const inputStr = ref('')

const quickPrompts = [
  '帮我请假',
  '查今晚空教室',
  '这道积分题算得不对',
  '安排文献阅读'
]

const scrollRef = ref(null)

const scrollToBottom = async () => {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

const borrowType = ref('主馆')

const sendMsg = () => {
  if (!inputStr.value.trim()) return
  
  const query = inputStr.value
  messageList.value.push({
    role: 'user',
    content: query
  })
  scrollToBottom()
  inputStr.value = ''
  
  setTimeout(() => {
    let reply = '收到你的请求。系统正在进行意图识别...'
    let widget = null
    
    // 模拟意图路由：如果是办理业务，同步到 Services 模块
    if (query.includes('假') || query.includes('书') || query.includes('场地') || query.includes('充值') || query.includes('办')) {
      if (window.__SERVICES_SUBMIT__) {
        window.__SERVICES_SUBMIT__(query)
      }
    }

    if (query.includes('充值') || query.includes('卡')) {
      reply = '好的，已为你调起聚合支付网关。请扫描下方支付码完成一卡通充值：'
      widget = 'payment'
    } else if (query.includes('书') || query.includes('借')) {
       reply = '好的，已为你启动图书馆借阅流程。请直接在下方填写具体书名和取书偏好：'
       widget = 'borrow'
    } else if (query.includes('请假')) {
      reply = '正在调用 【事务办理引擎】... 已生成高数课请假单草稿，并同步至「事务办理」任务流中。详情请查看左侧菜单。'
    } else if (query.includes('场地') || query.includes('预定')) {
       reply = '正在查询空闲场地... 已启动场地预定工单，请在「事务办理」模块补充具体时间段。'
    } else if (query.includes('教室') || query.includes('上课')) {
      reply = '正在调用 【智能空间引擎】... 当前距离上门课还有 45 分钟，主楼 302。最近的可用空教室是 图书馆2层D区 (剩余12座)。'
    } else if (query.includes('积分')) {
      reply = '正在调用 【学业辅助大脑】... 已结合你的错题本上下文，发现你对三角函数求导符号掌握薄弱。'
    } else if (query.includes('安排') || query.includes('阅读')) {
      reply = '正在调用 【动态日程引擎】... 已检测明日下午 14:00-16:00 有空闲时间槽，已将文献阅读任务挂载。'
    }
    
    messageList.value.push({
      role: 'ai',
      content: reply,
      widget: widget
    })
    scrollToBottom()
  }, 1000)
}

const handleWidgetAction = (idx, successMsg) => {
  // 隐藏当前消息的 widget
  messageList.value[idx].widget = null
  // 发送成功反馈
  setTimeout(() => {
    messageList.value.push({
      role: 'ai',
      content: successMsg
    })
    scrollToBottom()
  }, 500)
}

const handlePrompt = (prompt) => {
  inputStr.value = prompt
  sendMsg()
}

const triggerPrompt = (prompt) => {
  inputStr.value = prompt
  sendMsg()
}

defineExpose({
  triggerPrompt
})
</script>

<template>
  <div class="ai-chat-panel glass-card">
    <!-- 头部栏 -->
    <div class="panel-header">
      <div class="header-info">
        <div class="orb-mini">AI</div>
        <div class="title-group">
          <span class="p-title">Super Agent</span>
          <span class="p-status">Online</span>
        </div>
      </div>
      <el-icon class="close-btn" @click="emit('close')"><Close /></el-icon>
    </div>

    <!-- 聊天记录区 -->
    <div class="chat-history" ref="scrollRef">
      <div 
        v-for="(msg, idx) in messageList" 
        :key="idx" 
        class="message-row"
        :class="msg.role === 'user' ? 'msg-right' : 'msg-left'"
      >
        <div class="avatar" :class="msg.role === 'ai' ? 'ai-avatar' : 'user-avatar'">
          {{ msg.role === 'ai' ? 'AI' : '我' }}
        </div>
        <div class="bubble-wrapper">
          <div class="bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-ai'">
            {{ msg.content }}
          </div>

          <!-- 交互式组件区 -->
          <div v-if="msg.widget === 'payment'" class="chat-widget mt-2">
            <div class="payment-card glass-card">
              <div class="card-header">一卡通聚合支付</div>
              <div class="qr-container">
                <img src="/payment_qr_code.png" alt="支付码" />
              </div>
              <p class="qr-tip">可以使用微信/支付宝扫码充值</p>
              <el-input placeholder="自定义金额" size="small" class="mb-2">
                <template #append>元</template>
              </el-input>
              <el-button type="primary" size="small" class="w-100" @click="handleWidgetAction(idx, '充值成功！一卡通余额已更新。')">确认已支付</el-button>
            </div>
          </div>

          <div v-if="msg.widget === 'borrow'" class="chat-widget mt-2">
            <div class="form-card glass-card">
              <div class="card-header">借书登记工单</div>
              <el-form label-position="top" size="small">
                <el-form-item label="图书名称">
                  <el-input placeholder="请输入书名，如《算法导论》" />
                </el-form-item>
                <el-form-item label="预计借阅天数">
                  <el-slider :min="1" :max="30" show-input />
                </el-form-item>
                <el-form-item label="取书网点">
                  <el-radio-group v-model="borrowType">
                    <el-radio-button label="主馆" />
                    <el-radio-button label="西二楼自助柜" />
                  </el-radio-group>
                </el-form-item>
                <el-button type="primary" size="small" class="w-100" @click="handleWidgetAction(idx, '借阅登记已提交！请前往所选地点凭证件取书。')">确认提交</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷指令 -->
    <div class="quick-prompts">
      <el-button 
        v-for="(prompt, idx) in quickPrompts" 
        :key="idx"
        size="small"
        class="prompt-btn"
        @click="handlePrompt(prompt)"
      >
        {{ prompt }}
      </el-button>
    </div>

    <!-- 输入区 -->
    <div class="input-area-container">
      <div class="input-wrapper">
        <el-input 
          v-model="inputStr" 
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 4 }"
          placeholder="问问这个知识点，或获取学习建议..."
          class="chat-input"
          resize="none"
          @keydown.enter.prevent="sendMsg"
        />
        <div class="input-actions-row">
          <div class="left-tools">
            <el-tooltip content="发送图片/截图" placement="top">
              <el-button link :icon="Picture" class="tool-btn" />
            </el-tooltip>
            <el-tooltip content="语音输入" placement="top">
              <el-button link :icon="Microphone" class="tool-btn" />
            </el-tooltip>
          </div>
          <el-button 
            type="primary" 
            :icon="Promotion" 
            class="send-now-btn" 
            @click="sendMsg" 
            :disabled="!inputStr.trim()"
            circle 
          />
        </div>
      </div>
      <p class="ai-disclaimer">Agent 可能产生错误，重要信息请核实。</p>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-panel {
  width: 420px;
  height: 75vh;
  min-height: 600px;
  max-height: 850px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.panel-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--glass-border);
  background: linear-gradient(to right, rgba(14, 165, 233, 0.05), rgba(99, 102, 241, 0.05));
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.orb-mini {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-main);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 13px;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.p-title {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 15px;
}

.p-status {
  font-size: 12px;
  color: var(--success-color);
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ef4444;
}

.chat-history {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-row {
  display: flex;
  gap: 12px;
  max-width: 90%;
}

.msg-left {
  align-self: flex-start;
}

.msg-right {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}

.ai-avatar {
  background: var(--gradient-main);
  color: white;
}

.user-avatar {
  background: #f1f5f9;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
}

.bubble {
  padding: 12px 16px;
  border-radius: 16px;
  line-height: 1.5;
  font-size: 14px;
  white-space: pre-wrap;
}

.bubble-ai {
  background: white;
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  border-top-left-radius: 4px;
}

.bubble-user {
  background: var(--primary-color);
  color: white;
  border-top-right-radius: 4px;
}

.quick-prompts {
  padding: 8px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
}

.prompt-btn {
  background: white;
  border-color: #e2e8f0;
  color: var(--text-secondary);
  border-radius: 16px;
  font-size: 12px;
}

.prompt-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* 交互组件样式 */
.bubble-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-widget {
  width: 100%;
  max-width: 320px;
}

.payment-card, .form-card {
  padding: 16px;
  background: white !important;
  border-radius: 12px;
}

.card-header {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #eee;
  color: var(--primary-color);
}

.qr-container {
  width: 160px;
  height: 160px;
  margin: 0 auto 12px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 8px;
}

.qr-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-tip {
  text-align: center;
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.w-100 {
  width: 100%;
}

.mb-2 {
  margin-bottom: 8px;
}

.mt-2 {
  margin-top: 8px;
}

/* 输入区样式优化 */
.input-area-container {
  padding: 16px 20px 10px;
  background: white;
  border-top: 1px solid #f1f5f9;
}

.input-wrapper {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper:focus-within {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.08);
}

.chat-input :deep(.el-textarea__inner) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
}

.input-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 4px;
}

.left-tools {
  display: flex;
  gap: 4px;
}

.tool-btn {
  font-size: 18px;
  color: #94a3b8;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.tool-btn:hover {
  color: var(--primary-color);
  background: rgba(14, 165, 233, 0.08);
}

.send-now-btn {
  width: 32px;
  height: 32px;
  min-height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  border: none;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.send-now-btn:hover:not(:disabled) {
  transform: scale(1.1) rotate(-10deg);
  background: #0ea5e9;
}

.send-now-btnBy:active {
  transform: scale(0.95);
}

.send-now-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  box-shadow: none;
}

.ai-disclaimer {
  text-align: center;
  font-size: 10px;
  color: #94a3b8;
  margin-top: 10px;
  letter-spacing: 0.5px;
}
</style>
