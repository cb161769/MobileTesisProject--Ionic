import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneConsumptionsPageRoutingModule } from './connection-one-consumptions-routing.module';

import { ConnectionOneConsumptionsPage } from './connection-one-consumptions.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneConsumptionsPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [ConnectionOneConsumptionsPage]
})
export class ConnectionOneConsumptionsPageModule {}
