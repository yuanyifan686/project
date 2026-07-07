/* 页脚 */
(function () {
    'use strict';

    const { defineComponent } = Vue;

    const AppFooter = defineComponent({
        name: 'AppFooter',
        setup() {
            const go = (path) => window.Router.navigate(path);

            const categories = [
                { label: '大模型应用', query: '大模型应用' },
                { label: 'Agent 开发', query: 'Agent 开发' },
                { label: '自动化工作流', query: '自动化工作流' },
                { label: '企业 AI 落地', query: '企业 AI 落地' },
            ];

            const goCategory = (cat) => {
                window.Router.navigate(
                    `/courses?category=${encodeURIComponent(cat)}`
                );
            };

            return { go, categories, goCategory };
        },
        template: `
            <footer class="footer">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>AI 智能体课程</h4>
                        <p>
                            为开发者与企业打造的 AI 学习平台。从大模型应用到 Agent 开发，
                            从自动化工作流到企业级落地，助你掌握智能时代核心能力。
                        </p>
                    </div>
                    <div class="footer-col">
                        <h4>探索</h4>
                        <ul>
                            <li><a href="#" @click.prevent="go('/')">首页</a></li>
                            <li><a href="#" @click.prevent="go('/courses')">全部课程</a></li>
                            <li><a href="#" @click.prevent="go('/consult')">免费咨询</a></li>
                            <li><a href="#" @click.prevent="go('/about')">关于我们</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>课程方向</h4>
                        <ul>
                            <li v-for="c in categories" :key="c.query">
                                <a href="#" @click.prevent="goCategory(c.query)">{{ c.label }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>联系我们</h4>
                        <ul>
                            <li>400-888-8888</li>
                            <li>contact@ai-course.com</li>
                            <li>北京市海淀区</li>
                            <li>周一至周五 9:00–18:00</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    Copyright © 2026 AI Course Inc. 保留所有权利。
                </div>
            </footer>
        `,
    });

    window.AppFooter = AppFooter;
})();