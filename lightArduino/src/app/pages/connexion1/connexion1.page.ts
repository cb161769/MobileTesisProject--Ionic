import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController, ToastController } from '@ionic/angular';
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
  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
              public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController, 
              public messageService: MessageService, public alertController: AlertController,
              public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController) { }


      /**  This method is launched when  the page is entered*/        
    async ionViewDidEnter(){
      
    }
    async dismissModal(){

    }
    async options(){

    }
    async selectTime(){

    }
    logScroll(event:any){

    }
    doRefresh(evnt:any){

    }


    async presentLoading(){
      this.loading = await this.loadingIndicator.create({
        message: 'Cargando ...',
        spinner: 'dots'
      });
      await this.loading.present();
    }



}
