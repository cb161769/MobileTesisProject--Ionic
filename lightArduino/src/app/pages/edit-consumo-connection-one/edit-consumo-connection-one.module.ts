import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditConsumoConnectionOnePageRoutingModule } from './edit-consumo-connection-one-routing.module';

import { EditConsumoConnectionOnePage } from './edit-consumo-connection-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditConsumoConnectionOnePageRoutingModule
  ],
  declarations: [EditConsumoConnectionOnePage]
})
export class EditConsumoConnectionOnePageModule {}
