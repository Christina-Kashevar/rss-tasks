import addSpaceToNumbers from './utils/addSpaceToNumbers';
import roundTwoDecimal from './utils/roundTwoDecimal';
import populationOfCountiesNotInAPI from './populationOfCountiesNotInAPI';
import flagsNotInAPI from './flagsNotInAPI';

const tableCountry = document.querySelector('.table-country');
const tableCases = document.querySelector('.table-cases');
const tableRecovery = document.querySelector('.table-recovery');
const tableDead = document.querySelector('.table-dead');
const populationGlobal = 7827000000;

export default function renderTable(data, dataPopulation, global, population, period, country) {
  if (global) {
    const coefPer100k = populationGlobal / 100000;
    tableCountry.innerHTML = 'GLOBAL';
    if (population && period) {
      tableCases.innerHTML = addSpaceToNumbers(data.Global.TotalConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(data.Global.TotalRecovered);
      tableDead.innerHTML = addSpaceToNumbers(data.Global.TotalDeaths);
    } else if (population && !period) {
      tableCases.innerHTML = addSpaceToNumbers(data.Global.NewConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(data.Global.NewRecovered);
      tableDead.innerHTML = addSpaceToNumbers(data.Global.NewDeaths);
    } else if (!population && period) {
      tableCases.innerHTML = roundTwoDecimal(data.Global.TotalConfirmed / coefPer100k);
      tableRecovery.innerHTML = roundTwoDecimal(data.Global.TotalRecovered / coefPer100k);
      tableDead.innerHTML = roundTwoDecimal(data.Global.TotalDeaths / coefPer100k);
    } else {
      tableCases.innerHTML = roundTwoDecimal(data.Global.NewConfirmed / coefPer100k);
      tableRecovery.innerHTML = roundTwoDecimal(data.Global.NewRecovered / coefPer100k);
      tableDead.innerHTML = roundTwoDecimal(data.Global.NewDeaths / coefPer100k);
    }
  } else {
    const targetCountry = data.Countries.filter((item) => item.Country === country)[0];
    const targetPopulation = dataPopulation.filter((elem) => elem.name === country)[0];
    let coefPer100k;
    if (targetPopulation) coefPer100k = targetPopulation.population / 100000;
    if (populationOfCountiesNotInAPI[country]) {
      coefPer100k = populationOfCountiesNotInAPI[country] / 100000;
    }
    if (targetPopulation) {
      tableCountry.innerHTML = `<img src=${targetPopulation.flag} class="flag"></img><span>${targetCountry.Country}</span>`;
    } else if (flagsNotInAPI[targetCountry.Country]) {
      tableCountry.innerHTML = `<img src=${
        flagsNotInAPI[targetCountry.Country]
      } class="flag"><span>${targetCountry.Country}</span>`;
    } else {
      tableCountry.innerHTML = `<span>${targetCountry.Country}</span>`;
    }
    if (population && period) {
      tableCases.innerHTML = addSpaceToNumbers(targetCountry.TotalConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(targetCountry.TotalRecovered);
      tableDead.innerHTML = addSpaceToNumbers(targetCountry.TotalDeaths);
    } else if (population && !period) {
      tableCases.innerHTML = addSpaceToNumbers(targetCountry.NewConfirmed);
      tableRecovery.innerHTML = addSpaceToNumbers(targetCountry.NewRecovered);
      tableDead.innerHTML = addSpaceToNumbers(targetCountry.NewDeaths);
    } else if (!population && period) {
      tableCases.innerHTML = addSpaceToNumbers(
        roundTwoDecimal(targetCountry.TotalConfirmed / coefPer100k),
      );
      tableRecovery.innerHTML = addSpaceToNumbers(
        roundTwoDecimal(targetCountry.TotalRecovered / coefPer100k),
      );
      tableDead.innerHTML = addSpaceToNumbers(
        roundTwoDecimal(targetCountry.TotalDeaths / coefPer100k),
      );
    } else {
      tableCases.innerHTML = addSpaceToNumbers(
        roundTwoDecimal(targetCountry.NewConfirmed / coefPer100k),
      );
      tableRecovery.innerHTML = addSpaceToNumbers(
        roundTwoDecimal(targetCountry.NewRecovered / coefPer100k),
      );
      tableDead.innerHTML = addSpaceToNumbers(
        roundTwoDecimal(targetCountry.NewDeaths / coefPer100k),
      );
    }
  }
}
