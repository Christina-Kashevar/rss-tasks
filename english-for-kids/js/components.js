const HomeComponent = {
  render: () => `
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
    `,
};

const StatisticComponent = {
  render: (cards) => {
    let table = '<table>';
    const categoryAmount = 8;
    for (let i = 0; i < categoryAmount; i += 1) {
      table += `<tr class="cat-heading"><td colspan = "6">${cards[0][i]}</td></tr>`;
      for (let j = 0; j < categoryAmount; j += 1) {
        const correct = cards[i + 1][j].correct === undefined ? 0 : cards[i + 1][j].correct;
        const wrong = cards[i + 1][j].wrong === undefined ? 0 : cards[i + 1][j].wrong;
        const asked = cards[i + 1][j].asked === undefined ? 0 : cards[i + 1][j].asked;
        const errors = +wrong + +correct === 0 ? 0 : Math.round(+wrong / (+wrong + +correct) * 100);
        table += `<tr class = "cat-word"><td>${cards[i + 1][j].word}</td>
        <td>${cards[i + 1][j].translation}</td>
        <td>${asked}</td>
        <td>${correct}</td>
        <td>${wrong}</td>
        <td>${errors}</td></tr>`;
      }
    }
    table += '</table>';
    return table;
  },
};

const CardsComponent = {
  render: (param) => {
    let renderElement = '<div class="cards-block page"><div class="rating"></div>';
    for (let i = 0; i < param.length; i += 1) {
      renderElement += `
      <div class="card-container">
        <div class="card" data-word=${param[i].word}>
          <div class="front" style="background-image: url(${param[i].image});">
            <div class="card-header">${param[i].word}</div>
          </div>
          <div class="back hidden" style="background-image: url(${param[i].image});">
            <div class="card-header">${param[i].translation}</div>
          </div>
          <div class="rotate"></div>
        </div>
      </div>`;
    }

    renderElement += '<div class="btn-wrapper"><button class="btn none">Start game</button></div><audio class="audio"></audio><audio class="starSound"></audio></div>';
    return renderElement;
  },
};

export { HomeComponent, StatisticComponent, CardsComponent };
