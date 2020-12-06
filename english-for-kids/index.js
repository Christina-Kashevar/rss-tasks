import cards from './js/cards.js';
import {HomeComponent, CardsComponent} from './js/components.js';
import Play from './js/play.js';

const navInput = document.querySelector("#menuToggle > input[type=checkbox]");
const switcher = document.querySelector("#myonoffswitch");
const menu = document.querySelector("#menu");
let currentPage = 'Main page';
const play = new Play()

switcher.addEventListener('click', changeBgDependingOnMode);
menu.addEventListener('click', changePages);
renderCards();
play.init();

document.addEventListener('click', (e) => {
  if(!document.querySelector('.modal').classList.contains('modal_closed')) {
    currentPage = 'Main page';
    renderCards();
    addActiveClassToLink();
    document.querySelector('.modal-overlay').classList.add('modal_closed');
    document.querySelector('.modal').classList.add('modal_closed');
    return;
  }
  if (!e.target.closest('#menu') && !e.target.closest('#menuToggle')) {
    navInput.checked = false;
  }
})

function renderCards() {
  if(currentPage === 'Main page') {
    document.querySelector('.main-wrapper').innerHTML = HomeComponent.render();
    changeBgDependingOnMode();
    openCatPage()
  } else {
    const categoryInCardsIndex = cards[0].indexOf(currentPage) + 1;
    const parametersToRender = cards[categoryInCardsIndex];
    document.querySelector('.main-wrapper').innerHTML = CardsComponent.render(parametersToRender);
    if(!switcher.checked) {
      play.changeCardsStyle()
    }
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