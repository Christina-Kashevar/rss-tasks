import cards from './js/cards.js';
import { HomeComponent, StatisticComponent, CardsComponent } from './js/components.js';
import Play from './js/play.js';

const navInput = document.querySelector('#menuToggle > input[type=checkbox]');
const switcher = document.querySelector('#myonoffswitch');
const menu = document.querySelector('#menu');
let currentPage = 'Main page';
const play = new Play();

alert('Если у Вас не загружается приложение, попробуйте, пожалуйста, открыть в другом браузере или устройстве. Возможна проблема в редких случаях с local storage');

function writeToLocalStorage() {
  const value = [cards[0]];
  const categoryAmount = 8;
  for (let i = 0; i < categoryAmount; i += 1) {
    const valueElement = [];
    for (let j = 0; j < categoryAmount; j += 1) {
      valueElement.push({
        word: cards[i + 1][j].word,
        translation: cards[i + 1][j].translation,
        correct: 0,
        wrong: 0,
        asked: 0,
        errors: 0,
      });
    }
    value.push(valueElement);
  }

  localStorage.setItem('play', JSON.stringify(value));
}

if (localStorage.getItem('play') === null || localStorage.getItem('play').length < 100) {
  writeToLocalStorage();
}



function changeBgDependingOnMode() {
  const mainCards = document.querySelectorAll('.main-card');
  if (!switcher.checked) {
    mainCards.forEach((item) => {
      item.classList.add('play-mode');
    });
    menu.classList.add('play-mode');
  } else {
    mainCards.forEach((item) => {
      if (item.classList.contains('play-mode')) {
        item.classList.remove('play-mode');
      }
    });
    if (menu.classList.contains('play-mode')) {
      menu.classList.remove('play-mode');
    }
  }
}

function addActiveClassToLink() {
  const menuLinks = document.querySelectorAll('#menu a');
  for (let i = 0, menuLinksCount = menuLinks.length; i < menuLinksCount; i += 1) {
    if (currentPage === menuLinks[i].childNodes[0].innerHTML) {
      menuLinks[i].classList.add('active');
    } else {
      menuLinks[i].classList.remove('active');
    }
  }
}

let cardsFromStorage;

try {
  cardsFromStorage = JSON.parse(localStorage.getItem('play'));
} catch(e) {
  writeToLocalStorage();
  cardsFromStorage = JSON.parse(localStorage.getItem('play'))
}

function addTrain(word) {
  const results = cardsFromStorage;
  const targetCat = results[play.pageIndex];
  const currentWord = targetCat.find((i) => {
    if (word === 'ice') { word = 'ice cream'; }
    return i.word === word;
  });
  currentWord.asked += 1;
  results[play.pageIndex] = targetCat;
  localStorage.setItem('play', JSON.stringify(results));
}

function playSound(e) {
  const targetCard = e.target.closest('.card');
  if (!switcher.checked) return;
  if (targetCard.classList.contains('translate') || e.target.classList.contains('rotate')) {
    return;
  }
  const audio = document.querySelector('.audio');
  if (!audio) return;
  audio.src = `./assets/audio/${targetCard.dataset.word}.mp3`;
  audio.play();
  addTrain(targetCard.dataset.word);
}

function openCatPage() {
  document.querySelector('.cards-block').addEventListener('click', (e) => {
    if (!e.target.closest('.main-card')) return;
    const targetCategory = e.target.closest('.main-card').innerText;
    if (!targetCategory) return;
    currentPage = targetCategory;
    renderCards();
    addActiveClassToLink();
  });
}

function rotateCardBack(e) {
  if (e.target.classList.contains('translate')) {
    e.target.classList.remove('translate');
  }
}

function rotateCard(e) {
  if (e.target.classList.contains('rotate')) {
    const targetCard = e.target.closest('.card');
    targetCard.classList.add('translate');
  }
}

function renderCards(list) {
  if (currentPage === 'Main page') {
    document.querySelector('.main-wrapper').innerHTML = HomeComponent.render();
    changeBgDependingOnMode();
    openCatPage();
  } else if (currentPage === 'Statistic') {
    cardsFromStorage = JSON.parse(localStorage.getItem('play'));
    const heading = `
    <div class ="stat-wrapper">
      <div class="stat-btn-wrapper">
        <button class="stat-btn" id="repeat">Repeat Difficult Words</button>
        <button class="stat-btn" id="reset">Reset</button>
      </div>
      <div class="table-heading">
        <div class="stat-word">Word</div>
        <div class="stat-translation">Translation</div>
        <div class="stat-asked">Trained</div>
        <div class="stat-correct">Correct</div>
        <div class="stat-wrong">Wrong</div>
        <div class="stat-errors">% errors</div>
      </div>
      <div class="table"></div>
    </div>`;
    document.querySelector('.main-wrapper').innerHTML = heading;
    document.querySelector('.table').innerHTML = StatisticComponent.render(cardsFromStorage);
    document.querySelector('#repeat').addEventListener('click', repeatWords);
    document.querySelector('#reset').addEventListener('click', resetWords);
  } else {
    if (currentPage === 'Difficult words') {
      document.querySelector('.main-wrapper').innerHTML = CardsComponent.render(list);
    } else {
      const categoryInCardsIndex = cards[0].indexOf(currentPage) + 1;
      const parametersToRender = cards[categoryInCardsIndex];
      document.querySelector('.main-wrapper').innerHTML = CardsComponent.render(parametersToRender);
      play.pageIndex = categoryInCardsIndex;
    }
    if (!switcher.checked) {
      play.changeCardsStyle();
    }
    document.querySelector('.cards-block').addEventListener('click', rotateCard);
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('mouseleave', rotateCardBack);
      card.addEventListener('click', playSound);
    });
    document.querySelector('.btn').addEventListener('click', play.startGame);
  }
}

