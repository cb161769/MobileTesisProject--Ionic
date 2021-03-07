import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneConsumptionEvolutionPageRoutingModule } from './connection-one-consumption-evolution-routing.module';

import { ConnectionOneConsumptionEvolutionPage } from './connection-one-consumption-evolution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneConsumptionEvolutionPageRoutingModule
  ],
  declarations: [ConnectionOneConsumptionEvolutionPage]
})
export class ConnectionOneConsumptionEvolutionPageModule {}
