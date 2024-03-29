import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneSchedulePage } from './connection-one-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionOneSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneSchedulePageRoutingModule {}
