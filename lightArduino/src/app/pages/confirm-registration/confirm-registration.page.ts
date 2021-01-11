import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfirmRegistrarion } from 'src/app/models/confirm-registrarion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-registration',
  templateUrl: './confirm-registration.page.html',
  styleUrls: ['./confirm-registration.page.scss'],
})
export class ConfirmRegistrationPage implements OnInit {
  confirmRegistrationForm:FormGroup;
  confirRegistrationModel:ConfirmRegistrarion = new ConfirmRegistrarion();
  loading:any;
  confirmRegistrationError:any;
  toaster:any;
  /**
   * this is the Confirm RegistrationPage Constructor
   * @param awsAmplifyService  AWS cognito AmplifyService
   * @param loadingIndicator loading Indicator 
   * @param navController nav Controller
   * @param toast toast
   */
  constructor(public router:Router,public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastController,
    ) { 

      this.confirmRegistrationForm = new FormGroup({
        'userName': new FormControl(this.confirRegistrationModel.username,Validators.required),
        'verificationCode':new FormControl(this.confirRegistrationModel.verificationCode,[Validators.required,Validators.minLength(4)])
      });

    }

  ngOnInit() {
    
  }
  async confirmRegistration(){
    await this.PresentLoading();
    this.awsAmplifyService.confirmSingUp(this.confirRegistrationModel.username,this.confirRegistrationModel.verificationCode).then((result) => {
      if (result != undefined) {
        this.redirectToRegisterDevice();

        
      } else {
        this.confirmRegistrationError = this.awsAmplifyService.getErrors();
        
      }
    }).catch((error) => {

    }).finally(() => {
      this.loading.dismiss();
    });

  }
  /**
   * this method is to present a loading Indicator
   */
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();
  }
  /**
   * this method redirects to the HomePage
   */
  async redirectToRegisterDevice(){
    this.toaster = await this.toast.create({
      message:'su cuenta ha sido verificada con éxito',
      duration:2000
    });
    this.toaster.present();
    this.router.navigateByUrl('/register-device');
    

  }


}
