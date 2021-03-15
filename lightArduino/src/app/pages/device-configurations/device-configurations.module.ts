import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceConfigurationsPageRoutingModule } from './device-configurations-routing.module';

import { DeviceConfigurationsPage } from './device-configurations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceConfigurationsPageRoutingModule
  ],
  declarations: [DeviceConfigurationsPage]
})
export class DeviceConfigurationsPageModule {}
