import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionOneTabsPage } from './connection-one-tabs.page';

const routes: Routes = [
  {
    path: 'connection-one-tab',
    component: ConnectionOneTabsPage,
    children: [
      {
        path:'tab1',
        loadChildren:() => import('../connexion1/connexion1.module').then( m => m.Connexion1PageModule)
      }
    ]
  },
  {
    path:'',
    redirectTo:'connection-one-tab/tab1',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneTabsPageRoutingModule {}
