import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddConnectionSchedulePage } from './add-connection-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: AddConnectionSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddConnectionSchedulePageRoutingModule {}
