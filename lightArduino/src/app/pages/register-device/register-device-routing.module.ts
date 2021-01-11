import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterDevicePage } from './register-device.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterDevicePageRoutingModule {}
