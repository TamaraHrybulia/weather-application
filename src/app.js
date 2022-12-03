function formatDate(currentDate) {
  let now = new Date(currentDate);

  let date = now.getDate();

  let months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];

  let year = now.getFullYear();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[now.getDay()];

  return `${date} ${month}, ${year}, ${day},  ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "ef282473708576ee3e925f4f705e27c8";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showWeatherData);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchinput = document.querySelector("#search-text-input");
  searchCity(searchinput.value);
}

let inputForm = document.querySelector("#search-form");
inputForm.addEventListener("submit", handleSubmit);

let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", getCurrentPosition);

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(searchCurrentCity);
}

function searchCurrentCity(position) {
  let apiKey = "ef282473708576ee3e925f4f705e27c8";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showWeatherData);
  console.log(apiUrl);
}

function showWeatherData(response) {
  console.log(response.data);

  let h1 = document.querySelector("h1");
  h1.innerHTML = `${response.data.name}`;

  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = `${temperature} ℃`;

  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector(
    "#current-weather-description"
  );
  descriptionElement.innerHTML = `${description}`;

  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `Humidity: ${humidity}%`;

  let temperaturefeelling = Math.round(response.data.main.feels_like);
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `Feels like: ${temperaturefeelling} ℃`;

  let windSpeed = Math.round(response.data.wind.speed);
  let windSpeedElement = document.querySelector("#wind-speed");
  windSpeedElement.innerHTML = `Wind speed: ${windSpeed} m/s`;

  let dateElement = document.querySelector("#current-date-and-time");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let mainIconElement = document.querySelector("#main-icon");
  mainIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainIconElement.setAttribute("alt", response.data.weather[0].description);
}

searchCity("Kyiv");
