/* 图片懒加载：进入视口后再设置 src */
(function (global) {
    'use strict';

    const observer =
        typeof IntersectionObserver !== 'undefined'
            ? new IntersectionObserver(
                  (entries) => {
                      entries.forEach((entry) => {
                          if (!entry.isIntersecting) return;
                          const el = entry.target;
                          const src = el.dataset.src;
                          if (src) {
                              el.src = src;
                              el.removeAttribute('data-src');
                          }
                          const bg = el.dataset.bg;
                          if (bg) {
                              el.style.backgroundImage = `url(${bg})`;
                              el.removeAttribute('data-bg');
                          }
                          observer.unobserve(el);
                      });
                  },
                  { rootMargin: '120px' }
              )
            : null;

    function observe(el) {
        if (!el || !observer) {
            if (el?.dataset?.src) el.src = el.dataset.src;
            if (el?.dataset?.bg)
                el.style.backgroundImage = `url(${el.dataset.bg})`;
            return;
        }
        observer.observe(el);
    }

    global.LazyLoad = { observe };
})(window);