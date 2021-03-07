import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';

@Component({
  selector: 'app-connexion1',
  templateUrl: './connexion1.page.html',
  styleUrls: ['./connexion1.page.scss'],
})
export class Connexion1Page {
  loading:any;
  selected_time:any;
  colorArray: any;
  gaugeType = "semi";
  gaugeValue = 21000;
  public healthy: number = 0;
  gaugeLabel = "Amperaje de la instalacion";
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };
  gaugeAppendText = "Watts";
  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
              public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController, 
              public messageService: MessageService, public alertController: AlertController,
              public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController,public actionSheetController: ActionSheetController) { }


      /**  This method is launched when  the page is entered*/        
    async ionViewDidEnter(){
      
    }
    async dismissModal(){

    }
    async options(url?:string){
      this.router.navigate([url]);
    }
    async selectTime(){
      const actionSheet = await this.actionSheetController.create({
        header:'Seleccionar Lapso Temporal',
        buttons:[
          {
            text:'Anual',handler:() =>{

            }
          },
          {
            text:'Trimestral',handler:() =>{
              
            }
          },
          {
            text:'Mensual',handler:() =>{
              
            }
          },
          {
            text:'Semanal',handler:() =>{
              
            }
          }
        ]
      });
      await actionSheet.present();
    }
    logScroll(event:any){

    }
    doRefresh(event:any){

    }


    async presentLoading(){
      this.loading = await this.loadingIndicator.create({
        message: 'Cargando ...',
        spinner: 'dots'
      });
      await this.loading.present();
    }



}
