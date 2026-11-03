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
