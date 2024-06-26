let chartInstance; 

function fetchWeatherData(city) {
  const apiKey = '8d6726487b6e02ff11ccd665b533562c';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  console.log(`Fetching weather data for ${city}`);
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Weather data:', data);
      updateDashboard(data);
      updateChart(data);
      updateMap(city);  
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

function updateDashboard(data) {
  document.querySelector('.value.temperature').textContent = data.main.temp + '°C';
  document.querySelector('.value.humidity').textContent = data.main.humidity + '%';
  document.querySelector('.value.pressure').textContent = data.main.pressure + ' hPa';
  document.querySelector('.value.wind_speed').textContent = data.wind.speed + ' m/s';
  document.querySelector('.value.wind_deg').textContent = data.wind.deg + '°';
}

function updateChart(data) {
  const ctx = document.getElementById('airQualityChart').getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Temperature', 'Humidity', 'Pressure', 'Wind Speed', 'Wind Direction'],
      datasets: [{
        label: 'Air Quality Metrics',
        data: [data.main.temp, data.main.humidity, data.main.pressure, data.wind.speed, data.wind.deg],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateMap(city) {
  const apiKey = '8d6726487b6e02ff11ccd665b533562c';
  const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  console.log(`Fetching coordinates for ${city}`);
  
  fetch(geocodingUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching geocoding data: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Geocoding data:', data);
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log(`Updating map to coordinates: ${lat}, ${lon}`);
        map.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(map)
          .bindPopup(city)
          .openPopup();
      } else {
        console.error('No geocoding data found for the specified city');
      }
    })
    .catch(error => console.error('Error fetching geocoding data:', error));
}

let map;

function initializeMap(lat = 44.7866, lon = 20.4489) {  // Default koordinate za Beograd
  map = L.map('map').setView([lat, lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup('Belgrade')
    .openPopup();
}

document.addEventListener('DOMContentLoaded', (event) => {
  const defaultCity = 'Belgrade';
  fetchWeatherData(defaultCity);
  initializeMap();  

  document.getElementById('fetchDataButton').addEventListener('click', () => {
    const city = document.getElementById('cityName').value;
    if (city) {
      fetchWeatherData(city);
    }
  });
});
