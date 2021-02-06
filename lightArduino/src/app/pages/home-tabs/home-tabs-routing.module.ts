import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeTabsPage } from './home-tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomeTabsPage,
    children:[
      {
        path:'tab1',
        children:[
          {
            path:'',
            loadChildren: ()=> import('../home-device-page/home-device-page.module').then(m => m.HomeDevicePagePageModule)

          }
        ]
        
      },
      {
        path:'tab2',
        children:[
          {
            path:'',
            loadChildren: ()=> import('../my-device/my-device.module').then(m => m.MyDevicePageModule)

          }
        ]
      },
      {
        path:'tab3',
        children:[
          {
            path:'',
            loadChildren: ()=> import('../statistics-page/statistics-page-routing.module').then(m => m.StatisticsPagePageRoutingModule)

          }
        ]
      },
      {
        path:'tab4',
        children:[
          {
            path:'',
            loadChildren: ()=> import('../your-account/your-account.module').then(m => m.YourAccountPageModule)

          }
        ]
      }
    ]
  }
  ,{
    path:'',
    redirectTo:'tabs/tab1',
    pathMatch:'full'

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabsPageRoutingModule {}
