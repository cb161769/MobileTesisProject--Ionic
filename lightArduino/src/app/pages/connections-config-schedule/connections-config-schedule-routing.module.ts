import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionsConfigSchedulePage } from './connections-config-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionsConfigSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionsConfigSchedulePageRoutingModule {}
