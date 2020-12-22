import populationOfCountiesNotInAPI from './populationOfCountiesNotInAPI';
import flagsNotInAPI from './flagsNotInAPI';
import addSpaceToNumbers from './utils/addSpaceToNumbers';
import roundTwoDecimal from './utils/roundTwoDecimal';

const listHeading = document.querySelector('.list__heading');
const listMain = document.querySelector('.list__main');

function sortData(data, population, activeTabList, period, populationApp) {
  let key;
  if (activeTabList === 'Cases' && period) {
    key = 'TotalConfirmed';
  } else if (activeTabList === 'Cases' && !period) {
    key = 'NewConfirmed';
  } else if (activeTabList === 'Recovered' && period) {
    key = 'TotalRecovered';
  } else if (activeTabList === 'Recovered' && !period) {
    key = 'NewRecovered';
  } else if (activeTabList === 'Deaths' && period) {
    key = 'TotalDeaths';
  } else {
    key = 'NewDeaths';
  }
  let coefPer100kListA;
  let coefPer100kListB;
  if (!populationApp) {
    data.sort((a, b) => {
      const popA = population.filter((c) => c.name === a.Country)[0];
      const popB = population.filter((c) => c.name === b.Country)[0];
      if (popA) coefPer100kListA = popA.population / 100000;
      if (populationOfCountiesNotInAPI[a.Country]) {
        coefPer100kListA = populationOfCountiesNotInAPI[a.Country] / 100000;
      }
      if (popB) coefPer100kListB = popB.population / 100000;
      if (populationOfCountiesNotInAPI[b.Country]) {
        coefPer100kListB = populationOfCountiesNotInAPI[b.Country] / 100000;
      }
      return a[key] / coefPer100kListA > b[key] / coefPer100kListB ? 1 : -1;
    });
  } else {
    data.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }
  if (listHeading.classList.contains('reverse')) {
    data.reverse();
  }
  return data;
}

export default function renderList(
  dataList,
  dataPopulationList,
  activeTabList,
  period,
  populationApp,
) {
  listMain.innerHTML = '';
  let countries = dataList.Countries;
  listHeading.innerHTML = activeTabList;
  if (listHeading.classList.contains('active-sort')) {
    countries = sortData(countries, dataPopulationList, activeTabList, period, populationApp);
  }
  countries.forEach((elem) => {
    const targetPopulationList = dataPopulationList.filter((c) => c.name === elem.Country)[0];
    let coefPer100kList;
    if (targetPopulationList) coefPer100kList = targetPopulationList.population / 100000;
    if (populationOfCountiesNotInAPI[elem.Country]) {
      coefPer100kList = populationOfCountiesNotInAPI[elem.Country] / 100000;
    }
    const divCountry = document.createElement('div');
    const numEl = document.createElement('span');
    const countryEl = document.createElement('span');
    const flagEl = document.createElement('img');
    divCountry.classList.add('country-list-line');
    let targetCategory;
    if (activeTabList === 'Cases' && period) {
      targetCategory = elem.TotalConfirmed;
    } else if (activeTabList === 'Cases' && !period) {
      targetCategory = elem.NewConfirmed;
    } else if (activeTabList === 'Recovered' && period) {
      targetCategory = elem.TotalRecovered;
    } else if (activeTabList === 'Recovered' && !period) {
      targetCategory = elem.NewRecovered;
    } else if (activeTabList === 'Deaths' && period) {
      targetCategory = elem.TotalDeaths;
    } else {
      targetCategory = elem.NewDeaths;
    }
    if (!populationApp) {
      targetCategory = roundTwoDecimal(targetCategory / coefPer100kList);
    }
    numEl.innerHTML = addSpaceToNumbers(targetCategory);
    numEl.classList.add('num-list');
    countryEl.innerHTML = elem.Country;
    countryEl.classList.add('country-list');
    if (targetPopulationList) {
      flagEl.src = targetPopulationList.flag;
    }
    if (flagsNotInAPI[elem.Country]) {
      flagEl.src = flagsNotInAPI[elem.Country];
    }
    flagEl.classList.add('flag');
    divCountry.append(numEl, countryEl, flagEl);
    listMain.append(divCountry);
  });
}
