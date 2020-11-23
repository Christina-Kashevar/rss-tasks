import { Field } from "./Field.js"

export default class Puzzle{
  constructor(){
    this.level = 4;
    this.audio = true;
    this.picture = true;
    this.isPause = false;
    this.timer = 0;
    this.interval;
    this.widthWindow;
    this.widthWrapper;
  }

  init() {
    this.wrapper = createDomNode(this.wrapper, 'div', null,'wrapper');
    this.header = createDomNode(this.header, 'div', null, 'flex');
    this.start = createDomNode(this.start, 'button', 'Start', 'start');
    this.pause = createDomNode(this.pause, 'button', 'Pause', 'pause');
    this.select = createDomNode(this.select, 'select', null, 'select-box');
    this.select.innerHTML = `<option class="select-option" value="3">3x3</option>
      <option class="select-option" value="4" selected>4x4</option>
      <option class="select-option" value="5">5x5</option>
      <option class="select-option" value="6">6x6</option>
      <option class="select-option" value="7">7x7</option>
      <option class="select-option" value="8">8x8</option>`;
    this.time = createDomNode(this.time, 'div', null, 'time');
    this.timeDecs = createDomNode(this.timeDecs, 'span', 'Time', 'description');
    this.timeCounter = createDomNode(this.timeCounter, 'span', '00:00', 'time-counter');
    this.time.append(this.timeDecs, this.timeCounter);

    this.moves = createDomNode(this.moves, 'div', null, 'moves');
    this.movesDecs = createDomNode(this.movesDecs, 'span', 'Moves', 'description');
    this.movesCounter = createDomNode(this.movesCounter, 'span', '0', 'moves-counter');
    this.moves.append(this.movesDecs, this.movesCounter);

    this.header.append(this.start, this.pause, this.select, this.time, this.moves);

    this.overlayResults = createDomNode(this.overlay, 'div', null, 'overlayResults', 'hidden');
    this.overlayResults.innerHTML=`<div class='score'></div><button class='hide-results'>Hide results</button>`;
    this.startField= createDomNode(this.startField, 'div', 'Let`s play!', 'start-field');
    this.startField.append(this.overlayResults)

    this.footer = createDomNode(this.footer, 'div', null, 'flex');
    this.audioBtn = createDomNode(this.audioBtn, 'button', null, 'audio');
    this.audioBtn.innerHTML = createIconHTML("music_note");
    this.pictureBtn = createDomNode(this.pictureBtn, 'button', "Picture", 'picture');
    this.savedGame = createDomNode(this.savedGame, 'button', 'Saved Game');
    this.results = createDomNode(this.results, 'button', 'Results');

    this.additionalInfo = createDomNode(this.additionalInfo, 'div', null, 'additional-info'); 

    this.footer.append(this.audioBtn, this.pictureBtn, this.savedGame, this.results)
    this.wrapper.append(this.header, this.startField, this.footer, this.additionalInfo)

    this.instruction = createDomNode(this.instruction, 'div', null, 'instruction');
    this.instruction.innerHTML = `<p>Чтобы начать новую игру: выберите вверху уровень сложности,включите/отключите картинки - кнопка Picture, нажмите Start или кликните по полю игры. Чтобы снова начать новую игру: 
    нажмите Pause, перед тем как нажать в появившемся окне New Game, настройте праметры новой игры (выберите вверху уровень сложности, включите/отключите картинки - кнопка Picture).<br> Чтобы сохранить игру, нажмите Pause, в появившемся окне нажмите Save Game. Если хотите сыграть в ранее сохраненную
    игру, нажмите кнопку Saved Game. Кнопка results показывает в модальном окне результаты по времени.
    Чтобы убрать модальное окно, нажмите Hide results. Приложение адаптивно, после уменьшения окна менее чем 420px, перезагрузите страницу</p>`

    document.body.append(this.wrapper, this.instruction);

    // Bind Events
    this.bindEvents();

  }

