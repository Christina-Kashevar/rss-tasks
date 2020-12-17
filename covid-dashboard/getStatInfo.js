

const url = "https://api.covid19api.com/summary";

async function getStatistic(url) {
  const response = await fetch(url);
  const statData = await response.json();
 
  //  fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data)
  //    return data;
  //   });
}

let statData = getStatistic(url);
console.log(typeof statData)
// console.log(statData)

export default statData;