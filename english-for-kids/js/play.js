export default class Play {
  constructor() {
   this.mode = 'train';
  }

  init() {
    this.addEvents();
  }

  addEvents() {
    console.log(this.mode)
    this.switcher = document.querySelector("#myonoffswitch");
    this.switcher.addEventListener('click', this.changeMode);
    // document.querySelector("#myonoffswitch").addEventListener('click', this.changeMode);
    console.log(this.switcher)
  }

  changeCardsStyle = () => {
    if(this.mode === 'play') {
      document.querySelectorAll('.card').forEach( card => {
        card.classList.add('card-cover')
      });
      document.querySelectorAll('.rotate').forEach( card => {
        card.classList.add('none')
      });
      document.querySelectorAll('.card-header').forEach( card => {
        card.classList.add('none')
      });
      if (document.querySelector('.btn') && document.querySelector('.btn').classList.contains('none')) {
        document.querySelector('.btn').classList.remove('none');
      }
    } else {
      document.querySelectorAll('.card').forEach( card => {
        card.classList.remove('card-cover');
      });
      document.querySelectorAll('.rotate').forEach( card => {
        card.classList.remove('none')
      });
      document.querySelectorAll('.card-header').forEach( card => {
        card.classList.remove('none')
      });
      if( document.querySelector('.btn') && !document.querySelector('.btn').classList.contains('none')) {
        document.querySelector('.btn').classList.add('none');
      }
    }
  }

  startGame = () => {
    this.startBtn.classList.add('repeat');
    let wordsOnPage = [];
    document.querySelectorAll('.card').forEach( card => {
      wordsOnPage.push(card.dataset.word);
    });
    wordsOnPage.sort(() => Math.random() - 0.5);
  }

  changeMode = () => {
    console.log(5)
    if(!this.switcher.checked) {
      this.mode = 'play';
      this.startBtn = document.querySelector('.btn');
      if (this.startBtn) {
        if (this.startBtn.classList.contains('repeat')) {
          this.startBtn.classList.remove('repeat')
        }
        this.startBtn.addEventListener('click', this.startGame);
      }
    } else {
      this.mode = 'train';
    }
    this.changeCardsStyle()
  }
}

