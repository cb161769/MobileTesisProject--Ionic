import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneStatisticsPageRoutingModule } from './connection-one-statistics-routing.module';

import { ConnectionOneStatisticsPage } from './connection-one-statistics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneStatisticsPageRoutingModule
  ],
  declarations: [ConnectionOneStatisticsPage]
})
export class ConnectionOneStatisticsPageModule {}