  bindEvents() {
    this.start.addEventListener('click', () => this.startGame()),
    this.startField.addEventListener('click', () => this.startGame()),
    this.pause.addEventListener('click', () => this.pauseGame()),
    this.select.addEventListener('click', () => this.selectLevelOfDifficulty()),
    this.audioBtn.addEventListener('click', () => this.toggleAudio()),
    this.pictureBtn.addEventListener('click', () => this.togglePicture()),
    this.savedGame.addEventListener('click', ()=> this.startSavedGame()),
    this.results.addEventListener('click', ()=> this.showResults() ),
    document.querySelector('.hide-results').addEventListener('click', ()=> this.hideResults() )
  }

  startGame() {
    this.widthWindow = document.documentElement.clientWidth;
    this.widthWrapper = this.widthWindow > 480 ? 400 : 300;
    this.field = new Field(this.level, this.audio, this.widthWrapper, this.picture);
    this.fieldNew = this.field.init();
    this.fieldNew.addEventListener('click', () => this.countMoves())
    this.fieldNew.addEventListener('dragend', () => this.countMoves())

    if (this.wrapper.contains(this.startField)) {
      this.wrapper.replaceChild(this.fieldNew,this.startField)
    }

    this.bindOverlayEvents()

    this.start.style.display = 'none';
    this.pause.style.display = 'inline-block';

    this.startTimer()
  }

  bindOverlayEvents() {
    this.saveGameBtn = document.querySelector('.save-game');
    this.saveGameBtn.addEventListener('click', () => this.saveGame())
    this.newGameBtnArr = document.querySelectorAll('.new-game');
    this.newGameBtnArr.forEach( item =>
      item.addEventListener('click', () => this.startNewGame()) );
    this.continueGameBtn = document.querySelector('.continue-game');
    this.continueGameBtn.addEventListener('click', () => this.resumeGame());
    if( document.querySelector('.hide-results')) {
      document.querySelector('.hide-results').addEventListener('click', ()=> this.hideResults() )
    }
  }

  startTimer() {
    let innerText = null;
    this.interval = setInterval( () => {
      if(!this.isPause && !this.field.finishGame) {
        this.timer++;
        this.field.timer = this.timer;
        innerText = new Date(this.timer*1000).toUTCString().split(/ /)[4]
        if( innerText[0]== 0 && innerText[1] == 0) {
          this.timeCounter.innerText = innerText.slice(3)
        } else {
          this.timeCounter.innerText = innerText
        }
      }
    }, 1000)
  }

  selectLevelOfDifficulty() {
    this.level = this.select.value
  }

  pauseGame(){
    this.overlay = document.querySelector('.overlay');
    this.isPause =true;
    if ( this.pause.innerHTML == 'Pause') {
      this.overlay.classList.remove('hidden')
      this.pause.innerHTML = 'Resume'
    } else {
      this.resumeGame(),
      this.pause.innerHTML = 'Pause'
    }
  }

  countMoves() {
    this.movesCounter.innerText= `${this.field.moves}`
  }

  resumeGame() {
    // this.isPause = false;
    this.overlay.classList.add('hidden');
    this.pause.innerHTML = 'Pause';
    if(document.querySelector('.overlayResults')) {
      if(document.querySelector('.overlayResults').classList.contains('hidden')) {
        this.isPause = false;
      }
    } else {
      this.isPause = false;
    }
  }

  startNewGame() {
    let oldPuzzle = document.querySelector(`.field`);
    this.widthWindow = document.documentElement.clientWidth;
    this.widthWrapper = this.widthWindow > 480 ? 400 : 300;
    this.field = new Field(this.level, this.audio,this.widthWrapper, this.picture);
    this.fieldNew = this.field.init();
    this.field.finishGame =false;
    this.fieldNew.addEventListener('click', () => this.countMoves())
    this.fieldNew.addEventListener('dragend', () => this.countMoves())
    this.overlay = document.querySelector('.overlay');
    this.overlay.classList.add('hidden');
    this.pause.innerHTML = 'Pause';
    this.wrapper.replaceChild(this.fieldNew, oldPuzzle);
    () => clearInterval(this.interval);
    this.bindOverlayEvents()
    this.isPause = false;
    this.timer = 0;
  }

