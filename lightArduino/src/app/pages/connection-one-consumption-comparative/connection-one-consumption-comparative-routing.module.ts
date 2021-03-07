import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneConsumptionComparativePage } from './connection-one-consumption-comparative.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneConsumptionComparativePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneConsumptionComparativePageRoutingModule {}
