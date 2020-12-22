import create from './utils/create';

const countryList = document.querySelector('#countries');

export default function setDataList(dataList) {
  // const responseList = await fetch(url);
  // const dataList = await responseList.json();
  const countries = dataList.Countries;
  create('option', '', '', countryList, ['value', 'Global']);
  countries.forEach((el) => {
    create('option', '', '', countryList, ['value', `${el.Country}`]);
  });
}
