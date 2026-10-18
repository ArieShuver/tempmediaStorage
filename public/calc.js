function initCalc() {
  const principalInput = document.getElementById('calc-principal');
  const monthlyInput = document.getElementById('calc-monthly');
  const rateInput = document.getElementById('calc-rate');
  const yearsInput = document.getElementById('calc-years');
  const yearsDisplay = document.getElementById('years-display');

  const toggleTax = document.getElementById('toggle-tax');
  const toggleFees = document.getElementById('toggle-fees');
  const taxGroup = document.getElementById('tax-group');
  const feeAccumGroup = document.getElementById('fee-accum-group');
  const feeDepositGroup = document.getElementById('fee-deposit-group');
  const feePromoMessage = document.getElementById('fee-promo-message');

  const taxInput = document.getElementById('calc-tax');
  const feeAccumInput = document.getElementById('calc-fee-accum');
  const feeDepositInput = document.getElementById('calc-fee-deposit');

  const toggleInflation = document.getElementById('toggle-inflation');
  const inflationGroup = document.getElementById('inflation-group');
  const calcInflation = document.getElementById('calc-inflation');

  const calcFreq = document.getElementById('calc-freq');

  // Sliders
  const sliderPrincipal = document.getElementById('slider-principal');
  const sliderMonthly = document.getElementById('slider-monthly');
  const sliderYears = document.getElementById('slider-years');
  const sliderRate = document.getElementById('slider-rate');
  const sliderInflation = document.getElementById('slider-inflation');
  const sliderTax = document.getElementById('slider-tax');
  const sliderFeeAccum = document.getElementById('slider-fee-accum');
  const sliderFeeDeposit = document.getElementById('slider-fee-deposit');

  const resFinal = document.getElementById('res-final');
  const resDeposits = document.getElementById('res-deposits');
  const resProfit = document.getElementById('res-profit');
  const resFees = document.getElementById('res-fees');
  const resTax = document.getElementById('res-tax');
  const boxFeesContainer = document.getElementById('box-fees-container');
  const boxTaxContainer = document.getElementById('box-tax-container');
  const resInflation = document.getElementById('res-inflation');
  const boxInflationContainer = document.getElementById('box-inflation-container');

  const tableBody = document.getElementById('yearly-table-body');
  const colFeesHeaders = document.querySelectorAll('.col-fees');
  const colTaxHeaders = document.querySelectorAll('.col-tax');

  let compoundChart = null;
  const allInputs = [
    principalInput, monthlyInput, rateInput, yearsInput,
    taxInput, feeAccumInput, feeDepositInput, toggleTax, toggleFees,
    calcFreq, calcInflation, toggleInflation,
    sliderPrincipal, sliderMonthly, sliderYears, sliderRate, sliderInflation,
    sliderTax, sliderFeeAccum, sliderFeeDeposit
  ].filter(Boolean);

  // Track if user has explicitly interacted with inputs
  let userTouchedYears = false;
  let userTouchedRate = false;

  if (yearsInput) {
    yearsInput.addEventListener('input', () => { userTouchedYears = true; });
    yearsInput.addEventListener('focus', () => { userTouchedYears = true; });
  }
  if (sliderYears) {
    sliderYears.addEventListener('input', () => { userTouchedYears = true; });
  }
  if (rateInput) {
    rateInput.addEventListener('input', () => { userTouchedRate = true; });
    rateInput.addEventListener('focus', () => { userTouchedRate = true; });
  }
  if (sliderRate) {
    sliderRate.addEventListener('input', () => { userTouchedRate = true; });
  }

  function autoSuggestIfVirgin() {
    const pVal = parseFloat(principalInput ? principalInput.value : 0) || 0;
    const mVal = parseFloat(monthlyInput ? monthlyInput.value : 0) || 0;
    if (pVal > 0 || mVal > 0) {
      if (!userTouchedYears && yearsInput && yearsInput.value === '' && document.activeElement !== yearsInput) {
        yearsInput.value = '10';
        if (sliderYears) sliderYears.value = 10;
        updateYearsDisplay();
      }
      if (!userTouchedRate && rateInput && rateInput.value === '' && document.activeElement !== rateInput) {
        rateInput.value = '7';
        if (sliderRate) sliderRate.value = 7;
      }
    }
  }

  // Sync inputs and sliders
  function syncInputs(numInput, slider) {
    if (!numInput || !slider) return;
    numInput.addEventListener('input', () => {
      slider.value = numInput.value || 0;
      calculate();
    });
    slider.addEventListener('input', () => {
      numInput.value = slider.value;
      calculate();
    });
  }
  syncInputs(principalInput, sliderPrincipal);
  syncInputs(monthlyInput, sliderMonthly);
  syncInputs(yearsInput, sliderYears);
  syncInputs(rateInput, sliderRate);
  syncInputs(calcInflation, sliderInflation);
  syncInputs(taxInput, sliderTax);
  syncInputs(feeAccumInput, sliderFeeAccum);
  syncInputs(feeDepositInput, sliderFeeDeposit);

  if (principalInput) principalInput.addEventListener('input', autoSuggestIfVirgin);
  if (monthlyInput) monthlyInput.addEventListener('input', autoSuggestIfVirgin);

  function handleToggles() {
    if (toggleTax && taxGroup) {
      taxGroup.style.display = toggleTax.checked ? '' : 'none';
      if (boxTaxContainer) boxTaxContainer.style.display = toggleTax.checked ? '' : 'none';
    }
    if (toggleFees && feeAccumGroup && feeDepositGroup) {
      feeAccumGroup.style.display = toggleFees.checked ? '' : 'none';
      feeDepositGroup.style.display = toggleFees.checked ? '' : 'none';
      if (feePromoMessage) feePromoMessage.style.display = toggleFees.checked ? '' : 'none';
      if (boxFeesContainer) boxFeesContainer.style.display = toggleFees.checked ? '' : 'none';
    }
    if (toggleInflation && inflationGroup) {
      inflationGroup.style.display = toggleInflation.checked ? 'block' : 'none';
      if (boxInflationContainer) boxInflationContainer.style.display = toggleInflation.checked ? '' : 'none';
    }
    calculate();
  }

  if (toggleTax) toggleTax.addEventListener('change', handleToggles);
  if (toggleFees) toggleFees.addEventListener('change', handleToggles);
  if (toggleInflation) toggleInflation.addEventListener('change', handleToggles);

  // Format currency
  function formatMoney(amount) {
    return '₪' + amount.toLocaleString('he-IL', { maximumFractionDigits: 0 });
  }

  // Animate number count-up
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      obj.textContent = formatMoney(currentVal);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Update years display from slider
  function updateYearsDisplay() {
    if (yearsDisplay && yearsInput) yearsDisplay.textContent = yearsInput.value || '0';
  }

  const resultsSection = document.getElementById('calc-results-section');
  const emptyState = document.getElementById('calc-empty-state');

  // Calculate and draw chart
  function calculate() {
    const P = Math.min(Math.max(parseFloat(principalInput ? principalInput.value : 0) || 0, 0), 100000000);
    const PMT = Math.min(Math.max(parseFloat(monthlyInput ? monthlyInput.value : 0) || 0, 0), 10000000);
    const rawRate = rateInput ? rateInput.value.trim() : '';
    const rawYears = yearsInput ? yearsInput.value.trim() : '';
    const r = rawRate === '' ? 0 : Math.min(Math.max(parseFloat(rawRate) || 0, 0), 100);
    const t = rawYears === '' ? 0 : Math.min(Math.max(parseInt(rawYears) || 0, 0), 120);

    const hasData = (P > 0 || PMT > 0 || t > 0);

    if (!hasData) {
      if (resultsSection) {
        resultsSection.style.setProperty('display', 'none', 'important');
        resultsSection.classList.add('is-hidden');
      }
      if (emptyState) {
        emptyState.style.setProperty('display', '', '');
        emptyState.classList.remove('is-hidden');
      }
      return;
    }

    // Money or years entered -> empty state completely disappears, results show up
    if (emptyState) {
      emptyState.style.setProperty('display', 'none', 'important');
      emptyState.classList.add('is-hidden');
    }
    if (resultsSection) {
      resultsSection.style.setProperty('display', 'block', 'important');
      resultsSection.classList.remove('is-hidden');
    }

    let taxRate = 0;
    if (toggleTax && toggleTax.checked && taxInput) {
      taxRate = (parseFloat(taxInput.value) || 0) / 100;
    }

    let monthlyFeeAccumRate = 0;
    let feeDepositRate = 0;
    if (toggleFees && toggleFees.checked) {
      if (feeAccumInput) monthlyFeeAccumRate = ((parseFloat(feeAccumInput.value) || 0) / 100) / 12;
      if (feeDepositInput) feeDepositRate = (parseFloat(feeDepositInput.value) || 0) / 100;
    }

    let inflationRate = 0;
    if (toggleInflation && toggleInflation.checked && calcInflation) {
      inflationRate = (parseFloat(calcInflation.value) || 0) / 100;
    }

    const freq = parseInt(calcFreq ? calcFreq.value : 12);

    const monthlyRate = (r / 100) / 12;
    const months = t * 12;

    let labels = [];
    let dataCompound = [];
    let dataRegular = [];

    let currentCompound = P;
    let currentRegular = P;

    labels.push('0');
    dataCompound.push(P);
    dataRegular.push(P);

    let totalFeesDeducted = 0;
    let tableHTML = '';
    window.tableDataCache = [];

    for (let m = 1; m <= months; m++) {
      let currentDeposit = 0;
      if (freq === 12) {
        currentDeposit = PMT;
      } else if (freq === 1 && m % 12 === 0) {
        currentDeposit = PMT;
      }

      if (toggleFees && toggleFees.checked) {
        let feeDepositThisMonth = currentDeposit * feeDepositRate;
        totalFeesDeducted += feeDepositThisMonth;
        currentDeposit -= feeDepositThisMonth;
      }

      currentCompound += currentDeposit;
      if (freq === 12) {
        currentRegular += PMT;
      } else if (freq === 1 && m % 12 === 0) {
        currentRegular += PMT;
      }

      currentCompound *= (1 + monthlyRate);

      let feeAccumThisMonth = currentCompound * monthlyFeeAccumRate;
      totalFeesDeducted += feeAccumThisMonth;
      currentCompound -= feeAccumThisMonth;

      if (m % 12 === 0) {
        let postTaxBalance = currentCompound;
        const profitAtN = currentCompound - currentRegular;
        let taxDeductedThisYear = 0;
        if (profitAtN > 0 && taxRate > 0) {
          taxDeductedThisYear = profitAtN * taxRate;
          postTaxBalance = currentCompound - taxDeductedThisYear;
        }

        const year = m / 12;
        let inflationDiscount = Math.pow(1 + inflationRate, year);

        let displayDeposits = currentRegular;
        let displayBalance = postTaxBalance / inflationDiscount;
        let displayProfit = displayBalance - displayDeposits;
        let displayFees = totalFeesDeducted / inflationDiscount;
        let displayTax = taxDeductedThisYear / inflationDiscount;

        labels.push(year.toString());
        dataCompound.push(Math.round(displayBalance));
        dataRegular.push(Math.round(displayDeposits));

        tableHTML += `
          <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
            <td style="padding: 12px;">${year}</td>
            <td style="padding: 12px;">${formatMoney(Math.round(displayDeposits))}</td>
            <td style="padding: 12px; color: var(--green);">${formatMoney(Math.round(displayProfit))}</td>
            <td class="col-fees" style="padding: 12px; color: #F5A623; display: ${toggleFees && toggleFees.checked ? 'table-cell' : 'none'};">${formatMoney(Math.round(displayFees))}</td>
            <td class="col-tax" style="padding: 12px; color: #E74C3C; display: ${toggleTax && toggleTax.checked ? 'table-cell' : 'none'};">${formatMoney(Math.round(displayTax))}</td>
            <td style="padding: 12px; font-weight: 600; color: var(--primary);">${formatMoney(Math.round(displayBalance))}</td>
          </tr>
        `;

        window.tableDataCache.push({
          year: year,
          deposits: Math.round(displayDeposits),
          profit: Math.round(displayProfit),
          fees: Math.round(displayFees),
          tax: Math.round(displayTax),
          balance: Math.round(displayBalance)
        });
      }
    }

    const finalAmount = dataCompound[dataCompound.length - 1];
    const totalDeposits = dataRegular[dataRegular.length - 1];
    const totalProfit = finalAmount - totalDeposits;

    let finalTaxDeducted = 0;
    const grossProfit = currentCompound - currentRegular;
    if (grossProfit > 0 && taxRate > 0) {
      finalTaxDeducted = grossProfit * taxRate;
    }

    let finalInflationDiscount = Math.pow(1 + inflationRate, t);
    let finalDisplayFees = totalFeesDeducted / finalInflationDiscount;
    let finalDisplayTax = finalTaxDeducted / finalInflationDiscount;

    let postTaxFinalNominal = currentCompound - finalTaxDeducted;
    let finalInflationDeducted = postTaxFinalNominal - (postTaxFinalNominal / finalInflationDiscount);

    const currentFinal = parseInt(resFinal.textContent.replace(/[^0-9]/g, '')) || 0;
    const currentDeposits = parseInt(resDeposits.textContent.replace(/[^0-9]/g, '')) || 0;
    const currentProfit = parseInt(resProfit.textContent.replace(/[^0-9]/g, '')) || 0;

    animateValue(resFinal, currentFinal, finalAmount, 500);
    animateValue(resDeposits, currentDeposits, totalDeposits, 500);
    animateValue(resProfit, currentProfit, totalProfit, 500);

    if (resFees) {
      const currentFees = parseInt(resFees.textContent.replace(/[^0-9]/g, '')) || 0;
      animateValue(resFees, currentFees, Math.round(finalDisplayFees), 500);
    }
    if (resTax) {
      const currentTax = parseInt(resTax.textContent.replace(/[^0-9]/g, '')) || 0;
      animateValue(resTax, currentTax, Math.round(finalDisplayTax), 500);
    }
    if (resInflation) {
      const currentInflation = parseInt(resInflation.textContent.replace(/[^0-9]/g, '')) || 0;
      animateValue(resInflation, currentInflation, Math.round(finalInflationDeducted), 500);
    }

    if (tableBody) {
      tableBody.innerHTML = tableHTML;
    }
    colFeesHeaders.forEach(el => el.style.display = (toggleFees && toggleFees.checked) ? '' : 'none');
    colTaxHeaders.forEach(el => el.style.display = (toggleTax && toggleTax.checked) ? '' : 'none');

    try {
      updateChart(labels, dataCompound, dataRegular);
    } catch (err) {
      console.error('Error in updateChart:', err);
      if (!window.alertedChartErr) { alert('Chart error: ' + err.message); window.alertedChartErr = true; }
    }
    updateUrlParams();
  }

  function updateChart(labels, compound, regular) {
    const ctx = document.getElementById('compoundChart').getContext('2d');

    if (compoundChart) {
      compoundChart.destroy();
    }

    if (Chart.defaults && Chart.defaults.font) {
      Chart.defaults.font.family = "'Heebo', sans-serif";
    } else if (Chart.defaults && Chart.defaults.global) {
      Chart.defaults.global.defaultFontFamily = "'Heebo', sans-serif";
    }
    if (Chart.defaults) {
      Chart.defaults.color = '#334155';
    }

    compoundChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'ריבית דריבית',
            data: compound,
            borderColor: '#41B37C',
            backgroundColor: 'rgba(65, 179, 124, 0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          },
          {
            label: 'סך הפקדות (ללא ריבית)',
            data: regular,
            borderColor: '#F5A623',
            backgroundColor: 'transparent',
            borderWidth: 3,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              font: {
                size: 14,
                weight: '600'
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '₪' + context.parsed.y.toLocaleString('he-IL');
                }
                return label;
              },
              title: function (context) {
                return 'שנה ' + context[0].label;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'שנים',
              font: {
                size: 14,
                weight: '600'
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            min: 0,
            suggestedMax: 1000,
            title: {
              display: true,
              text: 'סכום כולל (₪)',
              font: {
                size: 14,
                weight: '600'
              }
            },
            ticks: {
              callback: function (value, index, values) {
                if (value < 0) return '';
                if (value >= 1000000) {
                  return '₪' + (value / 1000000).toFixed(1) + 'M';
                }
                if (value >= 1000) {
                  return '₪' + (value / 1000).toFixed(0) + 'K';
                }
                return '₪' + value;
              }
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }

  allInputs.forEach(input => {
    // Avoid double attaching if handled by syncInputs
    if (input && !input.id.startsWith('slider-') && input !== principalInput && input !== monthlyInput && input !== rateInput && input !== yearsInput && input !== calcInflation) {
      input.addEventListener('input', calculate);
    }
  });
  yearsInput.addEventListener('input', updateYearsDisplay);

  function updateUrlParams() {
    // Keep URL clean, do not replace browser history during normal calculation
  }

  function getShareUrl() {
    try {
      const p = principalInput ? principalInput.value : '';
      const m = monthlyInput ? monthlyInput.value : '';
      const y = yearsInput ? yearsInput.value : '';
      const r = rateInput ? rateInput.value : '';
      const inf = toggleInflation && toggleInflation.checked ? (calcInflation ? calcInflation.value : '2.5') : null;
      const tax = toggleTax && toggleTax.checked ? (taxInput ? taxInput.value : '25') : null;
      const fees = toggleFees && toggleFees.checked ? (feeAccumInput ? feeAccumInput.value : '0.6') : null;

      const params = new URLSearchParams();
      if (p && p !== '0') params.set('p', p);
      if (m && m !== '0') params.set('m', m);
      if (y && y !== '0') params.set('y', y);
      if (r && r !== '0') params.set('r', r);
      if (inf) params.set('inf', inf);
      if (tax) params.set('tax', tax);
      if (fees) params.set('fees', fees);

      const qs = params.toString();
      return window.location.origin + window.location.pathname + (qs ? '?' + qs : '');
    } catch (e) {
      return window.location.href;
    }
  }

  function loadFromUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      let changed = false;
      if (params.has('p') && principalInput) {
        principalInput.value = params.get('p');
        if (sliderPrincipal) sliderPrincipal.value = params.get('p');
        changed = true;
      }
      if (params.has('m') && monthlyInput) {
        monthlyInput.value = params.get('m');
        if (sliderMonthly) sliderMonthly.value = params.get('m');
        changed = true;
      }
      if (params.has('y') && yearsInput) {
        yearsInput.value = params.get('y');
        if (sliderYears) sliderYears.value = params.get('y');
        changed = true;
      }
      if (params.has('r') && rateInput) {
        rateInput.value = params.get('r');
        if (sliderRate) sliderRate.value = params.get('r');
        changed = true;
      }
      if (params.has('inf')) {
        if (toggleInflation) toggleInflation.checked = true;
        if (calcInflation) calcInflation.value = params.get('inf');
        if (sliderInflation) sliderInflation.value = params.get('inf');
        changed = true;
      }
      if (params.has('tax')) {
        if (toggleTax) toggleTax.checked = true;
        if (taxInput) taxInput.value = params.get('tax');
        if (sliderTax) sliderTax.value = params.get('tax');
        changed = true;
      }
      if (params.has('fees')) {
        if (toggleFees) toggleFees.checked = true;
        if (feeAccumInput) feeAccumInput.value = params.get('fees');
        if (sliderFeeAccum) sliderFeeAccum.value = params.get('fees');
        changed = true;
      }
      return changed;
    } catch (e) {
      return false;
    }
  }

  // Preset Buttons Handling
  const presetButtons = document.querySelectorAll('.preset-btn');
  const presetsConfig = {
    child: { p: 0, m: 200, y: 18, r: 8, tax: false, fees: true, inf: false },
    sp500: { p: 50000, m: 3000, y: 25, r: 9, tax: true, fees: true, inf: true },
    million: { p: 10000, m: 2500, y: 16, r: 8, tax: true, fees: true, inf: false },
    conservative: { p: 100000, m: 1000, y: 15, r: 5, tax: false, fees: true, inf: true }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const conf = presetsConfig[presetKey];
      if (!conf) return;

      presetButtons.forEach(b => {
        b.style.background = 'rgba(65, 179, 124, 0.1)';
        b.style.color = 'var(--primary)';
      });
      btn.style.background = 'var(--green)';
      btn.style.color = '#fff';

      if (principalInput) {
        principalInput.value = conf.p;
        if (sliderPrincipal) sliderPrincipal.value = conf.p;
      }
      if (monthlyInput) {
        monthlyInput.value = conf.m;
        if (sliderMonthly) sliderMonthly.value = conf.m;
      }
      if (yearsInput) {
        yearsInput.value = conf.y;
        if (sliderYears) sliderYears.value = conf.y;
      }
      if (rateInput) {
        rateInput.value = conf.r;
        if (sliderRate) sliderRate.value = conf.r;
      }
      if (toggleTax) toggleTax.checked = !!conf.tax;
      if (toggleFees) toggleFees.checked = !!conf.fees;
      if (toggleInflation) toggleInflation.checked = !!conf.inf;

      userTouchedYears = true;
      userTouchedRate = true;
      updateYearsDisplay();
      handleToggles();
    });
  });

  // Clear URL query parameters from earlier runs so calculator starts clean
  if (window.location.search) {
    try {
      window.history.replaceState(null, '', window.location.pathname);
    } catch (e) {}
  }

  // Initialize completely zeroed out
  if (principalInput) principalInput.value = '';
  if (monthlyInput) monthlyInput.value = '';
  if (yearsInput) yearsInput.value = '';
  if (rateInput) rateInput.value = '';
  if (sliderPrincipal) sliderPrincipal.value = 0;
  if (sliderMonthly) sliderMonthly.value = 0;
  if (sliderYears) sliderYears.value = 0;
  if (sliderRate) sliderRate.value = 0;
  if (toggleTax) toggleTax.checked = false;
  if (toggleFees) toggleFees.checked = false;
  if (toggleInflation) toggleInflation.checked = false;

  updateYearsDisplay();
  handleToggles();

  const toggleTableBtn = document.getElementById('toggle-table-btn');
  const toggleTableText = document.getElementById('toggle-table-text');
  const tableWrapper = document.getElementById('yearly-table-wrapper');

  if (toggleTableBtn && tableWrapper && toggleTableText) {
    toggleTableBtn.addEventListener('click', () => {
      if (tableWrapper.style.display === 'none') {
        tableWrapper.style.display = 'block';
        toggleTableText.textContent = 'הסתר טבלה';
      } else {
        tableWrapper.style.display = 'none';
        toggleTableText.textContent = 'הצג פירוט בטבלה';
      }
    });
  }

  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareUrl = getShareUrl();
      const shareData = {
        title: 'חישוב ריבית דריבית מותאם אישית',
        text: 'בדקו את סימולציית הריבית דריבית במחשבון של משה שובר:',
        url: shareUrl
      };

      if (navigator.share && /mobile|android|iphone/i.test(navigator.userAgent)) {
        navigator.share(shareData).catch(() => { });
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          const textEl = shareBtn.querySelector('.share-text');
          const originalText = textEl ? textEl.textContent : 'שתפו את הקסם';
          if (textEl) textEl.textContent = 'הקישור הועתק בהצלחה! 📋';
          shareBtn.classList.add('copied');
          setTimeout(() => {
            if (textEl) textEl.textContent = originalText;
            shareBtn.classList.remove('copied');
          }, 3000);
        }).catch(console.error);
      }
    });
  }

  const exportCsvBtn = document.getElementById('export-csv-btn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      if (!window.tableDataCache) return;
      let csvContent = "\uFEFFשנה,סך הפקדות,רווח צבור,דמי ניהול שנגבו,מס צפוי במשיכה,יתרה סופית (נטו)\n";
      window.tableDataCache.forEach(row => {
        csvContent += `${row.year},${row.deposits},${row.profit},${row.fees},${row.tax},${row.balance}\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "compound_interest_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      userTouchedYears = false;
      userTouchedRate = false;
      if (principalInput) principalInput.value = '';
      if (sliderPrincipal) sliderPrincipal.value = 0;
      if (monthlyInput) monthlyInput.value = '';
      if (sliderMonthly) sliderMonthly.value = 0;
      if (rateInput) rateInput.value = '';
      if (sliderRate) sliderRate.value = 0;
      if (yearsInput) yearsInput.value = '';
      if (sliderYears) sliderYears.value = 0;
      updateYearsDisplay();
      if (calcFreq) calcFreq.value = "12";
      if (toggleTax) toggleTax.checked = false;
      if (toggleFees) toggleFees.checked = false;
      if (typeof toggleInflation !== 'undefined' && toggleInflation) toggleInflation.checked = false;
      if (taxInput) taxInput.value = 25;
      if (sliderTax) sliderTax.value = 25;
      if (feeAccumInput) feeAccumInput.value = 0.6;
      if (sliderFeeAccum) sliderFeeAccum.value = 0.6;
      if (feeDepositInput) feeDepositInput.value = 0;
      if (sliderFeeDeposit) sliderFeeDeposit.value = 0;
      if (typeof calcInflation !== 'undefined' && calcInflation) calcInflation.value = 2.5;
      if (typeof sliderInflation !== 'undefined' && sliderInflation) sliderInflation.value = 2.5;
      presetButtons.forEach(b => {
        b.style.background = 'rgba(65, 179, 124, 0.1)';
        b.style.color = 'var(--primary)';
      });
      handleToggles();
    });
  }

  const exitModal = document.getElementById('exit-intent-modal');
  const closeExitModal = document.getElementById('close-exit-modal');
  let modalShown = false;

  function showExitModal() {
    if (!modalShown && exitModal) {
      exitModal.style.display = 'flex';
      modalShown = true;
    }
  }

  if (closeExitModal && exitModal) {
    closeExitModal.addEventListener('click', () => {
      exitModal.style.display = 'none';
    });
    exitModal.addEventListener('click', (e) => {
      if (e.target === exitModal) {
        exitModal.style.display = 'none';
      }
    });
  }

  // Only trigger on desktop when mouse leaves toward the top address bar
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && window.innerWidth > 768) {
      showExitModal();
    }
  });
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initCalc); } else { initCalc(); }
