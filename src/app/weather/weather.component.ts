import { Component } from '@angular/core';

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  //post request to get weather data
  weatherData : any;

  constructor() {  }

  url = "https://europe-west1-vast-arena-424819-f6.cloudfunctions.net/send-sensor-data2";

  ngOnInit() {
    this.getWeatherData(this.url, this.getTimeStamp(12), -1).then(data => {
      this.weatherData = data;
      console.log(this.weatherData);
      this.setWeatherData(this.weatherData[this.weatherData.length-1]);
      this.setPastRecords(this.weatherData.slice(0, this.weatherData.length-1));
    });
  }

  async getWeatherData(url : string, timestamp : string, n : number) {
    let payload = {
      timestamp: timestamp,
      n: n
    };
    console.log(payload);
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then(response => response.json())
    .then(data => {
      return data;
    })
  }

  getTimeStamp(deltatime : number) {
    let date = new Date();
    //subtract deltatime hours from current time
    date = new Date(date.getTime() - deltatime*60*60*1000);
    //Convert to YYYYMMDDHHMMSS
    let timestamp = date.toISOString().slice(0, 19).replace(/-/g, "").replace(/:/g, "").replace("T", "");
    return timestamp;
  }

  setWeatherData(jsonData : any) {
    //get html elements
    let temp = document.getElementById("temperature");
    let hum = document.getElementById("humidity");
    let press = document.getElementById("pressure");
    let wind = document.getElementById("brightness");
  
    if (temp == null || hum == null || press == null || wind == null) {
      console.log("Error: Element not found");
      return;
    }
  
    if (jsonData && jsonData.sensor_data.DHT && jsonData.sensor_data.BME280 && jsonData.sensor_data.BH1750) {
      temp.innerHTML = jsonData.sensor_data.DHT.temperature;
      hum.innerHTML = jsonData.sensor_data.DHT.humidity;
      press.innerHTML = jsonData.sensor_data.BME280.pressure;
      wind.innerHTML = jsonData.sensor_data.BH1750.light;
    } else {
      console.log("Error: Invalid weather data");
      console.log(jsonData);
    }
    this.giveGradientEN("current_weather", jsonData.sensor_data.DHT.temperature, jsonData.sensor_data.BH1750.light, 300);
  }

  giveGradientEN(element_name : string, temp : number, bright : number, rotation : number) {
    let element = document.getElementById(element_name);
    if (element == null) {
      console.log("Error: Element not found");
      return;
    }
    let tempColor = this.getTempColor(temp);
    let brightColor = this.getBrightColor(bright);
    element.style.background = "linear-gradient(" + rotation + "deg, " + tempColor + ", " + brightColor + ")";
  }

  giveGradientE(element : any, temp : number, bright : number, rotation : number) {
    let tempColor = this.getTempColor(temp);
    let brightColor = this.getBrightColor(bright);
    element.style.background = "linear-gradient(" + rotation + "deg, " + tempColor + ", " + brightColor + ")";
  }

  getTempColor(temp : number) {
    if (temp < 0) {
      return "#4CBFE4";
    } else if (temp < 5) {
      return "#A2F9DE";
    } else if (temp < 10) {
      return "#DAF9A2";
    } else if (temp < 15) {
      return "#F9F2A2";
    } else if (temp < 20) {
      return "#FAD1A2";
    } else if (temp < 25) {
      return "#FCB8A1";
    } else {
      return "#FF8373";
    }
  }

  getBrightColor(bright : number) {
    if (bright < 100) {
      return "#00395F";
    } else if (bright < 5000) {
      return "#1A5F8C";
    } else if (bright < 10000) {
      return "#3982B2";
    } else if (bright < 20000) {
      return "#6EB7E8";
    } else {
      return "#A6DBFE";
    }
  }

  setPastRecords(jsonData : any) {
    let pastRecords = document.getElementById("past_records");
    if (pastRecords == null) {
      console.log("Error: Element not found");
      return;
    }
    pastRecords.style.gridTemplateColumns = "repeat(" + (jsonData.length + 1) + ", minmax(200px, 1fr)";
    for (let i = jsonData.length - 1; i >= 0; i--) {
      let record = document.createElement("div");
      record.className = "past_record";
      let date = document.createElement("p");
      let timestamp = jsonData[i].timestamp;
      let timestamp_date = new Date(timestamp.slice(0, 4), timestamp.slice(4, 6), timestamp.slice(6, 8), timestamp.slice(8, 10), timestamp.slice(10, 12), timestamp.slice(12, 14));
      timestamp_date = new Date(timestamp_date.getTime() + 60*60*1000);
      date.innerHTML = timestamp_date.toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
      record.appendChild(date);
      let temp = document.createElement("p");
      temp.innerHTML = jsonData[i].sensor_data.DHT.temperature;
      record.appendChild(temp);
      let hum = document.createElement("p");
      hum.innerHTML = jsonData[i].sensor_data.DHT.humidity;
      record.appendChild(hum);
      let press = document.createElement("p");
      press.innerHTML = jsonData[i].sensor_data.BME280.pressure;
      record.appendChild(press);
      let brightness = document.createElement("p");
      brightness.innerHTML = jsonData[i].sensor_data.BH1750.light;
      record.appendChild(brightness);
      this.giveGradientE(record, jsonData[i].sensor_data.DHT.temperature, jsonData[i].sensor_data.BH1750.light, 0);
      pastRecords.appendChild(record);
    }
  }
}