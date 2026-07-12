document.addEventListener('DOMContentLoaded', () => {

  /* === Header scroll === */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* === Mobile menu === */
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.nav-a').forEach(a =>
    a.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); })
  );

  /* === Scroll‑to‑form helper === */
  function goToForm(cat) {
    const el = document.getElementById('contact');
    const sel = document.getElementById('f-interest');
    if (cat && sel) {
      sel.value = cat;
      sel.dispatchEvent(new Event('change'));
      sel.closest('.field')?.classList.remove('bad');
    }
    el.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => sel?.focus(), 700);
  }

  /* === Hero quick search === */
  const heroSel = document.getElementById('search-input');
  document.getElementById('btn-hero').addEventListener('click', () => {
    if (heroSel.value) {
      goToForm(heroSel.value);
    } else {
      heroSel.focus();
      heroSel.style.borderColor = 'var(--danger)';
      setTimeout(() => heroSel.style.borderColor = '', 800);
    }
  });

  document.querySelectorAll('.qt').forEach(btn =>
    btn.addEventListener('click', () => {
      const v = btn.dataset.v;
      heroSel.value = v;
      goToForm(v);
    })
  );

  /* === Expert cards accordion === */
  document.querySelectorAll('.e-card').forEach(card => {
    card.addEventListener('click', () => {
      const wasActive = card.classList.contains('active');
      document.querySelectorAll('.e-card').forEach(c => c.classList.remove('active'));
      if (!wasActive) card.classList.add('active');
    });
  });

  /* === Coverage card click → highlight + scroll === */
  const covCards = document.querySelectorAll('.cov-card');
  covCards.forEach(card => {
    card.addEventListener('click', () => {
      covCards.forEach(c => c.classList.remove('on'));
      card.classList.add('on');
      goToForm(card.dataset.cat);
    });
  });

  /* === Form validation === */
  const form      = document.getElementById('lead-form');
  const btnSubmit = document.getElementById('btn-submit');
  const success   = document.getElementById('success');
  const fName     = document.getElementById('f-name');
  const fPhone    = document.getElementById('f-phone');
  const fInterest = document.getElementById('f-interest');

  [fName, fPhone].forEach(i => i.addEventListener('input',  () => i.closest('.field')?.classList.remove('bad')));
  fInterest.addEventListener('change', () => fInterest.closest('.field')?.classList.remove('bad'));

  function okPhone(v) { return /^05\d{8}$/.test(v.replace(/[-\s]/g, '')); }

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    if (!fName.value.trim() || fName.value.trim().length < 2) { fName.closest('.field').classList.add('bad'); ok = false; }
    if (!okPhone(fPhone.value.trim()))                         { fPhone.closest('.field').classList.add('bad'); ok = false; }
    if (!fInterest.value)                                      { fInterest.closest('.field').classList.add('bad'); ok = false; }

    if (!ok) return;

    btnSubmit.classList.add('loading');
    btnSubmit.disabled = true;

    setTimeout(() => {
      btnSubmit.classList.remove('loading');
      btnSubmit.disabled = false;
      document.getElementById('suc-name').textContent  = fName.value.trim();
      document.getElementById('suc-phone').textContent = fPhone.value.trim();
      success.classList.add('show');
    }, 1400);
  });

  document.getElementById('btn-close').addEventListener('click', () => {
    success.classList.remove('show');
    form.reset();
    covCards.forEach(c => c.classList.remove('on'));
  });

});
