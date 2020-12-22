import '../sass/style.scss';
import './images';
import renderTable from './renderTable';
import renderList from './renderList';
import renderChart from './renderChart';
// eslint-disable-next-line import/no-cycle
import renderMap from './renderMap';
import setDataList from './setDataList';
import Keyboard from './keyboard';
import createData from './utils/getData';

Keyboard.init();
createData();

const inputCountry = document.querySelector('.use-keyboard-input');
const enterBtn = document.querySelector('.keyboard__key_enter');
const url = 'https://api.covid19api.com/summary';
const urlPopulation = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag';
const listHeading = document.querySelector('.list__heading');
const listMain = document.querySelector('.list__main');
const tabs = document.querySelectorAll('.tab');
const fullScreenBtns = document.querySelectorAll('.fullscreen__btn');

function makeFullscreen(e) {
  e.target.parentNode.parentNode.classList.toggle('fullscreen-active');
}

function deleteSortList() {
  if (listHeading.classList.contains('active-sort')) {
    listHeading.classList.remove('active-sort');
  }
  if (listHeading.classList.contains('reverse')) {
    listHeading.classList.remove('reverse');
  }
}
class AppCovid {
  constructor() {
    this.global = true;
    this.country = null;
    this.period = true;
    this.population = true;
    this.activeTabList = 'Cases';
    this.activeTabChart = 'Cases';
    this.activeTabMap = 'Cases';
  }

  async defineActiveTab(e) {
    try {
      const responsePopulation = await fetch(urlPopulation);
      this.dataPopulation = await responsePopulation.json();
    } catch {
      return;
    }
    // const responsePopulation = await fetch(urlPopulation);
    // this.dataPopulation = await responsePopulation.json();
    let tabBtns;
    if (e.target.parentNode.classList.contains('tab_list')) {
      tabBtns = document.querySelectorAll('.tab_list span');
      tabBtns.forEach((tabBtn) => {
        if (tabBtn === e.target) {
          if (!tabBtn.classList.contains('active')) {
            tabBtn.classList.add('active');
            this.activeTabList = tabBtn.innerText;
          }
        } else {
          tabBtn.classList.remove('active');
        }
      });
      deleteSortList();
      renderList(this.data, this.dataPopulation, this.activeTabList, this.period, this.population);
    } else if (e.target.parentNode.classList.contains('tab_chart')) {
      tabBtns = document.querySelectorAll('.tab_chart span');
      tabBtns.forEach((tabBtn) => {
        if (tabBtn === e.target) {
          if (!tabBtn.classList.contains('active')) {
            tabBtn.classList.add('active');
            this.activeTabChart = tabBtn.innerText;
          }
        } else {
          tabBtn.classList.remove('active');
        }
      });
      renderChart(
        this.global,
        this.dataPopulation,
        this.country,
        this.activeTabChart,
        this.period,
        this.population,
      );
    } else if (e.target.parentNode.classList.contains('tab_map')) {
      tabBtns = document.querySelectorAll('.tab_map span');
      tabBtns.forEach((tabBtn) => {
        if (tabBtn === e.target) {
          if (!tabBtn.classList.contains('active')) {
            tabBtn.classList.add('active');
            this.activeTabMap = tabBtn.innerText;
          }
        } else {
          tabBtn.classList.remove('active');
        }
      });
      renderMap(this.activeTabMap, this.activeTabChart, this.period, this.population);
    }
  }

  async sortList() {
    try {
      const response = await fetch(url);
      this.data = await response.json();
      const responsePopulation = await fetch(urlPopulation);
      this.dataPopulation = await responsePopulation.json();
    } catch {
      return;
    }
    if (listHeading.classList.contains('active-sort')) {
      listHeading.classList.toggle('reverse');
    } else {
      listHeading.classList.add('active-sort');
    }
    renderList(this.data, this.dataPopulation, this.activeTabList, this.period, this.population);
  }

  async setCountryFromList(e) {
    const response = await fetch(url);
    this.data = await response.json();
    const responsePopulation = await fetch(urlPopulation);
    this.dataPopulation = await responsePopulation.json();
    this.global = false;
    this.country = e.target.closest('div').children[1].innerText;
    renderTable(
      this.data,
      this.dataPopulation,
      this.global,
      this.population,
      this.period,
      this.country,
    );
    renderChart(
      this.global,
      this.dataPopulation,
      this.country,
      this.activeTabChart,
      this.period,
      this.population,
    );
  }

  async updateState(e) {
    const response = await fetch(url);
    this.data = await response.json();
    const responsePopulation = await fetch(urlPopulation);
    this.dataPopulation = await responsePopulation.json();
    if (e.target.classList.contains('period')) {
      this.period = !this.period;
      document.querySelectorAll('.period').forEach((switcher) => {
        if (switcher !== e.target) {
          // eslint-disable-next-line no-param-reassign
          switcher.checked = !switcher.checked;
        }
      });
    }
    if (e.target.classList.contains('population')) {
      this.population = !this.population;
      document.querySelectorAll('.population').forEach((switcher) => {
        if (switcher !== e.target) {
          // eslint-disable-next-line no-param-reassign
          switcher.checked = !switcher.checked;
        }
      });
    }
    renderTable(
      this.data,
      this.dataPopulation,
      this.global,
      this.population,
      this.period,
      this.country,
    );
    renderList(this.data, this.dataPopulation, this.activeTabList, this.period, this.population);
    renderChart(
      this.global,
      this.dataPopulation,
      this.country,
      this.activeTabChart,
      this.period,
      this.population,
    );
    renderMap(this.activeTabMap, this.period, this.population);
  }

  enterCity() {
    if (inputCountry.value === 'Global') {
      this.global = true;
      this.country = null;
    } else {
      this.global = false;
      this.country = inputCountry.value.toString();
      this.country = `${this.country[0].toUpperCase()}${this.country.slice(1)}`;
    }
    renderTable(
      this.data,
      this.dataPopulation,
      this.global,
      this.population,
      this.period,
      this.country,
    );
    renderChart(
      this.global,
      this.dataPopulation,
      this.country,
      this.activeTabChart,
      this.period,
      this.population,
    );
    inputCountry.value = '';
  }

  init() {
    this.getData();
    tabs.forEach((tab) => tab.addEventListener('click', (e) => this.defineActiveTab(e)));
    listHeading.addEventListener('click', () => this.sortList());
    listMain.addEventListener('click', (e) => this.setCountryFromList(e));
    fullScreenBtns.forEach((btn) => btn.addEventListener('click', (e) => makeFullscreen(e)));
    inputCountry.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        this.enterCity();
        if (!document.querySelector('.keyboard').classList.contains('keyboard--hidden')) {
          document.querySelector('.keyboard').classList.add('keyboard--hidden');
        }
      }
    });
    enterBtn.addEventListener('click', () => this.enterCity());
    document.querySelectorAll('.switch-checkbox').forEach((block) => {
      block.addEventListener('click', (e) => this.updateState(e));
    });
  }

  async getData() {
    try {
      const response = await fetch(url);
      this.data = await response.json();
      const responsePopulation = await fetch(urlPopulation);
      this.dataPopulation = await responsePopulation.json();
    } catch {
      return;
    }
    renderTable(
      this.data,
      this.dataPopulation,
      this.global,
      this.population,
      this.period,
      this.country,
    );
    setDataList(this.data);
    renderList(this.data, this.dataPopulation, this.activeTabList, this.period, this.population);
    renderChart(
      this.global,
      this.dataPopulation,
      this.country,
      this.activeTabChart,
      this.period,
      this.population,
    );
    renderMap(this.activeTabMap, this.activeTabChart, this.period, this.population);
  }
}

const app = new AppCovid();
app.init();

export default app;
