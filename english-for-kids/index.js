import cards from './js/cards.js';
import {HomeComponent, StatisticComponent, CardsComponent} from './js/components.js';
import Play from './js/play.js';

const navInput = document.querySelector("#menuToggle > input[type=checkbox]");
const switcher = document.querySelector("#myonoffswitch");
const menu = document.querySelector("#menu");
let currentPage = 'Main page';
const play = new Play()

switcher.addEventListener('click', changeBgDependingOnMode);
menu.addEventListener('click', changePages);

document.addEventListener('click', (e) => {
  if(!document.querySelector('.modal').classList.contains('modal_closed')) {
    currentPage = 'Main page';
    renderCards();
    addActiveClassToLink();
    document.querySelector('.modal-overlay').classList.add('modal_closed');
    document.querySelector('.modal').classList.add('modal_closed');
    return;
  };
  if (e.target.closest('.table-heading')) {
    const statHeading = document.querySelectorAll(".table-heading div");
    statHeading.forEach( elem => {
      if(e.target === elem) {
        if(e.target.classList.contains('active-td')) {
          e.target.classList.toggle('reverse')
        } else {
          elem.classList.add('active-td');
        }
      } else {
        elem.classList.remove('active-td');
        elem.classList.remove('reverse');
      }
    })
    sortStat(e.target);
  }
  if (!e.target.closest('#menu') && !e.target.closest('#menuToggle')) {
    navInput.checked = false;
  }
})

function writeToLocalStorage() {
  let value = [cards[0]];
  const categoryAmount = 8;
  for (let i = 0; i < categoryAmount; i++) {
    let valueElement = [];
    for (let j = 0; j < categoryAmount; j++) {
      valueElement.push({
        word: cards[i+1][j].word,
        translation: cards[i+1][j].translation,
        correct: 0,
        wrong: 0,
        asked: 0,
        errors: 0
      })
    }
    value.push(valueElement)
  }
  localStorage.setItem('play', JSON.stringify(value))
}

if(!localStorage.getItem('play')) { writeToLocalStorage()};

let cardsFromStorage = JSON.parse(localStorage.getItem('play'));

renderCards();
play.init();

function renderCards() {
  if(currentPage === 'Main page') {
    document.querySelector('.main-wrapper').innerHTML = HomeComponent.render();
    changeBgDependingOnMode();
    openCatPage()
  } else if (currentPage === 'Statistic') {
    cardsFromStorage = JSON.parse(localStorage.getItem('play'));
    let heading = `
    <div class ="stat-wrapper">
      <div class="stat-btn-wrapper">
        <button class="stat-btn" id="repeat">Repeat Difficult Words</button>
        <button class="stat-btn" id="reset">Reset</button>
      </div>
      <div class="table-heading">
        <div class="stat-word">Word</div>
        <div class="stat-translation">Translation</div>
        <div class="stat-asked">Asked</div>
        <div class="stat-correct">Correct</div>
        <div class="stat-wrong">Wrong</div>
        <div class="stat-errors">% errors</div>
      </div>
      <div class="table"></div>
    </div>`
    document.querySelector('.main-wrapper').innerHTML = heading;
    document.querySelector('.table').innerHTML = StatisticComponent.render(cardsFromStorage);
    document.querySelector('#repeat').addEventListener('click', repeatWords);
    document.querySelector('#reset').addEventListener('click', resetWords);
  } else {
    const categoryInCardsIndex = cards[0].indexOf(currentPage) + 1;
    const parametersToRender = cards[categoryInCardsIndex];
    document.querySelector('.main-wrapper').innerHTML = CardsComponent.render(parametersToRender);
    if(!switcher.checked) {
      play.changeCardsStyle()
    }
    play.pageIndex = categoryInCardsIndex;
    document.querySelector('.cards-block').addEventListener('click', rotateCard);
    document.querySelectorAll('.card').forEach( card => {
      card.addEventListener('mouseleave', rotateCardBack);
      card.addEventListener('click', playSound);
    });
    document.querySelector('.btn').addEventListener('click', play.startGame)
  }
}

