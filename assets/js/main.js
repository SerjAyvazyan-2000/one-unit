/* One Unit — мобильное меню и события аналитики. Страница полностью работает без JS. */
(function () {
  'use strict';

  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  var mq = window.matchMedia('(max-width: 960px)');

  function setOpen(open, returnFocus) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      burger.focus();
    }
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true', false);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && mq.matches) setOpen(false, false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setOpen(false, true);
      }
    });

    document.addEventListener('click', function (e) {
      if (burger.getAttribute('aria-expanded') === 'true' &&
          !nav.contains(e.target) && !burger.contains(e.target)) {
        setOpen(false, false);
      }
    });

    mq.addEventListener('change', function (e) {
      if (!e.matches) setOpen(false, false);
    });
  }

  /* Плавное появление элементов при прокрутке */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    // соседние элементы одной сетки появляются по очереди
    reveals.forEach(function (el) {
      var parent = el.parentElement;
      var siblings = Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains('reveal'); });
      var i = siblings.indexOf(el);
      if (siblings.length > 1 && i > 0 && !el.classList.contains('reveal--delay')) {
        el.style.setProperty('--reveal-delay', Math.min(i * 90, 450) + 'ms');
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Уведомление о cookie: запоминаем согласие на год */
  var banner = document.getElementById('cookie-banner');
  var accept = document.getElementById('cookie-accept');
  function hasConsent() {
    try { if (localStorage.getItem('ou_cookie_ok') === '1') return true; } catch (e) {}
    return document.cookie.indexOf('ou_cookie_ok=1') !== -1;
  }
  if (banner && accept && !hasConsent()) {
    banner.hidden = false;
    accept.addEventListener('click', function () {
      try { localStorage.setItem('ou_cookie_ok', '1'); } catch (e) {}
      document.cookie = 'ou_cookie_ok=1; max-age=31536000; path=/; SameSite=Lax';
      banner.hidden = true;
    });
  }
  /* Ссылка «Подробнее» раскрывает блок с информацией о cookie */
  document.querySelectorAll('a[href="#cookies"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var d = document.querySelector('#cookies details');
      if (d) d.open = true;
    });
  });

  /* Год в подвале */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /*
    Аналитика: события click_phone / click_vk / click_gorko с параметром place.
    Подключается только при наличии ID счётчика владельца.
    Пример для Яндекс Метрики: ym(COUNTER_ID, 'reachGoal', name, { place: place });
  */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-event]');
    if (!link) return;
    var name = link.getAttribute('data-event');
    var place = link.getAttribute('data-place') || '';
    if (typeof window.ym === 'function' && window.YM_ID) {
      window.ym(window.YM_ID, 'reachGoal', name, { place: place });
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, { place: place });
    }
  });
})();
