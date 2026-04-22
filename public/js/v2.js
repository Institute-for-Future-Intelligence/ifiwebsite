/* v2.js — shared runtime for v2-redesigned pages.
   - Scroll-reveal via IntersectionObserver on [data-reveal]
   - Quote carousel: auto-rotate, crossfade, pause on hover, dot navigation
*/

(function () {
    // --- Scroll reveal --------------------------------------------------
    var els = document.querySelectorAll('.v2 [data-reveal]');
    if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px' });
        els.forEach(function (el) { observer.observe(el); });
    }

    // --- Quote carousel -------------------------------------------------
    document.querySelectorAll('.v2-quote-carousel').forEach(function (carousel) {
        var items = carousel.querySelectorAll('.v2-quote-item');
        var dots  = carousel.querySelectorAll('.v2-quote-dot');
        if (items.length < 2) return;

        var current = 0;
        var autoMs = parseInt(carousel.getAttribute('data-auto') || '8000', 10);
        var timer = null;

        function show(idx) {
            items.forEach(function (el, i) { el.classList.toggle('is-active', i === idx); });
            dots.forEach(function (el, i) {
                el.classList.toggle('is-active', i === idx);
                el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
            });
            current = idx;
        }
        function next() { show((current + 1) % items.length); }
        function start() { stop(); timer = setInterval(next, autoMs); }
        function stop()  { if (timer) { clearInterval(timer); timer = null; } }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { show(i); start(); });
        });
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('focusout', start);

        start();
    });
})();
