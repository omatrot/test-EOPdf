import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/service/rest.service';
import { WeatherForecast } from 'src/app/entity/weather-forecast';
import { STORAGE_KEY } from 'src/app/app.constants';

@Component({
  selector: 'app-weather-forecast-table',
  templateUrl: './weather-forecast-table.component.html',
  styleUrls: ['./weather-forecast-table.component.scss']
})
export class WeatherForecastTableComponent implements OnInit {

  constructor(public rest: RestService) { }

  ngOnInit(): void {
    this.rest.getWeatherForecastData();
  }

  get listWeatherForecast(): Array<WeatherForecast> {
    return this.rest.listWeatherForecast;
  }

  get model(): number {
    return Number(localStorage.getItem(STORAGE_KEY.MODEL_ID_KEY));
  }

  get category(): number {
    return Number(localStorage.getItem(STORAGE_KEY.CATEGORY_ID_KEY));
  }
}
