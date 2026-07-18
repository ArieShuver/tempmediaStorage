document.addEventListener('DOMContentLoaded', function() {
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

  const calcFreq = document.getElementById('calc-freq');

  const resFinal = document.getElementById('res-final');
  const resDeposits = document.getElementById('res-deposits');
  const resProfit = document.getElementById('res-profit');
  const resFees = document.getElementById('res-fees');
  const resTax = document.getElementById('res-tax');
  const boxFeesContainer = document.getElementById('box-fees-container');
  const boxTaxContainer = document.getElementById('box-tax-container');

  const tableBody = document.getElementById('yearly-table-body');
  const colFeesHeaders = document.querySelectorAll('.col-fees');
  const colTaxHeaders = document.querySelectorAll('.col-tax');

  let compoundChart = null;
  const allInputs = [
    principalInput, monthlyInput, rateInput, yearsInput,
    taxInput, feeAccumInput, feeDepositInput, toggleTax, toggleFees,
    calcFreq
  ].filter(Boolean);

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
    calculate();
  }

  if (toggleTax) toggleTax.addEventListener('change', handleToggles);
  if (toggleFees) toggleFees.addEventListener('change', handleToggles);

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
    yearsDisplay.textContent = yearsInput.value;
  }

  // Calculate and draw chart
  function calculate() {
    const P = parseFloat(principalInput.value) || 0;
    const PMT = parseFloat(monthlyInput.value) || 0;
    const r = parseFloat(rateInput.value) || 0;
    const t = parseInt(yearsInput.value) || 0;

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

    const inflationRate = 0;
    const freq = parseInt(calcFreq ? calcFreq.value : 12);

    const monthlyRate = (r / 100) / 12;
    const months = t * 12;

    let labels = [];
    let dataCompound = [];
    let dataRegular = []; // Representing just deposits (0% interest)

    let currentCompound = P;
    let currentRegular = P;

    // Push initial state
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

      // Sample data every 12 months (yearly)
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

    // Update Summary Boxes
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

    if (tableBody) {
      tableBody.innerHTML = tableHTML;
    }
    colFeesHeaders.forEach(el => el.style.display = (toggleFees && toggleFees.checked) ? '' : 'none');
    colTaxHeaders.forEach(el => el.style.display = (toggleTax && toggleTax.checked) ? '' : 'none');

    updateChart(labels, dataCompound, dataRegular);
  }

  function updateChart(labels, compound, regular) {
    const ctx = document.getElementById('compoundChart').getContext('2d');

    if (compoundChart) {
      compoundChart.destroy();
    }

    Chart.defaults.font.family = "'Heebo', sans-serif";
    Chart.defaults.color = '#334155';

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
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += '₪' + context.parsed.y.toLocaleString('he-IL');
                }
                return label;
              },
              title: function(context) {
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
            title: {
              display: true,
              text: 'סכום כולל (₪)',
              font: {
                size: 14,
                weight: '600'
              }
            },
            ticks: {
              callback: function(value, index, values) {
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

  // Bind events for real-time calculation
  allInputs.forEach(input => {
    input.addEventListener('input', calculate);
  });
  yearsInput.addEventListener('input', updateYearsDisplay);

  // Initial render
  updateYearsDisplay();
  handleToggles();

  // Table Toggle Logic
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

  // Share Button Logic
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareData = {
        title: document.title,
        text: 'גלו כמה הכסף שלכם יכול לצמוח עם מחשבון ריבית דריבית מתקדם.',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(console.error);
      } else {
        // Fallback for desktop
        navigator.clipboard.writeText(window.location.href).then(() => {
          const originalText = shareBtn.querySelector('.share-text').textContent;
          shareBtn.querySelector('.share-text').textContent = 'הקישור הועתק!';
          shareBtn.classList.add('copied');
          setTimeout(() => {
            shareBtn.querySelector('.share-text').textContent = originalText;
            shareBtn.classList.remove('copied');
          }, 2500);
        }).catch(console.error);
      }
    });
  }

  // Export to CSV Logic
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

  // Reset Logic
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      principalInput.value = 10000;
      monthlyInput.value = 500;
      rateInput.value = 7;
      yearsInput.value = 20;
      updateYearsDisplay();
      if (calcFreq) calcFreq.value = "12";
      if (toggleTax) toggleTax.checked = false;
      if (toggleFees) toggleFees.checked = true;
      if (toggleInflation) toggleInflation.checked = false;
      if (taxInput) taxInput.value = 25;
      if (feeAccumInput) feeAccumInput.value = 0.6;
      if (feeDepositInput) feeDepositInput.value = 0;
      if (calcInflation) calcInflation.value = 2.5;
      handleToggles();
    });
  }
});
