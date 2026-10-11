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

    function fromHash() {
      var id = window.location.hash.slice(1);
      return buttons.filter(function (button) {
        return button.getAttribute('aria-controls') === id;
      })[0];
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

    window.addEventListener('hashchange', function () {
      var button = fromHash();
      if (button) {
        select(button);
      }
    });

    select(fromHash() || buttons[0]);
  }

  document.addEventListener('DOMContentLoaded', function () {
    toggle(document.querySelector('.nav-toggle'), document.getElementById('site-nav'));
    toggle(document.querySelector('.author__follow'), document.getElementById('author-urls'));
    tabs(document.querySelector('.tabs'));

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
