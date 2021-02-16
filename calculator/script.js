class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement;
      this.currentOperandTextElement = currentOperandTextElement;
      this.readyToReset = false;
      this.clear();
      this.calculationArray =[]
    }
  
    clear() {
      this.readyToReset = false
      this.currentOperand = '';
      this.previousOperand = '';
      this.operation = undefined;
      this.calculationArray = [];
    }
  
    delete() {
      if (this.currentOperandTextElement.innerText === "Error") {
        this.currentOperand = '';
      } else {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
      }
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      if (this.currentOperandTextElement.innerText === "Error") {
        this.currentOperand = '';
      }
      console.log(this.currentOperand)
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  
    chooseOperation(operation) {
      if (this.currentOperandTextElement.innerText === "Error" ) {
        this.currentOperand = 0;
      }
      if (this.currentOperand === '') return;
      if (this.currentOperand === '√') { // если последняя операция √, то можно нажимать кнопку с операцией
          this.currentOperand = '';
          this.operation = operation;
          this.calculationArray.push(this.operation);
          this.previousOperand +=' '+ this.operation;
          return;
      }
      if (this.operation === '÷') {
        this.checkPossibilityOfCompute();
      }
      if (this.currentOperand != "Error") {
        this.operation = operation;
        this.calculationArray.push(this.currentOperand, this.operation)
        this.previousOperand +=' '+ this.currentOperand +' '+ this.operation;
        this.currentOperand = '';
      }
    }

    sqrt (operation) {
      if (this.currentOperand < 0 ) {
          this.currentOperand = "Error";
          return
     } else {
        this.operation = operation;
        this.calculationArray.push( this.operation, this.currentOperand)
        this.previousOperand +=' '+ this.operation +' '+ this.currentOperand;
        this.currentOperand = this.operation;
     }
    }

    checkPossibilityOfCompute() {
        if (this.operation === '√' && this.currentOperand < 0 ||
            this.operation === '÷' && +this.currentOperand === 0) {
                this.currentOperand = "Error";
        }
    }
  
    compute() {
      this.checkPossibilityOfCompute();
      let result;
      let maxDig;
      if (this.currentOperand === "Error") {
        this.updateDisplay();
        return
      }
      if (this.previousOperand === '' || this.currentOperand === '') return;
      this.calculationArray.push(this.currentOperand)
      let computation = 0;

      // проверяем окончание строки previousOperand, если последнее значение не цифра - удаляем
      let lastElement = this.calculationArray[this.calculationArray.length-1];
      if ( isNaN(parseFloat(lastElement)) ) {
        this.calculationArray.pop()
      }

      let counter = 0;
      let counter2 = 0;
      for (let i =0; i< this.calculationArray.length; i++) {
        if ( this.calculationArray[i] === '*'|| this.calculationArray[i] === '÷' ||
             this.calculationArray[i] === '√' || this.calculationArray[i] === '**'){
              ++counter
          }
      }

      for (let i =0; i< this.calculationArray.length; i++) {
        if ( this.calculationArray[i] === '-'|| this.calculationArray[i] === '+'){
              ++counter2
          }
      }
      
      for (let i =0; i < counter; i++ ) {
          console.log(this.calculationArray)
        this.calculationArray.map( (item,index) => {
            switch (item) {
                case '*':
                    result = this.makeFractionCorrect(parseFloat(this.calculationArray[index-1]), parseFloat(this.calculationArray[index+1]))
                    computation =( parseFloat(result[0]) * parseFloat(result[1]) ) / ((10**result[2]) * (10**result[3]))
                    computation += ''
                    this.calculationArray.splice(index-1, 3, computation);
                    break
                case '÷':
                    result = this.makeFractionCorrect(parseFloat(this.calculationArray[index-1]), parseFloat(this.calculationArray[index+1]))
                    computation =( parseFloat(result[0]) / parseFloat(result[1]) ) / ((10**result[2]) * (10**result[3]))
                    computation += ''
                    this.calculationArray.splice(index-1, 3, computation)
                    break
                case '√':
                    computation = Math.sqrt(parseFloat(this.calculationArray[index+1]));
                    computation += '';
                    this.calculationArray.splice(index, 2, computation)
                    break
                case '**':
                    result = this.makeFractionCorrect(parseFloat(this.calculationArray[index-1]), parseFloat(this.calculationArray[index+1]));
                    computation = ( parseFloat(result[0]) ** parseFloat(result[1]) ) / ((10**result[2]) ** result[1]);
                    computation += ''
                    this.calculationArray.splice(index-1, 3, computation)
                    break
                default:
                    return;
            }
        })
      }

      for (let i =0; i < counter2; i++ ) {
        console.log(this.calculationArray)
        this.calculationArray.map( (item,index) => {
            switch (item) {
                case '+':
                    result = this.makeFractionCorrect(parseFloat(this.calculationArray[index-1]), parseFloat(this.calculationArray[index+1]))
                    maxDig = Math.max(result[2], result[3]);
                    computation = ( parseFloat(this.calculationArray[index-1])* (10** maxDig) + parseFloat(this.calculationArray[index+1])* (10** maxDig)) / (10** maxDig)
                    computation += ''
                    this.calculationArray.splice(index-1, 3, computation)
                    break
                case '-':
                    result = this.makeFractionCorrect(parseFloat(this.calculationArray[index-1]), parseFloat(this.calculationArray[index+1]))
                    maxDig = Math.max(result[2], result[3])
                    computation = ( parseFloat(this.calculationArray[index-1])* (10** maxDig) - parseFloat(this.calculationArray[index+1])* (10** maxDig)) / (10** maxDig)
                    computation += ''
                    this.calculationArray.splice(index-1, 3, computation)
                    break
                default:
                    return;
            }
        })
      }
      computation = Math.round(computation * 100000000) / 100000000;
      this.readyToReset = true;
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = '';
      this.calculationArray = [];
    }

    makeFractionCorrect (operand1, operand2) {
      let firstDigitsAfterComa;
      let secondDigitsAfterComa;
      firstDigitsAfterComa = (operand1.toString().includes('.')) ? (operand1.toString().split('.').pop().length) : (0) ;
      operand1 = operand1 * (10**firstDigitsAfterComa);
      if (operand2 !== undefined) {
        secondDigitsAfterComa = (operand2.toString().includes('.')) ? (operand2.toString().split('.').pop().length) : (0) ;
        operand2 = operand2 * (10**secondDigitsAfterComa);
      }
      return ([operand1, operand2, firstDigitsAfterComa, secondDigitsAfterComa ])
    }

    plusMinus () {
        this.currentOperand *= -1
    }
  
    getDisplayNumber(number) {
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() {
        if (this.currentOperand === "Error") {
            this.currentOperandTextElement.innerText = "Error"
        } else {
            this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand)
        }
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = this.previousOperand
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}
  
  
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const plusMinusButton = document.querySelector('[data-plus-minus]');
const sqrtButton = document.querySelector('[data-sqrt]');
  
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        if(calculator.previousOperand === "" &&
           calculator.currentOperand !== "" &&
           calculator.readyToReset) {
              calculator.currentOperand = "";
              calculator.readyToReset = false;
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay();
    })
})
  
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText);
      calculator.updateDisplay();
    })
})
  
equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
})
  
allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
})
  
deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
})

plusMinusButton.addEventListener('click', button => {
    calculator.plusMinus();
    calculator.updateDisplay();
})

sqrtButton.addEventListener('click', button => {
  calculator.sqrt('√');
  calculator.updateDisplay();
})