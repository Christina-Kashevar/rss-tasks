//Создаем массив из 48 псевдослучайых элементов 
let pets = []; // 8
let fullPetsList = []; // 48
let index = 0;
let currentPage = 0;
const request = new XMLHttpRequest();
request.open('GET', './pets.json');
// request.onload = () => {console.log(request.response)};
fetch('./pets.json').then(res => res.json()).then(list => {
  pets = list;

  fullPetsList = (() => {
    let tempArr = [];

    for (let i = 0; i < 6; i++) {
      const newPets = pets;

      for (let j = pets.length; j > 0; j--) {
        let randInd = Math.floor(Math.random() * j);
        const randElem = newPets.splice(randInd, 1)[0];
        newPets.push(randElem);
      }

      tempArr = [...tempArr, ...newPets];
    }
    return tempArr;
  })();

  fullPetsList = sort863(fullPetsList);

renderArticlesToDom();

//   document.querySelector("#currentPage").innerText = (currentPage+1).toString();

//   for (let i = 0; i < (fullPetsList.length / 6); i++) {
//     const stepList = fullPetsList.slice(i * 6, (i * 6) + 6);

//     for (let j = 0; j < 6; j++) {
//       stepList.forEach((item, ind) => {
//         if ( item.name === stepList[j].name && (ind !== j) ) {
//           document.querySelector("#pets").children[(i * 6) + j].style.border = '5px solid red';
//         }
//       })
//     }
//   }
})


request.send();

const sort863 = (list) => {
  let unique8List = [];
  let length = list.length;
  for (let i = 0; i < length / 8; i++) {
    const uniqueStepList = [];
    for (j = 0; j < list.length; j++) {
      if (uniqueStepList.length >= 8) {
        break;
      }
      const isUnique = !uniqueStepList.some((item) => {
        return item.name === list[j].name;
      });
      if (isUnique) {
        uniqueStepList.push(list[j]);
        list.splice(j, 1);
        j--;
      }
    }
    unique8List = [...unique8List, ...uniqueStepList];
  }
  list = unique8List;


  list = sort6recursively(list);

  return list;
}

const sort6recursively = (list) => {
  const length = list.length;

  for (let i = 0; i < (length / 6); i++) {
    const stepList = list.slice(i * 6, (i * 6) + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && (ind !== j);
      });

      if (duplicatedItem !== undefined) {
        const ind = (i * 6) + j;
        const which8OfList = Math.trunc(ind / 8);

        list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

        sort6recursively(list);
      }
    }
  }

  return list;
}

//Создаем одну карточку для отрисовки на странице
class Article {
    constructor({ name, img, ...rest }) {
        this.name = name;
        this.urlToImage = img;
    }

    // Article generator
    generateArticle() {
        let template = '';
        let article = document.createElement('article');
        article.className = 'our-friend-card';
        article.setAttribute('data-name', this.name);

        this.urlToImage &&
        (template += `<img class="our-friend-card__image" src=${this.urlToImage} alt=${this.name}>`)

        if (this.name) {
            template += `<h5>${this.name}</h5>`
        }
        template += `<button class="button button_bordered">Learn more</button>`

        article.innerHTML = template;
        return article;
    }
}

// Создаем модальное окно для POP UP
class Modal {
    constructor (classes) {
        this.classes = classes;
        this.modal = '';
        this.modalContent = '';
        this.modalCloseBtn = '';
        this.overlay = '';
    }

    buildModal(content) {
        console.log(5)
        if(document.querySelector('.overlay')) {
            return;
        }
        //Overlay
        this.overlay = this.createDomNode(this.overlay, 'div', 'overlay', 'overlay_modal');

        //Modal
        this.modal = this.createDomNode(this.modal, 'div', 'modal', this.classes);

        //Modal content
        this.modalContent = this.createDomNode(this.modalContent, 'div', 'modal__content');

        //Close Button
        this.modalCloseBtn = this.createDomNode(this.modalCloseBtn, 'button', 'modal-button');
        this.modalCloseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z" fill="#292929"/></svg>'

        this.setContent(content);

        this.appendModalElements();

        // Bind Events
        this.bindEvents();

        // Open Modal
        this.openModal();
    }

    createDomNode (node, element, ...classes){
        node = document.createElement(element);
        node.classList.add(...classes);
        return node
    };

    setContent(content) {
        if(typeof content === 'string') {
            this.modalContent.innerHTML = content;
        } else {
            this.modalContent.innerHTML = '';
            this.modalContent.appendChild(content);
        }
    }

    appendModalElements() {
        this.modal.append(this.modalCloseBtn);
        this.modal.append(this.modalContent);
        this.overlay.append(this.modal);
    }

