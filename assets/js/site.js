(function () {
  'use strict';

  /* ==========================================================================
     Toast Notification System
     ========================================================================== */
  function showToast(message, duration) {
    duration = duration || 2600;
    var toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'site-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');

    if (toast._timer) {
      clearTimeout(toast._timer);
    }
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, duration);
  }

  /* ==========================================================================
     Theme Toggle (Dark / Light)
     ========================================================================== */
  function themeToggle() {
    var button = document.querySelector('.theme-toggle');
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function current() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function paint(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#0b0f17' : '#f8fafc');
      }
      if (!button) {
        return;
      }
      var dark = theme === 'dark';
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    paint(current());

    if (button) {
      button.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem('theme', next);
        } catch (e) {
          /* Storage can be blocked; the choice still applies for this visit. */
        }
        paint(next);
        showToast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 1800);
      });
    }

    media.addEventListener('change', function (event) {
      var stored = null;
      try {
        stored = localStorage.getItem('theme');
      } catch (e) {
        stored = null;
      }
      if (stored === 'light' || stored === 'dark') {
        return;
      }
      paint(event.matches ? 'dark' : 'light');
    });
  }

  /* ==========================================================================
     Disclosure & Dropdown Toggles (Mobile Menu & Follow)
     ========================================================================== */
  function toggle(button, target) {
    if (!button || !target) {
      return;
    }

    function set(open) {
      target.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    button.addEventListener('click', function () {
      set(!target.classList.contains('is-open'));
    });

    document.addEventListener('click', function (event) {
      if (!button.contains(event.target) && !target.contains(event.target)) {
        set(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        set(false);
      }
    });
  }

  /* ==========================================================================
     Tab Navigation (Blog & Sections)
     ========================================================================== */
  function tabs(list) {
    if (!list) {
      return;
    }

    var buttons = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

    function select(button) {
      buttons.forEach(function (other) {
        var active = other === button;
        other.setAttribute('aria-selected', active ? 'true' : 'false');
        other.tabIndex = active ? 0 : -1;
        var panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !active;
        }
      });
    }

    function openHash() {
      if (!window.location.hash) return false;
      var target = document.getElementById(window.location.hash.slice(1));
      var panel = target && target.closest('[role="tabpanel"]');
      var button = panel && buttons.filter(function (other) {
        return other.getAttribute('aria-controls') === panel.id;
      })[0];
      if (!button) {
        return false;
      }
      select(button);
      if (target !== panel) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return true;
    }

    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        select(button);
        history.replaceState(null, '', '#' + button.getAttribute('aria-controls'));
      });

      button.addEventListener('keydown', function (event) {
        var step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
        if (step) {
          event.preventDefault();
          var next = buttons[(index + step + buttons.length) % buttons.length];
          next.click();
          next.focus();
        }
      });
    });

    window.addEventListener('hashchange', openHash);

    if (!openHash() && buttons.length) {
      select(buttons[0]);
    }
  }

  /* ==========================================================================
     Interactive Project Filter (Projects Page)
     ========================================================================== */
  function projectFilters() {
    var container = document.querySelector('.project-filter-nav');
    if (!container) return;

    var filterBtns = container.querySelectorAll('.filter-btn');
    var projectSections = document.querySelectorAll('.project-section');

    function applyFilter(category) {
      filterBtns.forEach(function (btn) {
        var isCurrent = btn.getAttribute('data-filter') === category;
        btn.classList.toggle('is-active', isCurrent);
        btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      });

      projectSections.forEach(function (sec) {
        var secCat = sec.getAttribute('data-category');
        if (category === 'all' || secCat === category) {
          sec.style.display = '';
          sec.classList.remove('is-hidden');
        } else {
          sec.style.display = 'none';
          sec.classList.add('is-hidden');
        }
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        applyFilter(cat);
      });
    });
  }

  /* ==========================================================================
     Lightbox Image Gallery (Personal Blog Posts)
     ========================================================================== */
  function gallery(card) {
    var links = Array.prototype.slice.call(card.querySelectorAll('.post-card__lead, .post-card__photos a'));
    if (!links.length || !window.HTMLDialogElement) {
      return;
    }

    function icon(points) {
      return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + points + '</svg>';
    }

    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.setAttribute('aria-label', 'Photos');
    dialog.innerHTML =
      '<div class="lightbox__stage"><img class="lightbox__image" alt=""></div>' +
      '<p class="lightbox__count" aria-live="polite"></p>' +
      '<button class="lightbox__button lightbox__button--close" type="button" aria-label="Close">' +
      icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>') + '</button>' +
      '<button class="lightbox__button lightbox__button--prev" type="button" aria-label="Previous photo">' +
      icon('<polyline points="15 18 9 12 15 6"/>') + '</button>' +
      '<button class="lightbox__button lightbox__button--next" type="button" aria-label="Next photo">' +
      icon('<polyline points="9 18 15 12 9 6"/>') + '</button>';
    document.body.appendChild(dialog);

    var image = dialog.querySelector('.lightbox__image');
    var count = dialog.querySelector('.lightbox__count');
    var current = 0;

    function show(index) {
      current = (index + links.length) % links.length;
      image.src = links[current].href;
      var imgEl = links[current].querySelector('img');
      image.alt = imgEl ? imgEl.alt : 'Photo';
      count.textContent = (current + 1) + ' / ' + links.length;
    }

    links.forEach(function (link, index) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        show(index);
        dialog.showModal();
      });
    });

    dialog.querySelector('.lightbox__button--prev').addEventListener('click', function () {
      show(current - 1);
    });

    dialog.querySelector('.lightbox__button--next').addEventListener('click', function () {
      show(current + 1);
    });

    dialog.querySelector('.lightbox__button--close').addEventListener('click', function () {
      dialog.close();
    });

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.classList.contains('lightbox__stage')) {
        dialog.close();
      }
    });

    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        show(current - 1);
      } else if (event.key === 'ArrowRight') {
        show(current + 1);
      }
    });
  }

  /* ==========================================================================
     Email Copy & Mailto Handling
     ========================================================================== */
  function setupEmailCopy() {
    document.querySelectorAll('.js-email').forEach(function (el) {
      var user = el.getAttribute('data-user') || 'mirzaevmuzaffar';
      var domain = el.getAttribute('data-domain') || 'gmail.com';
      var address = user + '@' + domain;

      var wrapper = document.createElement('span');
      wrapper.className = 'email-copy-wrap';

      var link = document.createElement('a');
      link.href = 'mailto:' + address;
      link.textContent = el.hasAttribute('data-show') ? address : (el.textContent.trim() || 'Email');
      link.title = 'Send email to ' + address;

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-email-btn';
      copyBtn.setAttribute('aria-label', 'Copy email address to clipboard');
      copyBtn.title = 'Copy email address';
      copyBtn.innerHTML = '<svg class="icon icon--copy" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

      copyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(address).then(function () {
            showToast('Copied ' + address + ' to clipboard!');
          }).catch(function () {
            prompt('Copy email address:', address);
          });
        } else {
          prompt('Copy email address:', address);
        }
      });

      wrapper.appendChild(link);
      wrapper.appendChild(copyBtn);
      el.replaceWith(wrapper);
    });
  }

  /* ==========================================================================
     Back to Top Button
     ========================================================================== */
  function setupBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top of page');
    btn.title = 'Back to top';
    btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          btn.classList.toggle('is-visible', window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     Visit Stats (GoatCounter)
     ========================================================================== */
  var GOATCOUNTER = 'https://mmp17.goatcounter.com';
  var LIVE_HOST = 'mmp17.github.io';

  // GoatCounter buckets days in the site's timezone (UTC by default).
  function utcDay(daysAgo) {
    var d = new Date();
    d.setUTCDate(d.getUTCDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  }

  function countVisits(fromDaysAgo, toDaysAgo) {
    var url = GOATCOUNTER + '/counter/TOTAL.json?start=' + utcDay(fromDaysAgo) + '&end=' + utcDay(toDaysAgo);
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error('GoatCounter ' + res.status);
      }
      return res.json();
    }).then(function (data) {
      return parseInt(String(data.count).replace(/\D/g, ''), 10) || 0;
    });
  }

  function describeChange(current, previous) {
    if (previous === 0) {
      return current > 0 ? { text: 'New', trend: 'is-up' } : { text: 'No change', trend: '' };
    }
    var pct = Math.round(((current - previous) / previous) * 100);
    if (pct === 0) {
      return { text: '0%', trend: '' };
    }
    return pct > 0
      ? { text: '\u25B2 ' + pct + '%', trend: 'is-up' }
      : { text: '\u25BC ' + Math.abs(pct) + '%', trend: 'is-down' };
  }

  function visitStats() {
    // Forks and local copies must not count toward (or display) the live site's stats.
    if (location.hostname !== LIVE_HOST) {
      return;
    }

    var tracker = document.createElement('script');
    tracker.async = true;
    tracker.src = 'https://gc.zgo.at/count.js';
    tracker.setAttribute('data-goatcounter', GOATCOUNTER + '/count');
    document.body.appendChild(tracker);

    var footer = document.querySelector('.page-footer');
    if (!footer) {
      return;
    }

    var periods = [
      { label: 'Today', days: 1, compare: 'vs yesterday' },
      { label: 'Last 7 days', days: 7, compare: 'vs previous 7 days' },
      { label: 'Last 30 days', days: 30, compare: 'vs previous 30 days' }
    ];

    Promise.all(periods.map(function (period) {
      return Promise.all([
        countVisits(period.days - 1, 0),
        countVisits(period.days * 2 - 1, period.days)
      ]);
    })).then(function (results) {
      var section = document.createElement('section');
      section.className = 'visit-stats';
      section.setAttribute('aria-label', 'Site visits');

      var title = document.createElement('p');
      title.className = 'visit-stats__title';
      title.textContent = 'Visitors';
      section.appendChild(title);

      var grid = document.createElement('ul');
      grid.className = 'visit-stats__grid';

      periods.forEach(function (period, i) {
        var current = results[i][0];
        var change = describeChange(current, results[i][1]);

        var item = document.createElement('li');
        item.className = 'visit-stats__item';

        var label = document.createElement('span');
        label.className = 'visit-stats__label';
        label.textContent = period.label;

        var value = document.createElement('span');
        value.className = 'visit-stats__value';
        value.textContent = current.toLocaleString();

        var delta = document.createElement('span');
        delta.className = 'visit-stats__change ' + change.trend;
        delta.textContent = change.text + ' ' + period.compare;

        item.appendChild(label);
        item.appendChild(value);
        item.appendChild(delta);
        grid.appendChild(item);
      });

      section.appendChild(grid);
      footer.insertBefore(section, footer.querySelector('p'));
    }).catch(function () {
      // Stats are decorative; leave the footer as-is if GoatCounter is unreachable.
    });
  }

  /* ==========================================================================
     DOM Ready Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    themeToggle();
    toggle(document.querySelector('.nav-toggle'), document.getElementById('site-nav'));
    toggle(document.querySelector('.author__follow'), document.getElementById('author-urls'));
    tabs(document.querySelector('.tabs'));
    projectFilters();
    document.querySelectorAll('.post-card').forEach(gallery);
    setupEmailCopy();
    setupBackToTop();
    visitStats();
  });
})();
