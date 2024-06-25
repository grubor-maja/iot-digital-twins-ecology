function fetchWeatherData() {
  const apiKey = '8d6726487b6e02ff11ccd665b533562c';
  const city = 'Belgrade';
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      updateDashboard(data);
      updateChart(data);
    })
    .catch(error => console.error('Error fetching data:', error));
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
  new Chart(ctx, {
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

function initializeMap() {
  const map = L.map('map').setView([44.7866, 20.4489], 13); // Beograd - koordinate

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  L.marker([44.7866, 20.4489]).addTo(map)
      .bindPopup('Belgrade')
      .openPopup();
}

document.addEventListener('DOMContentLoaded', (event) => {
  initializeMap();
  fetchWeatherData();
  setInterval(fetchWeatherData, 5000);
});
