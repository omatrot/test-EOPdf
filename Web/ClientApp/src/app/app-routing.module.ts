import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './components/shared/components/not-found/not-found.component';
import { RenderingComponent } from './components/shared/components/rendering/rendering.component';

const routes: Routes = [
  {
    path: 'default',
    loadChildren: () => import('src/app/components/default/default.module').then(m => m.DefaultModule),
  },
  {
    path: 'report',
    loadChildren: () => import('src/app/components/reports/report.module').then(m => m.ReportModule)
  },
  { path: '', redirectTo: 'default', pathMatch: 'full' },
  { path: 'rendering', component: RenderingComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
