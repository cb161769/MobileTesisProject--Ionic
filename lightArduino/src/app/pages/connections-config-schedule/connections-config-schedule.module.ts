import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionsConfigSchedulePageRoutingModule } from './connections-config-schedule-routing.module';

import { ConnectionsConfigSchedulePage } from './connections-config-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionsConfigSchedulePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ConnectionsConfigSchedulePage]
})
export class ConnectionsConfigSchedulePageModule {}
