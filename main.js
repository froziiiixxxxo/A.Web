/* ============================================================
   A.Web — интерактив: прелоадер, скролл-анимации, меню, FAQ
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Прелоадер ---------- */
    var preloader = document.getElementById('preloader');
    function hidePreloader() {
        if (preloader && !preloader.classList.contains('done')) {
            preloader.classList.add('done');
        }
    }
    window.addEventListener('load', function () { setTimeout(hidePreloader, 350); });
    setTimeout(hidePreloader, 2500); // страховка

    /* ---------- Прогресс скролла + шапка + кнопка вверх ---------- */
    var progress = document.getElementById('progress');
    var header = document.getElementById('header');
    var toTop = document.getElementById('toTop');

    function onScroll() {
        var st = window.scrollY || document.documentElement.scrollTop;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (progress) progress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', st > 30);
        if (toTop) toTop.classList.toggle('show', st > 600);
        spyNav(st);
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Scrollspy: подсветка активного пункта меню ---------- */
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a'));
    var spySections = navLinks
        .map(function (a) {
            var href = a.getAttribute('href') || '';
            if (href.charAt(0) !== '#') return null;
            var el = document.querySelector(href);
            return el ? { link: a, el: el } : null;
        })
        .filter(Boolean);

    function spyNav(st) {
        var current = null;
        spySections.forEach(function (s) {
            if (s.el.offsetTop - 140 <= st) current = s;
        });
        spySections.forEach(function (s) { s.link.classList.remove('active'); });
        if (current) current.link.classList.add('active');
    }

    /* ---------- Мобильное меню ---------- */
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');
    var overlay = document.getElementById('menuOverlay');

    function setMenu(open) {
        if (!hamburger || !navMenu || !overlay) return;
        hamburger.classList.toggle('active', open);
        navMenu.classList.toggle('open', open);
        overlay.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            setMenu(!navMenu.classList.contains('open'));
        });
    }
    if (overlay) overlay.addEventListener('click', function () { setMenu(false); });
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });
    }
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
    });

    /* ---------- Reveal-анимации при скролле ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ---------- Анимированные счётчики ---------- */
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var dur = 1400;
        var start = null;
        function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    cio.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { cio.observe(el); });
    }

    /* ---------- FAQ-аккордеон ---------- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var q = item.querySelector('.faq-q');
        if (!q) return;
        q.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(function (other) {
                other.classList.remove('open');
            });
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ---------- Параллакс орбов за курсором (десктоп) ---------- */
    var orbs = document.querySelectorAll('[data-parallax]');
    var fineMouse = window.matchMedia('(pointer: fine)').matches;
    if (fineMouse && orbs.length) {
        var raf = null;
        window.addEventListener('mousemove', function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                var cx = (e.clientX / window.innerWidth - 0.5);
                var cy = (e.clientY / window.innerHeight - 0.5);
                orbs.forEach(function (orb) {
                    var depth = parseFloat(orb.getAttribute('data-parallax')) || 10;
                    orb.style.translate = (cx * depth) + 'px ' + (cy * depth) + 'px';
                });
                raf = null;
            });
        }, { passive: true });
    }

    /* ---------- Год в футере ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Старт ---------- */
    onScroll();
})();
