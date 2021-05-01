import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { ConnectionOneConsumptionsPage } from './connection-one-consumptions.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneConsumptionsPage,
    canActivate:[AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneConsumptionsPageRoutingModule {}
