const url = 'https://europe-west1-vast-arena-424819-f6.cloudfunctions.net/send-sensor-data';

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); 
})
.then(data => {
    //Watch out, the following code is god awful, you're welcome
    
    console.log(data);
    const temperature = data[0].sensor_data.DHT.temperature;
    const humidity = data[0].sensor_data.DHT.humidity;

    // get the sensor data elements
    const temperatureElement = document.getElementById('current-temperature');
    const humidityElement = document.getElementById('current-humidity');
    const windSpeedElement = document.getElementById('current-wind-speed');
    const atmosphericPressureElement = document.getElementById('current-atmospheric-pressure');
    const brightnessElement = document.getElementById('current-brightness');

    // get <em> child elements
    const temperatureEmElement = temperatureElement.querySelector('em');
    const humidityEmElement = humidityElement.querySelector('em');
    const windSpeedEmElement = windSpeedElement.querySelector('em');
    const atmosphericPressureEmElement = atmosphericPressureElement.querySelector('em');
    const brightnessEmElement = brightnessElement.querySelector('em');

    // set the text content of the <em> elements
    temperatureEmElement.textContent = temperature;
    humidityEmElement.textContent = humidity;
    windSpeedEmElement.textContent = "WIP";
    atmosphericPressureEmElement.textContent = "WIP";
    brightnessEmElement.textContent = "WIP";

    const timestamp = data[0].timestamp;
    const timestampElement = document.getElementById('last-updated');
    const timestampEmElement = timestampElement.querySelector('em');
    const current_date = new Date(timestamp.year, timestamp.month - 1, timestamp.day, timestamp.hour, timestamp.minute, timestamp.second);
    timestampEmElement.textContent = current_date.toLocaleString();

    const table = document.getElementById('past-data-records');
    const tbody = table.querySelector('table');
    data.forEach((record, index) => {
        const row = tbody.insertRow();
        const cell1 = row.insertCell();
        const cell2 = row.insertCell();
        const cell3 = row.insertCell();
        const cell4 = row.insertCell();
        const cell5 = row.insertCell();
        const cell6 = row.insertCell();
        let date = new Date(record.timestamp.year, record.timestamp.month - 1, record.timestamp.day, record.timestamp.hour, record.timestamp.minute, record.timestamp.second);
        cell1.textContent = date.toLocaleString();
        cell2.textContent = record.sensor_data.DHT.temperature;
        cell3.textContent = record.sensor_data.DHT.humidity;
        cell4.textContent = "WIP";
        cell5.textContent = "WIP";
        cell6.textContent = "WIP";
    });
    // Doesn't this make you want to cry?
})