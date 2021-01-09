import { Register } from './../../models/register';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmRegistrationPage } from '../confirm-registration/confirm-registration.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userError:any;
  confirmationCode:any;
  registerModel:Register = new Register();
  registerForm:FormGroup;
  loading: any;

  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController,public alertController: AlertController,
     public router:Router,public navCtrl: NavController)
   {
    this.registerForm = new FormGroup({
      'firstName': new FormControl(this.registerModel.name,[Validators.required]),
      'lastName': new FormControl(this.registerModel.lastName,[Validators.required]),
      'email': new FormControl(this.registerModel.userEmail,[Validators.email,Validators.required]),
      'phoneNumber': new FormControl(this.registerModel.userPhoneNumber,[Validators.required,Validators.nullValidator]),
      'password': new FormControl(this.registerModel.userPassword,[Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),Validators.minLength(8)])
    });
    }

  ngOnInit() {
  }
  /**
   * this method is fo User'S SingIn
   */
  async singIn(){
    await this.PresentLoading();
    this.registerModel.userName = this.registerModel.userEmail;
    await this.awsAmplifyService.singUp(this.registerModel.userName,this.registerModel.userPassword,this.registerModel.userEmail,this.registerModel.name,this.registerModel.lastName,this.registerModel.userPhoneNumber)
    .then((result) => {
      if (result !=undefined) {
      
        this.promptVerificationCode();
        
      } else {
        this.userError = this.awsAmplifyService.getErrors();
        console.log(this.userError);
        
      }
    }).catch((error) => {

    }).finally(() => {
      this.loading.dismiss();
      this.registerForm.reset();
      

    });



  }
  promptVerificationCode() {
   this.router.navigateByUrl('/confirm-registration');
   // this.navCtrl.navigateRoot('ConfirmRegistrationPage');

    // let alert = this.alertController.create({
    //   header:'Ingresar Código de Verificación',
      
    //   inputs: [
    //     {
    //       name: "confirmationCode",
    //       placeholder: "Código de Verificación"
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: "Cancelar",
    //       role: "cancel",
    //       handler: data => {
    //         console.log("Cancel clicked");
    //       }
    //     },
    //     {
    //       text: "Verificar Código",
    //       handler: data => {
    //         this.awsAmplifyService.confirmSingUp(this.registerModel.userName,data.confirmationCode).then((result) => {
    //           if (result != undefined) {
    //             console.log(result);
                
    //           }else{

    //           }
    //         })
    //       }
    //     }
    //   ]
    // });
    // (await alert).present();
  }
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'cargando ...',
      spinner: 'dots'
    });
    await this.loading.present();

  }
  


}
