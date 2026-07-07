/* Vue3 应用入口 + Hash 路由 */
(function () {
    'use strict';

    const { createApp, ref, onMounted } = Vue;
    const { ElMessage, ElMessageBox } = ElementPlus;

    const routes = {
        '/': { component: window.HomePage, title: '首页' },
        '/courses': { component: window.CourseListPage, title: '课程中心' },
        '/course/:id': { component: window.CourseDetailPage, title: '课程详情' },
        '/consult': { component: window.ConsultPage, title: '免费咨询' },
        '/about': { component: window.AboutPage, title: '关于我们' },
    };

    const App = {
        components: {
            'nav-bar': window.NavBar,
            'app-footer': window.AppFooter,
            'ai-chat': window.AiChat,
            'router-view': {
                template:
                    '<component :is="currentComponent" :params="params" :query="query" />',
                props: ['params', 'query'],
                computed: {
                    currentComponent() {
                        return routes[this.currentPath]?.component;
                    },
                    currentPath() {
                        return this.$root.currentPath;
                    },
                },
            },
        },
        setup() {
            const currentPath = ref('/');
            const params = ref({});
            const query = ref({});

            function syncRoute() {
                const r = window.Router.parseHash();
                const pathKey = routes[r.path] ? r.path : '/';
                currentPath.value = pathKey;
                params.value = r.params;
                query.value = r.query;
                const route = routes[pathKey];
                document.title = route?.title
                    ? `${route.title} - AI 智能体课程平台`
                    : 'AI 智能体课程平台';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            onMounted(() => {
                window.addEventListener('hashchange', syncRoute);
                if (!location.hash) location.hash = '/';
                syncRoute();
            });

            return { currentPath, params, query };
        },
        template: `
            <nav-bar :current-path="currentPath"></nav-bar>
            <main>
                <router-view :params="params" :query="query"></router-view>
            </main>
            <app-footer></app-footer>
            <ai-chat></ai-chat>
        `,
    };

    const app = createApp(App);
    app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });
    app.config.globalProperties.$message = ElMessage;
    app.config.globalProperties.$confirm = ElMessageBox.confirm;
    app.config.globalProperties.$go = (path) => window.Router.navigate(path);
    app.mount('#app');
    window.__vue_app__ = true;
})();