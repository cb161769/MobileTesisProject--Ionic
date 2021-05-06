import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController,ToastController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { RelaysModel } from 'src/app/models/relays-model';
import { environment } from 'src/environments/environment';
import { Observable, of } from "rxjs";
@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.page.html',
  styleUrls: ['./statistics-page.page.scss'],
})
export class StatisticsPagePage implements OnInit {
  relaysModel:RelaysModel[] = [];
  loading:any;
  relaysList = [];
  currentUserError:any;
  relays: Observable<RelaysModel[]>;
  constructor(public awsAmplifyService: AwsAmplifyService,public loadingIndicator:LoadingController,public router:Router,
    public DynamoDBService: DynamoDBAPIService, public ToastController : ToastController,public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController) { }

  ngOnInit() {
  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  async ionViewDidEnter(

  ){

   this.validateLoggedUser();
  }
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
  async loadAllRelays(userEmail:any){
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceRelays;
    const urlFullPath = `${url}` + `${urlPath}` + `${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe(
      {
        next: async (data) => {
          if (data != null || data != undefined || data.data !=undefined) {
            if (data.data.length > 0) {
              this.relaysList = data.data;
              let relays$:Observable<RelaysModel[]>;
              for (let index = 0; index < this.relaysList.length; index++) {
                this.relaysModel.push(this.relaysList[index]);
                relays$ = of([{Name:this.relaysList[index].Name}]);
              }
              this.relays = relays$;  
            }
            
          }
          else{
            const alert = await this.alertController.create({
              header:'Advertencia',
              subHeader:'no tiene dispositivos registrados',
              message:'es necesario que registre un dispositivo para acceder a esta pagina',
              buttons: [
                {
                  text:'Aceptar',
                  handler: async () => {
                    await this.singOut();
  
                  }
                }
              ]
            });
            await alert.present();
          }
        },
        error:(error) => {
          console.log(error);
        }, 
        complete:() => {
          console.log('complete...')
        }
      }
    )
  }
  redirectToRegisterDevicePage(){
    this.navController.navigateBack('/register-device');
  }
  /**
   * @method singOut
   */
  async singOut(){
    await this.presentLoading();
    this.awsAmplifyService.singOut().then((result) => {
      if (result != undefined) {
      }else{
      }
    }).catch(() => {

    }).finally(() => {
      this.loading.dismiss();
    });
    
  }
  async openPage(page){
    
  }
  async  validateLoggedUser(){
    await this.presentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        this.loadAllRelays(result.attributes.email);
        
      } else {
        this.currentUserError = this.awsAmplifyService.getErrors();
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, ingrese nuevamente al sistema',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();

      }

    }).catch((error) => {
      console.log(error);

    }).finally(() => {
      this.loading.dismiss();

    });
    
      
  }

}
