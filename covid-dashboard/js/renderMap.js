/* eslint-disable no-undef */
import create from './utils/create';
import addSpaceToNumbers from './utils/addSpaceToNumbers';
// eslint-disable-next-line import/no-cycle
import app from './index';
import renderTable from './renderTable';
import renderChart from './renderChart';

export default async function renderMap(activeTabMap, period, populationApp) {
  document.querySelector('#map').innerHTML = '';
  if (document.querySelector('#map')) {
    document.querySelector('#map').remove();
  }
  create('div', '', '', document.querySelector('.map__container'), ['id', 'map']);
  let response;
  try {
    response = await fetch('https://corona.lmao.ninja/v2/countries');
  } catch (e) {
    return;
  }
  const data = await response.json();
  if (!Array.isArray(data) && !data.length > 0) return;
  const geoData = {
    type: 'FeatureCollection',
    features: data.map((country = {}) => {
      const { countryInfo = {} } = country;
      const { lat, long: lng } = countryInfo;
      return {
        properties: {
          ...country,
        },
        coordinates: [lat, lng],
      };
    }),
  };

  const mapOptions = {
    center: [53, 27],
    zoom: 2,
    minZoom: 2,
    maxZoom: 5,
  };

  const map = new L.Map('map', mapOptions);

  const mapbox =
    'https://api.mapbox.com/styles/v1/jesperchrisper/ckixkl6335ux819sz1p9iqzj0/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiamVzcGVyY2hyaXNwZXIiLCJhIjoiY2tpeGtnemppMTQ1dDMwbWVsYzh2c2pyZiJ9.fxYLezkdWZXl2qrgjLR5vw'; //! Custom Map
  const openStreetMap = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const layer = new L.TileLayer(mapbox || openStreetMap);
  map.addLayer(layer);

  geoData.features.forEach((el) => {
    const per100k = (value) => {
      return Math.floor((value / el.properties.population) * 100000);
    };
    const iconOptions = {};
    let count = 0;
    let markerDesctription = '';
    if (activeTabMap === 'Cases') {
      if (!period && !populationApp) {
        count = per100k(el.properties.todayCases);
        markerDesctription = 'Per 100 000 & Last Day';
      } else if (!populationApp) {
        count = el.properties.casesPerOneMillion * 10;
        markerDesctription = 'Per 100 000';
      } else if (!period) {
        count = el.properties.todayCases;
        markerDesctription = 'Last Day';
      } else {
        count = el.properties.cases;
      }

      if (count > 2000000) {
        iconOptions.iconUrl = '../assets/static/covid-19-red.png';
        iconOptions.iconSize = [35, 35];
      } else {
        iconOptions.iconUrl = '../assets/static/covid-19.png';
        iconOptions.iconSize = [22, 22];
      }
    } else if (activeTabMap === 'Recovered') {
      iconOptions.iconUrl = '../assets/static/recovered.png';

      if (!period && !populationApp) {
        count = per100k(el.properties.todayRecovered);
        markerDesctription = 'Per 100 000 & Last Day';
      } else if (!populationApp) {
        count = el.properties.recoveredPerOneMillion * 10;
        markerDesctription = 'Per 100 000';
      } else if (!period) {
        count = el.properties.todayRecovered;
        markerDesctription = 'Last Day';
      } else {
        count = el.properties.recovered;
      }

      if (count > 1000000) {
        iconOptions.iconSize = [35, 35];
      } else {
        iconOptions.iconSize = [22, 22];
      }
    } else {
      iconOptions.iconUrl = '../assets/static/death.png';

      if (!period && !populationApp) {
        count = per100k(el.properties.todayDeaths);
        markerDesctription = 'Per 100 000 & Last Day';
      } else if (!populationApp) {
        count = el.properties.deathsPerOneMillion * 10;
        markerDesctription = 'Per 100 000';
      } else if (!period) {
        count = el.properties.todayDeaths;
        markerDesctription = 'Last Day';
      } else {
        count = el.properties.deaths;
      }

      if (count > 100000) {
        iconOptions.iconSize = [35, 35];
      } else {
        iconOptions.iconSize = [22, 22];
      }
    }

    const customIcon = L.icon(iconOptions);

    // activeTabChart точно эта переменная???
    const markerOptions = {
      title: `${markerDesctription} ${activeTabMap} ${el.properties.country}`,
      clickable: true,
      draggable: false,
      icon: customIcon,
    };

    const marker = L.marker(el.coordinates, markerOptions);
    const markerTemplate = `<p>${markerDesctription} ${activeTabMap}: ${addSpaceToNumbers(
      count,
    )}<p>`;
    marker.bindPopup(`${markerTemplate}`).openPopup();
    marker.addTo(map);
    marker.addEventListener('click', () => {
      app.global = false;
      app.country = `${el.properties.country}`;

      switch (el.properties.country) {
        case 'USA':
          app.country = 'United States of America';
          break;
        case 'UK':
          app.country = 'United Kingdom';
          break;
        case 'Russia':
          app.country = 'Russian Federation';
          break;
        default:
          break;
      }
      renderTable(
        app.data,
        app.dataPopulation,
        app.global,
        app.population,
        app.period,
        app.country,
      );
      renderChart(
        app.global,
        app.dataPopulation,
        app.country,
        app.activeTabChart,
        app.period,
        app.population,
      );
    });
  });

  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = () => {
    const div = create('div', 'info legend');
    if (activeTabMap === 'Cases') {
      create(
        'i',
        'legend__line',
        [create('i', 'cases', ''), create('i', 'legend__title', 'Cases > 2 000 000')],
        div,
      );
      create(
        'i',
        'legend__line',
        [create('i', 'cases-small', ''), create('i', 'legend__title', 'Cases < 2 000 000')],
        div,
      );
    } else if (activeTabMap === 'Recovered') {
      create(
        'i',
        'legend__line',
        [create('i', 'recovered', ''), create('i', 'legend__title', 'Recovered > 1 000 000')],
        div,
      );
      create(
        'i',
        'legend__line',
        [
          create('i', 'recovered recovered-small', ''),
          create('i', 'legend__title', 'Recovered < 1 000 000'),
        ],
        div,
      );
    } else {
      create(
        'i',
        'legend__line',
        [create('i', 'death', ''), create('i', 'legend__title', 'Death > 100 000')],
        div,
      );
      create(
        'i',
        'legend__line',
        [create('i', 'death death-small', ''), create('i', 'legend__title', 'Death < 100 000')],
        div,
      );
    }

    return div;
  };
  legend.addTo(map);
}
