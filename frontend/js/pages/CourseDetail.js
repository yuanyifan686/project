/* ============================================
 * 课程详情页 CourseDetail
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, ref, onMounted, watch, computed } = Vue;

    const CourseDetailPage = defineComponent({
        name: 'CourseDetailPage',
        props: {
            params: { type: Object, required: true },
        },
        setup(props) {
            const course = ref(null);
            const content = ref(null);
            const loading = ref(true);

            async function load() {
                const id = parseInt(props.params?.id || 0);
                if (!id) return;
                loading.value = true;
                try {
                    const data = await window.API.getCourse(id);
                    course.value = data;
                    if (data?.content) {
                        try {
                            content.value = JSON.parse(data.content);
                        } catch {
                            content.value = null;
                        }
                    }
                } catch (e) {
                    console.error('课程详情加载失败', e);
                } finally {
                    loading.value = false;
                }
            }

            watch(() => props.params?.id, load);
            onMounted(load);

            const goConsult = () => window.Router.navigate('/consult');
            const goList = () => window.Router.navigate('/courses');
            const openChat = () => window.Router.openAiChat();

            const levelColor = computed(() => {
                const lv = course.value?.level;
                if (lv === '高级') return '#e53e3e';
                if (lv === '中级') return '#d69e2e';
                return '#38a169';
            });

            return { course, content, loading, goConsult, goList, openChat, levelColor };
        },
        template: `
            <div class="container section" v-loading="loading">
                <div v-if="course">
                    <a href="#" class="apple-link" @click.prevent="goList" style="display:inline-block; margin-bottom:24px;">返回课程列表</a>

                    <div class="course-detail">
                        <!-- 头部信息 -->
                        <div class="course-detail-hero">
                            <img
                                :src="course.cover"
                                :alt="course.title"
                                class="course-detail-cover"
                                loading="lazy"
                                @error="$event.target.style.background='#e2e8f0'"
                            />
                            <div class="course-detail-info">
                                <h1>{{ course.title }}</h1>
                                <p style="color:#718096;">{{ course.description }}</p>
                                <div class="course-detail-meta">
                                    <span class="meta-item">👨‍🏫 {{ course.teacher }}</span>
                                    <span class="meta-item">⏱ {{ course.duration }}</span>
                                    <span
                                        class="meta-item"
                                        :style="{ background: levelColor, color:'white' }"
                                    >📊 {{ course.level }}</span>
                                    <span class="meta-item">🏷 {{ course.category }}</span>
                                    <span class="meta-item">👥 {{ course.student_count }} 人学习</span>
                                </div>
                                <div class="course-detail-price">
                                    <small>¥</small>{{ Math.floor(course.price) }}
                                </div>
                                <div class="course-detail-actions">
                                    <el-button
                                        type="primary"
                                        size="large"
                                        @click="goConsult"
                                    >立即咨询</el-button>
                                    <el-button size="large" @click="$message.success('已收藏')">收藏课程</el-button>
                                </div>
                            </div>
                        </div>

                        <!-- 详细内容 -->
                        <div class="course-detail-body">
                            <div>
                                <div class="course-section" v-if="content?.objectives">
                                    <h2>🎯 学习目标</h2>
                                    <ul>
                                        <li v-for="(item, i) in content.objectives" :key="i">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="course-section" v-if="content?.tech">
                                    <h2>🛠 技术体系</h2>
                                    <ul>
                                        <li v-for="(item, i) in content.tech" :key="i">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="course-section" v-if="content?.projects">
                                    <h2>💼 实战项目</h2>
                                    <ul>
                                        <li v-for="(item, i) in content.projects" :key="i">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="course-section" v-if="content?.outline">
                                    <h2>📚 课程目录</h2>
                                    <div
                                        class="outline-chapter"
                                        v-for="(ch, i) in content.outline"
                                        :key="i"
                                    >
                                        <h3>{{ ch.chapter }}</h3>
                                        <ul>
                                            <li v-for="(t, j) in ch.topics" :key="j">
                                                {{ t }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <!-- 侧边栏 -->
                            <aside>
                                <div class="aside-card">
                                    <h3>📞 课程咨询</h3>
                                    <p style="color:#718096; font-size:14px; margin-bottom:16px;">
                                        想了解课程详情、价格优惠、学习路线？
                                    </p>
                                    <el-button
                                        type="primary"
                                        style="width:100%; margin-bottom:8px;"
                                        @click="goConsult"
                                    >立即免费咨询</el-button>
                                    <el-button
                                        style="width:100%;"
                                        @click="openChat"
                                    >AI 智能咨询</el-button>

                                    <el-divider />

                                    <h3>🎁 课程保障</h3>
                                    <ul style="list-style:none; padding:0; color:#4a5568; font-size:14px;">
                                        <li style="padding:6px 0;">✓ 7 天无理由退课</li>
                                        <li style="padding:6px 0;">✓ 一线讲师授课</li>
                                        <li style="padding:6px 0;">✓ 终身学习社群</li>
                                        <li style="padding:6px 0;">✓ 实战项目驱动</li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>

                <div v-else-if="!loading" class="empty">
                    <div class="empty-icon">😢</div>
                    <p>课程不存在或已下架</p>
                    <el-button style="margin-top:16px;" @click="goList">返回课程列表</el-button>
                </div>
            </div>
        `,
    });

    window.CourseDetailPage = CourseDetailPage;
})();