function addActiveClassToLink() {
  const menuLinks = document.querySelectorAll("#menu a");
  for (let i = 0, menuLinksCount = menuLinks.length; i < menuLinksCount; i++) {
    if (currentPage === menuLinks[i].childNodes[0].innerHTML){
      menuLinks[i].classList.add("active");
    } else {
      menuLinks[i].classList.remove("active");
    }
  }
}

function changeBgDependingOnMode() {
  const mainCards = document.querySelectorAll('.main-card');
  if (!switcher.checked) {
    mainCards.forEach(item => {
      item.classList.add('play-mode')
    });
    menu.classList.add('play-mode');
  } else {
    mainCards.forEach(item=> {
     if (item.classList.contains('play-mode')) {
        item.classList.remove('play-mode')
      }
    })
    if (menu.classList.contains('play-mode')) {
      menu.classList.remove('play-mode')
    }
  }
}

function changePages(e) {
  if( e.target.tagName !== 'LI') return;
  navInput.checked = false;
  currentPage = e.target.innerHTML
  renderCards();
  addActiveClassToLink();
}

function openCatPage(){
  document.querySelector('.cards-block').addEventListener('click', (e) => {
    if (!e.target.closest('.main-card')) return;
    const targetCategory = e.target.closest('.main-card').innerText;
    if(!targetCategory) return;
    currentPage = targetCategory;
    renderCards();
    addActiveClassToLink();
  });
}

function rotateCard(e) {
  if (e.target.classList.contains('rotate')) {
    const targetCard = e.target.closest('.card');
    targetCard.classList.add('translate');
  }
}

function rotateCardBack (e) {
  if(e.target.classList.contains('translate')) {
    e.target.classList.remove('translate')
  }
}

function playSound(e) {
  const targetCard = e.target.closest('.card');
  if (!switcher.checked) return;
  if(targetCard.classList.contains('translate') || e.target.classList.contains('rotate')) {
    return;
  }
  const audio = document.querySelector('.audio');
  if (!audio) return;
  audio.src = `./assets/audio/${targetCard.dataset.word}.mp3`;
  audio.play();
}

function sortStat(target) {
  let storageCopy = JSON.parse(localStorage.getItem('play')).slice();
  if (target.classList.contains('stat-word')) {
    sortStat('word')
  } else if (target.classList.contains('stat-translation')) {
    sortStat('translation')
  } else if(target.classList.contains('stat-asked')) {
    sortStat('asked')
  } else if(target.classList.contains('stat-correct')) {
    sortStat('correct')
  } else if(target.classList.contains('stat-wrong')) {
    sortStat('wrong')
  } else if(target.classList.contains('stat-errors')) {
    sortStat('errors')
  }

  function sortStat(key) {
    for (let i =1; i < storageCopy.length; i++) {
      storageCopy[i].sort((a, b) => a[key] > b[key] ? 1 : -1);
      if(target.classList.contains('reverse')) {
        storageCopy[i].reverse();
      }
   }
  }
  document.querySelector('.table').innerHTML = StatisticComponent.render(storageCopy)
}

function resetWords() {
  const categoryAmount = 8;
    for (let i = 1; i < categoryAmount; i++) {
      for (let j = 0; j < categoryAmount; j++) {
        cardsFromStorage[i][j].correct = 0;
        cardsFromStorage[i][j].wrong = 0;
        cardsFromStorage[i][j].asked = 0;
        cardsFromStorage[i][j].errors = 0;
      }
    }
  document.querySelector('.table').innerHTML = StatisticComponent.render(cardsFromStorage);
  localStorage.setItem('play', JSON.stringify(cardsFromStorage))
}

function repeatWords() {

}