    bindEvents() {
        this.modalCloseBtn.addEventListener('click', this.closeModal);
        this.overlay.addEventListener('click', this.closeModal);
        this.overlay.addEventListener('mouseover', this.closeBtnHover);
    }

    openModal() {
        document.body.append(this.overlay);
        document.body.classList.add('hidden')
    }

    closeModal(e) {
        let classes = e.target.classList;
        if(classes.contains('overlay') || classes.contains('modal-button')) {
            document.querySelector('.overlay').remove();
            document.body.classList.remove('hidden');
        }
    }

    closeBtnHover(e) {
        if (e.target === document.querySelector('.overlay')){
            document.querySelector('.modal-button').classList.add('hover')
        } else {
            document.querySelector('.modal-button').classList.remove('hover')
        }

    }
}


//Создаем одну карточку для отрисовки в POP UP
class ArticleModal extends Modal {
    constructor (classes, { name, img, type, breed, description, age, inoculations, diseases, parasites}) {
        super(classes);
        this.name = name;
        this.urlToImage = img;
        this.type = type;
        this.breed = breed;
        this.description = description;
        this.age = age;
        this.inoculations = inoculations;
        this.diseases = diseases;
        this.parasites = parasites;
    }

    // Article Modal generator
    generateContent() {
        let template = '';
        let article = document.createElement('div');
        article.className = 'article-modal__content';

        this.urlToImage &&
        (template += `<img class="our-friend-card__image" src=${this.urlToImage} alt=${this.name}>`)

        if (this.name || this.type || this.description || this.age || this.inoculations || this.diseases || this.parasites ) {
            template += `<div class="our-friend__content">`
            
            this.name &&
            (template += `<h3 class="our-friend__name">${this.name}</h3>`)

            if(this.type && this.breed) {
                (template += `<h5 class="our-friend__type">${this.type} - ${this.breed}</h5>`)
            }

            this.description &&
            (template += `<p class="our-friend__description">${this.description}</p>`)

            if(this.age || this.inoculations || this.diseases || this.parasites ) {
                template += `<ul class="our-friend__list">`

               this.age &&
               (template += `<li class="our-friend__list-item"><span class="list-item_bold">Age: </span>${this.age}</li>`)

                this.inoculations &&
               (template += `<li class="our-friend__list-item"><span class="list-item_bold">Inoculations: </span>${this.inoculations}</li>`)

                this.diseases &&
               (template += `<li class="our-friend__list-item"><span class="list-item_bold">Diseases: </span>${this.diseases}</li>`)

                this.parasites &&
               (template += `<li class="our-friend__list-item"><span class="list-item_bold">Parasites: </span>${this.parasites}</li>`)

                template += `</ul>`
            }

            template += `</div>`
        }

        article.innerHTML = template;
        return article;
    }

    renderModal() {
        let content = this.generateContent();
        super.buildModal(content);
    }
}

const renderArticlesToDom = () => {
    let ourFriendsCards = getOurFriendsCards();
    generateArticles(fullPetsList).forEach(article => {
        ourFriendsCards.append(article.generateArticle())
    })

    addOurFriendsClickHandler();
}

const getOurFriendsCards = () => {
    const ourFriendsContainer = document.querySelector('.layout-4-column');
    ourFriendsContainer.innerHTML = '';
    return ourFriendsContainer
}

const generateArticles = (fullPetsList) => {
    let articles = [];
    let petsPerPage = checkItemsPerPage();
    for (let i = index; i< ( index + petsPerPage ); i++ ) {
        articles.push(new Article(fullPetsList[i]))
    }
    // fullPetsList.forEach(article => {
    //     articles.push(new Article(article))
    // });
    return articles;
}

const checkItemsPerPage = () => {
    if (document.querySelector("body").offsetWidth > 1280) {
        return 8;
    } else if (document.querySelector("body").offsetWidth > 768 && document.querySelector("body").offsetWidth < 1280) {
        return 6;
    } else {
        return 3;
    }
}

const addOurFriendsClickHandler = () => {
    document.querySelector('.layout-4-column').addEventListener('click', (e) => {
        if (e.target.closest('.our-friend-card')) {
            let clickedStrategyName = e.target.closest('.our-friend-card').getAttribute('data-name');
            let clickedStrategyData = getClickedData(clickedStrategyName);

            renderArticleModalWindow(clickedStrategyData);
        }
    })
}

const getClickedData = (name) => {
    return fullPetsList.find(article => article.name == name)
}

const renderArticleModalWindow = (article) => {
    let modal = new ArticleModal ('article-modal', article);
    modal.renderModal();
}