  toggleAudio() {
    this.audio = !this.audio
    this.audioBtn.innerHTML = this.audio ? createIconHTML("music_note") : createIconHTML("music_off");
    if(this.field) this.field.audio = !this.field.audio
  }

  togglePicture() {
    this.picture = !this.picture
    this.pictureBtn.classList.toggle('inactive');
    if(this.field) this.field.picture = !this.field.picture;
  }

  saveGame(){
    localStorage.setItem('game', JSON.stringify(this.field))
  }

  startSavedGame(){
    let oldPuzzle = document.querySelector(`.field`);
    let prevField = JSON.parse(localStorage.getItem('game'));
    if (!prevField) {
      this.additionalInfo.innerText = `There is no saved game`;
      setTimeout( () => {
        this.additionalInfo.innerText = ''
      }, 2000)
      return;
    }
    this.timer = prevField.timer;
    this.moves = prevField.moves;
    this.isPause = false;
    this.widthWindow = document.documentElement.clientWidth;
    this.widthWrapper = this.widthWindow > 430 ? 400 : 300;
    // this.field = new Field(this.level, this.audio, this.picture, this.widthWrapper);
    this.field = new Field(this.level, this.audio, this.widthWrapper);
    this.field.cells = prevField.cells;
    this.field.level = prevField.level;
    this.field.finishGame = false;
    this.field.picture = prevField.picture;
    this.field.image = prevField.image;
    this.field.cellsQuantity = prevField.cellsQuantity;
    this.field.cellSize = prevField.cellSize;
    this.field.moves = prevField.moves;
    this.field.timer = prevField.timer;
    this.field.empty = prevField.empty

    this.fieldNew = this.field.initSavedGame();
    this.fieldNew.addEventListener('click', () => this.countMoves())
    if(oldPuzzle) {
      this.wrapper.replaceChild(this.fieldNew, oldPuzzle);
    } else {
      this.startTimer()
      this.start.style.display = 'none';
      this.pause.style.display = 'inline-block';
      this.wrapper.replaceChild(this.fieldNew,this.startField)
    }

    () => clearInterval(this.interval);
    
    this.countMoves()

    this.bindOverlayEvents()
    // this.startTimer()
  }

  showResults() {
    this.isPause = true;
    document.querySelector('.overlayResults').classList.remove('hidden');
    if(localStorage.getItem('results')) {
      let results = JSON.parse(localStorage.getItem('results'));
      let table = `<table><tr><th>Level</th><th>Moves</th><th>Time</th>`

      for(let i =0; i < results.length; i++) {
        let innerText = new Date(results[i][2]*1000).toUTCString().split(/ /)[4]
        if( innerText[0]== 0 && innerText[1] == 0) {
          innerText = innerText.slice(3)
        }
        table += `<tr><td>${results[i][0]}</td><td>${results[i][1]}</td><td>${innerText}</td></tr>`
      }
      table +='</table>'
      document.querySelector('.score').innerHTML = table;
    } else {
      document.querySelector('.score').innerText = 'There is no results'
    }
  }

  hideResults(){
    // this.isPause = false;
    document.querySelector('.overlayResults').classList.add('hidden');
    if(document.querySelector('.overlay').classList.contains('hidden')) {
      this.isPause = false;
    }
  }

}

function createDomNode (node, element, innerText, ...classes){
  node = document.createElement(element);
  node.classList.add(...classes);
  if (innerText) node.innerText = innerText;
  return node
};

function createIconHTML (icon_name) {
  return `<i class="material-icons">${icon_name}</i>`;
}

