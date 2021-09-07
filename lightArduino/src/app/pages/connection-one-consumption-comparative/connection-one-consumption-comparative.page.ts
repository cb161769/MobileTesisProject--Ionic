import { AwsSdkService } from "./../../data-services/awsIoT/aws-sdk.service";
import { Router } from "@angular/router";
import {
  LoadingController,
  NavController,
  ToastController,
  AlertController,
} from "@ionic/angular";
import { AwsAmplifyService } from "./../../data-services/aws-amplify.service";
import { DynamoDBAPIService } from "src/app/data-services/dynamo-db-api.service";
import { Component, OnInit } from "@angular/core";
import { MessageService } from "src/app/data-services/messageService/message.service";
import { ToastService } from "src/app/data-services/ToasterService/toast.service";
import { TensorflowService } from "src/app/data-services/tensorflow.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { delay } from "rxjs/operators";
@Component({
  selector: "app-connection-one-consumption-comparative",
  templateUrl: "./connection-one-consumption-comparative.page.html",
  styleUrls: ["./connection-one-consumption-comparative.page.scss"],
})
export class ConnectionOneConsumptionComparativePage implements OnInit {
  dataToBeProcessed: Array<any> = [];
  lossChart = document.getElementById("lossChart");
  predictChart = document.getElementById("accuracyChart");
  loading: any;
  // tslint:disable-next-line: max-line-length
  constructor(
    public awsAmplifyService: AwsAmplifyService,
    public loadingIndicator: LoadingController,
    public navController: NavController,
    public toast: ToastService,
    // tslint:disable-next-line: max-line-length
    public ToastController: ToastController,
    public alertController: AlertController,
    public router: Router,
    public messageService: MessageService,
    public dynamoDBService: DynamoDBAPIService,
    public tensorflowService: TensorflowService,
    public sdkService: AwsSdkService,
    private httpClient: HttpClient
  ) {}

  async ngOnInit() {
    await this.makePrediction();
  }
  /**
   *
   * @param event the event that will be triggered
   */
  async doRefresh(event) {
    await this.ngOnInit();
  }
  /**
   * this method is to present a loading Indicator
   */
  async PresentLoading() {
    this.loading = await this.loadingIndicator.create({
      message: "Cargando ...",
      spinner: "dots",
    });
    await this.loading.present();
  }
  /**
   * @function fetchData
   *
   */
  async fetchData() {
    const url = environment.DynamoBDEndPoints.ULR;
    const urlPath =
      environment.DynamoBDEndPoints.API_PATHS.Tensorflow.PredictNexMonth;
    const fullUrl = `${url}` + urlPath;
    const data = await this.httpClient
      .get<any>(fullUrl)
      .pipe(delay(3000))
      .toPromise();
    return data;
    // await this.dynamoDBService
    //   .genericGet(fullUrl)
    //   .then((data: any) => {
    //
    //     if(data){

    //       if (Array.isArray(data.data)) {
    //         this.dataToBeProcessed = data.data;
    //       } else {
    //         this.dataToBeProcessed = [{ y: 0, x: new Date() }];
    //       }
    //     }else{
    //       this.dataToBeProcessed = [{ y: 0, x: new Date() }];
    //     }

    //   })
    //   .catch(async (error) => {
    //     const toast = await this.ToastController.create({
    //       message: 'ha ocurrido un error consultando la data',
    //       duration: 2000,
    //     });
    //     toast.present();
    //   });
  }
  /**
   * @function createModel
   * @returns {model}
   * @description this method
   * @aut
   */
  async createModel() {
    return this.tensorflowService.createModel();
  }
  /**
   *
   * @param data
   * @returns asdasd
   */
  async convertToTensor(data: any) {
    try {
      return this.tensorflowService.convertToTensor(data);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * @function testModel
   * @param model model
   * @param inputData inputData
   * @param normalizationData normalizationData
   * @returns {model}
   */
  async testModel(model, inputData, normalizationData, plotData?) {
    return this.tensorflowService.trainModel(
      model,
      inputData,
      normalizationData,
      plotData
    );
  }
  async trainModel(model, inputData, normalizationData, plotData?) {
    return this.tensorflowService.makePrediction(
      model,
      inputData,
      normalizationData,
      plotData
    );
  }
  /**
   *@function makePrediction
   *@author Claudio Raul Brito Mercedes
   */
  async makePrediction() {
    try {
      await this.PresentLoading();
      const model = await this.createModel();
      const data = await this.fetchData();

      const tensorData = await this.convertToTensor(data.data);

      const { inputs, labels } = tensorData;

      const trainedModel = await this.testModel(
        model,
        inputs,
        labels,
        "lossChart"
      );

      const finalModel = await this.trainModel(
        model,
        this.dataToBeProcessed,
        tensorData,
        "accuracyChart"
      );
      this.loading.dismiss();
    } catch (error) {
      console.log(error);
    }
  }
}
