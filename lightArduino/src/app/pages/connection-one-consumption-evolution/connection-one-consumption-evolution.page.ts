import { ConnectionConsumptions } from './../../models/connection-consumptions';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { AvailableCharts } from './../../models/interfaces/Charts';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController,NavController } from '@ionic/angular';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';

@Component({
  selector: 'app-connection-one-consumption-evolution',
  templateUrl: './connection-one-consumption-evolution.page.html',
  styleUrls: ['./connection-one-consumption-evolution.page.scss'],
})
export class ConnectionOneConsumptionEvolutionPage implements OnInit {

  availableChartModel:any;
  chartsArray:Array<any> = [];
  ConnectionConsumptionsModel:ConnectionConsumptions = new ConnectionConsumptions();

  constructor(public router: Router, public AwsAmplifyService:AwsAmplifyService,
             public loadingIndicator:LoadingController, public NavController:NavController,
             public toastController:ToastController, public dynamoDBService: DynamoDBAPIService) { }

  ngOnInit() {

  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
