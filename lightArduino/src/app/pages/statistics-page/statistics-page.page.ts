import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController,ToastController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.page.html',
  styleUrls: ['./statistics-page.page.scss'],
})
export class StatisticsPagePage implements OnInit {

  constructor(public awsAmplifyService: AwsAmplifyService,public loadingIndicator:LoadingController,public router:Router,
    public DynamoDBService: DynamoDBAPIService, public ToastController : ToastController,public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController) { }

  ngOnInit() {
  }
  singOut():void{

  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  async ionViewDidEnter(){
   
  }

}
