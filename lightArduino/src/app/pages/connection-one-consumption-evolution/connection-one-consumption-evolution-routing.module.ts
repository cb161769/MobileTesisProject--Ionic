import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneConsumptionEvolutionPage } from './connection-one-consumption-evolution.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneConsumptionEvolutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneConsumptionEvolutionPageRoutingModule {}
