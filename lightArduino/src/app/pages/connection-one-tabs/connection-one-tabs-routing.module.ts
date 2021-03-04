import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneTabsPage } from './connection-one-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneTabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneTabsPageRoutingModule {}
