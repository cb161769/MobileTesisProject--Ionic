import { Router } from '@angular/router';
import { ResetPassword } from './../../models/reset-password';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  forgetPasswordForm: FormGroup;
  resetPasswordModel: ResetPassword = new ResetPassword();
  loading:any;
  userError:any;

  constructor(public awsAmplifyService: AwsAmplifyService,
              public loadingIndicator:LoadingController,
              public router: Router) {
                this.forgetPasswordForm = new FormGroup({
                  'email': new FormControl(this.resetPasswordModel.userEmail,[Validators.email,Validators.required]),
                  'code': new FormControl(this.resetPasswordModel.userCode,[Validators.required]),
                  'password': new FormControl(this.resetPasswordModel.userNewPassword,[Validators.required,Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
                });
               }

  ngOnInit() {
  }
  async changePassword(){
    await this.PresentLoading();
    this.awsAmplifyService.forgotPasswordSubmit(this.resetPasswordModel.userEmail,this.resetPasswordModel.userCode,this.resetPasswordModel.userNewPassword).then((result) => {
      if (result != undefined) {
        this.router.navigateByUrl("/login");
        
      }else{
        this.userError = this.awsAmplifyService.getErrors();
      }
    }).catch((Error) => {
      if (Error != undefined) {
        this.userError = this.awsAmplifyService.getErrors();
        
      }
      
    }).finally(() => {
      this.forgetPasswordForm.reset();
      this.loading.dismiss();
    })

  }
  /** 
   * this method Presents a loading Screen
   */
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();
  }

}
