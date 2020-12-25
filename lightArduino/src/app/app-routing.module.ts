import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'alert',
    loadChildren: () => import('./pages/alert/alert.module').then( m => m.AlertPageModule)
  },
  {
    path: 'action-sheet',
    loadChildren: () => import('./pages/action-sheet/action-sheet.module').then( m => m.ActionSheetPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'confirm-registration',
    loadChildren: () => import('./pages/confirm-registration/confirm-registration.module').then( m => m.ConfirmRegistrationPageModule)
  },
  {
    path: 'your-account',
    loadChildren: () => import('./pages/your-account/your-account.module').then( m => m.YourAccountPageModule)
  },
  {
    path: 'update-account',
    loadChildren: () => import('./pages/update-account/update-account.module').then( m => m.UpdateAccountPageModule)
  },
  {
    path: 'home-tabs',
    loadChildren: () => import('./pages/home-tabs/home-tabs.module').then( m => m.HomeTabsPageModule)
  },
  {
    path: 'home-device-page',
    loadChildren: () => import('./pages/home-device-page/home-device-page.module').then( m => m.HomeDevicePagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
