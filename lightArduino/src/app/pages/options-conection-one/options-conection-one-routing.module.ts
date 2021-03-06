import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionsConectionOnePage } from './options-conection-one.page';

const routes: Routes = [
  {
    path: '',
    component: OptionsConectionOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionsConectionOnePageRoutingModule {}
