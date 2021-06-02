import { Router } from '@angular/router';
import { LoadingController, NavController,ToastController,AlertController } from '@ionic/angular';
import { AwsAmplifyService } from './../../data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { TensorflowService } from 'src/app/data-services/tensorflow.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-connection-one-consumption-comparative',
  templateUrl: './connection-one-consumption-comparative.page.html',
  styleUrls: ['./connection-one-consumption-comparative.page.scss'],
})
export class ConnectionOneConsumptionComparativePage implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public navController: NavController, public toast: ToastService,
              // tslint:disable-next-line: max-line-length
              public ToastController: ToastController, public alertController: AlertController, public router: Router, public messageService: MessageService, public dynamoDBService: DynamoDBAPIService,
              public tensorflowService:TensorflowService) { }

  ngOnInit() {
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  async fetchData(){
    const url = environment.DynamoBDEndPoints.ULR;
  }

}
