import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { readSync } from 'fs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userName:any;
  userEmail:any;
  userPassword:any;
  userFirstName:any;
  userLastName:any;
  userPhoneNumber:any;
  userError:any;
  confirmationCode:any;

  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController,public alertController: AlertController) { }

  ngOnInit() {
  }
  /**
   * this method is fo User'S SingIn
   */
  async singIn(){
    await this.awsAmplifyService.singUp(this.userName,this.userPassword,this.userEmail,this.userFirstName,this.userLastName,this.userPhoneNumber)
    .then((result) => {
      if (result !=undefined) {
        this.promptVerificationCode();
        
      } else {
        this.userError = this.awsAmplifyService.getErrors();
        console.log(this.userError);
        
      }
    }).catch((error) => {

    }).finally(() => {

    });



  }
 async promptVerificationCode() {
    let alert = this.alertController.create({
      header:'Ingresar Código de Verificación',
      
      inputs: [
        {
          name: "confirmationCode",
          placeholder: "Código de Verificación"
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Verificar Código",
          handler: data => {
            this.awsAmplifyService.confirmSingUp(this.userName,data.confirmationCode).then((result) => {
              if (result != undefined) {
                console.log(result);
                
              }else{

              }
            })
          }
        }
      ]
    });
    (await alert).present();
  }
  


}
