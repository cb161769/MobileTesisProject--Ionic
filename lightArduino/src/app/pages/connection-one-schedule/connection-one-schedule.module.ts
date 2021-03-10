import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneSchedulePageRoutingModule } from './connection-one-schedule-routing.module';

import { ConnectionOneSchedulePage } from './connection-one-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneSchedulePageRoutingModule
  ],
  declarations: [ConnectionOneSchedulePage]
})
export class ConnectionOneSchedulePageModule {}
