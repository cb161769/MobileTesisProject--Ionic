import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneActiosPage } from './connection-one-actios.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneActiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneActiosPageRoutingModule {}
