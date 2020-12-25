import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourAccountPageRoutingModule } from './your-account-routing.module';

import { YourAccountPage } from './your-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourAccountPageRoutingModule
  ],
  declarations: [YourAccountPage]
})
export class YourAccountPageModule {}
