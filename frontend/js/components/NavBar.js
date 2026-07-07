/* 顶部导航 */
(function () {
    'use strict';

    const { defineComponent, ref, onMounted, onUnmounted } = Vue;

    const NavBar = defineComponent({
        name: 'NavBar',
        props: {
            currentPath: { type: String, default: '/' },
        },
        setup(props) {
            const mobileOpen = ref(false);
            const scrolled = ref(false);

            const menu = [
                { path: '/', label: '首页' },
                { path: '/courses', label: '课程' },
                { path: '/consult', label: '咨询' },
                { path: '/about', label: '关于' },
            ];

            const isActive = (path) => {
                if (path === '/') return props.currentPath === '/';
                if (path === '/courses') {
                    return (
                        props.currentPath === '/courses' ||
                        props.currentPath === '/course/:id'
                    );
                }
                return props.currentPath === path;
            };

            const onScroll = () => {
                scrolled.value = window.scrollY > 4;
            };

            onMounted(() => {
                window.addEventListener('scroll', onScroll);
                onScroll();
            });
            onUnmounted(() => window.removeEventListener('scroll', onScroll));

            const go = (path) => {
                mobileOpen.value = false;
                window.Router.navigate(path);
            };

            return { mobileOpen, scrolled, menu, isActive, go };
        },
        template: `
            <header class="nav" :class="{ 'nav-scrolled': scrolled }">
                <div class="nav-inner">
                    <a href="#" class="nav-logo" @click.prevent="go('/')">
                        <span class="nav-logo-icon"></span>
                        <span>AI Course</span>
                    </a>

                    <ul class="nav-menu" :class="{ open: mobileOpen }">
                        <li v-for="item in menu" :key="item.path">
                            <a
                                href="#"
                                :class="{ active: isActive(item.path) }"
                                @click.prevent="go(item.path)"
                            >{{ item.label }}</a>
                        </li>
                        <li>
                            <a href="#" class="nav-cta" @click.prevent="go('/consult')">立即咨询</a>
                        </li>
                    </ul>

                    <button class="nav-toggle" @click="mobileOpen = !mobileOpen" aria-label="菜单">☰</button>
                </div>
            </header>
        `,
    });

    window.NavBar = NavBar;
})();