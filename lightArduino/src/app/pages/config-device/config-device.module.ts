import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigDevicePageRoutingModule } from './config-device-routing.module';

import { ConfigDevicePage } from './config-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigDevicePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ConfigDevicePage]
})
export class ConfigDevicePageModule {}
