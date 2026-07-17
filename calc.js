document.addEventListener('DOMContentLoaded', function() {
  const principalInput = document.getElementById('calc-principal');
  const monthlyInput = document.getElementById('calc-monthly');
  const rateInput = document.getElementById('calc-rate');
  const yearsInput = document.getElementById('calc-years');
  const yearsDisplay = document.getElementById('years-display');

  const resFinal = document.getElementById('res-final');
  const resDeposits = document.getElementById('res-deposits');
  const resProfit = document.getElementById('res-profit');

  let compoundChart = null;
  const allInputs = [principalInput, monthlyInput, rateInput, yearsInput];

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

    for (let m = 1; m <= months; m++) {
      currentCompound += PMT;
      currentCompound *= (1 + monthlyRate);
      
      currentRegular += PMT;

      // Sample data every 12 months (yearly)
      if (m % 12 === 0) {
        labels.push((m / 12).toString());
        dataCompound.push(Math.round(currentCompound));
        dataRegular.push(Math.round(currentRegular));
      }
    }

    const finalAmount = dataCompound[dataCompound.length - 1];
    const totalDeposits = dataRegular[dataRegular.length - 1];
    const totalProfit = finalAmount - totalDeposits;

    // Update Summary Boxes
    const currentFinal = parseInt(resFinal.textContent.replace(/[^0-9]/g, '')) || 0;
    const currentDeposits = parseInt(resDeposits.textContent.replace(/[^0-9]/g, '')) || 0;
    const currentProfit = parseInt(resProfit.textContent.replace(/[^0-9]/g, '')) || 0;

    animateValue(resFinal, currentFinal, finalAmount, 500);
    animateValue(resDeposits, currentDeposits, totalDeposits, 500);
    animateValue(resProfit, currentProfit, totalProfit, 500);

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
  calculate();
});
