/* eslint-disable no-undef */
import populationOfCountiesNotInAPI from './populationOfCountiesNotInAPI';
import roundTwoDecimal from './utils/roundTwoDecimal';
import './Chart.bundle.min';

const urlTotalDaily = 'https://disease.sh/v3/covid-19/historical/all?lastdays=366';
const populationGlobal = 7827000000;

export default async function renderChart(
  global,
  dataPopulation,
  country,
  activeTabChart,
  period,
  populationApp,
) {
  document.querySelector('.canvas-wrapper').innerHtml = '';
  if (document.querySelector('#myChart')) {
    document.querySelector('#myChart').remove();
  }
  const canvasEl = document.createElement('canvas');
  canvasEl.setAttribute('id', 'myChart');
  canvasEl.setAttribute('width', '300');
  canvasEl.setAttribute('height', '180');
  document.querySelector('.canvas-wrapper').append(canvasEl);
  const ctx = document.getElementById('myChart').getContext('2d');
  let responseChart;
  if (global) {
    try {
      responseChart = await fetch(urlTotalDaily);
    } catch {
      return;
    }
  } else {
    let targetCountry;
    if (country.indexOf(' ') > -1) {
      targetCountry = country
        .split(' ')
        .map((word) => word[0].toLowerCase() + word.slice(1))
        .join('-');
    } else {
      targetCountry = country[0].toLowerCase() + country.slice(1);
    }
    if (activeTabChart === 'Cases') {
      responseChart = await fetch(
        `https://api.covid19api.com/dayone/country/${targetCountry}/status/confirmed`,
      );
    } else if (activeTabChart === 'Recovered') {
      responseChart = await fetch(
        `https://api.covid19api.com/dayone/country/${targetCountry}/status/recovered`,
      );
    } else {
      responseChart = await fetch(
        `https://api.covid19api.com/dayone/country/${targetCountry}/status/deaths`,
      );
    }
  }
  let dataChart;
  try {
    dataChart = await responseChart.json();
  } catch {
    return;
  }
  let dataNum = [];
  let typeChart;
  let labelsNames = [];
  if (global) {
    if (activeTabChart === 'Cases') {
      dataNum = Object.values(dataChart.cases);
      labelsNames = Object.keys(dataChart.cases);
    } else if (activeTabChart === 'Recovered') {
      dataNum = Object.values(dataChart.recovered);
      labelsNames = Object.keys(dataChart.recovered);
    } else {
      dataNum = Object.values(dataChart.deaths);
      labelsNames = Object.keys(dataChart.deaths);
    }
  } else {
    if (dataChart.message === 'Not Found') return;
    dataChart.forEach((day) => dataNum.push(day.Cases));
    labelsNames = dataChart.map((day) => day.Date.slice(0, 10));
  }

  if (period) {
    typeChart = 'line';
  } else {
    typeChart = 'bar';
    dataNum = dataNum.map((el, index, array) => {
      if (index > 0) {
        if (array[index] - array[index - 1] > 0) {
          return array[index] - array[index - 1];
        }
        return 0;
      }
      return el;
    });
  }
  if (!populationApp) {
    let coefPer100kChart;
    if (global) {
      coefPer100kChart = populationGlobal / 100000;
    } else {
      const targetPopulation = dataPopulation.filter((elem) => elem.name === country)[0];
      if (targetPopulation) coefPer100kChart = targetPopulation.population / 100000;
      if (populationOfCountiesNotInAPI[country]) {
        coefPer100kChart = populationOfCountiesNotInAPI[country] / 100000;
      }
    }
    dataNum = dataNum.map((number) => roundTwoDecimal(number / coefPer100kChart));
  }

  // eslint-disable-next-line no-unused-vars
  const myChart = new Chart(ctx, {
    type: typeChart,
    data: {
      labels: labelsNames,
      datasets: [
        {
          label: activeTabChart,
          data: dataNum,
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 0.2)',
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: (value) => {
                if (value > 999999) {
                  return `${value / 10e5}M`;
                }
                if (value > 9999) {
                  return `${value / 10e2}k`;
                }
                return value;
              },
            },
          },
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              unit: 'month',
            },
          },
        ],
      },
    },
  });
}
