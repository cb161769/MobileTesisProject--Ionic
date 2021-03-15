import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDeviceConfigurationsPage } from './edit-device-configurations.page';

const routes: Routes = [
  {
    path: '',
    component: EditDeviceConfigurationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDeviceConfigurationsPageRoutingModule {}
