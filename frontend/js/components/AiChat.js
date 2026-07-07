/* ============================================
 * AI 智能客服组件（服务端代理，密钥不暴露给前端）
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, ref, nextTick, onMounted, onUnmounted } = Vue;

    const QUICK_QUESTIONS = [
        '课程价格',
        '学习路线',
        '讲师介绍',
        '开课时间',
    ];

    const AiChat = defineComponent({
        name: 'AiChat',
        setup() {
            const chatMode = ref('mock');
            const visible = ref(false);
            const input = ref('');
            const messages = ref([
                {
                    role: 'bot',
                    text:
                        '您好！我是 AI 课程智能助手 🤖\n可以为您介绍：\n• 课程内容与价格\n• 学习路线推荐\n• 师资介绍\n• 开课时间\n请问您想了解哪方面？',
                },
            ]);
            const sending = ref(false);
            const messagesEl = ref(null);

            function open() {
                visible.value = true;
                scrollToBottom();
            }
            function close() {
                visible.value = false;
            }
            function toggle() {
                visible.value = !visible.value;
                if (visible.value) scrollToBottom();
            }

            function scrollToBottom() {
                nextTick(() => {
                    if (messagesEl.value) {
                        messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
                    }
                });
            }

            async function send(text) {
                const content = (text || input.value).trim();
                if (!content || sending.value) return;
                messages.value.push({ role: 'user', text: content });
                input.value = '';
                sending.value = true;
                scrollToBottom();

                try {
                    const data = await window.API.chat(content);
                    messages.value.push({
                        role: 'bot',
                        text: data?.reply || '抱歉，没有理解您的问题，请重试。',
                    });
                } catch (e) {
                    messages.value.push({
                        role: 'bot',
                        text: '网络异常，请稍后重试 🙏',
                    });
                } finally {
                    sending.value = false;
                    scrollToBottom();
                }
            }

            async function loadChatConfig() {
                try {
                    const cfg = await window.API.getChatConfig();
                    if (cfg?.mode) chatMode.value = cfg.mode;
                } catch (e) {
                    console.warn('AI 客服配置加载失败', e);
                }
            }

            function onKeydown(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                }
            }

            function onExternalOpen() {
                open();
            }

            onMounted(() => {
                loadChatConfig();
                window.addEventListener('open-ai-chat', onExternalOpen);
            });
            onUnmounted(() => {
                window.removeEventListener('open-ai-chat', onExternalOpen);
            });

            return {
                chatMode,
                visible,
                input,
                messages,
                sending,
                messagesEl,
                open,
                close,
                toggle,
                send,
                onKeydown,
                QUICK_QUESTIONS,
            };
        },
        template: `
            <button
                class="chat-fab"
                @click="toggle"
                :title="visible ? '关闭客服' : '打开客服'"
            >
                <span v-if="!visible">💬</span>
                <span v-else>×</span>
            </button>

            <div class="chat-modal" v-if="visible">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-header-avatar">🤖</div>
                        <div>
                            <div class="chat-header-title">AI 课程顾问</div>
                            <div class="chat-header-sub">
                                {{ chatMode === 'coze' ? 'Coze 智能回复' : '在线服务中' }}
                            </div>
                        </div>
                    </div>
                    <button class="chat-close" @click="close" title="关闭">×</button>
                </div>

                <div class="chat-messages" ref="messagesEl">
                    <div
                        v-for="(m, i) in messages"
                        :key="i"
                        class="chat-msg"
                        :class="m.role"
                    >{{ m.text }}</div>
                    <div v-if="sending" class="chat-msg bot">正在思考中...</div>
                </div>

                <div style="padding: 8px 16px 0; background:#f7fafc;">
                    <div class="chat-quick">
                        <button
                            v-for="q in QUICK_QUESTIONS"
                            :key="q"
                            class="chat-quick-btn"
                            @click="send(q)"
                        >{{ q }}</button>
                    </div>
                </div>

                <div class="chat-input-bar">
                    <input
                        v-model="input"
                        class="chat-input"
                        placeholder="输入您的问题..."
                        @keydown="onKeydown"
                    />
                    <button
                        class="chat-send"
                        :disabled="sending || !input.trim()"
                        @click="send()"
                    >发送</button>
                </div>
            </div>
        `,
    });

    window.AiChat = AiChat;
})();