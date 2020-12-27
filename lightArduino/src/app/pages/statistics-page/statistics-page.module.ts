import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticsPagePageRoutingModule } from './statistics-page-routing.module';

import { StatisticsPagePage } from './statistics-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatisticsPagePageRoutingModule
  ],
  declarations: [StatisticsPagePage]
})
export class StatisticsPagePageModule {}
