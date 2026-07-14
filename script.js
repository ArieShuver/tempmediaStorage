document.addEventListener('DOMContentLoaded', () => {
  /* === Header === */
  const header = document.getElementById('site-header');
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        header.style.boxShadow = window.scrollY > 40 ? '0 4px 10px rgba(0,0,0,0.1)' : 'none';
        scrollTicking = false;
      });
    }
  }, {passive: true});

  /* === Typewriter Effect === */
  const typedTextSpan = document.querySelector('.typewriter');
  const cursorSpan = document.querySelector('.cursor');

  if (typedTextSpan && cursorSpan) {
    const textArray = [
      'ביטחון מלא למשפחה.',
      'חיסכון אדיר במשכנתא.',
      'פנסיה שעובדת בשבילך.',
      'תנאים ששמורים לגדולים.',
      'ליווי צמוד ברגעי האמת.'
    ];
    const typingDelay = 80;
    const erasingDelay = 40;
    const newTextDelay = 2500;
    let textArrayIndex = 0;
    let charIndex = typedTextSpan.textContent.length;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        cursorSpan.classList.remove('typing');
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        cursorSpan.classList.remove('typing');
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 500);
      }
    }

    setTimeout(erase, newTextDelay);
  }

  /* === Mobile menu === */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  const navLinks = document.querySelectorAll('.nav-a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(otherLink => otherLink.classList.remove('active'));
      link.classList.add('active');
      nav.classList.remove('open');
    });
  });

  /* === FAQ Accordion === */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');

    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* === Form Validation & Submit (Supports Multiple Forms) === */
  function okPhone(v) {
    return /^05\d{8}$/.test(v.replace(/[-\s]/g, ''));
  }

  const forms = document.querySelectorAll('.lead-form');

  forms.forEach(form => {
    const fName = form.querySelector('.f-name');
    const fPhone = form.querySelector('.f-phone');
    const fInterest = form.querySelector('.f-interest');
    const fPrivacy = form.querySelector('#privacy');
    const btnSubmit = form.querySelector('.btn-submit');
    const successBox = form.closest('.lead-box, .cta-box').querySelector('.success');
    const sucNameEl = successBox?.querySelector('.suc-name');
    const btnClose = successBox?.querySelector('.btn-close');

    if (fName) fName.addEventListener('input', () => fName.closest('.field')?.classList.remove('bad'));
    if (fPhone) fPhone.addEventListener('input', () => fPhone.closest('.field')?.classList.remove('bad'));
    if (fInterest) fInterest.addEventListener('change', () => fInterest.closest('.field')?.classList.remove('bad'));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;

      if (fName && (!fName.value.trim() || fName.value.trim().length < 2)) {
        fName.closest('.field').classList.add('bad');
        ok = false;
      }
      if (fPhone && !okPhone(fPhone.value.trim())) {
        fPhone.closest('.field').classList.add('bad');
        ok = false;
      }
      if (fInterest && !fInterest.value) {
        fInterest.closest('.field').classList.add('bad');
        ok = false;
      }
      if (fPrivacy && !fPrivacy.checked) {
        ok = false;
        alert('יש לאשר את מדיניות הפרטיות');
      }

      if (!ok) return;

      // The form will now submit to web3forms, we just show a loading state.
      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;
      
      const formData = new FormData(form);
      const object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        if (response.status == 200) {
          if (sucNameEl && fName) sucNameEl.textContent = fName.value.trim();
          if (successBox) successBox.classList.add('show');
        } else {
          console.error('Form submission failed:', await response.json());
          alert('אופס! משהו השתבש בשליחה. אנא נסה שוב.');
        }
      })
      .catch(error => {
        console.error('Form submission error:', error);
        alert('אופס! משהו השתבש בשליחה. אנא נסה שוב.');
      })
      .finally(() => {
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;
      });
    });

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        successBox.classList.remove('show');
        form.reset();
      });
    }
  });

  /* === Fade-in on Scroll === */
  const fadeInElements = document.querySelectorAll('.fade-in-element');

  if (fadeInElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px' // Trigger a little before it's fully in view
    });

    fadeInElements.forEach(el => observer.observe(el));
  }

  /* === Lazy Load UserWay Accessibility Widget on user interaction === */
  let userwayLoaded = false;

  function loadUserWayWidget(e) {
    // If it's a click, prevent default link behavior
    if (e && e.type === 'click') {
      e.preventDefault();
    }

    // Prevent multiple loads
    if (userwayLoaded || window.userway) {
      return;
    }
    userwayLoaded = true;

    var _userway_config = {
      color: '#41B37C',
      position: 5,
      mobile_position: 3,
      account: 'j1gIuV8Npl'
    };
    window._userway_config = _userway_config;

    const userwayScript = document.createElement('script');
    userwayScript.src = 'https://cdn.userway.org/widget.js';
    document.body.appendChild(userwayScript);
  }

  window.addEventListener('mousemove', loadUserWayWidget, { once: true });
  window.addEventListener('touchstart', loadUserWayWidget, { once: true });
  const loadWidgetButton = document.getElementById('load-accessibility-widget');
  if (loadWidgetButton) loadWidgetButton.addEventListener('click', loadUserWayWidget);
});
