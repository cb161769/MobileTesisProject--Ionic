import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyDevicePage } from './my-device.page';

const routes: Routes = [
  {
    path: '',
    component: MyDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyDevicePageRoutingModule {}
