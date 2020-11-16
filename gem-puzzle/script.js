class Field {
  constructor(level = 4, audio = true, picture = false) {
    this.level= level,
    this.audio = audio,
    this.picture = picture,
    this.cellsQuantity = level*level - 1,
    this.cellSize = 400 / level,
    this.cells =[],
    this.moves = 0,
    this.empty = {}
    // this.empty = { value: 0,
    //   top: 0,
    //   left: 0},
    this.timer = 0,
    this.finishGame = false,
    this.image = Math.floor(Math.random()*150) + 1
  }

  init() {
    this.field = this.createDomNode(this.field, 'div', null, 'field');
    this.createCells();
    this.audioDiv = document.createElement('audio');
    this.audioDiv.src = './assets/sound.mp3';
    this.overlay = this.createDomNode(this.overlay, 'div', null, 'overlay', 'hidden');
    this.overlay.innerHTML =`<span class="message"> game paused, want to save it? <button class= 'save-game'> save game</button></span>
      <div class="overlay-main">
      <button class="new-game">New Game</button>
      <button class="continue-game">Continue</button>
      </div>
    `
    this.overlayWin = this.createDomNode(this.overlay, 'div', null, 'overlayWin', 'hidden');
    this.overlayWin.innerHTML =`<p>YOU WON!</p><p class='phrase'>Yo solve the puzzle for </p> <button class="new-game">New Game</button>`;
    this.overlayResults = this.createDomNode(this.overlay, 'div', null, 'overlayResults', 'hidden');
    this.overlayResults.innerHTML=`<div class='score'></div><button class='hide-results'>Hide results</button>`
    this.field.append(this.audioDiv, this.overlay, this.overlayWin, this.overlayResults)

    return this.field;
  }

  // начать сохраненную игру
  initSavedGame() {
    this.field = this.createDomNode(this.field, 'div', null, 'field');
    this.createCellsSavedField();
    this.audioDiv = document.createElement('audio');
    this.audioDiv.src = './assets/sound.mp3';
    this.overlay = this.createDomNode(this.overlay, 'div', null, 'overlay', 'hidden');
    this.overlay.innerHTML =`<span class="message"> game paused, want to save it? <button class= 'save-game'> save game</button></span>
      <div class="overlay-main">
      <button class="new-game">New Game</button>
      <button class="continue-game">Continue</button>
      </div>
    `
    this.overlayWin = this.createDomNode(this.overlay, 'div', null, 'overlayWin', 'hidden');
    this.overlayWin.innerHTML =`<p>YOU WON!</p><p class='phrase'>Yo solve the puzzle for </p> <button class="new-game">New Game</button>`;
    this.overlayResults = this.createDomNode(this.overlay, 'div', null, 'overlayResults', 'hidden');
    this.overlayResults.innerHTML=`<div class='score'></div><button class='hide-results'>Hide results</button>`
    this.field.append(this.audioDiv, this.overlay, this.overlayWin, this.overlayResults)
    return this.field;
  }

  createDomNode (node, element, innerText, ...classes){
    node = document.createElement(element);
    node.classList.add(...classes);
    if (innerText) node.innerText = innerText;
    return node
  };

  createCellsArray() { // замешиваем числа и проверяем решаемость пазла
    let numbers = [...Array(this.cellsQuantity).keys()]
     .sort(()=> Math.random() - 0.5);
   // проверить решаемость
    let sum = 0;
    for (let i =0; i < numbers.length; i++) {
      for (let j = i; j < numbers.length; j++ ) {
        if(numbers[i] > numbers[j]) {
          sum +=1
        }
      }
    }
    if(this.level== 4 || this.level== 6 || this.level == 8 ) {
      sum += this.level // добавить для четных уровней номер ряда пустой ячейки ( в данном случае 1)
    }
    if ( sum % 2 != 0) {
      numbers = this.createCellsArray()
      return numbers
    } else {
      return numbers
    }
  }

  // создаем для замешанных чисел дивы, вешаем обработчики, устанавливаем стили
  createCells() {
    const numbersArr = this.createCellsArray()
    this.empty.value = this.level * this.level;
    this.empty.top = this.level -1;
    this.empty.left = this.level -1;
    this.cells.push(this.empty);
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cell';
    emptyCell.classList.add('empty-cell');
    emptyCell.style.width =`${ 400/ this.level - 2}px`;
    emptyCell.style.height = emptyCell.style.width;
    emptyCell.ondragenter = 'dragEnter(event)';
    emptyCell.ondrop = 'dragDrop(event)';
    emptyCell.ondragover = 'dragOver(event)';
    this.field.append(emptyCell);
    emptyCell.addEventListener('dragenter', (e)=>{
      this.dragEnter(e)
    })
    emptyCell.addEventListener('drop', (e)=>{
      this.dragDrop(e)
    })
    emptyCell.addEventListener('dragover', (e)=>{
      this.dragOver(e)
    })
    this.empty.element = emptyCell;
    for (let i =1; i <= this.cellsQuantity ; i++) {
      const cell = document.createElement('div');
      cell.draggable = `true`;
      const value = numbersArr[i-1] + 1;
      cell.className = 'cell';
      cell.style.width =`${ 400/ this.level - 2}px`;
      cell.style.height = cell.style.width;
      cell.innerHTML = value;
    
      const left = (i-1) % this.level;
      const top = ( i- left -1) / this.level;
    
      this.cells.push({
        value: value,
        left: left,
        top :top,
        element: cell,
      })
    
      cell.style.left = `${left * this.cellSize}px`;
      cell.style.top = `${top * this.cellSize}px`;
    
      this.field.append(cell);
    
      cell.addEventListener('click', ()=>{
        this.move(i)
      })

      cell.addEventListener('dragstart', (e)=>{
        this.dragStart(e)
      })

       if (this.picture) {
        cell.style.backgroundSize = '400px 400px'
        cell.style.backgroundImage = `url(./assets/images/${this.image}.jpg)`;
        let width = 400/ this.level - 2;
        cell.style.backgroundPosition = `-${left*width}px -${top*width}px`;
       }

    //   // console.log(value, left, top)
    //   // console.log(cell.style.backgroundPosition)
     }
  }

  chooseRandomPicture() {
    return Math.floor(Math.random()*150) + 1
  }

  // создаем для сохраненной игры дивы, вешаем обработчики, устанавливаем стили
  createCellsSavedField() {
    let emptyCell = document.createElement('div');
    emptyCell.className = 'cell';
    emptyCell.classList.add('empty-cell');
    emptyCell.style.width =`${ 400/ this.level - 2}px`;
    emptyCell.style.height = emptyCell.style.width;
    emptyCell.style.left = `${this.empty.left * this.cellSize}px`;
    emptyCell.style.top = `${this.empty.top * this.cellSize}px`;
    emptyCell.ondragenter = 'dragEnter(event)';
    emptyCell.ondrop = 'dragDrop(event)';
    emptyCell.ondragover = 'dragOver(event)';
    this.field.append(emptyCell);
    emptyCell.addEventListener('dragenter', (e)=>{
      this.dragEnter(e)
    })
    emptyCell.addEventListener('drop', (e)=>{
      this.dragDrop(e)
    })
    emptyCell.addEventListener('dragover', (e)=>{
      this.dragOver(e)
    })
    this.empty.element = emptyCell;
   
    for (let i = 0; i < this.cells.length ; i++) {
      if(this.cells[i].value == this.level*this.level) {
        this.cells[i] = this.empty
        continue
      };
      const cell = document.createElement('div');
      cell.draggable = `true`
      cell.className = 'cell';
      cell.style.width =`${ 400/ this.level - 2}px`;
      cell.style.height = cell.style.width;
      cell.innerHTML = this.cells[i].value;
    
      cell.style.left = `${this.cells[i].left * this.cellSize}px`;
      cell.style.top = `${this.cells[i].top * this.cellSize}px`;
      this.cells[i].element = cell;
    
      this.field.append(cell);
    
      cell.addEventListener('click', ()=>{
        this.move(i)
    })
    cell.addEventListener('dragstart', (e)=>{
      this.dragStart(e)
    })

    if (this.picture) {
      const left = (i-1) % this.level;
      const top = ( i- left -1) / this.level;
      cell.style.backgroundSize = '400px 400px'
      cell.style.backgroundImage = `url(./assets/images/${this.image}.jpg)`;
      let width = 400/ this.level - 2;
      cell.style.backgroundPosition = `-${left*width}px -${top*width}px`;
     }
    }
  }

  //начало движения по клику
  move(index) {
    const cell = this.cells[index];
    this.moveAndDrag(cell)
  }

  //логика движения клетки по клику и драгу
  moveAndDrag(cell, e) {
    const leftDiff = Math.abs(this.empty.left - cell.left);
    const topDiff = Math.abs(this.empty.top - cell.top);

    if (leftDiff + topDiff > 1){
      return; // если клетка не соседняя, движения не происходит
    }
    if ( e == 'drop') {
      cell.element.style.transition = 'none'
      setTimeout( () => {
        cell.element.style.transition = 'all 0.3s'
      }, 500)
    }
    cell.element.style.left = `${this.empty.left * this.cellSize}px`;
    cell.element.style.top = `${this.empty.top * this.cellSize}px`;
    const emptyLeft = this.empty.left;
    const emptyTop = this.empty.top;
    this.empty.left = cell.left;
    this.empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;
    this.empty.element.style.left = `${this.empty.left * this.cellSize}px`;
    this.empty.element.style.top = `${this.empty.top * this.cellSize}px`;
    this.playAudio();
    this.moves += 1;
    const isFinished = this.cells.every(cell => {
      return (cell.value-1) === cell.top * this.level + cell.left;
    })

    if (isFinished) {
      this.saveResultToLocalStorage();
      this.finishGame = true;
      let innerText = new Date(this.timer*1000).toUTCString().split(/ /)[4];
      
      if( innerText[0]== 0 && innerText[1] == 0) {
        innerText = innerText.slice(3)
      } 
      document.querySelector('.phrase').innerHTML = `You solve the puzzle for<br> ${innerText} time and ${this.moves} moves`
      this.timer = 0,
      this.overlayWin.classList.remove('hidden')
    }
  }

  dragStart(e) {
    e.dataTransfer.setData("text", e.target.innerHTML);
    e.dataTransfer.effectAllowed='move';
    // e.dataTransfer.setDragImage(e.target,100,100); 
    return true;
  }

  dragOver(e){
    e.preventDefault();
  }

  dragEnter(e){
    e.preventDefault();
    return true;
  }

  dragDrop(e){
    let data = e.dataTransfer.getData("Text");
    let cell = this.cells.find(cell => cell.value == data)
    this.moveAndDrag(cell, 'drop')
  }

  saveResultToLocalStorage() {
    if(localStorage.getItem('results')) {
      let results = JSON.parse(localStorage.getItem('results'));
      results.push([this.level, this.moves, this.timer]);
      results.sort((a,b) => a[2] > b[2] ? 1: -1) // сортируем результаты по времени
      if(results.length >10) results = results.slice(0,10)
      localStorage.setItem('results', JSON.stringify(results))
    } else {
      let results = [];
      results.push([this.level, this.moves, this.timer]);
      localStorage.setItem('results', JSON.stringify(results))
    }
  }

  playAudio() {
    if(!this.audio) return;
    let audio = document.querySelector('audio')
    audio.currentTime = 0;
    audio.play();
  }
}

// import Field from "./Field"

class Puzzle {
  constructor(){
    this.level = 4,
    this.audio = true,
    this.picture = false,
    this.isPause = false,
    this.timer = 0,
    this.interval
    
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
    this.field = new Field(this.level, this.audio, this.picture);
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
    this.field = new Field(this.level, this.audio, this.picture);
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
    this.field = new Field(this.level, this.audio);
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
