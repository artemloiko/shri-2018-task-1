import { Chart } from 'chart.js';

function getColor(isActive, alpha = 1) {
  return isActive
    ? `rgba(54, 162, 235, ${alpha})`
    : `rgba(255, 99, 132, ${alpha})`;
}

function getLabel(el, i, data) {
  const x = new Date();
  x.setHours(x.getHours() - data.length + i);
  x.setMinutes(0);
  x.setSeconds(0);
  x.setMilliseconds(0);
  // *** более красивый формат вывода даты и времени
  return x.toLocaleString();
}

export function createChart(container, data, isActive) {
  const ctx = container.getContext('2d');

  const borderColor = getColor(isActive);
  const backgroundColor = getColor(isActive, 0.5);

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(getLabel),
      datasets: [
        {
          data: data,
          borderWidth: 1,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        }
      ]
    },
    options: {
        legend: { 
            display: false
        },
        scales: {
            // *** type time автоматически парсит входящую строку времени и  source: 'auto' подбирает формат отображения подписей оси 
            xAxes: [{ 
              type: 'time',
              ticks: {
                source: 'auto',
              } 
            }],
            // *** график больше нуля убрал max: 0
            // *** stepsize для лучшей видимости
            yAxes: [{ 
              ticks: { 
                beginAtZero: true, 
                stepSize: 2 
              } 
            }]
        }
    }
  });

  return chart;
}
