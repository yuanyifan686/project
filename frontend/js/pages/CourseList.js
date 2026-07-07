/* ============================================
 * 课程列表页 CourseList（分页）
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, ref, onMounted, watch } = Vue;

    const CourseListPage = defineComponent({
        name: 'CourseListPage',
        props: {
            params: { type: Object, default: () => ({}) },
            query: { type: Object, default: () => ({}) },
        },
        components: {
            'course-card': window.CourseCard,
        },
        setup(props) {
            const courses = ref([]);
            const loading = ref(true);
            const category = ref('全部');
            const level = ref('全部');
            const keyword = ref('');
            const page = ref(1);
            const pageSize = ref(12);
            const total = ref(0);

            const categories = ['全部', '大模型应用', 'Agent 开发', '自动化工作流', '企业 AI 落地'];
            const levels = ['全部', '初级', '中级', '高级'];

            async function load() {
                loading.value = true;
                try {
                    const params = { page: page.value, page_size: pageSize.value };
                    if (category.value !== '全部') params.category = category.value;
                    if (level.value !== '全部') params.level = level.value;
                    if (keyword.value.trim()) params.keyword = keyword.value.trim();
                    const data = await window.API.getCoursesPage(params);
                    courses.value = data?.items || [];
                    total.value = data?.total || 0;
                } catch (e) {
                    console.error('课程列表加载失败', e);
                    ElementPlus.ElMessage.error(e.message || '加载失败');
                } finally {
                    loading.value = false;
                }
            }

            function reset() {
                category.value = '全部';
                level.value = '全部';
                keyword.value = '';
                page.value = 1;
                load();
            }

            function onPageChange(p) {
                page.value = p;
                load();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            let timer = null;
            watch(keyword, () => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    page.value = 1;
                    load();
                }, 400);
            });
            watch([category, level], () => {
                page.value = 1;
                load();
            });

            function applyQueryFromRoute() {
                const cat = props.query?.category;
                if (cat && categories.includes(cat) && category.value !== cat) {
                    category.value = cat;
                }
            }

            watch(() => props.query, applyQueryFromRoute, { deep: true });

            onMounted(() => {
                applyQueryFromRoute();
                load();
            });

            return {
                courses,
                loading,
                category,
                level,
                keyword,
                categories,
                levels,
                load,
                reset,
                total,
                page,
                pageSize,
                onPageChange,
            };
        },
        template: `
            <div class="container section">
                <div class="apple-headline" style="text-align:left; margin-bottom:40px;">
                    <p class="apple-eyebrow">课程中心</p>
                    <h2 style="font-size:40px;">全部课程</h2>
                    <p style="margin-left:0;">系统化 AI 课程体系，覆盖入门到企业落地。</p>
                </div>

                <div class="filter-bar">
                    <div class="filter-row" style="margin-bottom:12px;">
                        <span class="filter-label">分类：</span>
                        <span
                            class="filter-chip"
                            v-for="c in categories"
                            :key="c"
                            :class="{ active: category === c }"
                            @click="category = c"
                        >{{ c }}</span>
                    </div>
                    <div class="filter-row">
                        <span class="filter-label">难度：</span>
                        <span
                            class="filter-chip"
                            v-for="l in levels"
                            :key="l"
                            :class="{ active: level === l }"
                            @click="level = l"
                        >{{ l }}</span>
                        <input
                            v-model="keyword"
                            class="search-input"
                            placeholder="🔍 搜索课程名称或简介"
                        />
                        <el-button @click="reset">重置</el-button>
                    </div>
                </div>

                <div v-loading="loading">
                    <div class="course-grid" v-if="courses.length">
                        <course-card
                            v-for="c in courses"
                            :key="c.id"
                            :course="c"
                        />
                    </div>
                    <div v-else-if="!loading" class="empty">
                        <div class="empty-icon">🔍</div>
                        <p>未找到匹配的课程</p>
                        <p style="margin-top:8px;">
                            <el-button @click="reset">重置筛选</el-button>
                        </p>
                    </div>
                </div>

                <div
                    v-if="!loading && total > pageSize"
                    style="display:flex; justify-content:center; margin-top:32px;"
                >
                    <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :total="total"
                        :page-size="pageSize"
                        :current-page="page"
                        @current-change="onPageChange"
                    />
                </div>
                <p
                    v-else-if="!loading && courses.length"
                    style="text-align:center; color:#718096; margin-top:24px;"
                >共 {{ total }} 门课程</p>
            </div>
        `,
    });

    window.CourseListPage = CourseListPage;
})();