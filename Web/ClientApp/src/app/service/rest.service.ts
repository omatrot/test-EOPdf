import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http';
// import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherForecast } from '../entity/weather-forecast';
import { ReportRun } from '../entity/ReportRun';

const endpoint1 = 'https://localhost:44310/api';
const endpoint2 = 'https://api.my-domain.com/api';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class RestService {

  private _listWeatherForecast: Array<WeatherForecast> = new Array<WeatherForecast>();

  constructor(private http: HttpClient) { }

  get listWeatherForecast(): Array<WeatherForecast> {
    return this._listWeatherForecast;
  }

  public getWeatherForecastData() {
    console.log('App => getWeatherForecastData()');

    this._listWeatherForecast = new Array<WeatherForecast>();
    this.getWeatherForecast()
      .subscribe(
        (data: Array<WeatherForecast>) => {
          console.log("getWeatherForecast:", data);
          this._listWeatherForecast = data;
        },
        (httpError) => {
          console.log("httpError:", httpError);
        },
        () => {
          console.log("get Weather Forecast: COMPLETE");
        });
  }

  public getWeatherForecast(): Observable<Array<WeatherForecast>> {
    console.log('RestService => getWeatherForecast()');
    console.log('RestService => environment.production:', environment.production);
    return this.http.get<Array<WeatherForecast>>(`${!environment.production ? endpoint1 : endpoint2}/weatherforecast/GetData`, httpOptions);
  }

  public createReportPDF(oReportRun: ReportRun): Observable<any> {
    console.log('RestService => getReportPDF => oReportRun:', oReportRun);
    return this.http.post<ReportRun>(`${!environment.production ? endpoint1 : endpoint2}/weatherforecast/CreateReportPDF`, oReportRun);
  }

  /*
  public getReportPDF_OLD(oReportRun: ReportRun) {

    return fetch(`${!environment.production ? endpoint1 : endpoint2}/weatherforecast/DownloadReportPdf`, {
      method: 'POST',
      headers:
      {
        'Content-Type': 'application/json'
      },
      // body data type must match "Content-Type" header
      body: JSON.stringify(oReportRun),
    })
      .then(response => {
        if (!response.ok) {
          console.log("getReportPDF => Fetch POST Errors =>", response.statusText, response);
          throw Error(response.statusText);
        }
        return response;
      });
  }
  */
}



