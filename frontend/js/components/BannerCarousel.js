/* Banner 轮播 */
(function () {
    'use strict';

    const { defineComponent, ref, nextTick, onMounted, onUnmounted, watch } = Vue;

    const BannerCarousel = defineComponent({
        name: 'BannerCarousel',
        props: {
            banners: { type: Array, default: () => [] },
            autoplay: { type: Boolean, default: true },
            interval: { type: Number, default: 6000 },
        },
        setup(props) {
            const current = ref(0);
            let timer = null;

            function go(i) {
                if (!props.banners.length) return;
                current.value = (i + props.banners.length) % props.banners.length;
            }

            function start() {
                stop();
                if (!props.autoplay || props.banners.length < 2) return;
                timer = setInterval(() => go(current.value + 1), props.interval);
            }

            function stop() {
                if (timer) { clearInterval(timer); timer = null; }
            }

            function onPrimaryClick(banner) {
                window.Router.navigate(
                    window.Router.resolveBannerUrl(banner.url)
                );
            }

            function goConsult() {
                window.Router.navigate('/consult');
            }

            onMounted(() => {
                start();
                nextTick(() => {
                    document.querySelectorAll('.hero-slide-bg[data-bg]').forEach((el) => {
                        if (window.LazyLoad) window.LazyLoad.observe(el);
                    });
                });
            });
            onUnmounted(stop);

            watch(() => props.banners.length, () => {
                current.value = 0;
                start();
            });

            return { current, go, onPrimaryClick, goConsult, start, stop };
        },
        template: `
            <div class="hero-banner" @mouseenter="stop" @mouseleave="start">
                <div
                    v-for="(b, i) in banners"
                    :key="b.id"
                    class="hero-slide"
                    :class="{ active: i === current }"
                >
                    <div class="hero-slide-bg" :data-bg="b.image"></div>
                    <div class="hero-content">
                        <p class="hero-eyebrow">全新课程季</p>
                        <h1>{{ b.title }}</h1>
                        <p>{{ b.subtitle }}</p>
                        <div class="apple-cta-row hero-cta">
                            <a
                                href="#"
                                class="apple-btn apple-btn--primary"
                                @click.prevent="onPrimaryClick(b)"
                            >{{ b.button_text || '了解课程' }}</a>
                            <a
                                href="#"
                                class="apple-link"
                                @click.prevent="goConsult"
                            >免费咨询</a>
                        </div>
                    </div>
                </div>

                <div class="hero-dots" v-if="banners.length > 1">
                    <span
                        v-for="(b, i) in banners"
                        :key="'dot-' + b.id"
                        class="hero-dot"
                        :class="{ active: i === current }"
                        @click.stop="go(i)"
                    ></span>
                </div>
            </div>
        `,
    });

    window.BannerCarousel = BannerCarousel;
})();