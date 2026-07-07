/* 首页 — Apple 风格 */
(function () {
    'use strict';

    const { defineComponent, ref, onMounted } = Vue;

    const HomePage = defineComponent({
        name: 'HomePage',
        components: {
            'banner-carousel': window.BannerCarousel,
            'course-card': window.CourseCard,
            'teacher-card': window.TeacherCard,
        },
        setup() {
            const banners = ref([]);
            const hotCourses = ref([]);
            const teachers = ref([]);
            const reviews = ref([]);
            const loading = ref(true);

            const features = [
                {
                    icon: '◆',
                    title: '大模型应用开发',
                    desc: '从 LLM 原理到 API 集成，系统掌握大模型应用开发全流程。',
                },
                {
                    icon: '◇',
                    title: 'Agent 智能体',
                    desc: 'ReAct 推理、工具调用与多智能体协作，构建下一代 AI 应用。',
                },
                {
                    icon: '○',
                    title: '自动化工作流',
                    desc: 'n8n、Dify、Coze Workflow 实战，打造企业级自动化系统。',
                },
                {
                    icon: '□',
                    title: '企业 AI 落地',
                    desc: '战略规划、知识库搭建与 ROI 评估，助力智能化转型。',
                },
            ];

            async function load() {
                try {
                    const [b, c, t, r] = await Promise.all([
                        window.API.getBanners(),
                        window.API.getHotCourses(6),
                        window.API.getTeachers(),
                        window.API.getReviews(5),
                    ]);
                    banners.value = b || [];
                    hotCourses.value = c || [];
                    teachers.value = (t || []).slice(0, 4);
                    reviews.value = r || [];
                } catch (e) {
                    ElementPlus.ElMessage.error(e.message || '加载失败，请刷新重试');
                } finally {
                    loading.value = false;
                }
            }

            const goCourses = () => window.Router.navigate('/courses');
            const goConsult = () => window.Router.navigate('/consult');

            const featureRoutes = {
                '大模型应用开发': '/courses?category=大模型应用',
                'Agent 智能体开发': '/courses?category=Agent 开发',
                '自动化工作流': '/courses?category=自动化工作流',
                '企业 AI 落地': '/courses?category=企业 AI 落地',
            };
            const goFeature = (title) => {
                const path = featureRoutes[title] || '/courses';
                window.Router.navigate(path);
            };

            onMounted(load);

            return {
                banners, hotCourses, teachers, reviews, loading,
                features, goCourses, goConsult, goFeature,
            };
        },
        template: `
            <div v-loading="loading">
                <banner-carousel v-if="banners.length" :banners="banners" />

                <!-- 热门课程 -->
                <section class="section">
                    <div class="container">
                        <div class="apple-headline">
                            <p class="apple-eyebrow">热门推荐</p>
                            <h2>精选 AI 课程</h2>
                            <p>由一线大厂讲师打造，覆盖入门到企业落地的完整路径。</p>
                            <div class="apple-cta-row">
                                <a href="#" class="apple-btn apple-btn--primary" @click.prevent="goCourses">浏览全部课程</a>
                                <a href="#" class="apple-link" @click.prevent="goConsult">获取学习建议</a>
                            </div>
                        </div>
                        <div class="course-grid" v-if="hotCourses.length">
                            <course-card v-for="c in hotCourses" :key="c.id" :course="c" />
                        </div>
                        <div v-else-if="!loading" class="empty">
                            <p>暂无课程，敬请期待。</p>
                        </div>
                    </div>
                </section>

                <!-- 学习路径 -->
                <section class="section section--alt">
                    <div class="container">
                        <div class="apple-headline">
                            <p class="apple-eyebrow">学习路径</p>
                            <h2>四个方向。一种未来。</h2>
                            <p>无论你是开发者还是企业决策者，都能找到适合的进阶路线。</p>
                        </div>
                        <div class="feature-grid">
                            <div
                                class="feature-card"
                                v-for="(f, i) in features"
                                :key="i"
                                @click="goFeature(f.title)"
                            >
                                <div class="feature-icon">{{ f.icon }}</div>
                                <h3>{{ f.title }}</h3>
                                <p>{{ f.desc }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 师资 -->
                <section class="section">
                    <div class="container">
                        <div class="apple-headline">
                            <p class="apple-eyebrow">讲师团队</p>
                            <h2>向最优秀的人学习。</h2>
                            <p>来自一线互联网公司的资深 AI 专家，平均 8 年以上行业经验。</p>
                        </div>
                        <div class="teacher-grid" v-if="teachers.length">
                            <teacher-card v-for="t in teachers" :key="t.id" :teacher="t" />
                        </div>
                    </div>
                </section>

                <!-- 学员评价 -->
                <section class="section section--alt">
                    <div class="container">
                        <div class="apple-headline">
                            <p class="apple-eyebrow">学员反馈</p>
                            <h2>他们这样说。</h2>
                        </div>
                        <div class="review-list" v-if="reviews.length">
                            <div class="review-card" v-for="r in reviews" :key="r.id">
                                <p class="review-content">{{ r.content }}</p>
                                <div class="review-meta">
                                    <img
                                        :src="r.avatar"
                                        :alt="r.name"
                                        class="review-avatar"
                                        loading="lazy"
                                        @error="$event.target.style.display='none'"
                                    />
                                    <div>
                                        <div class="review-name">{{ r.name }}</div>
                                        <div class="review-course">{{ r.course }}</div>
                                    </div>
                                    <div class="review-stars">
                                        <span v-for="n in 5" :key="n">{{ n <= r.rating ? '★' : '☆' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA -->
                <section class="apple-promo">
                    <h2>开启你的 AI 学习之旅。</h2>
                    <p>现在咨询，获取专属学习规划与课程优惠。</p>
                    <div class="apple-cta-row">
                        <a href="#" class="apple-btn apple-btn--primary" @click.prevent="goConsult">免费咨询</a>
                        <a href="#" class="apple-link" @click.prevent="goCourses" style="color:#2997ff;">查看课程</a>
                    </div>
                </section>
            </div>
        `,
    });

    window.HomePage = HomePage;
})();