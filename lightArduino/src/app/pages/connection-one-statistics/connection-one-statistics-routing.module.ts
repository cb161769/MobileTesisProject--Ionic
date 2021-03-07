import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneStatisticsPage } from './connection-one-statistics.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneStatisticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneStatisticsPageRoutingModule {}
