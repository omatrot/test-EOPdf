import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/service/rest.service';
import { WeatherForecast } from 'src/app/entity/weather-forecast';

// use the javascript functions
declare function jsIsEOPdf(): any;
declare function jsStartEOPdfConvert(): any;

declare function chkWindowEOApi(): any;
declare function chkTypeOfEOApi(): any;
declare function chkIsDefinedEOApi(): any;

declare function exist_isEOPdf(): any;
declare function exist_convert(): any;

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {

  public title = 'Test EOPdf';
  public debug_env_params: any = {};

  constructor(public rest: RestService) { }

  ngOnInit() {
    this.rest.getWeatherForecastData();

    this.debug_env_params.DATE = new Date();
    this.debug_env_params.WINDOW_EO_API = chkWindowEOApi();
    this.debug_env_params.TYPEOF_EO_API = chkTypeOfEOApi();
    this.debug_env_params.IS_DEFINED_EO_API = chkIsDefinedEOApi();

    this.debug_env_params.EXIST_ISEOPDF = exist_isEOPdf();
    this.debug_env_params.EXIST_CONVERT = exist_convert();

    setTimeout(() => {
      jsStartEOPdfConvert();
    }, 1000);
  }

  get listWeatherForecast(): Array<WeatherForecast> {
    return this.rest.listWeatherForecast;
  }

  get isEOPdf(): boolean { return jsIsEOPdf() };

  get getDebugEnvParams(): string {
    return JSON.stringify(this.debug_env_params, null, 6)
      .replace(/\n( *)/g, function (match, p1) {
        return `<br/>` + '&nbsp;'.repeat(p1.length);
      });
  }
}
