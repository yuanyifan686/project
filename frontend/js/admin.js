/* ============================================
 * 后台管理 - 主脚本
 * ============================================ */
(function () {
    'use strict';

    const { createApp, ref, reactive, computed, onMounted, h } = Vue;
    const { ElMessage, ElMessageBox } = ElementPlus;

    // Element Plus 图标
    const IconUser = window.ElementPlusIconsVue?.User;
    const IconLock = window.ElementPlusIconsVue?.Lock;
    const IconDataLine = window.ElementPlusIconsVue?.DataLine;
    const IconReading = window.ElementPlusIconsVue?.Reading;
    const IconUser2 = window.ElementPlusIconsVue?.UserFilled;
    const IconChat = window.ElementPlusIconsVue?.ChatDotRound;
    const IconSearch = window.ElementPlusIconsVue?.Search;
    const IconPlus = window.ElementPlusIconsVue?.Plus;

    const app = createApp({
        setup() {
            // ===== 登录状态 =====
            const loggedIn = ref(false);
            const username = ref('');
            const loginLoading = ref(false);
            const loginForm = reactive({ username: '', password: '' });
            const loginFormRef = ref(null);
            const loginRules = {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            };

            // ===== 标签页 =====
            const activeTab = ref('dashboard');
            const tabTitle = computed(() => ({
                dashboard: '数据概览',
                courses: '课程管理',
                teachers: '师资管理',
                banners: 'Banner 管理',
                reviews: '评价管理',
                consultations: '咨询记录',
            }[activeTab.value]));

            // ===== 公共 =====
            const loading = ref(false);
            const saving = ref(false);

            // ===== 统计 =====
            const stats = reactive({
                courses: 0,
                teachers: 0,
                consultations: 0,
                banners: 0,
                reviews: 0,
            });

            // ===== 课程 =====
            const courseList = ref([]);
            const courseKeyword = ref('');
            const courseDialog = ref(false);
            const courseForm = reactive({
                id: null,
                title: '',
                teacher: '',
                duration: '',
                price: 0,
                level: '初级',
                description: '',
                content: '',
                category: '大模型应用',
                student_count: 0,
                cover: '',
            });
            const courseFormRef = ref(null);
            const courseRules = {
                title: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
                teacher: [{ required: true, message: '请输入讲师', trigger: 'blur' }],
            };

            // ===== 师资 =====
            const teacherList = ref([]);
            const teacherDialog = ref(false);
            const teacherForm = reactive({
                id: null,
                name: '',
                position: '',
                experience: '',
                specialty: '',
                intro: '',
                avatar: '',
            });
            const teacherFormRef = ref(null);
            const teacherRules = {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
            };

            // ===== Banner =====
            const bannerList = ref([]);
            const bannerDialog = ref(false);
            const bannerForm = reactive({
                id: null,
                title: '',
                subtitle: '',
                image: '',
                button_text: '立即学习',
                url: '#',
                sort_order: 0,
            });
            const bannerFormRef = ref(null);
            const bannerRules = {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
            };

            // ===== 评价 =====
            const reviewList = ref([]);
            const reviewDialog = ref(false);
            const reviewForm = reactive({
                id: null,
                name: '',
                avatar: '',
                content: '',
                course: '',
                rating: 5,
            });
            const reviewFormRef = ref(null);
            const reviewRules = {
                name: [{ required: true, message: '请输入学员名', trigger: 'blur' }],
                content: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
            };

            // ===== 咨询 =====
            const consultList = ref([]);
            const consultKeyword = ref('');
            const consultStatus = ref('全部');

            const STATUS_LABELS = {
                pending: '待处理',
                contacted: '已联系',
                closed: '已关闭',
            };
            const statusLabel = (s) => STATUS_LABELS[s] || s || '待处理';

            // ===== 工具 =====
            const formatDate = (s) => {
                if (!s) return '-';
                try {
                    const d = new Date(s);
                    return d.toLocaleString('zh-CN');
                } catch {
                    return s;
                }
            };

            // 兼容后端可能返回的不同结构：数组 / 单对象嵌套 / {code,data,message} 等
            function normalizeList(payload) {
                if (Array.isArray(payload)) return payload;
                if (payload && typeof payload === 'object') {
                    // 形如 {id, create_time, data: {actual}} —— 提取 data 字段
                    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
                        return [payload.data];
                    }
                    // 形如 {code, data: [...]} —— 已由 api.js 解包，这里防御一下
                    if (payload.data && Array.isArray(payload.data)) return payload.data;
                    if (payload.code === 200 && Array.isArray(payload.data)) return payload.data;
                }
                return [];
            }

            // ===== 登录 =====
            async function doLogin() {
                try {
                    await loginFormRef.value.validate();
                } catch {
                    return;
                }
                loginLoading.value = true;
                try {
                    const res = await window.API.adminLogin(
                        loginForm.username,
                        loginForm.password
                    );
                    localStorage.setItem('admin_token', res.token);
                    localStorage.setItem('admin_username', res.username);
                    username.value = res.username;
                    loggedIn.value = true;
                    ElMessage.success('登录成功');
                    loadAll();
                } catch (e) {
                    ElMessage.error(e.message || '登录失败');
                } finally {
                    loginLoading.value = false;
                }
            }

            function doLogout() {
                ElMessageBox.confirm('确定要退出登录吗？', '提示', {
                    type: 'warning',
                })
                    .then(() => {
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_username');
                        loggedIn.value = false;
                        loginForm.password = '';
                    })
                    .catch(() => {});
            }

            function goFront() {
                window.open('/', '_blank');
            }

            // ===== 加载数据 =====
            async function loadStats() {
                try {
                    const [c, t, cons, b, r] = await Promise.all([
                        window.API.adminListCourses(),
                        window.API.adminListTeachers(),
                        window.API.adminListConsultations(),
                        window.API.adminListBanners(),
                        window.API.adminListReviews(),
                    ]);
                    stats.courses = normalizeList(c).length;
                    stats.teachers = normalizeList(t).length;
                    stats.consultations = normalizeList(cons).length;
                    stats.banners = normalizeList(b).length;
                    stats.reviews = normalizeList(r).length;
                } catch (e) {
                    console.error('统计加载失败', e);
                }
            }

            async function loadCourses() {
                loading.value = true;
                try {
                    courseList.value = normalizeList(
                        await window.API.adminListCourses(courseKeyword.value)
                    );
                } catch (e) {
                    if (e.message?.includes('未授权')) {
                        loggedIn.value = false;
                    }
                    ElMessage.error(e.message || '加载失败');
                } finally {
                    loading.value = false;
                }
            }

            async function loadTeachers() {
                loading.value = true;
                try {
                    teacherList.value = normalizeList(
                        await window.API.adminListTeachers()
                    );
                } catch (e) {
                    ElMessage.error(e.message || '加载失败');
                } finally {
                    loading.value = false;
                }
            }

            async function loadBanners() {
                loading.value = true;
                try {
                    bannerList.value = normalizeList(await window.API.adminListBanners());
                } catch (e) {
                    ElMessage.error(e.message || '加载失败');
                } finally {
                    loading.value = false;
                }
            }

            async function loadReviews() {
                loading.value = true;
                try {
                    reviewList.value = normalizeList(await window.API.adminListReviews());
                } catch (e) {
                    ElMessage.error(e.message || '加载失败');
                } finally {
                    loading.value = false;
                }
            }

            async function loadConsultations() {
                loading.value = true;
                try {
                    consultList.value = normalizeList(
                        await window.API.adminListConsultations({
                            keyword: consultKeyword.value,
                            status: consultStatus.value,
                        })
                    );
                } catch (e) {
                    ElMessage.error(e.message || '加载失败');
                } finally {
                    loading.value = false;
                }
            }

            function loadAll() {
                if (activeTab.value === 'dashboard') loadStats();
                else if (activeTab.value === 'courses') loadCourses();
                else if (activeTab.value === 'teachers') loadTeachers();
                else if (activeTab.value === 'banners') loadBanners();
                else if (activeTab.value === 'reviews') loadReviews();
                else if (activeTab.value === 'consultations') loadConsultations();
            }

            // ===== 课程 CRUD =====
            function openCourseDialog(row) {
                if (row) {
                    Object.assign(courseForm, row);
                } else {
                    Object.assign(courseForm, {
                        id: null,
                        title: '',
                        teacher: '',
                        duration: '',
                        price: 0,
                        level: '初级',
                        description: '',
                        content: '',
                        category: '大模型应用',
                        student_count: 0,
                        cover: '',
                    });
                }
                courseDialog.value = true;
            }

            async function saveCourse() {
                try {
                    await courseFormRef.value.validate();
                } catch {
                    return;
                }
                saving.value = true;
                try {
                    if (courseForm.id) {
                        await window.API.adminUpdateCourse(courseForm.id, {
                            ...courseForm,
                        });
                        ElMessage.success('更新成功');
                    } else {
                        const { id, ...data } = courseForm;
                        await window.API.adminCreateCourse(data);
                        ElMessage.success('创建成功');
                    }
                    courseDialog.value = false;
                    loadCourses();
                } catch (e) {
                    ElMessage.error(e.message || '保存失败');
                } finally {
                    saving.value = false;
                }
            }

            function deleteCourse(row) {
                ElMessageBox.confirm(
                    `确定要删除课程「${row.title}」吗？`,
                    '删除确认',
                    { type: 'warning' }
                )
                    .then(async () => {
                        try {
                            await window.API.adminDeleteCourse(row.id);
                            ElMessage.success('已删除');
                            loadCourses();
                        } catch (e) {
                            ElMessage.error(e.message || '删除失败');
                        }
                    })
                    .catch(() => {});
            }

            // ===== 师资 CRUD =====
            function openTeacherDialog(row) {
                if (row) {
                    Object.assign(teacherForm, row);
                } else {
                    Object.assign(teacherForm, {
                        id: null,
                        name: '',
                        position: '',
                        experience: '',
                        specialty: '',
                        intro: '',
                        avatar: '',
                    });
                }
                teacherDialog.value = true;
            }

            async function saveTeacher() {
                try {
                    await teacherFormRef.value.validate();
                } catch {
                    return;
                }
                saving.value = true;
                try {
                    if (teacherForm.id) {
                        await window.API.adminUpdateTeacher(teacherForm.id, {
                            ...teacherForm,
                        });
                        ElMessage.success('更新成功');
                    } else {
                        const { id, ...data } = teacherForm;
                        await window.API.adminCreateTeacher(data);
                        ElMessage.success('创建成功');
                    }
                    teacherDialog.value = false;
                    loadTeachers();
                } catch (e) {
                    ElMessage.error(e.message || '保存失败');
                } finally {
                    saving.value = false;
                }
            }

            function deleteTeacher(row) {
                ElMessageBox.confirm(
                    `确定要删除师资「${row.name}」吗？`,
                    '删除确认',
                    { type: 'warning' }
                )
                    .then(async () => {
                        try {
                            await window.API.adminDeleteTeacher(row.id);
                            ElMessage.success('已删除');
                            loadTeachers();
                        } catch (e) {
                            ElMessage.error(e.message || '删除失败');
                        }
                    })
                    .catch(() => {});
            }

            // ===== Banner CRUD =====
            function openBannerDialog(row) {
                if (row) {
                    Object.assign(bannerForm, row);
                } else {
                    Object.assign(bannerForm, {
                        id: null,
                        title: '',
                        subtitle: '',
                        image: '',
                        button_text: '立即学习',
                        url: '#',
                        sort_order: 0,
                    });
                }
                bannerDialog.value = true;
            }

            async function saveBanner() {
                try {
                    await bannerFormRef.value.validate();
                } catch {
                    return;
                }
                saving.value = true;
                try {
                    if (bannerForm.id) {
                        await window.API.adminUpdateBanner(bannerForm.id, { ...bannerForm });
                        ElMessage.success('更新成功');
                    } else {
                        const { id, ...data } = bannerForm;
                        await window.API.adminCreateBanner(data);
                        ElMessage.success('创建成功');
                    }
                    bannerDialog.value = false;
                    loadBanners();
                } catch (e) {
                    ElMessage.error(e.message || '保存失败');
                } finally {
                    saving.value = false;
                }
            }

            function deleteBanner(row) {
                ElMessageBox.confirm(`确定删除 Banner「${row.title}」吗？`, '删除确认', {
                    type: 'warning',
                })
                    .then(async () => {
                        await window.API.adminDeleteBanner(row.id);
                        ElMessage.success('已删除');
                        loadBanners();
                    })
                    .catch(() => {});
            }

            // ===== 评价 CRUD =====
            function openReviewDialog(row) {
                if (row) {
                    Object.assign(reviewForm, row);
                } else {
                    Object.assign(reviewForm, {
                        id: null,
                        name: '',
                        avatar: '',
                        content: '',
                        course: '',
                        rating: 5,
                    });
                }
                reviewDialog.value = true;
            }

            async function saveReview() {
                try {
                    await reviewFormRef.value.validate();
                } catch {
                    return;
                }
                saving.value = true;
                try {
                    if (reviewForm.id) {
                        await window.API.adminUpdateReview(reviewForm.id, { ...reviewForm });
                        ElMessage.success('更新成功');
                    } else {
                        const { id, ...data } = reviewForm;
                        await window.API.adminCreateReview(data);
                        ElMessage.success('创建成功');
                    }
                    reviewDialog.value = false;
                    loadReviews();
                } catch (e) {
                    ElMessage.error(e.message || '保存失败');
                } finally {
                    saving.value = false;
                }
            }

            function deleteReview(row) {
                ElMessageBox.confirm(`确定删除「${row.name}」的评价吗？`, '删除确认', {
                    type: 'warning',
                })
                    .then(async () => {
                        await window.API.adminDeleteReview(row.id);
                        ElMessage.success('已删除');
                        loadReviews();
                    })
                    .catch(() => {});
            }

            // ===== 咨询记录 =====
            async function updateConsultStatus(row, status) {
                if (row.status === status) return;
                try {
                    await window.API.adminUpdateConsultationStatus(row.id, status);
                    ElMessage.success('状态已更新');
                    loadConsultations();
                } catch (e) {
                    ElMessage.error(e.message || '更新失败');
                }
            }

            function deleteConsult(row) {
                ElMessageBox.confirm('确定要删除该咨询记录吗？', '删除确认', {
                    type: 'warning',
                })
                    .then(async () => {
                        try {
                            await window.API.adminDeleteConsultation(row.id);
                            ElMessage.success('已删除');
                            loadConsultations();
                        } catch (e) {
                            ElMessage.error(e.message || '删除失败');
                        }
                    })
                    .catch(() => {});
            }

            // ===== 切换 tab 时自动加载 =====
            function onSelect(idx) {
                activeTab.value = idx;
                loadAll();
            }

            // ===== 自动登录（已保存 token）=====
            async function tryAutoLogin() {
                const token = localStorage.getItem('admin_token');
                if (!token) return;
                try {
                    const info = await window.API.adminInfo();
                    username.value = info.username;
                    loggedIn.value = true;
                    loadAll();
                } catch {
                    localStorage.removeItem('admin_token');
                }
            }

            onMounted(() => {
                tryAutoLogin();
            });

            return {
                loggedIn,
                username,
                loginLoading,
                loginForm,
                loginFormRef,
                loginRules,
                activeTab,
                tabTitle,
                loading,
                saving,
                stats,
                courseList,
                courseKeyword,
                courseDialog,
                courseForm,
                courseFormRef,
                courseRules,
                teacherList,
                teacherDialog,
                teacherForm,
                teacherFormRef,
                teacherRules,
                bannerList,
                bannerDialog,
                bannerForm,
                bannerFormRef,
                bannerRules,
                reviewList,
                reviewDialog,
                reviewForm,
                reviewFormRef,
                reviewRules,
                consultList,
                consultKeyword,
                consultStatus,
                statusLabel,
                formatDate,
                loadBanners,
                loadReviews,
                openBannerDialog,
                saveBanner,
                deleteBanner,
                openReviewDialog,
                saveReview,
                deleteReview,
                updateConsultStatus,
                doLogin,
                doLogout,
                goFront,
                loadCourses,
                loadTeachers,
                loadConsultations,
                openCourseDialog,
                saveCourse,
                deleteCourse,
                openTeacherDialog,
                saveTeacher,
                deleteTeacher,
                deleteConsult,
                onSelect,
            };
        },
    });

    // 注册 Element Plus
    app.use(ElementPlus, { locale: ElementPlusLocaleZhCn });

    // 注册图标
    if (window.ElementPlusIconsVue) {
        for (const [name, comp] of Object.entries(window.ElementPlusIconsVue)) {
            app.component(name, comp);
        }
    }

    app.mount('#app');
})();
