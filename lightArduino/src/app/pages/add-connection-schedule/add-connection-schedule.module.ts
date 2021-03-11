import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddConnectionSchedulePageRoutingModule } from './add-connection-schedule-routing.module';

import { AddConnectionSchedulePage } from './add-connection-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddConnectionSchedulePageRoutingModule
  ],
  declarations: [AddConnectionSchedulePage]
})
export class AddConnectionSchedulePageModule {}
