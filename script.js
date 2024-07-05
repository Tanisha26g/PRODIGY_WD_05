const locationInput = document.getElementById("location-input");
const getWeatherBtn = document.getElementById("get-weather");
const weatherInfo = document.getElementById("weather-info");

function getWeather(location) {
  // Try multiple free weather API endpoints in case one has limitations
  const apiUrls = [
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=`, // OpenWeatherMap (limited)
    `https://api.weatherapi.com/v1/current.json?key=YOUR_WEATHER_API_KEY&q=${location}`, // WeatherAPI (consider getting a free API key for more functionality)
  ];

  let successfulFetch = false; // Flag to track successful data retrieval

  for (const url of apiUrls) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Check for error messages
        if (data.cod === "401" || data.error) {
          console.error("Error:", data.message || data.error.message);
        } else {
          // Process and display weather data based on the API structure
          const city = data.name || data.location.name;
          const weather = data.weather[0].main || data.current.condition.text;
          const temp = Math.floor(data.main.temp - 273.15) || Math.floor(data.current.temp_c);

          weatherInfo.innerHTML = `
            <h2>${city}</h2>
            <p>${weather}</p>
            <p>Temperature: ${temp}&#8480;</p>
          `;
          successfulFetch = true; // Exit the loop after successful data retrieval
        }
      })
      .catch(error => console.error(error));
  }

  // Handle the case where no successful data retrieval occurred
  if (!successfulFetch) {
    weatherInfo.innerHTML = "<p>Error: Unable to fetch weather data.</p>";
  }
}

getWeatherBtn.addEventListener("click", () => {
  const location = locationInput.value || navigator.geolocation.getCurrentPosition?.coords?.latitude + "," + navigator.geolocation.getCurrentPosition?.coords?.longitude;
  getWeather(location);
});
