import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Connexion1Page } from './connexion1.page';

const routes: Routes = [
  {
    path: '',
    component: Connexion1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Connexion1PageRoutingModule {}
