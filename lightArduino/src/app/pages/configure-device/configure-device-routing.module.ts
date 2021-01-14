import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigureDevicePage } from './configure-device.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigureDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigureDevicePageRoutingModule {}
