const url = "https://api.covid19api.com/summary";
const urlPopulation = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag';
let country = 'Armenia';
const tableCountry = document.querySelector(".table-country");
const tableCases = document.querySelector(".table-cases");
const tableRecovery = document.querySelector(".table-recovery");
const tableDead = document.querySelector(".table-dead");
const list = document.querySelector(".list");
const switcherPeriod = document.querySelector("#myswitch2");
const switcherPopulation = document.querySelector("#myswitch");
const switcherPeriodList = document.querySelector("#myswitch2list");
const switcherPopulationList = document.querySelector("#myswitchlist");
const tab = document.querySelector(".tab");
let populationAmount = 7827000000;
let activeTab = 'Cases'

switcherPopulation.addEventListener('click', () => renderTable());
switcherPeriod.addEventListener('click', () => renderTable());
switcherPopulationList.addEventListener('click', () => renderList());
switcherPeriodList.addEventListener('click', () => renderList());
tab.addEventListener('click', (e) => changeActiveTab(e));
tab.addEventListener('click', () => renderList());

function addSpaceToNumbers(num) {
  const stringNumber = num.toString();
  return stringNumber.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
}

function roundTwoDecimal(num) {
  return Math.round(num * 100) / 100;
}

async function renderTable() {
  const response = await fetch(url);
  const data = await response.json();
  const responsePopulation = await fetch(urlPopulation);
  const dataPopulation = await responsePopulation.json();
  if(country === 'globe') {
    tableCountry.innerHTML = 'GLOBAL';
    if(switcherPopulation.checked && switcherPeriod.checked) {
      tableCases.innerHTML = addSpaceToNumbers(data.Global.TotalConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(data.Global.TotalRecovered);
      tableDead.innerHTML = addSpaceToNumbers(data.Global.TotalDeaths);
    } else if (switcherPopulation.checked && !switcherPeriod.checked) {
      tableCases.innerHTML = addSpaceToNumbers(data.Global.NewConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(data.Global.NewRecovered);
      tableDead.innerHTML = addSpaceToNumbers(data.Global.NewDeaths);
    } else if (!switcherPopulation.checked && switcherPeriod.checked) {
      tableCases.innerHTML = roundTwoDecimal(data.Global.TotalConfirmed / 100000);
      tableRecovery.innerHTML = roundTwoDecimal(data.Global.TotalRecovered / 100000);
      tableDead.innerHTML = roundTwoDecimal(data.Global.TotalDeaths / 100000);
    } else {
      tableCases.innerHTML = roundTwoDecimal(data.Global.NewConfirmed / 100000);
      tableRecovery.innerHTML = roundTwoDecimal(data.Global.NewRecovered / 100000);
      tableDead.innerHTML = roundTwoDecimal(data.Global.NewDeaths / 100000);
    }
  } else {
    const targetCountry = data.Countries.filter(item => item.Country === country)[0];
    const targetPopulation = dataPopulation.filter(elem => elem.name === country)[0];
    const coefPer100k = targetPopulation.population / 100000;
    tableCountry.innerHTML = `<img src=${targetPopulation.flag} class="flag"></img><span>${targetCountry.Country}</span>`;
    if(switcherPopulation.checked && switcherPeriod.checked) {
      tableCases.innerHTML = addSpaceToNumbers(targetCountry.TotalConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(targetCountry.TotalRecovered);
      tableDead.innerHTML = addSpaceToNumbers(targetCountry.TotalDeaths);
    } else if (switcherPopulation.checked && !switcherPeriod.checked) {
      tableCases.innerHTML = addSpaceToNumbers(targetCountry.NewConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(targetCountry.NewRecovered);
      tableDead.innerHTML = addSpaceToNumbers(targetCountry.NewDeaths);
    } else if (!switcherPopulation.checked && switcherPeriod.checked) {
      tableCases.innerHTML = addSpaceToNumbers(roundTwoDecimal(targetCountry.TotalConfirmed / coefPer100k));
      tableRecovery.innerHTML = addSpaceToNumbers(roundTwoDecimal(targetCountry.TotalRecovered / coefPer100k));
      tableDead.innerHTML = addSpaceToNumbers(roundTwoDecimal(targetCountry.TotalDeaths / coefPer100k));
    } else {
      tableCases.innerHTML = addSpaceToNumbers(roundTwoDecimal(targetCountry.NewConfirmed / coefPer100k));
      tableRecovery.innerHTML = addSpaceToNumbers(roundTwoDecimal(targetCountry.NewRecovered / coefPer100k));
      tableDead.innerHTML = addSpaceToNumbers(roundTwoDecimal(targetCountry.NewDeaths / coefPer100k));
    }
  }
}

async function renderList() {
  const responseList = await fetch(url);
  const dataList = await responseList.json();
  const countries = dataList.Countries;
  const responsePopulationList = await fetch(urlPopulation);
  const dataPopulationList = await responsePopulationList.json();
  countries.forEach(elem => {
    const targetPopulationList = dataPopulationList.filter(c => c.name === elem.Country)[0];
    const coefPer100kList = targetPopulationList.population / 100000;
    const divCountry = document.createElement('div');
    const numEl = document.createElement('span');
    const countryEl = document.createElement('span');
    const flagEl = document.createElement('img');
    divCountry.classList.add('country-list-line');
    let targetCategory;
    if (activeTab === 'Cases' && switcherPeriodList.checked) {
      targetCategory = elem.TotalConfirmed;
    } else if (activeTab === 'Cases' && !switcherPeriodList.checked) {
      targetCategory = elem.NewConfirmed;
    } else if (activeTab === 'Recovered' && switcherPeriodList.checked) {
      targetCategory = elem.TotalRecovered;
    } else if (activeTab === 'Recovered' && !switcherPeriodList.checked) {
      targetCategory = elem.NewRecovered;
    } else if (activeTab === 'Deaths' && !switcherPeriodList.checked) {
      targetCategory = elem.TotalDeaths;
    } else {
      targetCategory = elem.NewDeaths;
    }
    if (!switcherPopulationList.checked) {
      targetCategory /= coefPer100kList
    }
    numEl.innerHTML = addSpaceToNumbers(targetCategory);
    numEl.classList.add('num-list');
    countryEl.innerHTML = elem.Country;
    countryEl.classList.add('country-list')
    if(targetPopulationList ) {
      flagEl.src = targetPopulationList.flag;
    }
    flagEl.classList.add('flag');
    divCountry.append(numEl, countryEl, flagEl);
    list.append(divCountry)
  })
}

function changeActiveTab (e) {
  const tabBtns = document.querySelectorAll('.tab span');
  tabBtns.forEach(tabBtn => {
    if (tabBtn === e.target) {
      if (!tabBtn.classList.contains('active')) {
        tabBtn.classList.add('active');
        activeTab = tabBtn.innerText;
      }
    } else {
      tabBtn.classList.remove('active');
    }
  })
}

renderTable();
renderList()


// class Table {
//   constructor() {
//     this.country = 'globe';
//     this.data = fetch(url).then(response => response.json());
//    }

//    renderTable() {
//     if (this.data) {
//       if (this.country === 'globe') {
//         document.querySelector(".table-country").innerHTML = 'GLOBE';
//         document.querySelector(".table-cases").innerHTML = this.data.then( info => info.Global.TotalConfirmed);
//         document.querySelector(".table-recovery").innerHTML = 'GLOBE';
//         document.querySelector(".table-dead").innerHTML = 'GLOBE';
//         document.querySelector(".table-cases-per-day").innerHTML = 'GLOBE';
//         document.querySelector(".table-recovery-per-day").innerHTML = 'GLOBE';
//         document.querySelector(".table-dead-per-day").innerHTML = 'GLOBE';

//       }
//     }
//   }
// }

// const table = new Table;

// table.renderTable()