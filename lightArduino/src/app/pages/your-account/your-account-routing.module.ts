import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourAccountPage } from './your-account.page';

const routes: Routes = [
  {
    path: '',
    component: YourAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourAccountPageRoutingModule {}
