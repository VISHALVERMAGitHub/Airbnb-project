
      // Initialize the map and set its view to a geographical location (latitude, longitude)
      var map = L.map('map').setView([28.6139, 77.2088], 13);  
  
      // Load and display tile layers on the map (OpenStreetMap tiles)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
  
      // Add a marker to the map at the same location
      L.marker([28.6139, 77.2088]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
