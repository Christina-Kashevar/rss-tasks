export default class Play {
  constructor() {
   this.mode = 'train';
  }

  init() {
    this.addEvents()
  }

  addEvents() {
    this.switcher = document.querySelector("#myonoffswitch");
    this.switcher.addEventListener('click', this.changeMode)
  }

  changeMode = () => {
    if(!this.switcher.checked) {
      this.mode = 'play';
    } else {
      this.mode = 'train';
    }
    console.log(this.mode)
  }
}