// Пагинация
const btnToFirstPage = document.querySelector('#to-first-page');
const btnToPrevPage = document.querySelector('#to-previous-page');
const btnCurrentPage = document.querySelector('#current-page');
const btnToNextPage = document.querySelector("#to-next-page");
const btnToLastPage = document.querySelector('#to-last-page');

const openFirstPage = () => {
    index = 0;
    renderArticlesToDom();
    removeInactiveClass();
    removeDisabled();
    currentPage = 0;
    btnToFirstPage.classList.add('button-pagination_inactive');
    btnToPrevPage.classList.add('button-pagination_inactive');
    btnToFirstPage.disabled = true;
    btnToPrevPage.disabled = true;
    btnCurrentPage.innerHTML = (currentPage+1).toString();
}

const openPrevPage = () => {
    if (currentPage > 0) {
        let petsPerPage = checkItemsPerPage();
        index -= petsPerPage;
        currentPage--;
      }
    renderArticlesToDom();
    removeInactiveClass();
    removeDisabled();
    if(currentPage < 1) {
        btnToFirstPage.classList.add('button-pagination_inactive');
        btnToPrevPage.classList.add('button-pagination_inactive');
        btnToFirstPage.disabled = true;
        btnToPrevPage.disabled = true;
    }
    btnCurrentPage.innerHTML = (currentPage+1).toString();
}

const openNextPage = () => {

    let petsPerPage = checkItemsPerPage();
    if (currentPage < (fullPetsList.length / petsPerPage )) {
        index += petsPerPage;
        currentPage++;
      }
 
    renderArticlesToDom();
    removeInactiveClass();
    removeDisabled();
    if(currentPage === (fullPetsList.length / petsPerPage - 1)) {
        btnToLastPage.classList.add('button-pagination_inactive');
        btnToNextPage.classList.add('button-pagination_inactive');
        btnToLastPage.disabled = true;
        btnToNextPage.disabled = true;
    }
    btnCurrentPage.innerHTML = (currentPage+1).toString();
}

const openLastPage = () => {

    let petsPerPage = checkItemsPerPage();
    index = fullPetsList.length - petsPerPage;
    currentPage = fullPetsList.length/petsPerPage -1;

    renderArticlesToDom();
    removeInactiveClass();
    removeDisabled();
    btnToLastPage.classList.add('button-pagination_inactive');
    btnToNextPage.classList.add('button-pagination_inactive');
    btnToLastPage.disabled = true;
    btnToNextPage.disabled = true;
    btnCurrentPage.innerHTML = (currentPage+1).toString();
}


const removeInactiveClass = () => {
    document.querySelectorAll('.button-pagination').forEach( item =>{
        if(item.classList.contains('button-pagination_inactive')) {
            item.classList.remove('button-pagination_inactive')
        }
    })
}

const removeDisabled =() => {
    document.querySelectorAll('.button-pagination').forEach( item => {
        item.disabled = false;
    })
}

btnToFirstPage.addEventListener('click', openFirstPage);
btnToPrevPage.addEventListener('click', openPrevPage);
btnToNextPage.addEventListener('click', openNextPage);
btnToLastPage.addEventListener('click', openLastPage);

// hamburger
const btnHamburger = document.querySelector('#open-hamburger');

const openHamburger = () => {
    document.querySelector('.header-logo-main').style.opacity =0;
    document.querySelector('#open-hamburger').style.opacity =0;
    document.querySelector('.header-hamburger-wrapper').classList.remove('animate');
    document.querySelector('.overlay-hamburger').classList.remove('none');
    document.body.classList.add('hidden');
    setTimeout(function(){
        document.querySelector('#close-hamburger').classList.add('rotate90');
    },1000)
}

btnHamburger.addEventListener('click', openHamburger);

const btnHamburgerClose = document.querySelector('#close-hamburger');

const closeHamburger = (e) => {
    let classes = e.target.classList;
    if(classes.contains('overlay-hamburger') || classes.contains('header__hamburger') || 
    classes.contains('hamburger__line') || classes.contains('hamburger') || classes.contains('navigation__link_active')) {
        setTimeout(function(){
            document.querySelector('.header-logo-main').style.opacity =1;
            document.querySelector('#open-hamburger').style.opacity =1;
            document.querySelector('.overlay-hamburger').classList.add('none');
            document.body.classList.remove('hidden');
            },1500)
        document.querySelector('#close-hamburger').classList.remove('rotate90');
        document.querySelector('.header-hamburger-wrapper').classList.add('animate');
        document.querySelector('#close-hamburger').classList.add('animateRotate');
    }
}

btnHamburgerClose.addEventListener('click', closeHamburger);
document.querySelector('.overlay-hamburger').addEventListener('click', closeHamburger);