import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

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
  selector: 'app-rendering',
  templateUrl: './rendering.component.html',
  styleUrls: ['./rendering.component.css']
})
export class RenderingComponent implements OnInit {

  public renderingInfos: IRenderingParams = null;
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

        localStorage.setItem(STORAGE_KEY.MODEL_ID_KEY, `${this.renderingInfos.modelId}`);
        localStorage.setItem(STORAGE_KEY.CATEGORY_ID_KEY, `${this.renderingInfos.categoryId}`);

        this.debug_env_params.LOCAL_STORAGE = {
          modelId: localStorage.getItem(STORAGE_KEY.MODEL_ID_KEY),
          categoryId: localStorage.getItem(STORAGE_KEY.CATEGORY_ID_KEY),
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

      let urlReportToCall: string = `report/weatherforecast`;

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

  private makeRenderingInfos(params: Params): IRenderingParams {

    let isQueryStringValid: boolean = true;

    let newRenderingInfos: IRenderingParams = {
      categoryId: 0,
      modelId: 0,
    };

    // Category Id (are required)
    if (isQueryStringValid) {
      let isParamOk: boolean = false;
      if (params.hasOwnProperty('category')) {
        let paramId: number = Number(params['category']);
        if ((paramId > 0) && (Math.floor(paramId) == paramId)) {
          newRenderingInfos.categoryId = paramId;
          isParamOk = true;
        }
      }
      isQueryStringValid = isParamOk;
    }

    // Model Id (are required)
    if (isQueryStringValid) {
      let isParamOk: boolean = false;
      if (params.hasOwnProperty('model')) {
        let paramId: number = Number(params['model']);
        if ((paramId > 0) && (Math.floor(paramId) == paramId)) {
          newRenderingInfos.modelId = paramId;
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

interface IRenderingParams {
  categoryId: number;
  modelId: number;
}
