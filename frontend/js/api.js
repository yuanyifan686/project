/* ============================================
 * API 客户端：基于 Axios 封装
 * 后端基础地址可通过 window.API_BASE 覆盖
 * ============================================ */
(function (global) {
    'use strict';

    // 默认同源访问；file:// 或独立前端端口时回退到 8000
    const API_BASE =
        global.API_BASE ||
        (location.protocol === 'file:'
            ? 'http://127.0.0.1:8000'
            : location.port === '8080' || location.port === '5500'
              ? `${location.protocol}//${location.hostname}:8000`
              : `${location.protocol}//${location.hostname}${location.port ? ':' + location.port : ''}`);

    // 创建 axios 实例
    const instance = axios.create({
        baseURL: API_BASE,
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 请求拦截：仅管理端接口禁用缓存，公开页面允许浏览器缓存
    instance.interceptors.request.use(
        (config) => {
            const isAdmin = (config.url || '').includes('/api/admin');
            if (isAdmin) {
                config.headers = config.headers || {};
                config.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
                config.headers['Pragma'] = 'no-cache';
                config.headers['Expires'] = '0';
                if (config.method === 'get' || !config.method) {
                    config.params = {
                        ...(config.params || {}),
                        _t: Date.now(),
                    };
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // 响应拦截：解包 {code, data, message}
    instance.interceptors.response.use(
        (response) => {
            const body = response.data;
            if (body && typeof body === 'object' && 'code' in body) {
                if (body.code === 200) {
                    return body.data;
                }
                const err = new Error(body.message || '请求失败');
                err.code = body.code;
                err.response = body;
                return Promise.reject(err);
            }
            return body;
        },
        (error) => {
            const message =
                error?.response?.data?.message || error.message || '网络异常';
            return Promise.reject(new Error(message));
        }
    );

    // ===== API 方法 =====
    const API = {
        baseURL: API_BASE,

        /** 获取轮播图 */
        getBanners() {
            return instance.get('/api/banners');
        },

        /** 获取课程列表（支持筛选；传 page 则分页） */
        getCourses(params = {}) {
            return instance.get('/api/courses', { params });
        },

        /** 分页获取课程列表 */
        getCoursesPage(params = {}) {
            return instance.get('/api/courses', {
                params: { page: 1, page_size: 12, ...params },
            });
        },

        /** 获取热门课程 */
        getHotCourses(limit = 6) {
            return instance.get('/api/courses/hot', { params: { limit } });
        },

        /** 获取课程详情 */
        getCourse(id) {
            return instance.get(`/api/courses/${id}`);
        },

        /** 获取师资列表 */
        getTeachers() {
            return instance.get('/api/teachers');
        },

        /** 获取师资详情 */
        getTeacher(id) {
            return instance.get(`/api/teachers/${id}`);
        },

        /** 获取评价 */
        getReviews(limit = 10) {
            return instance.get('/api/reviews', { params: { limit } });
        },

        /** 提交免费咨询 */
        submitConsultation(data) {
            return instance.post('/api/consultations', data);
        },

        /** AI 聊天 */
        chat(message) {
            return instance.post('/api/chat', { message });
        },

        /** AI 客服公开配置（不含密钥） */
        getChatConfig() {
            return instance.get('/api/chat/config');
        },

        // ===== 后台管理 API =====
        _adminHeaders() {
            const token =
                (typeof localStorage !== 'undefined' &&
                    localStorage.getItem('admin_token')) ||
                '';
            return token ? { Authorization: `Bearer ${token}` } : {};
        },

        /** 管理员登录 */
        adminLogin(username, password) {
            return instance.post('/api/admin/login', { username, password });
        },

        /** 校验 token */
        adminInfo() {
            return instance.get('/api/admin/info', {
                headers: this._adminHeaders(),
            });
        },

        /** 获取所有课程（管理） */
        adminListCourses(keyword = '') {
            return instance.get('/api/admin/courses', {
                params: { keyword: keyword || undefined },
                headers: this._adminHeaders(),
            });
        },

        /** 创建课程 */
        adminCreateCourse(data) {
            return instance.post('/api/admin/courses', data, {
                headers: this._adminHeaders(),
            });
        },

        /** 更新课程 */
        adminUpdateCourse(id, data) {
            return instance.put(`/api/admin/courses/${id}`, data, {
                headers: this._adminHeaders(),
            });
        },

        /** 删除课程 */
        adminDeleteCourse(id) {
            return instance.delete(`/api/admin/courses/${id}`, {
                headers: this._adminHeaders(),
            });
        },

        /** 获取所有师资 */
        adminListTeachers() {
            return instance.get('/api/admin/teachers', {
                headers: this._adminHeaders(),
            });
        },

        /** 创建师资 */
        adminCreateTeacher(data) {
            return instance.post('/api/admin/teachers', data, {
                headers: this._adminHeaders(),
            });
        },

        /** 更新师资 */
        adminUpdateTeacher(id, data) {
            return instance.put(`/api/admin/teachers/${id}`, data, {
                headers: this._adminHeaders(),
            });
        },

        /** 删除师资 */
        adminDeleteTeacher(id) {
            return instance.delete(`/api/admin/teachers/${id}`, {
                headers: this._adminHeaders(),
            });
        },

        /** 获取咨询记录 */
        adminListConsultations(params = {}) {
            const p = typeof params === 'string' ? { keyword: params } : params;
            return instance.get('/api/admin/consultations', {
                params: {
                    keyword: p.keyword || undefined,
                    status: p.status || undefined,
                },
                headers: this._adminHeaders(),
            });
        },

        /** 更新咨询状态 */
        adminUpdateConsultationStatus(id, status) {
            return instance.patch(
                `/api/admin/consultations/${id}/status`,
                { status },
                { headers: this._adminHeaders() }
            );
        },

        /** 删除咨询记录 */
        adminDeleteConsultation(id) {
            return instance.delete(`/api/admin/consultations/${id}`, {
                headers: this._adminHeaders(),
            });
        },

        /** Banner 管理 */
        adminListBanners() {
            return instance.get('/api/admin/banners', {
                headers: this._adminHeaders(),
            });
        },
        adminCreateBanner(data) {
            return instance.post('/api/admin/banners', data, {
                headers: this._adminHeaders(),
            });
        },
        adminUpdateBanner(id, data) {
            return instance.put(`/api/admin/banners/${id}`, data, {
                headers: this._adminHeaders(),
            });
        },
        adminDeleteBanner(id) {
            return instance.delete(`/api/admin/banners/${id}`, {
                headers: this._adminHeaders(),
            });
        },

        /** 评价管理 */
        adminListReviews() {
            return instance.get('/api/admin/reviews', {
                headers: this._adminHeaders(),
            });
        },
        adminCreateReview(data) {
            return instance.post('/api/admin/reviews', data, {
                headers: this._adminHeaders(),
            });
        },
        adminUpdateReview(id, data) {
            return instance.put(`/api/admin/reviews/${id}`, data, {
                headers: this._adminHeaders(),
            });
        },
        adminDeleteReview(id) {
            return instance.delete(`/api/admin/reviews/${id}`, {
                headers: this._adminHeaders(),
            });
        },
    };

    global.API = API;
    global.API_BASE = API_BASE;
})(window);
