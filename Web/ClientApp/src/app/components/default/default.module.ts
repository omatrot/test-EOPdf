import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DEFAULT_COMPONENTS } from 'src/app/components/default/index';
import { DefaultRoutingModule } from './default-routing.module';

// Modules
import { SharedModule } from 'src/app/components/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SharedModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    DEFAULT_COMPONENTS
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class DefaultModule { }
