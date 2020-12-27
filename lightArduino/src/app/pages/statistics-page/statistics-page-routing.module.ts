import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatisticsPagePage } from './statistics-page.page';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatisticsPagePageRoutingModule {}
