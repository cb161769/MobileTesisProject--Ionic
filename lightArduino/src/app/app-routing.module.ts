import { AuthGuard } from "./auth/auth.guard";
import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: "alert",
    loadChildren: () =>
      import("./pages/alert/alert.module").then((m) => m.AlertPageModule),
  },
  {
    path: "action-sheet",
    loadChildren: () =>
      import("./pages/action-sheet/action-sheet.module").then(
        (m) => m.ActionSheetPageModule
      ),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: "forget-password",
    loadChildren: () =>
      import("./pages/forget-password/forget-password.module").then(
        (m) => m.ForgetPasswordPageModule
      ),
  },
  {
    path: "confirm-registration",
    loadChildren: () =>
      import("./pages/confirm-registration/confirm-registration.module").then(
        (m) => m.ConfirmRegistrationPageModule
      ),
  },
  {
    path: "your-account",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/your-account/your-account.module").then(
        (m) => m.YourAccountPageModule
      ),
  },
  {
    path: "update-account",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/update-account/update-account.module").then(
        (m) => m.UpdateAccountPageModule
      ),
  },
  {
    path: "home-tabs",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/home-tabs/home-tabs.module").then(
        (m) => m.HomeTabsPageModule
      ),
  },
  {
    path: "home-device-page",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/home-device-page/home-device-page.module").then(
        (m) => m.HomeDevicePagePageModule
      ),
  },
  {
    path: "statistics-page",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/statistics-page/statistics-page.module").then(
        (m) => m.StatisticsPagePageModule
      ),
  },
  {
    path: "my-device",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/my-device/my-device.module").then(
        (m) => m.MyDevicePageModule
      ),
  },
  {
    path: "config-device",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/config-device/config-device.module").then(
        (m) => m.ConfigDevicePageModule
      ),
  },
  {
    path: "connect-device",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/connect-device/connect-device.module").then(
        (m) => m.ConnectDevicePageModule
      ),
  },
  {
    path: "reset-password",
    loadChildren: () =>
      import("./pages/reset-password/reset-password.module").then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: "register-device",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/register-device/register-device.module").then(
        (m) => m.RegisterDevicePageModule
      ),
  },
  {
    path: "configure-device",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/configure-device/configure-device.module").then(
        (m) => m.ConfigureDevicePageModule
      ),
  },
  {
    path: "connexion1",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/connexion1/connexion1.module").then(
        (m) => m.Connexion1PageModule
      ),
  },
  {
    path: "connection-one-tabs",

    loadChildren: () =>
      import("./pages/connection-one-tabs/connection-one-tabs.module").then(
        (m) => m.ConnectionOneTabsPageModule
      ),
  },
  {
    path: "options-conection-one",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/options-conection-one/options-conection-one.module").then(
        (m) => m.OptionsConectionOnePageModule
      ),
  },
  {
    path: "edit-consumo-connection-one",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/edit-consumo-connection-one/edit-consumo-connection-one.module"
      ).then((m) => m.EditConsumoConnectionOnePageModule),
  },
  {
    path: "connection-one-statistics",
    ////canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/connection-one-statistics/connection-one-statistics.module"
      ).then((m) => m.ConnectionOneStatisticsPageModule),
  },
  {
    path: "connection-one-consumptions",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/connection-one-consumptions/connection-one-consumptions.module"
      ).then((m) => m.ConnectionOneConsumptionsPageModule),
  },
  {
    path: "connection-one-consumption-evolution",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/connection-one-consumption-evolution/connection-one-consumption-evolution.module"
      ).then((m) => m.ConnectionOneConsumptionEvolutionPageModule),
  },
  {
    path: "connection-one-consumption-comparative",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/connection-one-consumption-comparative/connection-one-consumption-comparative.module"
      ).then((m) => m.ConnectionOneConsumptionComparativePageModule),
  },

  {
    path: "connection-one-schedule",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/connection-one-schedule/connection-one-schedule.module"
      ).then((m) => m.ConnectionOneSchedulePageModule),
  },
  {
    path: "add-connection-schedule",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/add-connection-schedule/add-connection-schedule.module"
      ).then((m) => m.AddConnectionSchedulePageModule),
  },
  {
    path: "edit-connection-schedule",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/edit-connection-schedule/edit-connection-schedule.module"
      ).then((m) => m.EditConnectionSchedulePageModule),
  },
  {
    path: "device-configurations",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/device-configurations/device-configurations.module").then(
        (m) => m.DeviceConfigurationsPageModule
      ),
  },
  {
    path: "edit-device-configurations",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/edit-device-configurations/edit-device-configurations.module"
      ).then((m) => m.EditDeviceConfigurationsPageModule),
  },
  {
    path: "pop-over",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/pop-over/pop-over.module").then(
        (m) => m.PopOverPageModule
      ),
  },
  {
    path: "pop-over-connections",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import("./pages/pop-over-connections/pop-over-connections.module").then(
        (m) => m.PopOverConnectionsPageModule
      ),
  },
  {
    path: "connections-config-schedule",
    //canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        "./pages/connections-config-schedule/connections-config-schedule.module"
      ).then((m) => m.ConnectionsConfigSchedulePageModule),
  },
  {
    path: "dates",
    loadChildren: () =>
      import("./pages/dates-filter/dates/dates.module").then(
        (m) => m.DatesPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
