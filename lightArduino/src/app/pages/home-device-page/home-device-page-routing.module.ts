import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDevicePagePage } from './home-device-page.page';

const routes: Routes = [
  {
    path: '',
    component: HomeDevicePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeDevicePagePageRoutingModule {}
