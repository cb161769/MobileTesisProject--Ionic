import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmRegistrationPageRoutingModule } from './confirm-registration-routing.module';

import { ConfirmRegistrationPage } from './confirm-registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ConfirmRegistrationPageRoutingModule
  ],
  declarations: [ConfirmRegistrationPage]
})
export class ConfirmRegistrationPageModule {}
