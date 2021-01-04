import { Component, OnInit } from '@angular/core';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { Auth } from 'aws-amplify';
import { LoadingController, NavController,ToastController } from '@ionic/angular';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  Email:any;
  Usrpassword:any;
  loading: any;
  toaster:any;
  LoginError:any;
  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,public ToastController : ToastController) { }

  ngOnInit() {
  }
  /**
   * this method is to User's SingIn
   */
  async singIn(){
    await this.PresentLoading();
    
    this.awsAmplifyService.singIn(this.Email,this.Usrpassword).then((result) => {
      if (result != undefined) { 

      }
      else{
        this.LoginError = this.awsAmplifyService.getErrors();
      }

      
     
    }).catch((error) => {
      if (error != undefined) {
        this.LoginError = this.awsAmplifyService.getErrors();
        
      }
      

    }).finally(() =>{
      this.Email = null;
      this.Usrpassword = null;
      this.loading.dismiss();
      
      
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
