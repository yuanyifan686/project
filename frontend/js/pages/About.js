/* ============================================
 * 关于我们 About
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, ref, onMounted } = Vue;

    const AboutPage = defineComponent({
        name: 'AboutPage',
        components: {
            'teacher-card': window.TeacherCard,
        },
        setup() {
            const teachers = ref([]);

            const philosophy = [
                '以实战为核心，所有课程都源自真实企业项目',
                '用最简单的语言讲清楚最复杂的技术',
                '让每一位学员都能做出属于自己的 AI 产品',
                '教学相长，与学员共同成长',
                '拥抱开源，分享知识，让 AI 普惠',
            ];

            const advantages = [
                { icon: '🎓', title: '权威师资', desc: '一线大厂资深工程师授课' },
                { icon: '💼', title: '实战项目', desc: '真实企业级项目贯穿始终' },
                { icon: '👥', title: '小班教学', desc: '导师 1v1 答疑辅导' },
                { icon: '🌐', title: '终身学习', desc: '课程更新终身免费' },
                { icon: '🏆', title: '就业推荐', desc: '优秀学员内推大厂' },
                { icon: '💎', title: '品质保障', desc: '7 天无理由退款' },
            ];

            const contact = [
                { icon: '📞', label: '客服热线', value: '400-888-8888' },
                { icon: '📧', label: '商务邮箱', value: 'contact@ai-course.com' },
                { icon: '📍', label: '公司地址', value: '北京市海淀区中关村' },
                { icon: '⏰', label: '工作时间', value: '周一至周五 9:00-18:00' },
            ];

            async function loadTeachers() {
                try {
                    const data = await window.API.getTeachers();
                    teachers.value = data || [];
                } catch (e) {
                    console.error('师资加载失败', e);
                }
            }

            onMounted(loadTeachers);

            return { teachers, philosophy, advantages, contact };
        },
        template: `
            <div>
                <!-- Hero -->
                <div class="about-hero">
                    <h1>关于我们</h1>
                    <p>专注 AI 教育，赋能开发者与企业拥抱智能时代</p>
                </div>

                <div class="container section">
                    <!-- 公司介绍 -->
                    <div class="about-section">
                        <h2>公司介绍</h2>
                        <p>
                            我们是一家专注于 AI 智能体教育与咨询的创新型企业，致力于为开发者、技术团队和企业提供
                            最前沿、最实用的 AI 课程与落地服务。
                        </p>
                        <p>
                            团队由来自 BAT 等一线互联网公司的资深 AI 工程师组成，平均行业经验 8 年以上。
                            我们相信 AI 是这个时代最重要的技术变革之一，希望通过系统化的教育，
                            让更多人能够掌握 AI 能力，参与到这场智能革命中。
                        </p>
                        <p>
                            自创立以来，我们已服务超过 10,000+ 学员，
                            帮助 100+ 企业完成 AI 转型，
                            培育了众多 AI 工程师、Agent 开发者与企业 AI 负责人。
                        </p>
                    </div>

                    <!-- 教育理念 -->
                    <div class="about-section">
                        <h2>教育理念</h2>
                        <p>
                            我们坚持"实战驱动、面向未来"的教学理念：
                        </p>
                        <ul class="about-list">
                            <li v-for="(item, i) in philosophy" :key="i">{{ item }}</li>
                        </ul>
                    </div>

                    <!-- 服务优势 -->
                    <div class="about-section">
                        <h2>服务优势</h2>
                        <div class="feature-grid" style="margin-top:16px;">
                            <div
                                class="feature-card"
                                v-for="(a, i) in advantages"
                                :key="i"
                            >
                                <div class="feature-icon">{{ a.icon }}</div>
                                <h3>{{ a.title }}</h3>
                                <p>{{ a.desc }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 师资团队 -->
                    <div class="about-section">
                        <h2>核心师资</h2>
                        <p>由一线大厂资深工程师领衔的师资团队</p>
                        <div class="teacher-grid" v-if="teachers.length" style="margin-top:16px;">
                            <teacher-card
                                v-for="t in teachers"
                                :key="t.id"
                                :teacher="t"
                            />
                        </div>
                    </div>

                    <!-- 联系方式 -->
                    <div class="about-section">
                        <h2>联系方式</h2>
                        <p>期待与您建立联系，共同推动 AI 教育的进步</p>
                        <div class="contact-grid">
                            <div
                                class="contact-item"
                                v-for="(c, i) in contact"
                                :key="i"
                            >
                                <div class="contact-icon">{{ c.icon }}</div>
                                <div class="contact-label">{{ c.label }}</div>
                                <div class="contact-value">{{ c.value }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,
    });

    window.AboutPage = AboutPage;
})();
