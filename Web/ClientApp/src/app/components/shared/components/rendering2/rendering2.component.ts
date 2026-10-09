import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { IRendering2Params } from 'src/app/components/shared/interfaces/IRenderingParams';
import { STORAGE_KEY } from 'src/app/app.constants';

// use the javascript functions
declare function jsIsEOPdf(): any;
declare function jsStartEOPdfConvert(): any;

declare function chkWindowEOApi(): any;
declare function chkTypeOfEOApi(): any;
declare function chkIsDefinedEOApi(): any;

declare function exist_isEOPdf(): any;
declare function exist_convert(): any;

@Component({
  selector: 'app-rendering2',
  template: `
    <div *ngIf="isError">
      <div>debug_env_params:</div>
      <div [innerHTML]="getDebugEnvParams"></div>
    </div>
  `,
  styles: []
})
export class Rendering2Component implements OnInit {

  public renderingInfos: IRendering2Params | null = null;
  public debug_env_params: any = {};

  private isInitOk: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {

    let queryParams: Params = this.activatedRoute.snapshot.queryParams;

    // ----------------------------------------------------------------------------
    this.debug_env_params.DATE = new Date();

    // ----------------------------------------------------------------------------
    this.debug_env_params.QUERY_PARAMS = queryParams;
    console.log("Rendering => QUERY_PARAMS => ", queryParams, this.isEOPdf);

    // ----------------------------------------------------------------------------
    this.renderingInfos = this.makeRenderingInfos(queryParams);
    this.debug_env_params.RENDERING_INFOS = this.renderingInfos;
    console.log("Rendering => RENDERING_INFOS => ", this.renderingInfos);

    // ----------------------------------------------------------------------------
    if (this.renderingInfos) {

      try {

        localStorage.setItem(STORAGE_KEY.MIKI_ID_KEY, `${this.renderingInfos.mikiId}`);
        localStorage.setItem(STORAGE_KEY.MOUSE_ID_KEY, `${this.renderingInfos.mouseId}`);

        this.debug_env_params.LOCAL_STORAGE = {
          mikiId: localStorage.getItem(STORAGE_KEY.MIKI_ID_KEY),
          mouseId: localStorage.getItem(STORAGE_KEY.MOUSE_ID_KEY),
        };

        this.debug_env_params.TRY_CATCH_LOCAL_STORAGE = "Written successfully ";
        console.log("Rendering => LOCAL_STORAGE => ", this.debug_env_params.LOCAL_STORAGE);
      }
      catch {
        this.isInitOk = false;
        this.debug_env_params.TRY_CATCH_LOCAL_STORAGE = "Error in localStorage setItem";
        console.log('Rendering => Error in localStorage setItem');
      }

    }
    else {
      this.isInitOk = false;
      this.debug_env_params.QUERY_PARAMS_ERROR = "Url Params INVALIDES";
      console.log("Rendering => Url Params invalides => ", queryParams);
    }

    // ------------------------------------------------------------------------------
    // For DEBUG / Test display Errors
    // this.isInitOk = false;

    this.debug_env_params.WINDOW_EO_API = chkWindowEOApi();
    this.debug_env_params.TYPEOF_EO_API = chkTypeOfEOApi();
    this.debug_env_params.IS_DEFINED_EO_API = chkIsDefinedEOApi();

    this.debug_env_params.EXIST_ISEOPDF = exist_isEOPdf();
    this.debug_env_params.EXIST_CONVERT = exist_convert();

    // ------------------------------------------------------------------------------
    if (this.isInitOk) {

      // setTimeout(() => { }, 500);
      // this.compareLS();

      let urlReportToCall: string = `report/dumplocalstorage?miki=${this.renderingInfos.mikiId}&mouse=${this.renderingInfos.mouseId}`;

      this.debug_env_params.NAVIGATE_BY_URL = urlReportToCall;
      console.log("Rendering => navigateByUrl => ", urlReportToCall);

      // ----------------------------------------------------------------------------
      this.router.navigateByUrl(urlReportToCall);

      // ------------------------------------------------------------------------------
      // For DEBUG / Test display Errors
      // this.isInitOk = false;
      //setTimeout(() => {
      //  jsStartEOPdfConvert();
      //}, 1000);


    }
    else {
      jsStartEOPdfConvert();
    }

  }

  /*
  private counter: number = 0;
  private compareLS() {

    let mikiId: string = localStorage.getItem(STORAGE_KEY.MIKI_ID_KEY);
    let mouseId: string = localStorage.getItem(STORAGE_KEY.MOUSE_ID_KEY);

    if ((mikiId == `${this.renderingInfos.mikiId}`) && (mouseId == `${this.renderingInfos.mouseId}`)) {

      let urlReportToCall: string = `report/dumplocalstorage?miki=${this.renderingInfos.mikiId}&mouse=${this.renderingInfos.mouseId}&status=OK`;

      this.debug_env_params.NAVIGATE_BY_URL = urlReportToCall;
      console.log("Rendering => navigateByUrl => ", urlReportToCall);

      // ----------------------------------------------------------------------------
      this.router.navigateByUrl(urlReportToCall);

      this.counter = 0;

    } else if (this.counter < 3) {
      this.counter++;
      this.compareLS();
    }
    else {

      let urlReportToCall: string = `report/dumplocalstorage?miki=${this.renderingInfos.mikiId}&mouse=${this.renderingInfos.mouseId}&status=ERROR`;

      this.debug_env_params.NAVIGATE_BY_URL = urlReportToCall;
      console.log("Rendering => navigateByUrl => ", urlReportToCall);

      // ----------------------------------------------------------------------------
      this.router.navigateByUrl(urlReportToCall);

      this.counter = 0;
    }

  }
  */

  private makeRenderingInfos(params: Params): IRendering2Params {

    let isQueryStringValid: boolean = true;

    let newRenderingInfos: IRendering2Params = {
      mikiId: 0,
      mouseId: 0,
    };

    // Miki Id (are required)
    if (isQueryStringValid) {
      let isParamOk: boolean = false;
      if (params.hasOwnProperty('miki')) {
        let paramId: number = Number(params['miki']);
        if ((paramId > 0) && (Math.floor(paramId) == paramId)) {
          newRenderingInfos.mikiId = paramId;
          isParamOk = true;
        }
      }
      isQueryStringValid = isParamOk;
    }

    // Mouse Id (are required)
    if (isQueryStringValid) {
      let isParamOk: boolean = false;
      if (params.hasOwnProperty('mouse')) {
        let paramId: number = Number(params['mouse']);
        if ((paramId > 0) && (Math.floor(paramId) == paramId)) {
          newRenderingInfos.mouseId = paramId;
          isParamOk = true;
        }
      }
      isQueryStringValid = isParamOk;
    }

    return isQueryStringValid ? newRenderingInfos : null;
  }

  get isError(): boolean {
    return !this.isInitOk
  }

  get getDebugEnvParams(): string {
    return JSON.stringify(this.debug_env_params, null, 6)
      .replace(/\n( *)/g, function (match, p1) {
        return `<br/>` + '&nbsp;'.repeat(p1.length);
      });
  }

  get isEOPdf(): boolean { return jsIsEOPdf() };
}
