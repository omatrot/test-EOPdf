import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/service/rest.service';
//import { WeatherForecast } from 'src/app/entity/weather-forecast';
import { ReportRun } from 'src/app/entity/ReportRun';
import { STORAGE_KEY } from 'src/app/app.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public title = 'Test EOPdf';

  public displayInline: boolean = false;
  public displayInlineText: string = "Display inline";
  public pdfCreationInProgress: boolean = false;

  constructor(public rest: RestService) { }

  ngOnInit() {

    let modelId: number = this.getRandomInt(1, 20);
    let categoryId: number = this.getRandomInt(1, 20);

    localStorage.setItem(STORAGE_KEY.MODEL_ID_KEY, `${modelId}`);
    localStorage.setItem(STORAGE_KEY.CATEGORY_ID_KEY, `${categoryId}`);

    console.log(`DashboardComponent => ngOnInit() => modelId: ${modelId}, categoryId: ${categoryId}`);
  }

  // --------------------------------------------------------------------------------------

  public btnDisplayInline(): void {
    this.displayInline = !this.displayInline;
    this.displayInlineText = this.displayInline ? "Hide table" : "Display inline";
  }

  public btnDisplayInNewTab(): void {

    // console.log("btnDisplayInNewTab => href:", window.location.href); // http://localhost:4200/default/dashboard
    // console.log("btnDisplayInNewTab => indexOf:", window.location.href.indexOf('/default')); // 21

    let currentPath: string = window.location.href.substr(0, window.location.href.indexOf('/default'))
    // console.log("btnDisplayInNewTab => currentPath:", currentPath); // http://localhost:4200

    let viewPath: string = "/weatherforecast"
    let fullPath: string = `${currentPath}/report${viewPath}`;
    // console.log("btnDisplayInNewTab => fullPath:", fullPath); // http://localhost:4200/report/weatherforecast

    // ----------------------------------------------------------------------------
    fullPath = `${fullPath}?x=FULL`;
    // console.log("btnDisplayInNewTab => URL fullPath => ", fullPath); // http://localhost:4200/report/weatherforecast?x=FULL

    // ----------------------------------------------------------------------------
    window.open(fullPath, '_blank');
  }

  public btnDownload(): void {
    this.createReportPDF(new ReportRun(
      Number(localStorage.getItem(STORAGE_KEY.CATEGORY_ID_KEY)),
      Number(localStorage.getItem(STORAGE_KEY.MODEL_ID_KEY))
    ));
  }

  private createReportPDF(oReportRun: ReportRun) {
    console.log('DashboardComponent => createReportPDF()', oReportRun);

    this.pdfCreationInProgress = true;
    this.rest.createReportPDF(oReportRun)
      .subscribe(
        (reponse: any) => {
          console.log("DashboardComponent => createReportPDF => Create response:", reponse);
        },
        (httpError) => {
          console.log("DashboardComponent => createReportPDF => httpError:", httpError);
          this.pdfCreationInProgress = false;
        },
        () => {
          console.log("DashboardComponent => createReportPDF => Report Created Successfully !");
          this.pdfCreationInProgress = false;
        });
  }

  private getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
