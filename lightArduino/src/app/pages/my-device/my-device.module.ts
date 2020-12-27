import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDevicePageRoutingModule } from './my-device-routing.module';

import { MyDevicePage } from './my-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDevicePageRoutingModule
  ],
  declarations: [MyDevicePage]
})
export class MyDevicePageModule {}
