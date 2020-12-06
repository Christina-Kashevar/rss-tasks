export default class Play {
  constructor() {
   this.mode = 'train';
  }

  init() {
    this.addEvents();
  }

  addEvents() {
    this.switcher = document.querySelector("#myonoffswitch");
    this.switcher.addEventListener('click', this.changeMode);
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
      };
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
    this.startBtn = document.querySelector('.btn');
    this.startBtn.classList.add('repeat');
    this.mistakes = 0;
    this.startBtn.removeEventListener('click', this.startGame)
    this.wordsOnPage = [];
    this.wordsLeftToGuess = 8;
    document.querySelectorAll('.card').forEach( card => {
      this.wordsOnPage.push(card.dataset.word);
    });
    this.wordsOnPage.sort(() => Math.random() - 0.5);
    this.gameLogic();
  }

  gameLogic = () => {
    this.audio = document.querySelector('.audio');
    if (!this.audio) return;
    this.audio.src = `./assets/audio/${this.wordsOnPage[this.wordsOnPage.length-1]}.mp3`;
    this.audio.play();
    document.querySelector('.repeat').addEventListener('click', () => {
      this.audio.play();
    })
    document.querySelectorAll('.card').forEach( card => {
      card.addEventListener('click', this.checkWord)
    });
  }

  checkWord = (e) => {
    if(this.mode === 'train' || !this.wordsOnPage.length) return;
    this.audioStar = document.querySelector('.starSound');
    if (!this.audioStar) return;
    let clickedWord = e.target.closest('.card').dataset.word;
    let star = document.createElement('div');
    if (clickedWord === this.wordsOnPage[this.wordsOnPage.length-1]) {
      star.classList.add('star-win');
      this.audioStar.src = './assets/audio/correct.mp3';
      e.target.classList.add('inactive');
      if(this.wordsOnPage.length > 1) {
        this.wordsOnPage.pop();
        setTimeout(this.gameLogic,1000);
      } else {
        setTimeout(this.finishGame,300);
      }
    } else {
      star.classList.add('star-error');
      if( e.target.classList.contains('inactive')) return;
      this.audioStar.src = './assets/audio/error.mp3';
      this.mistakes += 1;
    }
    document.querySelector('.rating').append(star);
    this.audioStar.play();
  }

  finishGame = () => {
    const mistakesMsg = this.mistakes === 0 ? 'WIN!' : `${this.mistakes} errors`;
    const finishImg = document.querySelector('.modal img');
    finishImg.src = this.mistakes === 0 ? './assets/img/success.jpg' : './assets/img/failure.jpg';
    const finishText = document.querySelector('.modal p');
    finishText.innerHTML = mistakesMsg;
    document.querySelector('.modal-overlay').classList.remove('modal_closed');
    document.querySelector('.modal').classList.remove('modal_closed');
    this.audioStar.src = this.mistakes === 0 ? './assets/audio/success.mp3': './assets/audio/failure.mp3';
    this.audioStar.play();
  }

  changeMode = () => {
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
      document.querySelector('.rating').innerHTML ='';
      document.querySelectorAll('.front').forEach(card => {
        if (card.classList.contains('inactive')) {
          card.classList.remove('inactive');
        }
      })
    }
    this.changeCardsStyle();
  }
}

