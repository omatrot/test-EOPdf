import { Component, OnInit } from '@angular/core';
import { IStorage } from 'src/app/components/shared/interfaces/IStorage';
import { ActivatedRoute, Params } from '@angular/router';

// use the javascript functions
declare function jsIsEOPdf(): any;
declare function jsStartEOPdfConvert(): any;

declare function chkWindowEOApi(): any;
declare function chkTypeOfEOApi(): any;
declare function chkIsDefinedEOApi(): any;

declare function exist_isEOPdf(): any;
declare function exist_convert(): any;

@Component({
  selector: 'app-dump-local-storage',
  templateUrl: './dump-local-storage.component.html',
  styleUrls: ['./dump-local-storage.component.scss']
})
export class DumpLocalStorageComponent implements OnInit {

  // public thelocalStorage: Storage = { ...localStorage }
  public thelocalStorage: IStorage[] = [];
  public debug_env_params: any = {};

  private queryParams: Params | null = null;
  public params: string | null = null;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // console.log("thelocalStorage:", JSON.stringify(this.thelocalStorage));
    // setTimeout(() => { }, 0);

    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.params = JSON.stringify(this.queryParams);
    console.log("dump-local-storage Component => queryParams", this.queryParams, this.queryParams);

    for (let [key, value] of Object.entries(localStorage)) {
      this.thelocalStorage.push({ key, value })
      console.log(`${key}: ${value}`);
    }

    // this.thelocalStorage.forEach((item: IStorage) => console.log(`${item.key}: ${item.value}`));

    this.debug_env_params.DATE = new Date();
    this.debug_env_params.WINDOW_EO_API = chkWindowEOApi();
    this.debug_env_params.TYPEOF_EO_API = chkTypeOfEOApi();
    this.debug_env_params.IS_DEFINED_EO_API = chkIsDefinedEOApi();

    this.debug_env_params.EXIST_ISEOPDF = exist_isEOPdf();
    this.debug_env_params.EXIST_CONVERT = exist_convert();

    console.log("dump-local-storage Component => debug_env_params", this.debug_env_params);

    setTimeout(() => {
      console.log("dump-local-storage Component => call jsStartEOPdfConvert");
      jsStartEOPdfConvert();
    }, 1000);
  }

  get isEOPdf(): boolean { return jsIsEOPdf() };

  get getDebugEnvParams(): string {
    return JSON.stringify(this.debug_env_params, null, 6)
      .replace(/\n( *)/g, function (match, p1) {
        return `<br/>` + '&nbsp;'.repeat(p1.length);
      });
  }

}
