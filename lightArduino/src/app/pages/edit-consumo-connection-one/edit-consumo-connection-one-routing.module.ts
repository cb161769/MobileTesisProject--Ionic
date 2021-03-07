import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditConsumoConnectionOnePage } from './edit-consumo-connection-one.page';

const routes: Routes = [
  {
    path: '',
    component: EditConsumoConnectionOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditConsumoConnectionOnePageRoutingModule {}
