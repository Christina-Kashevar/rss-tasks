
import Puzzle from "./Puzzle.js"


let newPuzzle = new Puzzle()
newPuzzle.init()

// сделать буквы в заставке цветными
document.querySelector('.start-field').innerHTML =
colorizeLetters(document.querySelector('.start-field').innerText)


function colorizeLetters(text) {
  let letters = text.split('');
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
text = letters.randomColor();
return text;
}

