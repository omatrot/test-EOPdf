import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from 'src/app/components/default/default.component';
import { DashboardComponent } from 'src/app/components/default/dashboard/dashboard.component';

const defaultRoutes: Routes = [
  {
    path: '', component: DefaultComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(defaultRoutes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
