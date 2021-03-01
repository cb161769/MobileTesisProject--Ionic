import { FormControl, FormGroup } from '@angular/forms';
import { async } from '@angular/core/testing';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController,ToastController,AlertController,NavController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { environment } from 'src/environments/environment';
import { MyAccount } from 'src/app/models/my-account-model';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.page.html',
  styleUrls: ['./your-account.page.scss'],
})
export class YourAccountPage implements OnInit,OnDestroy {
  loading:any;
  myAccountModel: MyAccount = new MyAccount();
  myAccountForm:FormGroup;
  showSaveButton:boolean = false;
  showEditButton:boolean = true;
  private disableAllFormsControls:boolean = true;
  private disableEditButton:boolean = true;
  constructor(public awsAmplifyService: AwsAmplifyService,public loadingIndicator:LoadingController,public router:Router,
    public DynamoDBService: DynamoDBAPIService, public ToastController : ToastController,public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController) { 
      this.myAccountForm = new FormGroup({
        'userName': new FormControl(this.myAccountModel.email),
        'lastName': new FormControl(this.myAccountModel.family_name),
        'phone_number': new FormControl(this.myAccountModel.phone_number),
        'email_verified': new FormControl(this.myAccountModel.email_verified)
      });
    }

  ngOnInit() {
    
  }
  ngOnDestroy(){

  }
  singOut():void{

  }
  dismiss():void{
    
  }
  async ionViewDidEnter(){
    await this.presentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        //his.showDetailedChart();
        this.validateUserDevice(result.attributes.email).then(() => {
          this.myAccountModel.email = result.attributes.email;
          this.myAccountModel.email_verified = result.attributes.email_verified;
          this.myAccountModel.name = result.attributes.name;
          this.myAccountModel.family_name = result.attributes.family_name;
          this.myAccountModel.phone_number = result.attributes.phone_number;
          
          
        }).catch((error) => {console.log(error);})
        

        //console.log(result.attributes);

        
      } else {
        //this.currentUserError = this.awsAmplifyService.getErrors();
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, ingrese nuevamente al sistema',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();

       this.redirectToLoginPage(); 
      }

    }).catch((error) => {
      console.log(error);

    }).finally(() => {
      this.loading.dismiss();

    });
  }
  async saveEdit(){
    await this.presentLoading();
    await this.awsAmplifyService.UpdateUserAttributes('','','',this.myAccountModel.name,this.myAccountModel.family_name,this.myAccountModel.phone_number).then(async (result) => {
      console.log(result);
      await this.awsAmplifyService.getCurrentUser().then(async (result) => {
        if (result != undefined) {
          this.validateUserDevice(result.attributes.email).then(() => {
            this.myAccountModel.email = result.attributes.email;
            this.myAccountModel.email_verified = result.attributes.email_verified;
            this.myAccountModel.name = result.attributes.name;
            this.myAccountModel.family_name = result.attributes.family_name;
            this.myAccountModel.phone_number = result.attributes.phone_number;
            this.disableAllFormsControls = true;
            this.showSaveButton = false;
          }).catch((error) => {console.log(error);})
        }
      });
    }).catch((error) =>{
      console.log(error);
    }).finally(() =>{
      this.loading.dismiss();
    });
    

  }
  ionViewDidLeave(){}
  /**
   * this method presents a loading indicator
   */
  async presentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();
  }
  /**
   * this method edits the Forms
   */
  editData(){
    this.showSaveButton = true;
    this.disableAllFormsControls = false;

  }
  /**
   * this method redirects the user to the login page
   */
  redirectToLoginPage(){
    this.navController.navigateBack('/login');
  }
  async validateUserDevice(userEmail:any){
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;
    const urlFullPath = `${url}` + `${urlPath}` + `/${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async(data) => {
        console.log(data);
        if (data != null || data != undefined || data.readings ==undefined) {
          if (data.readings.Count > 0) {
            return true;
          }
          else{
            const alert = await this.alertController.create({
              header:'Advertencia',
              subHeader:'no tiene dispositivos registrados',
              message:'es necesario que registre un dispositivo para acceder a esta pagina',
              buttons: [
                {
                  text:'Aceptar',
                  handler: () => {
                    this.redirectToRegisterDevicePage();
  
                  }
                }
              ]
            });
            await alert.present();
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('completed')
      }
    });

  }
  /**
   * this method redirects to the Register-Device page
   */
  redirectToRegisterDevicePage(){
    this.navController.navigateBack('/register-device');
  }
  

}
