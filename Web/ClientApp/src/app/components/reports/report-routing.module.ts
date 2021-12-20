import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from 'src/app/components/reports/report.component';
import { WeatherForecastComponent } from 'src/app/components/reports/weather-forecast/weather-forecast.component';

const reportRoutes: Routes = [
  {
    path: '', component: ReportComponent,
    children: [
      { path: 'weatherforecast', component: WeatherForecastComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(reportRoutes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
