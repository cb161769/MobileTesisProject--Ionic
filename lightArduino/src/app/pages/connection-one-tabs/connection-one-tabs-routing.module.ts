import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth.guard';

import { ConnectionOneTabsPage } from './connection-one-tabs.page';

const routes: Routes = [
  {
    path: 'connection-one-tab',
    component: ConnectionOneTabsPage,
    canActivate:[AuthGuard],
    children: [
      {
        path:'tab1',
        loadChildren:() => import('../connexion1/connexion1.module').then( m => m.Connexion1PageModule),
       // canActivate:[AuthGuard]
      },
      {
        path: 'tab2',
        loadChildren:() => import('../connection-one-schedule/connection-one-schedule-routing.module').then( m => m.ConnectionOneSchedulePageRoutingModule),
      //  canActivate:[AuthGuard]
      },
        
      {
        path:'tab3',
        loadChildren:() => import('../connection-one-statistics/connection-one-statistics.module').then( m => m.ConnectionOneStatisticsPageModule),
      //  canActivate:[AuthGuard]
      }
    ]
  },
  { path: '',
    redirectTo: 'connection-one-tab/tab1',
    pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionOneTabsPageRoutingModule {}
