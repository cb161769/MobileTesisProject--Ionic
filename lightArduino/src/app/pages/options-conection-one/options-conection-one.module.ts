import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionsConectionOnePageRoutingModule } from './options-conection-one-routing.module';

import { OptionsConectionOnePage } from './options-conection-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionsConectionOnePageRoutingModule
  ],
  declarations: [OptionsConectionOnePage]
})
export class OptionsConectionOnePageModule {}
