document.addEventListener('DOMContentLoaded', () => {

  /* === Header === */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  /* === Mobile menu === */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  if(burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav-a').forEach(a =>
      a.addEventListener('click', () => { nav.classList.remove('open'); })
    );
  }

  /* === FAQ Accordion === */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    
    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-a').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* === Form Validation & Submit (Supports Multiple Forms) === */
  function okPhone(v) { return /^05\d{8}$/.test(v.replace(/[-\s]/g, '')); }

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

    // Remove error class on input
    if(fName) fName.addEventListener('input', () => fName.closest('.field')?.classList.remove('bad'));
    if(fPhone) fPhone.addEventListener('input', () => fPhone.closest('.field')?.classList.remove('bad'));
    if(fInterest) fInterest.addEventListener('change', () => fInterest.closest('.field')?.classList.remove('bad'));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      
      if (fName && (!fName.value.trim() || fName.value.trim().length < 2)) { fName.closest('.field').classList.add('bad'); ok = false; }
      if (fPhone && !okPhone(fPhone.value.trim())) { fPhone.closest('.field').classList.add('bad'); ok = false; }
      if (fInterest && !fInterest.value) { fInterest.closest('.field').classList.add('bad'); ok = false; }
      if (fPrivacy && !fPrivacy.checked) { ok = false; alert('יש לאשר את מדיניות הפרטיות'); }

      if (!ok) return;

      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;

      // Simulate API call
      setTimeout(() => {
        btnSubmit.classList.remove('loading');
        btnSubmit.disabled = false;
        
        if(sucNameEl && fName) sucNameEl.textContent = fName.value.trim();
        if(successBox) successBox.classList.add('show');
      }, 1400);
    });

    if(btnClose) {
      btnClose.addEventListener('click', () => {
        successBox.classList.remove('show');
        form.reset();
      });
    }
  });

});
