(function () {
  'use strict';

  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  var yearNow = document.getElementById('yearNow');

  if (yearNow) {
    yearNow.textContent = String(new Date().getFullYear());
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      siteNav.classList.toggle('is-open');
    });

    siteNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      });
    });

    document.addEventListener('click', function (e) {
      if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      }
    });
  }

  function setInvalid(field, invalid) {
    if (!field) return;
    if (invalid) field.classList.add('field-invalid');
    else field.classList.remove('field-invalid');
  }

  var quickQuoteForm = document.getElementById('quickQuoteForm');
  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', function (e) {
      var name = quickQuoteForm.querySelector('#name');
      var phone = quickQuoteForm.querySelector('#phone');
      var postcode = quickQuoteForm.querySelector('#postcode');

      var postPattern = /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]?\s?[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/;
      var ok = true;

      if (!name || name.value.trim().length < 2) {
        ok = false;
        setInvalid(name, true);
      } else {
        setInvalid(name, false);
      }

      if (!phone || phone.value.trim().length < 8) {
        ok = false;
        setInvalid(phone, true);
      } else {
        setInvalid(phone, false);
      }

      if (!postcode || !postPattern.test(postcode.value.trim())) {
        ok = false;
        setInvalid(postcode, true);
      } else {
        setInvalid(postcode, false);
      }

      if (!ok) {
        e.preventDefault();
      }
    });
  }

  var drivewayCalc = document.getElementById('drivewayCalc');
  var calcReset = document.getElementById('calcReset');
  var calcResult = document.getElementById('calcResult');
  var calcRange = calcResult ? calcResult.querySelector('.result-range') : null;
  var calcMeta = calcResult ? calcResult.querySelector('.result-meta') : null;
  var calcWhatsapp = document.getElementById('calcWhatsapp');
  var blendPreview = document.getElementById('blendPreview');
  var blendTag = document.getElementById('blendTag');
  var blendDescription = document.getElementById('blendDescription');

  function gbp(value) {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
  }

  function makeWhatsappLink(low, high, area) {
    var text = 'Hi ResinPro Cheshire, I used your calculator. Area: ' + area.toFixed(1) + 'm2. Estimated range: ' + gbp(low) + ' to ' + gbp(high) + '. Please can I get a survey?';
    return 'https://wa.me/447700900000?text=' + encodeURIComponent(text);
  }

  function calculateEstimate(length, width, surface, design, access) {
    var area = length * width;

    var rateLow = 72;
    var rateHigh = 98;

    var baseLow = area * rateLow;
    var baseHigh = area * rateHigh;

    var factor = surface * design * access;

    var adjustedLow = baseLow * factor;
    var adjustedHigh = baseHigh * factor;

    var mobilization = area < 30 ? 450 : 0;
    adjustedLow += mobilization;
    adjustedHigh += mobilization;

    return {
      area: area,
      low: Math.round(adjustedLow),
      high: Math.round(adjustedHigh)
    };
  }

  if (drivewayCalc && calcRange && calcMeta && calcWhatsapp) {
    drivewayCalc.addEventListener('submit', function (e) {
      e.preventDefault();

      var lengthField = document.getElementById('length');
      var widthField = document.getElementById('width');
      var surfaceField = document.getElementById('surface');
      var designField = document.getElementById('design');
      var accessField = document.getElementById('access');

      var length = parseFloat(lengthField.value);
      var width = parseFloat(widthField.value);
      var surface = parseFloat(surfaceField.value);
      var design = parseFloat(designField.value);
      var access = parseFloat(accessField.value);

      var valid = true;

      if (!length || length <= 0) {
        setInvalid(lengthField, true);
        valid = false;
      } else {
        setInvalid(lengthField, false);
      }

      if (!width || width <= 0) {
        setInvalid(widthField, true);
        valid = false;
      } else {
        setInvalid(widthField, false);
      }

      if (!valid) {
        calcRange.textContent = 'Please enter valid dimensions';
        calcMeta.textContent = 'Check length and width in metres.';
        calcWhatsapp.classList.add('is-disabled');
        calcWhatsapp.setAttribute('aria-disabled', 'true');
        calcWhatsapp.setAttribute('href', '#');
        return;
      }

      var result = calculateEstimate(length, width, surface, design, access);

      calcRange.textContent = gbp(result.low) + ' - ' + gbp(result.high);
      calcMeta.textContent = 'Based on approximately ' + result.area.toFixed(1) + 'm2 including typical prep and installation factors.';

      calcWhatsapp.classList.remove('is-disabled');
      calcWhatsapp.removeAttribute('aria-disabled');
      calcWhatsapp.setAttribute('href', makeWhatsappLink(result.low, result.high, result.area));
      calcWhatsapp.setAttribute('target', '_blank');
      calcWhatsapp.setAttribute('rel', 'noopener noreferrer');
    });

    calcReset.addEventListener('click', function () {
      drivewayCalc.reset();
      ['length', 'width', 'surface', 'design', 'access'].forEach(function (id) {
        var el = document.getElementById(id);
        setInvalid(el, false);
      });
      calcRange.textContent = 'Enter values to calculate';
      calcMeta.textContent = 'Based on a typical resin-bound install range in Cheshire.';
      calcWhatsapp.classList.add('is-disabled');
      calcWhatsapp.setAttribute('aria-disabled', 'true');
      calcWhatsapp.setAttribute('href', '#');
    });
  }

  if (blendPreview && blendTag && blendDescription) {
    document.querySelectorAll('.blend-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var blend = btn.getAttribute('data-blend');
        var label = btn.getAttribute('data-label');
        var description = btn.getAttribute('data-description');

        blendPreview.setAttribute('data-blend', blend || 'amber');
        blendTag.textContent = label || 'Amber Arc';
        blendDescription.textContent = description || '';

        document.querySelectorAll('.blend-btn').forEach(function (item) {
          item.classList.remove('is-active');
        });
        btn.classList.add('is-active');
      });
    });
  }

  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2');
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2').forEach(function (el) {
      el.classList.add('in');
    });
  }
})();
