import { Field } from "./Field.js"

class Puzzle {
  constructor(){
    this.level = 4;
    this.audio = true;
    this.picture = false;
    this.isPause = false;
    this.timer = 0;
    this.interval;
    this.widthWindow;
    this.widthWrapper;
  }

  init() {
    this.wrapper = this.createDomNode(this.wrapper, 'div', null,'wrapper');
    this.header = this.createDomNode(this.header, 'div', null, 'flex');
    this.start = this.createDomNode(this.start, 'button', 'Start', 'start');
    this.pause = this.createDomNode(this.pause, 'button', 'Pause', 'pause');
    this.select = this.createDomNode(this.select, 'select', null, 'select-box');
    this.select.innerHTML = `<option class="select-option" value="3">3x3</option>
      <option class="select-option" value="4" selected>4x4</option>
      <option class="select-option" value="5">5x5</option>
      <option class="select-option" value="6">6x6</option>
      <option class="select-option" value="7">7x7</option>
      <option class="select-option" value="8">8x8</option>`;
    this.time = this.createDomNode(this.time, 'div', null, 'time');
    this.timeDecs = this.createDomNode(this.timeDecs, 'span', 'Time', 'description');
    this.timeCounter = this.createDomNode(this.timeCounter, 'span', '00:00', 'time-counter');
    this.time.append(this.timeDecs, this.timeCounter);

    this.moves = this.createDomNode(this.moves, 'div', null, 'moves');
    this.movesDecs = this.createDomNode(this.movesDecs, 'span', 'Moves', 'description');
    this.movesCounter = this.createDomNode(this.movesCounter, 'span', '0', 'moves-counter');
    this.moves.append(this.movesDecs, this.movesCounter);

    this.header.append(this.start, this.pause, this.select, this.time, this.moves);

    this.overlayResults = this.createDomNode(this.overlay, 'div', null, 'overlayResults', 'hidden');
    this.overlayResults.innerHTML=`<div class='score'></div><button class='hide-results'>Hide results</button>`;
    this.startField= this.createDomNode(this.startField, 'div', 'Let`s play!', 'start-field');
    this.colorizeLetters();
    this.startField.append(this.overlayResults)

    this.footer = this.createDomNode(this.footer, 'div', null, 'flex');
    this.audioBtn = this.createDomNode(this.audioBtn, 'button', null, 'audio');
    this.audioBtn.innerHTML = this.createIconHTML("music_note");
    this.pictureBtn = this.createDomNode(this.pictureBtn, 'button', "Picture", 'picture', 'inactive');
    this.savedGame = this.createDomNode(this.savedGame, 'button', 'Saved Game');
    this.results = this.createDomNode(this.results, 'button', 'Results');

    this.additionalInfo = this.createDomNode(this.additionalInfo, 'div', null, 'additional-info'); 

    this.footer.append(this.audioBtn, this.pictureBtn, this.savedGame, this.results)
    this.wrapper.append(this.header, this.startField, this.footer, this.additionalInfo)
    document.body.append(this.wrapper);

    // Bind Events
    this.bindEvents();

  }

  createIconHTML (icon_name) {
    return `<i class="material-icons">${icon_name}</i>`;
  }

  createDomNode (node, element, innerText, ...classes){
    node = document.createElement(element);
    node.classList.add(...classes);
    if (innerText) node.innerText = innerText;
    return node
  };

  colorizeLetters() {
    let letters = this.startField.innerHTML.split('');
    // Converts integer to hex 
    const colToHex = (c) => {
    // Hack so colors are bright enough
    let color = (c < 75) ? c + 75 : c
    let hex = color.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

  // uses colToHex to concatenate
  // a full 6 digit hex code
  const rgbToHex = (r,g,b) => {
    return "#" + colToHex(r) + colToHex(g) + colToHex(b);
  }

  // Returns three random 0-255 integers
  const getRandomColor = () => {
    return rgbToHex(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255));
  }

  // This is the prototype function
  // that changes the color of each
  // letter by wrapping it in a span
  // element.
  Array.prototype.randomColor = function() {
    let html = '';
    this.map( (letter) => {
      let color = getRandomColor();
      if (letter == " ") letter = `&nbsp`;
      html +=
        "<span style=\"color:" + color + "\">"
        + letter +
        "</span>";
    }) 
    return html;
  };

  // Set the text
  this.startField.innerHTML = letters.randomColor();
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
    this.isPause = false;
    this.overlay.classList.add('hidden');
    this.pause.innerHTML = 'Pause';
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
    this.audioBtn.innerHTML = this.audio ? this.createIconHTML("music_note") : this.createIconHTML("music_off");
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
    this.isPause = false;
    document.querySelector('.overlayResults').classList.add('hidden');
  }

}

let newPuzzle = new Puzzle()
newPuzzle.init()
