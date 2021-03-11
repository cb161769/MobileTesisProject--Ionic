import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditConnectionSchedulePage } from './edit-connection-schedule.page';

const routes: Routes = [
  {
    path: '',
    component: EditConnectionSchedulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditConnectionSchedulePageRoutingModule {}
