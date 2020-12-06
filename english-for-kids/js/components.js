const HomeComponent = {
  render: () => {
    return `
      <div class="cards-block">
        <div class="main-card">
          <img src="./assets/img/dance.jpg" alt="Action (set A)">Action (set A)
        </div>
        <div class="main-card">
          <img src="./assets/img/swim.jpg" alt="Action (set B)">Action (set B)
        </div>
        <div class="main-card">
          <img src="./assets/img/strawberry.jpg" alt="Food (set A)">Food (set A)
        </div>
        <div class="main-card">
          <img src="./assets/img/cheese.jpg" alt="Food (set B)">Food (set B)
        </div>
        <div class="main-card">
          <img src="./assets/img/rabbit.jpg" alt="Animal (set A)">Animal (set A)
        </div>
        <div class="main-card">
          <img src="./assets/img/bird.jpg" alt="Animal (set B)">Animal (set B)
        </div>
        <div class="main-card">
          <img src="./assets/img/dress.jpg" alt="Clothes">Clothes
        </div>
        <div class="main-card">
          <img src="./assets/img/happy.jpg" alt="Emotions">Emotions
        </div>
    </div>
    `;
  }
};

const CardsComponent = {
  render: (param) => {
    let renderElement = '<div class="cards-block page"><div class="rating"></div>'
    for (let i = 0; i < param.length; i++) {
      renderElement += `
      <div class="card-container">
        <div class="card" data-word=${param[i]['word']}>
          <div class="front" style="background-image: url(${param[i]['image']});">
            <div class="card-header">${param[i]['word']}</div>
          </div>
          <div class="back hidden" style="background-image: url(${param[i]['image']});">
            <div class="card-header">${param[i]['translation']}</div>
          </div>
          <div class="rotate"></div>
        </div>
      </div>`
    }

    renderElement += '<div class="btn-wrapper"><button class="btn none">Start game</button></div><audio class="audio"></audio><audio class="starSound"></audio></div>'
    return renderElement;
  }
};

export {HomeComponent, CardsComponent};