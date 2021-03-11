import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditConnectionSchedulePageRoutingModule } from './edit-connection-schedule-routing.module';

import { EditConnectionSchedulePage } from './edit-connection-schedule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditConnectionSchedulePageRoutingModule
  ],
  declarations: [EditConnectionSchedulePage]
})
export class EditConnectionSchedulePageModule {}
