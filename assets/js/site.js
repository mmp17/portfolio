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

  document.addEventListener('DOMContentLoaded', function () {
    toggle(document.querySelector('.nav-toggle'), document.getElementById('site-nav'));
    toggle(document.querySelector('.author__follow'), document.getElementById('author-urls'));

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
