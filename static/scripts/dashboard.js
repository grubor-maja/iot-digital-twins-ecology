setInterval(() => {
    fetch('/api/outdoor_quality')
      .then(response => response.json())
      .then(data => {
        document.querySelector('.value.temperature').textContent = data.temperature + '°C';
        document.querySelector('.value.humidity').textContent = data.humidity + '%';
        document.querySelector('.value.pm25').textContent = data.pm25;
        document.querySelector('.value.pm10').textContent = data.pm10;
        document.querySelector('.value.co2').textContent = data.co2;
      })
      .catch(error => console.error('Error fetching data:', error));
  }, 5000); // Update every 5 seconds
  