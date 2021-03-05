import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Connexion1PageRoutingModule } from './connexion1-routing.module';

import { Connexion1Page } from './connexion1.page';
import { NgxGaugeModule } from 'ngx-gauge';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Connexion1PageRoutingModule,
    NgxGaugeModule
  ],
  declarations: [Connexion1Page]
})
export class Connexion1PageModule {}
