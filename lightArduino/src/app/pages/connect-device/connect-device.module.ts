import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectDevicePageRoutingModule } from './connect-device-routing.module';

import { ConnectDevicePage } from './connect-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectDevicePageRoutingModule
  ],
  declarations: [ConnectDevicePage]
})
export class ConnectDevicePageModule {}
