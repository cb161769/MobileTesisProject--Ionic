import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController,ToastController,AlertController,NavController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';

@Component({
  selector: 'app-your-account',
  templateUrl: './your-account.page.html',
  styleUrls: ['./your-account.page.scss'],
})
export class YourAccountPage implements OnInit,OnDestroy {

  constructor(public awsAmplifyService: AwsAmplifyService,public loadingIndicator:LoadingController,public router:Router,
    public DynamoDBService: DynamoDBAPIService, public ToastController : ToastController,public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController) { }

  ngOnInit() {
  }
  ngOnDestroy(){

  }
  singOut():void{

  }
  dismiss():void{
    
  }
  

}
