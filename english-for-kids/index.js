import cards from './js/cards.js'

const navInput = document.querySelector("#menuToggle > input[type=checkbox]");
const switcher = document.querySelector("#myonoffswitch");
const menu = document.querySelector("#menu");
let currentPage = 'Main page';

const HomeComponent = {
  render: () => {
    return `
      <div class="cards-block">
        <div class="main-card">
          <img src="./assets/img/dance.jpg" alt="Action (set A)">Action (set A)
        </div>
        <div class="main-card">
          <img src="./assets/img/sing.jpg" alt="Action (set B)">Action (set B)
        </div>
        <div class="main-card">
          <img src="./assets/img/swim.jpg" alt="Action (Set C)">Action (Set C)
        </div>
        <div class="main-card">
          <img src="./assets/img/surprised.jpg" alt="Adjective">Adjective
        </div>
        <div class="main-card">
          <img src="./assets/img/rabbit.jpg" alt="Animal (set A)">Animal (set A)
        </div>
        <div class="main-card">
          <img src="./assets/img/dog.jpg" alt="Animal (set B)">Animal (set B)
        </div>
        <div class="main-card">
          <img src="./assets/img/dress.jpg" alt="Clothes">Clothes
        </div>
        <div class="main-card">
          <img src="./assets/img/happy.jpg" alt="Emotions">Emotions
        </div>
    </div>
    `;
  }
};

const CardsComponent = {
  render: (param) => {
    let renderElement = '<div class="cards-block">'
    for (let i = 0; i < param.length; i++) {
      renderElement += `
      <div class="card-container">
      <div class="card" data-word=${param[i]['word']}>
        <div class="front" style="background-image: url(${param[i]['image']});">
          <div class="card-header">${param[i]['word']}</div>
        </div>
        <div class="back hidden" style="background-image: url(${param[i]['image']});">
          <div class="card-header">${param[i]['translation']}</div>
        </div>
        <div class="rotate"></div>
      </div>
    </div>`
    }

    renderElement += '</div>'
    return renderElement;
  }
};

// class App {
//   constructor(){
//     navInputChecked: false;
//     swictherChecked: false;
//   }

//   router = {
//     main: HomeComponent,
//     cards: CardsComponent,
//   };
// }


// updateState()

function renderCards() {
  if(currentPage === 'Main page') {
    document.querySelector('.main-wrapper').innerHTML = HomeComponent.render();
    changeBgDependingOnMode();
    openCatPage()
  } else {
    const categoryInCards = cards[0].indexOf(currentPage) + 1;
    const parametersToRender = cards[categoryInCards];
    document.querySelector('.main-wrapper').innerHTML = CardsComponent.render(parametersToRender);
    document.querySelector('.cards-block').addEventListener('click', rotateCard);
    document.querySelectorAll('.card').forEach( card => {
      card.addEventListener('mouseleave', rotateCardBack)
    })
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

document.addEventListener('click', (e)=>{
  if (!e.target.closest('#menu') && !e.target.closest('#menuToggle')) {
    navInput.checked = false;
  }
})

switcher.addEventListener('click', changeBgDependingOnMode)

function changeBgDependingOnMode() {
  const mainCards = document.querySelectorAll('.main-card');
  const menu = document.querySelector('#menu');
  if (!switcher.checked) {
    mainCards.forEach(item=> {
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

menu.addEventListener('click', changePages)

function changePages(e) {
  let target = e.target
  if( target.tagName !== 'LI') {
    return
  }
  navInput.checked = false;
  currentPage = target.innerHTML
  renderCards();
  addActiveClassToLink();
}

renderCards();

function openCatPage(){
  document.querySelector('.cards-block').addEventListener('click', (e) => {
    const targetCategory = e.target.closest('.main-card').innerText
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