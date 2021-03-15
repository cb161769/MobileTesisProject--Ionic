import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceConfigurationsPage } from './device-configurations.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceConfigurationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceConfigurationsPageRoutingModule {}
