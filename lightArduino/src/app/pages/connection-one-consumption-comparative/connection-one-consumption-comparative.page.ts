import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { AwsAmplifyService } from './../../data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  dataToBeProcessed: Array<any> = [];
  @ViewChild('lossChart') lossChart;
  @ViewChild('chart') predictChart;
  // tslint:disable-next-line: max-line-length
  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public navController: NavController, public toast: ToastService,
              // tslint:disable-next-line: max-line-length
              public ToastController: ToastController, public alertController: AlertController, public router: Router, public messageService: MessageService, public dynamoDBService: DynamoDBAPIService,
              public tensorflowService: TensorflowService) { }


  async ngOnInit() {
    await this.fetchData();
    await this.makePrediction();
  }
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  /**
   * @function fetchData
   *
   */
  async fetchData(){
    const url = environment.DynamoBDEndPoints.ULR;
    const urlPath = environment.DynamoBDEndPoints.API_PATHS.Tensorflow.PredictNexMonth;
    const fullUrl = `${url}` + urlPath;
    await this.dynamoDBService.genericGet(fullUrl).then((data: any) => {
      this.dataToBeProcessed =  data.data;


    }).catch( async (error) => {
      console.log(error);
    });
  }
  /**
   * @function createModel
   * @returns {model}
   * @description this method
   * @aut
   */
  async createModel(){
    return this.tensorflowService.createModel();
  }
  /**
   *
   * @param data
   * @returns asdasd
   */
  async convertToTensor(data: any){
    return this.tensorflowService.convertToTensor(data);
  }
  /**
   * @function testModel
   * @param model model
   * @param inputData inputData
   * @param normalizationData normalizationData
   * @returns {model}
   */
  async testModel(model, inputData, normalizationData){
    return this.tensorflowService.trainModel(model, inputData, normalizationData);
  }
  async trainModel(model, inputData, normalizationData){
    return this.tensorflowService.makePrediction(model, inputData, normalizationData);
  }

  async makePrediction() {
    const model = await this.createModel();
    await this.fetchData();
    debugger;
    const tensorData = await this.convertToTensor(this.dataToBeProcessed);
    const {inputs, labels} = tensorData;
    const trainedModel = await this.testModel(model, inputs, labels);
    const finalModel = await this.trainModel(model, this.dataToBeProcessed, tensorData);
    debugger;
  }


}
