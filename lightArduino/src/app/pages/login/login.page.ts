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
    public ToastController : ToastController, public router:Router)
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
    
    this.awsAmplifyService.singIn(this.loginModel.userEmail,this.loginModel.userPassword).then((result) => {
      if (result != undefined) { 
        this.router.navigateByUrl("/home-device-page");
      }
      else{
        this.LoginError = this.awsAmplifyService.getErrors();
        console.log(this.LoginError);
      }

      
     
    }).catch((error) => {
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
