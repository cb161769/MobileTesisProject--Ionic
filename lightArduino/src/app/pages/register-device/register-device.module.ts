import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterDevicePageRoutingModule } from './register-device-routing.module';

import { RegisterDevicePage } from './register-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterDevicePageRoutingModule
  ],
  declarations: [RegisterDevicePage]
})
export class RegisterDevicePageModule {}
