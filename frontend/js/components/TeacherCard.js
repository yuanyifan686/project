/* ============================================
 * 师资卡片组件 TeacherCard
 * ============================================ */
(function () {
    'use strict';

    const { defineComponent, ref, onMounted } = Vue;

    const TeacherCard = defineComponent({
        name: 'TeacherCard',
        props: {
            teacher: { type: Object, required: true },
        },
        setup() {
            const avatarEl = ref(null);
            onMounted(() => {
                if (avatarEl.value && window.LazyLoad) {
                    window.LazyLoad.observe(avatarEl.value);
                }
            });
            return { avatarEl };
        },
        template: `
            <div class="teacher-card">
                <img
                    ref="avatarEl"
                    :data-src="teacher.avatar"
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    :alt="teacher.name"
                    class="teacher-avatar"
                    loading="lazy"
                    @error="$event.target.src = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 240 240%22><rect width=%22240%22 height=%22240%22 fill=%22%23e2e8f0%22/><circle cx=%22120%22 cy=%22100%22 r=%2240%22 fill=%22%23a0aec0%22/><text x=%2250%25%22 y=%22180%22 text-anchor=%22middle%22 fill=%22%234a5568%22 font-size=%2216%22>{{ teacher.name }}</text></svg>'"
                />
                <div class="teacher-info">
                    <h3 class="teacher-name">{{ teacher.name }}</h3>
                    <p class="teacher-position">{{ teacher.position }}</p>
                    <p class="teacher-experience">{{ teacher.experience }} · {{ teacher.specialty }}</p>
                    <p class="teacher-specialty">{{ teacher.intro }}</p>
                </div>
            </div>
        `,
    });

    window.TeacherCard = TeacherCard;
})();