function repeatWords() {
  const difficultWords = [];
  const categoryAmount = 8;
  for (let i = 0; i <= categoryAmount; i += 1) {
    for (let j = 0; j < categoryAmount; j += 1) {
      if (cardsFromStorage[i][j].errors > 0) {
        cardsFromStorage[i][j].image = `./assets/img/${cardsFromStorage[i][j].word}.jpg`;
        if (cardsFromStorage[i][j].word === 'ice cream') {
          cardsFromStorage[i][j].image = './assets/img/ice-cream.jpg';
        }
        difficultWords.push(cardsFromStorage[i][j]);
      }
    }
  }
  if (difficultWords.length === 0) {
    document.querySelector('.table').innerHTML = '<p>There are no difficult words</p>';
    return;
  }
  if (difficultWords.length > 8) {
    difficultWords.sort((a, b) => (a.errors > b.errors ? 1 : -1));
    difficultWords.splice(8, difficultWords.length - 8);
  }
  play.difficultWords = difficultWords;
  currentPage = 'Difficult words';
  renderCards(difficultWords);
}

function resetWords() {
  const categoryAmount = 8;
  for (let i = 1; i < categoryAmount; i += 1) {
    for (let j = 0; j < categoryAmount; j += 1) {
      cardsFromStorage[i][j].correct = 0;
      cardsFromStorage[i][j].wrong = 0;
      cardsFromStorage[i][j].asked = 0;
      cardsFromStorage[i][j].errors = 0;
    }
  }
  document.querySelector('.table').innerHTML = StatisticComponent.render(cardsFromStorage);
  localStorage.setItem('play', JSON.stringify(cardsFromStorage));
}

function changePages(e) {
  if (e.target.tagName !== 'LI') return;
  navInput.checked = false;
  currentPage = e.target.innerHTML;
  renderCards();
  addActiveClassToLink();
}

function sortStat(target) {
  const storageCopy = JSON.parse(localStorage.getItem('play')).slice();
  function sortStatistic(key) {
    for (let i = 1; i < storageCopy.length; i += 1) {
      storageCopy[i].sort((a, b) => (a[key] > b[key] ? 1 : -1));
      if (target.classList.contains('reverse')) {
        storageCopy[i].reverse();
      }
    }
  }
  if (target.classList.contains('stat-word')) {
    sortStatistic('word');
  } else if (target.classList.contains('stat-translation')) {
    sortStatistic('translation');
  } else if (target.classList.contains('stat-asked')) {
    sortStatistic('asked');
  } else if (target.classList.contains('stat-correct')) {
    sortStatistic('correct');
  } else if (target.classList.contains('stat-wrong')) {
    sortStatistic('wrong');
  } else if (target.classList.contains('stat-errors')) {
    sortStatistic('errors');
  }
  document.querySelector('.table').innerHTML = StatisticComponent.render(storageCopy);
}

switcher.addEventListener('click', changeBgDependingOnMode);
menu.addEventListener('click', changePages);

document.addEventListener('click', (e) => {
  if (!document.querySelector('.modal').classList.contains('modal_closed')) {
    currentPage = 'Main page';
    renderCards();
    addActiveClassToLink();
    document.querySelector('.modal-overlay').classList.add('modal_closed');
    document.querySelector('.modal').classList.add('modal_closed');
    return;
  }
  if (e.target.closest('.table-heading')) {
    const statHeading = document.querySelectorAll('.table-heading div');
    statHeading.forEach((elem) => {
      if (e.target === elem) {
        if (e.target.classList.contains('active-td')) {
          e.target.classList.toggle('reverse');
        } else {
          elem.classList.add('active-td');
        }
      } else {
        elem.classList.remove('active-td');
        elem.classList.remove('reverse');
      }
    });
    sortStat(e.target);
  }
  if (!e.target.closest('#menu') && !e.target.closest('#menuToggle')) {
    navInput.checked = false;
  }
});

renderCards();
play.init();
