import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionOneActiosPageRoutingModule } from './connection-one-actios-routing.module';

import { ConnectionOneActiosPage } from './connection-one-actios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionOneActiosPageRoutingModule
  ],
  declarations: [ConnectionOneActiosPage]
})
export class ConnectionOneActiosPageModule {}
