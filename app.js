//DOM ELEMENTS
const searchButton = document.querySelector(".content__search--button");
const searchLoading = document.querySelector(".content__search--loading");
const dataContent = document.querySelector(".content__data");
const dataCurrent = document.querySelector(".data__curent");
const tomorrow = document.getElementById("tomorrow");
const nextDay = document.getElementById("nextDay");
const dayAfter = document.getElementById("dayAfter");
const cityName = document.querySelector(".content__nav--location");

//GET LOCATION AND WEATHER
const getCity = async () => {
  const weatherKey = "02e3d905bbc55cace1cc3c8910360fbe";
  let weatherForecast = new Object();
  searchLoading.classList.toggle("hidden");

  const getCoords = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const latitude = getCoords.coords.latitude;
  const longitude = getCoords.coords.longitude;

  const responseWeather = await fetch(`
  https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherKey}
  `);
  const dataWeather = await responseWeather.json();

  const responseCity = await fetch(
    ` https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`
  );
  const dataCity = await responseCity.json();
  const hoursOfForecast = [0, 8, 16, 24];
  const daysOfForecast = ["today", "tomorrow", "nextDay", "dayAfter"];

  for (let i = 0; i < hoursOfForecast.length; i++) {
    weatherForecast[daysOfForecast[i]] = {
      temp: Math.floor(dataWeather.list[hoursOfForecast[i]].main.temp),
      condition: dataWeather.list[hoursOfForecast[i]].weather[0].main,
    };
  }
  cityName.innerText = `${dataCity.address.city}, ${dataCity.address.state}`;
  tomorrow.innerText = `${weatherForecast.tomorrow.temp} & ${weatherForecast.tomorrow.condition}`;
  nextDay.innerText = `${weatherForecast.nextDay.temp} & ${weatherForecast.nextDay.condition}`;
  dayAfter.innerText = `${weatherForecast.dayAfter.temp} & ${weatherForecast.dayAfter.condition}`;

  const test = document.createTextNode(
    `${weatherForecast.today.temp} & ${weatherForecast.today.condition}`
  );
  dataCurrent.appendChild(test);
};

//DISPLAY DATA
const observer = new MutationObserver((mutations) => {
  dataContent.classList.toggle("hidden");
  searchLoading.classList.toggle("hidden");
  dataContent.scrollIntoView({ behavior: "smooth" });
});

observer.observe(dataCurrent, {
  childList: true,
});
// FUNCTIONS
searchButton.addEventListener("click", async () => {
  getCity();
});

searchLoading.addEventListener("click", () => {
  console.log("you found me");
});
