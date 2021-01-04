import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
//import {AwsCognitoServiceService} from '../../data-services/aws-cognito-service.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LoginPage],
  providers:[]
})
export class LoginPageModule {}
