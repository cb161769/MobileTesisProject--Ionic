import { ActivatedRoute, Router } from "@angular/router";
import { AwsSdkService } from "./../../data-services/awsIoT/aws-sdk.service";
import { Apollo, gql } from "apollo-angular";
import { DynamoDBAPIService } from "./../../data-services/dynamo-db-api.service";
import { environment } from "./../../../environments/environment";
import { LogModel } from "./../../models/log-model";
import { interval, Subscription } from "rxjs";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { DevicesEnum } from "src/app/utils/utilities";
import {
  AlertController,
  LoadingController,
  ToastController,
  NavController,
} from "@ionic/angular";
import { ConnectionStatus, NetworkService } from "src/app/data-services/network.service";

@Component({
  selector: "app-connection-one-tabs",
  templateUrl: "./connection-one-tabs.page.html",
  styleUrls: ["./connection-one-tabs.page.scss"],
})
export class ConnectionOneTabsPage implements OnInit, OnDestroy {
  devicesNames = Object.values(DevicesEnum);
  constructor(
    public DynamoDBService: DynamoDBAPIService,
    private apolloClient: Apollo,
    public AwsSdkService: AwsSdkService,
    public ToastController: ToastController,
    public router: ActivatedRoute, 
    public networkService: NetworkService,
  ) {}
  private querySubscription: Subscription;
  private subscription: Subscription;
  private turnedOff = false;
  private connectionName: any = "";
  ngOnInit() {}
  /**
   *
   */
  async ionViewDidEnter() {
    const source = interval(10000);
    // this.sub
    this.subscription = source.subscribe(() => {
      this.automate();
    });
  }
  /**
   *
   */
  async ionViewDidLeave() {
    this.subscription && this.subscription.unsubscribe();
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription && this.subscription.unsubscribe();
  }
  public async automate() {
    try {
      if (
        this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online
      ) {
        const deviceName = 1;
        this.querySubscription = this.apolloClient
          .watchQuery<any>({
            query: gql`
          {
            deviceId(deviceName:${deviceName}){
              isConnection,
              connectionName,
              turnOff,
              isDevice,
              deviceName
            }
          },
  
          `,
          })
          .valueChanges.subscribe(async ({ data, loading }) => {
            if (!loading) {
              if (Object.keys(data).length > 0) {
                if (data.deviceId.turnOff === true) {
                  if (data.deviceId.isConnection == true) {
                    for (
                      let index = 0;
                      index < this.devicesNames.length;
                      index++
                    ) {
                      const element = this.devicesNames[index];
                      if (element == data.deviceId.connectionName) {
                        const remix =
                          environment?.device_TOPICS?.topicsArray.filter(
                            (t) => t.connectionName == element
                          );
                        const topic = remix[0].turnOffTopics;
                        const payload = "hello";
                        const responses =
                          (await this.AwsSdkService.publishMessage(
                            topic,
                            payload
                          )) as any;
                        if (responses?.response.error != null) {
  
                          const toast = await this.ToastController.create({
                            message:
                              "Ha ocurrido un error desactivando el dispositivo",
                            duration: 2000,
                            position: "bottom",
                            color: "dark",
                          });
                          toast.present();
                          this.subscription.unsubscribe();
                        } else {
                          this.turnedOff = true;
                          const toast = await this.ToastController.create({
                            message: `se ha desactivado el dispositivo ${element} de manera satisfactoria`,
                            duration: 2000,
                            position: "bottom",
                            color: "dark",
                          });
                          toast.present();
                          this.subscription.unsubscribe();
                        }
                      }
                    }
                  }
                }
              }
            }
          });
      }else{
        const toast = await this.ToastController.create({
          message: `Ha ocurrido un error de conexion, intentelo nuevamente`,
          duration: 2000,
        });
        toast.present();
      }
      // this.querySubscription =

    } catch (error) {
      const logger = new LogModel();
      logger.level = "INFO";
      logger.route = '';
      logger.action = "showDetailChartInCurrentYear";
      logger.timeStamp = new Date();
      logger.userName = "";
      await this.logDevice(logger);
    }
  }
  async logDevice(log: LogModel) {
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.DynamoDBService.genericLogMethod(urlFullPath, log);
  }
}
