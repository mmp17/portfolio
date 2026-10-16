(function () {
  'use strict';

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
        document.getElementById(other.getAttribute('aria-controls')).hidden = !active;
      });
    }

    // The hash names a panel, or something inside one, such as a single post.
    function openHash() {
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
        target.scrollIntoView();
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

    if (!openHash()) {
      select(buttons[0]);
    }
  }

  // Clicking a photo opens the post's photos in a full-screen carousel.
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
      image.alt = links[current].querySelector('img').alt;
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

    // A click on the dark area around the photo closes the carousel.
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
        meta.setAttribute('content', theme === 'dark' ? '#121411' : '#f3f1ec');
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

  document.addEventListener('DOMContentLoaded', function () {
    themeToggle();
    toggle(document.querySelector('.nav-toggle'), document.getElementById('site-nav'));
    toggle(document.querySelector('.author__follow'), document.getElementById('author-urls'));
    tabs(document.querySelector('.tabs'));
    document.querySelectorAll('.post-card').forEach(gallery);

    // The address is kept out of the markup; build the mailto link here.
    document.querySelectorAll('.js-email').forEach(function (el) {
      var address = el.getAttribute('data-user') + '@' + el.getAttribute('data-domain');
      var link = document.createElement('a');
      link.href = 'mailto:' + address;
      link.textContent = el.hasAttribute('data-show') ? address : el.textContent;
      el.replaceWith(link);
    });
  });
})();
