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
const weatherIcon = document.querySelector('.weather__icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather__description');
const city = document.querySelector('.city');
const modalOverlay = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.modal__close');
const modalOkBtn = document.querySelector('.modal__save');
const humidity = document.querySelector('.weather__humidity');
const wind = document.querySelector('.weather__wind');

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
  time.innerHTML = `<span class='time-num'>${hour}</span><span>:</span><span class='time-num'>${addZero(min)}</span><span>:</span><span class='time-num'>${addZero(sec)}</span>`;

  setTimeout(showTime, 1000);
}

// Output Time
const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April ", "May", "June", "July", "August", "September", "October", "November", "December"]

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
      greeting.textContent = 'Good night, ';
    } else if (hour < 12) {
      // Morning
      greeting.textContent = 'Good morning, ';
    } else if (hour < 18) {
      // Afternoon
      greeting.textContent = 'Good afternoon, ';
    } else {
      greeting.textContent = 'Good evening, ';
    }
}

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if(e.target.innerText==='') {
        if(localStorage.getItem('name')) {
          name.textContent = localStorage.getItem('name');
        }else {
          name.textContent = '[Enter Name]';
        }
      } else {
        localStorage.setItem('name', e.target.innerText);
      }
      name.blur();
    }
  } else {
    if(name.textContent ==='') {
      if(localStorage.getItem('name')) {
        name.textContent = localStorage.getItem('name');
      }else {
        name.textContent = '[Enter Name]';
      }
    } else if( name.textContent ==='[Enter Name]') {
      return;
    } else {
      localStorage.setItem('name', e.target.innerText);
    }
  }
}

function clearNameField () {
  name.textContent =''
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

// Set Focus
function setFocus(e) {
  let focusLocal = e.target.innerText;
  if (focusLocal.length > 50 ) {
    focusLocal = focusLocal.substr(0,50)
  }
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if(focusLocal ==='') {

        if(localStorage.getItem('focus')) {
          focus.textContent = localStorage.getItem('focus');
        }else {
          focus.textContent = '[Enter Focus]';
        }
      } else {
        localStorage.setItem('focus', focusLocal);
        focus.textContent = focusLocal;
      }
      focus.blur();
    }
  } else {
    if(focus.textContent ==='') {
      if(localStorage.getItem('focus')) {
        focus.textContent = localStorage.getItem('focus');
      }else {
        focus.textContent = '[Enter Focus]';
      }
    } else if( focus.textContent ==='[Enter Focus]') {
      return;
    } else {
      localStorage.setItem('focus', focusLocal);
      focus.textContent = focusLocal;
    }
  }

}

function clickFocusField() {
    focus.textContent =''
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
  // const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru`;
  const url = `https://quote-garden.herokuapp.com/api/v2/quotes/random`;
  const res = await fetch(url);
  let data = await res.json();
  data = data.quote;
  if (data.quoteText.length > 100) {
     getQuote();
     return data;
  }
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

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityLocal}&lang=en&appid=1f22d4f798f3fa7006bf7a2c8aec93c5&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.className = 'weather__icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;
  } catch (err){
    modalContainer.classList.remove("modal_closed");
    modalOverlay.classList.remove("modal_closed");
  }
}

function setCity(e) {
  if (e.which == 13 || e.keyCode == 13) {
    if(e.target.innerText ==='') {
      if(localStorage.getItem('city')) {
        city.textContent = localStorage.getItem('city');
      }else {
        city.textContent = 'Minsk';
      }
    } else {
      localStorage.setItem('city', e.target.innerText);
    }
    getWeather();
    city.blur();
  }
}

function setCityBlur(e) {
  if(city.textContent ==='') {
    if(localStorage.getItem('city')) {
      city.textContent = localStorage.getItem('city');
    }else {
      city.textContent = 'Minsk';
    }
  } else {
    localStorage.setItem('city', e.target.innerText);
  }
  getWeather();
}

function clearCityField(){
  city.textContent = '';
}

function rotateBtn(e) {
  let start = Date.now();

  let timer = setInterval(function () {
    let timePassed = Date.now() - start;
    e.target.style.transform = `rotate(${timePassed}deg)`;
    if (timePassed > 180) clearInterval(timer);
  }, 20);
}

function closeModal() {
  modalContainer.classList.add("modal_closed");
  modalOverlay.classList.add("modal_closed");
  city.textContent = 'Minsk';
  localStorage.setItem('city', 'Minsk');
  getWeather();
}


name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', clearNameField);
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', clickFocusField);
btn.addEventListener('click', getImage);
btn.addEventListener('click', rotateBtn);
document.addEventListener('DOMContentLoaded', getQuote);
btnQuote.addEventListener('click', getQuote);
btnQuote.addEventListener('click', rotateBtn);
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCityBlur);
city.addEventListener('click', clearCityField);
modalCloseBtn.addEventListener('click', closeModal);
modalOkBtn.addEventListener('click', closeModal);

// Run
showTime();
showDay()
setBgGreet();
getName();
getFocus();