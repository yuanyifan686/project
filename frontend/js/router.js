/* 全局路由工具 — 所有组件统一调用 */
(function (global) {
    'use strict';

    const ROUTES = {
        '/': { title: '首页' },
        '/courses': { title: '课程中心' },
        '/course/:id': { title: '课程详情' },
        '/consult': { title: '免费咨询' },
        '/about': { title: '关于我们' },
    };

    /** 跳转（path 如 /courses 或 /courses?category=xxx） */
    function navigate(path) {
        if (!path) return;
        let target = String(path).trim();
        if (target.startsWith('#')) target = target.slice(1);
        if (!target.startsWith('/')) target = '/' + target;
        if (location.hash.replace(/^#/, '') === target) {
            window.dispatchEvent(new Event('hashchange'));
            return;
        }
        location.hash = target;
    }

    /** 解析 Banner / 外链为站内路径 */
    function resolveBannerUrl(url) {
        if (!url || url === '#') return '/courses';
        const u = String(url).trim();
        if (u.startsWith('#')) return u.slice(1) || '/courses';
        if (u.startsWith('/')) return u;
        try {
            const parsed = new URL(u, location.origin);
            if (parsed.hash) return parsed.hash.replace(/^#/, '') || '/courses';
        } catch {
            /* ignore */
        }
        return '/courses';
    }

    /** 解析当前 hash */
    function parseHash() {
        const raw = location.hash.replace(/^#/, '') || '/';
        const [pathPart, queryString] = raw.split('?');
        const query = {};
        if (queryString) {
            new URLSearchParams(queryString).forEach((v, k) => {
                query[k] = v;
            });
        }
        const detailMatch = pathPart.match(/^\/course\/(\d+)$/);
        if (detailMatch) {
            return {
                path: '/course/:id',
                params: { id: detailMatch[1] },
                query,
            };
        }
        const path = ROUTES[pathPart] ? pathPart : pathPart;
        return { path, params: {}, query };
    }

    function openAiChat() {
        window.dispatchEvent(new CustomEvent('open-ai-chat'));
    }

    global.Router = {
        navigate,
        resolveBannerUrl,
        parseHash,
        openAiChat,
        ROUTES,
    };
})(window);