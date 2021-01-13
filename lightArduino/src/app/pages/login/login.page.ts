import { MessageService } from './../../data-services/messageService/message.service';
import { Login } from './../../models/login';
import { Component, OnInit } from '@angular/core';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { LoadingController, NavController,ToastController } from '@ionic/angular';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: any;
  toaster:any;
  LoginError:any;
  loginModel:Login = new Login();
  loginForm:FormGroup;
  /**
   * this is the Login Page Constructor
   * @param awsAmplifyService awsAmplifyService
   * @param loadingIndicator loadingIndicator
   * @param navController nav Class Controller
   * @param toast toast Controller
   * @param ToastController 
   */
  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController, public router:Router, public messageService:MessageService)
     {
        this.loginForm = new FormGroup({
          'email': new FormControl(this.loginModel.userEmail,[Validators.required]),
          'password': new FormControl(this.loginModel.userPassword,[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])
        });

    }

  ngOnInit() {
  }
  /**
   * this method is to User's SingIn
   */
  async singIn(){
    await this.PresentLoading();
    
    this.awsAmplifyService.singIn(this.loginModel.userEmail,this.loginModel.userPassword).then( async (result) => {
      if (result != undefined) { 
        console.log(result);
        this.messageService.setUserEmail(this.loginModel.userEmail);
        
        this.router.navigateByUrl("/home-device-page");
      }
      
      else{
        this.LoginError = this.awsAmplifyService.getErrors();
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, intentelo nuevamente',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();
        
      }
      console.log(result);

      
     
    }).catch( async (error) => {
      if (this.LoginError !=undefined || error !=undefined) {
        
      }
      if (error != undefined) {
        this.LoginError = this.awsAmplifyService.getErrors();
        
      }
  
    }).finally(() =>{
      this.loading.dismiss();
      this.loginForm.reset();
      
      
      
    });
    
    
  }
  /**
   * this method is to present an Loading Indicator
   */
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();
  }

}
