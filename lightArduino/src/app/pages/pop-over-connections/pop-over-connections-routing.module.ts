import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopOverConnectionsPage } from './pop-over-connections.page';

const routes: Routes = [
  {
    path: '',
    component: PopOverConnectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopOverConnectionsPageRoutingModule {}
