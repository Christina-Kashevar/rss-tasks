// DOM Elements
const time = document.querySelector('.time');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const focus = document.querySelector('.focus');
const dayInfo = document.querySelector('.day');
const btn = document.querySelector('.btn');
const btnQuote = document.querySelector('.btn-quote');
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal');
const modalCloseBtn =  document.querySelector('.modal__close');
const modalOkBtn =  document.querySelector('.modal__save');

// Show Time
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();
    if (min === 0 && sec === 0) {
      setBgGreet();
    }

  // Output Time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

  setTimeout(showTime, 1000);
}

// Output Time
const dayOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]

function showDay() {
  let today = new Date(),
  day = dayOfWeek[today.getDay()],
  month = months[today.getMonth()],
  date = today.getDate()

  dayInfo.innerHTML =`${day}<span>, </span>${date}&nbsp;${month}`
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Create array of images

let imagesArray =[];
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
// let i = 0;

function addImage(time) {
  for (let i =0; i < 6; i++) {
    let imageNum = Math.floor(Math.random()*20);
    let image = time + images[imageNum];
    if (imagesArray.includes(image)) {
      --i
    } else {
      imagesArray.push(image)
    }
  }
}

addImage("night/");
addImage("morning/");
addImage("day/");
addImage("evening/");

console.log(imagesArray)


// Set Background and Greeting
const data = './assets/images/';
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours();
    let src = data + imagesArray[hour];
    let img = document.createElement('img');
    img.src= src;
    img.onload = () => {
      document.body.style.backgroundImage = `url(${src})`;
    };
    if (hour < 6) {
      // Night
      greeting.textContent = 'Доброй ночи, ';
    } else if (hour < 12) {
      // Morning
      greeting.textContent = 'Доброе утро, ';
    } else if (hour < 18) {
      // Afternoon
      greeting.textContent = 'Добрый день, ';
    } else {
      greeting.textContent = 'Добрый вечер, ';
    }
}

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Введите имя]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else {
    if(name.textContent === '') {
      name.textContent = '[Введите имя]';
      return
    }
    localStorage.setItem('name', e.target.innerText);
  }
}

function clearNameField () {
  if (name.textContent === '[Введите имя]') {
    name.textContent =''
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Введите цель]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem('focus', e.target.innerText);
      focus.blur();
    }
  } else {
    if(focus.textContent === '') {
      focus.textContent = '[Введите цель]';
      return
    }
    localStorage.setItem('focus', e.target.innerText);
  }
}

function clickFocusField() {
  if (focus.textContent === '[Введите цель]') {
    focus.textContent =''
  }
}

//Change background btn function

let today = new Date();
let i = today.getHours() + 1;

function viewBgImage(data) {
  const src = data;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {
    document.body.style.backgroundImage = `url(${img.src})`;
  };
}


function getImage() {
    if (i === 24) { i = 0}
    let imageSrc = data + imagesArray[i];
    viewBgImage(imageSrc);
    i++;
    btn.disabled = true;
    setTimeout(function() { btn.disabled = false }, 2000);
}


async function getQuote() {
  const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru`;
  const res = await fetch(url);
  const data = await res.json(); 
  blockquote.textContent = data.quoteText;
  figcaption.textContent = data.quoteAuthor;
}

async function getWeather() {
  try {
    let cityLocal = null;
    if (localStorage.getItem('city') === null) {
      cityLocal = city.textContent;
    } else {
      cityLocal = localStorage.getItem('city');
      city.textContent = cityLocal;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityLocal}&lang=ru&appid=1f22d4f798f3fa7006bf7a2c8aec93c5&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data)
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
  } catch (err){
    modalContainer.classList.remove("modal_closed");
    modalOverlay.classList.remove("modal_closed");
  }
}

function setCity(e) {
  if (e.which == 13 || e.keyCode == 13) {
    localStorage.setItem('city', e.target.innerText);
    getWeather();
    city.blur();
  }
}

function setCityBlur(e) {
  if(city.textContent === '') {
    city.textContent = 'Минск';
  }
  localStorage.setItem('city', e.target.innerText);
  getWeather();
}

function closeModal() {
  modalContainer.classList.add("modal_closed");
  modalOverlay.classList.add("modal_closed");
}


name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', clearNameField);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', clickFocusField);
btn.addEventListener('click', getImage);
// document.addEventListener('DOMContentLoaded', getQuote);
// btnQuote.addEventListener('click', getQuote);
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCityBlur);
modalCloseBtn.addEventListener('click', closeModal);
modalOkBtn.addEventListener('click', closeModal);

// Run
showTime();
showDay()
setBgGreet();
getName();
getFocus();