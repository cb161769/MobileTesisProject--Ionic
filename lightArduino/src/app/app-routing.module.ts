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
  {
    path: 'statistics-page',
    loadChildren: () => import('./pages/statistics-page/statistics-page.module').then( m => m.StatisticsPagePageModule)
  },
  {
    path: 'my-device',
    loadChildren: () => import('./pages/my-device/my-device.module').then( m => m.MyDevicePageModule)
  },
  {
    path: 'config-device',
    loadChildren: () => import('./pages/config-device/config-device.module').then( m => m.ConfigDevicePageModule)
  },
  {
    path: 'connect-device',
    loadChildren: () => import('./pages/connect-device/connect-device.module').then( m => m.ConnectDevicePageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'register-device',
    loadChildren: () => import('./pages/register-device/register-device.module').then( m => m.RegisterDevicePageModule)
  },
  {
    path: 'configure-device',
    loadChildren: () => import('./pages/configure-device/configure-device.module').then( m => m.ConfigureDevicePageModule)
  },
  {
    path: 'connexion1',
    loadChildren: () => import('./pages/connexion1/connexion1.module').then( m => m.Connexion1PageModule)
  },
  {
    path: 'connection-one-tabs',
    loadChildren: () => import('./pages/connection-one-tabs/connection-one-tabs.module').then( m => m.ConnectionOneTabsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
