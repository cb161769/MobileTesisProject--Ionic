import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneConsumptionComparativePageRoutingModule } from './connection-one-consumption-comparative-routing.module';

import { ConnectionOneConsumptionComparativePage } from './connection-one-consumption-comparative.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneConsumptionComparativePageRoutingModule
  ],
  declarations: [ConnectionOneConsumptionComparativePage]
})
export class ConnectionOneConsumptionComparativePageModule {}
