import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeDevicePagePageRoutingModule } from './home-device-page-routing.module';

import { HomeDevicePagePage } from './home-device-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeDevicePagePageRoutingModule
  ],
  declarations: [HomeDevicePagePage]
})
export class HomeDevicePagePageModule {}
