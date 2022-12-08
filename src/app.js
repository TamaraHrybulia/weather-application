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
  let apiKey = "30f3621d44ta8b790e7433b8ef5bf7ao";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?query=${city}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeatherData);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchinput = document.querySelector("#search-text-input");
  searchCity(searchinput.value);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(searchCurrentCity);
}

function searchCurrentCity(position) {
  let apiKey = "30f3621d44ta8b790e7433b8ef5bf7ao";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/current";
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `${apiEndpoint}?lon=${lon}&lat=${lat}&units=${units}&key=${apiKey}`;

  axios.get(apiUrl).then(showWeatherData);
}

function showWeatherData(response) {
  let h1 = document.querySelector("h1");
  let temperatureElement = document.querySelector("#current-temperature");
  let descriptionElement = document.querySelector(
    "#current-weather-description"
  );
  let humidityElement = document.querySelector("#humidity");
  let feelsLikeElement = document.querySelector("#feels-like");
  let windSpeedElement = document.querySelector("#wind-speed");
  let dateElement = document.querySelector("#current-date-and-time");
  let mainIconElement = document.querySelector("#main-icon");

  celsiusTemperature = response.data.temperature.current;

  h1.innerHTML = `${response.data.city}, ${response.data.country}`;
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}`;
  descriptionElement.innerHTML = `${response.data.condition.description}`;
  humidityElement.innerHTML = `${response.data.temperature.humidity}`;
  feelsLikeElement.innerHTML = `${Math.round(
    response.data.temperature.feels_like
  )}`;
  windSpeedElement.innerHTML = `${Math.round(response.data.wind.speed)}`;
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  mainIconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png
    `
  );
  mainIconElement.setAttribute("alt", response.data.condition.description);
  mainIconElement.style.width = "150px";

  getForecast(response.data.coordinates);
}

function getForecast(coordinates) {
  let apiKey = "30f3621d44ta8b790e7433b8ef5bf7ao";
  let apiEndpoint = "https://api.shecodes.io/weather/v1/forecast";
  let units = "metric";
  let lat = coordinates.latitude;
  let lon = coordinates.longitude;
  let apiUrl = `${apiEndpoint}?lon=${lon}&lat=${lat}&units=${units}&key=${apiKey}`;

  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");

  let forecast = response.data.daily;

  let forecastHTML = `<div class="row row-cols-5">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col mt-5 mb-5">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">${formatForecastDay(
                  forecastDay.time
                )}</h4>
                <p class="card-image"> <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                  forecastDay.condition.icon
                }.png" alt=""  /> </p>
                <p class="card-day-temperature"> ${Math.round(
                  forecastDay.temperature.maximum
                )}°</p>
                <p class="card-night-temperature">${Math.round(
                  forecastDay.temperature.minimum
                )}°</p>
              </div>
            </div>
          </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let celsiusTemperatureElement = document.querySelector(
    "#current-temperature"
  );
  celsiusTemperatureElement.innerHTML = Math.round(celsiusTemperature);
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitElement = document.querySelector("#current-temperature");
  fahrenheitElement.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let inputForm = document.querySelector("#search-form");
inputForm.addEventListener("submit", handleSubmit);

let currentCityButton = document.querySelector("#current-city-button");
currentCityButton.addEventListener("click", getCurrentPosition);

let celsiusTemperature = null;

searchCity("Kyiv");
