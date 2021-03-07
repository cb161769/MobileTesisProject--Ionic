import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneConsumptionsPage } from './connection-one-consumptions.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneConsumptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneConsumptionsPageRoutingModule {}
