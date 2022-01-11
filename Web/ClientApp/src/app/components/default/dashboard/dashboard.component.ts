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

    this.downloadPDF(new ReportRun(
      Number(localStorage.getItem(STORAGE_KEY.CATEGORY_ID_KEY)),
      Number(localStorage.getItem(STORAGE_KEY.MODEL_ID_KEY)),
      1)); // 0 => Create; 1 => Download
  }

  private downloadPDF(oReportRun: ReportRun) {

    let pdfFileNameDownloaded: string = "";
    this.pdfCreationInProgress = true;

    this.rest.getReportPDF(oReportRun)
      .then(response => {
        console.log("downloadPDF => response:", response);

        let headerContentDisposition: string = response.headers.get("content-disposition");
        console.log("downloadPDF => headerContentDisposition:", headerContentDisposition);

        pdfFileNameDownloaded = this.getFileNameToDownload(headerContentDisposition);
        console.log("downloadPDF => pdfFileNameDownloaded:", pdfFileNameDownloaded);

        return response.blob();
      })
      .then(blob => URL.createObjectURL(blob))
      .then(url => {

        let fileNamePdfToSave: string = pdfFileNameDownloaded.length > 0 ? pdfFileNameDownloaded : `TheSamplePDF.pdf`;
        console.log("downloadPDF => fileNamePdfToSave:", fileNamePdfToSave);

        var link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileNamePdfToSave);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("downloadPDF => PDF downloaded");
        this.pdfCreationInProgress = false;
        // this.callInProgress_GenerateReportPDF = false;
      })
      .catch(err => {
        console.error("Fetch POST catch Error =>", err);
        this.pdfCreationInProgress = false;
        // this.callInProgress_GenerateReportPDF = false;
      });
  }

  private getFileNameToDownload(headerContentDisposition: string): string {
    // Logging.logWithTimestamp("#=# DownloadService => getFileNameToDownload => headerContentDisposition:", headerContentDisposition);

    let fileNameToDownload: string = "";

    if (headerContentDisposition) {

      let prefixFileName: string = `filename*=UTF-8''`;

      let aContentDisposition: Array<string> = headerContentDisposition.split(";");
      aContentDisposition.filter(cd => cd.trim().startsWith(prefixFileName))
        .forEach(s => fileNameToDownload = decodeURIComponent(s.trim().substr(prefixFileName.length)));

      // Logging.logWithTimestamp("#=# DownloadService => getFileNameToDownload => aContentDisposition:", aContentDisposition);
      // Logging.logWithTimestamp("#=# DownloadService => getFileNameToDownload => fileNameToDownload:", fileNameToDownload);
    }

    return fileNameToDownload;
  }


  // --------------------------------------------------------------------------------
  public btnCreate(): void {
    this.createReportPDF(new ReportRun(
      Number(localStorage.getItem(STORAGE_KEY.CATEGORY_ID_KEY)),
      Number(localStorage.getItem(STORAGE_KEY.MODEL_ID_KEY)),
      0)); // 0 => Create; 1 => Download
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
          console.error("DashboardComponent => createReportPDF => httpError:", httpError);
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
