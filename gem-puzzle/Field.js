export default class Field {
  constructor(level = 4) {
    this.level= level,
    this.cellsQuantity = level*level - 1,
    this.cellSize = 400 / level,
    this.cells =[],
    this.empty = { value: 0,
      top: 0,
      left: 0}
  }

  init() {
    this.field = this.createDomNode(this.field, 'div', null, 'field');
    this.createCells();
    return this.field;
  }

  createDomNode (node, element, innerText, ...classes){
    node = document.createElement(element);
    node.classList.add(...classes);
    if (innerText) node.innerText = innerText;
    return node
  };

  createCells() {
    const numbers = [...Array(this.cellsQuantity).keys()]
     .sort(()=> Math.random() - 0.5);
    
    this.cells.push(this.empty);

    for (let i =1; i <= this.cellsQuantity ; i++) {
      const cell = document.createElement('div');
      const value = numbers[i-1] + 1;
      cell.className = 'cell';
      cell.innerHTML = value;
    
      const left = i % this.level;
      const top = ( i- left) / this.level;
    
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
    }
  }

  move(index) {
    const cell = this.cells[index];
    const leftDiff = Math.abs(this.empty.left - cell.left);
    const topDiff = Math.abs(this.empty.top - cell.top);

    if (leftDiff + topDiff > 1){
      return; // если клетка не соседняя, движения не происходит
    }

    cell.element.style.left = `${this.empty.left * this.cellSize}px`;
    cell.element.style.top = `${this.empty.top * this.cellSize}px`;
    const emptyLeft = this.empty.left;
    const emptyTop = this.empty.top;
    this.empty.left = cell.left;
    this.empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;

    const isFinished = this.cells.every(cell => {
      return cell.value === cell.top * 4 + cell.left;
    })

    if (isFinished) {
      alert('You won!!!!!!!')
    }
  }
}