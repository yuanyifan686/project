/* ============================================
 * 课程卡片组件 CourseCard
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, computed, ref, onMounted } = Vue;

    const FALLBACK_COVER =
        'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22><rect width=%22400%22 height=%22200%22 fill=%22%23e2e8f0%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23718096%22 font-size=%2220%22>AI 课程封面</text></svg>';

    const CourseCard = defineComponent({
        name: 'CourseCard',
        props: {
            course: { type: Object, required: true },
        },
        setup(props) {
            const coverEl = ref(null);

            const goDetail = () => {
                window.Router.navigate(`/course/${props.course.id}`);
            };

            const levelColor = computed(() => {
                const lv = props.course.level;
                if (lv === '高级') return '#e53e3e';
                if (lv === '中级') return '#d69e2e';
                return '#38a169';
            });

            onMounted(() => {
                if (coverEl.value && window.LazyLoad) {
                    window.LazyLoad.observe(coverEl.value);
                }
            });

            return { goDetail, levelColor, coverEl, FALLBACK_COVER };
        },
        template: `
            <div class="course-card" @click="goDetail">
                <img
                    ref="coverEl"
                    :data-src="course.cover"
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    :alt="course.title"
                    class="course-card-cover"
                    loading="lazy"
                    @error="$event.target.src = FALLBACK_COVER"
                />
                <div class="course-card-body">
                    <div class="course-card-tag">{{ course.category || 'AI 课程' }}</div>
                    <h3 class="course-card-title">{{ course.title }}</h3>
                    <p class="course-card-desc">{{ course.description }}</p>
                </div>
                <div class="course-card-meta">
                    <span class="price">¥{{ Math.floor(course.price) }} 起</span>
                    <span class="level-tag">{{ course.level }}</span>
                </div>
            </div>
        `,
    });

    window.CourseCard = CourseCard;
})();
