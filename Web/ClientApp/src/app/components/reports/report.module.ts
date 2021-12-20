import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { REPORT_COMPONENTS } from 'src/app/components/reports/index';
import { ReportRoutingModule } from './report-routing.module';

// Modules
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    REPORT_COMPONENTS
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule { }
