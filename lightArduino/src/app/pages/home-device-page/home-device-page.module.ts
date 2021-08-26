
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { IonicModule } from '@ionic/angular';

import { HomeDevicePagePageRoutingModule } from './home-device-page-routing.module';

import { HomeDevicePagePage } from './home-device-page.page';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { NgxGaugeModule } from 'ngx-gauge';
import { HighchartsChartModule } from 'highcharts-angular';

registerLocaleData(localeEs);
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomeDevicePagePageRoutingModule,
    NgxGaugeModule,
    HighchartsChartModule
    
  ],
  declarations: [HomeDevicePagePage],
  providers:[
    {provide:LOCALE_ID,useValue:'es-ES'},
  ]
})
export class HomeDevicePagePageModule {}
