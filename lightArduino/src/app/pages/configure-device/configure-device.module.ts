import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigureDevicePageRoutingModule } from './configure-device-routing.module';

import { ConfigureDevicePage } from './configure-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ConfigureDevicePageRoutingModule
  ],
  declarations: [ConfigureDevicePage]
})
export class ConfigureDevicePageModule {}
