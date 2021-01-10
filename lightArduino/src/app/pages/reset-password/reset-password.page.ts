import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResetPassword } from 'src/app/models/reset-password';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  userError:any;
  loading:any;
  resetPasswordModel: ResetPassword = new ResetPassword();
  resertPasswordForm:FormGroup;

  /**
   * This is the reset Password Page Constructor 
   * @param awsAmplifyService aws Services
   * @param loadingIndicator loading indicator 
   * @param router router variable
   */

  constructor(public awsAmplifyService:AwsAmplifyService,
              public loadingIndicator: LoadingController,public router:Router) 
              {
                this.resertPasswordForm = new FormGroup({
                  'email': new FormControl(this.resetPasswordModel.userEmail,[Validators.email,Validators.required]),
                });
              }
  ngOnInit() {
  }
  async resetPassword(){
    await this.PresentLoading();
    this.awsAmplifyService.forgotPassword(this.resetPasswordModel.userEmail).then(() => {
      this.router.navigateByUrl("/forget-password");
      
    }).catch((error) => {
      if (error != undefined) {
        this.userError = this.awsAmplifyService.getErrors();
      }
    }).finally(() => {
      this.resertPasswordForm.reset();
      this.loading.dismiss();
    });
    
  }
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();
  }


}
