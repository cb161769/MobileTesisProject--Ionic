import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDeviceConfigurationsPageRoutingModule } from './edit-device-configurations-routing.module';

import { EditDeviceConfigurationsPage } from './edit-device-configurations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDeviceConfigurationsPageRoutingModule
  ],
  declarations: [EditDeviceConfigurationsPage]
})
export class EditDeviceConfigurationsPageModule {}
