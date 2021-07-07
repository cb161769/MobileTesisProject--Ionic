import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { ConnectionsSchedule } from 'src/app/models/connections-schedule';
import { LogModel } from 'src/app/models/log-model';
import { environment } from 'src/environments/environment';
import { ConnectionsRealtimeDataModel } from 'src/app/models/connections-realtime-data-model';

@Component({
  selector: 'app-connections-config-schedule',
  templateUrl: './connections-config-schedule.page.html',
  styleUrls: ['./connections-config-schedule.page.scss'],
})
export class ConnectionsConfigSchedulePage implements OnInit {
  AddConnectionScheduleForm: FormGroup;
  configDeviceModel: ConfigDeviceModel = new ConfigDeviceModel();
  configConnectionModel: ConnectionsSchedule = new ConnectionsSchedule();
  ionSelectNameCancel = 'Cancelar';
  ionSelectNameOk = 'Ok';
  loading: any;
  private querySubscription: Subscription;
  userDevice = '';
  showDaily = true;
  showMonthly = true;
  sowWeekly = true;
  connectionsRealtimeDataModel:ConnectionsRealtimeDataModel = new ConnectionsRealtimeDataModel()
  constructor(
    // tslint:disable-next-line: max-line-length
    public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public navController: NavController, public toast: ToastService,
    // tslint:disable-next-line: max-line-length
    public ToastController: ToastController, private apolloClient: Apollo, public alertController: AlertController, public router: Router, public messageService: MessageService, public dynamoDBService: DynamoDBAPIService
  ) {
    this.AddConnectionScheduleForm = new FormGroup({
      connectionName: new FormControl(this.configConnectionModel.connectionName, [Validators.required]),
      isItDaily: new FormControl(this.configConnectionModel.isItDaily),
      isItWeekly: new FormControl(this.configConnectionModel.isItWeekly),
      isItMonthly: new FormControl(this.configConnectionModel.isItMonthly),
      status: new FormControl(this.configConnectionModel.status),
      configurationMaximumKilowattsPerDay: new FormControl(this.configConnectionModel.configurationMaximumKilowattsPerDay),
      configurationMaximumKilowattsPerWeek: new FormControl(this.configConnectionModel.configurationMaximumKilowattsPerWeek),
      configurationMaximumKilowattsPerMonth: new FormControl(this.configConnectionModel.configurationMaximumKilowattsPerMonth),
    });
   }

  async ngOnInit() {

  }
  async ionViewDidEnter(){
    try {
      await this.validateLoggedUser();
    } catch (error) {

    }

  }
  async getDeviceName(username: string): Promise<string>{
    const url = environment.DynamoBDEndPoints.ULR;
    let url_path = environment.DynamoBDEndPoints.API_PATHS.getDeviceConfiguration;
    let deviceName;
    const urlFullPath = `${url}` + `${url_path}` + `/${username}`;
    this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (response) => {
        deviceName = response.configuration[0].deviceName;
        await  this.GetDeviceConfiguration(deviceName);
        return deviceName;
      },
      error: async (response) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: response,
        });
        await alert.present();
      },
      complete: () => {
        return deviceName;
      }
    });
    return deviceName;
  }

  /**
   * @event toggleChange
   * @param $event event that is triggered when the toggle is moved
   * @
   */
  toggleChange(event){
    if (this.configConnectionModel.isItDaily == true) {
      this.configConnectionModel.isItWeekly = false;
      this.configConnectionModel.isItMonthly = false;
      this.showDaily = false;
      this.AddConnectionScheduleForm.get('configurationMaximumKilowattsPerDay').setValidators(Validators.required);
    }
    if (this.configConnectionModel.isItWeekly == true) {

      this.configConnectionModel.isItDaily = false;
      this.configConnectionModel.isItMonthly = false;
      this.sowWeekly = false;
      this.AddConnectionScheduleForm.get('configurationMaximumKilowattsPerWeek').setValidators(Validators.required);
    }
    if (this.configConnectionModel.isItMonthly == true) {

      this.configConnectionModel.isItDaily = false;
      this.configConnectionModel.isItWeekly = false;
      this.showMonthly = false;
      this.AddConnectionScheduleForm.get('configurationMaximumKilowattsPerMonth').setValidators(Validators.required);
    }
    if (this.showDaily == false) {
      this.sowWeekly = true;
      this.showMonthly = true;
    }
    if (this.sowWeekly == false) {
      this.showDaily = true;
      this.showMonthly = true;
    }
    if (this.showMonthly == false) {
      this.showDaily = true;
      this.sowWeekly = true;
    }
  }
  async GetDeviceConfiguration(username: any){
    const url = environment.DynamoBDEndPoints.ULR;
    const urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;
    const urlFullPath = `${url}` + `${urlPath}` + `/${username}`;
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = urlFullPath;
    logger.action = 'GetDeviceConfiguration';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);

    this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: async (response) => {
        if (response.status === 200) {
          this.configDeviceModel.configurationId = response.deviceConfiguration[0].configurationId;
          this.configDeviceModel.configurationMaximumKilowattsPerDay = response.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
          this.configDeviceModel.configurationDays = response.deviceConfiguration[0].configurationDays;
          this.configDeviceModel.deviceId = response.deviceConfiguration[0].deviceId;
          this.configDeviceModel.status = response.deviceConfiguration[0].status;
          this.configDeviceModel.connectionsConfigurations = response.deviceConfiguration[0].connectionsConfigurations;
          this.configDeviceModel.configurationName = response.deviceConfiguration[0].configurationName;

        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'ha ocurrido un error, intentelo nuevamente',
          });
          await alert.present();
          return;
        }

      },
      error: async (error) => {
        this.loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: error,
        });
        await alert.present();
      }
    });
  }
  async validateLoggedUser(){
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = '';
    logger.action = 'validateLoggedUser';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);
    await  this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        try {
          this.getDeviceName(result.attributes.email);
        } catch (error) {
          const logger = new LogModel();
          logger.level = 'ERROR';
          logger.route = '';
          logger.action = 'validateLoggedUser';
          logger.timeStamp = new Date();
          logger.userName = '';
          logger.logError = error;
          await this.logDevice(logger);
        }
      }
    });
  }
   allTheSame(array) {
    const first = array[0];
    return array.every(function(element) {
        return element === first;
    });
}

  /**
   *@function validateConnectionConfiguration
   * @param connection
   */
  async validateConnectionConfiguration(connection?: any): Promise<any>{


  for (let index = 0; index < this.configDeviceModel.connectionsConfigurations.length; index++) {
    const element = this.configDeviceModel.connectionsConfigurations[index];
    if (JSON.stringify(element) === JSON.stringify(connection)) {
      this.loading.dismiss();
      const toast = await this.alertController.create({
        message: 'La configuracion ha sido insertada anteriormente',

      });
      toast.present();
      return false;

    }

  }

  this.configDeviceModel.connectionsConfigurations.push(connection);
  return true;
  }
    /**
   *
   * @param log log model
   * @function logDevice
   * @author Claudio Raul Brito Mercedes
   */
  async logDevice(log: LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.dynamoDBService.genericLogMethod(urlFullPath, log).then(() => {
    });
  }
  /**Connection
   * @function addConnectionConfiguration
   * @param connectionModel the connectionModel
   * @author Claudio Raul Brito Mercedes
   *
   */
   /**
   * this method is to present a loading Indicator
   */
    async PresentLoading(){
      this.loading = await this.loadingIndicator.create({
        message: 'Cargando ...',
        spinner: 'dots'
      });
      await this.loading.present();

    }
  async addConnectionConfiguration(connectionModel?){
    await this.PresentLoading();
    const validation = await this.validateConnectionConfiguration(connectionModel);
    if (validation) {
      const url = environment.DynamoBDEndPoints.ULR;
      const urlPath = environment.DynamoBDEndPoints.API_PATHS.addDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}`;
      const logger = new LogModel();
      logger.level = 'INFO';
      logger.route = urlFullPath;
      logger.action = 'addConfiguration';
      logger.timeStamp = new Date();
      logger.userName = '';
      logger.timeStamp.toDateString();
      await this.logDevice(logger);
      this.dynamoDBService.genericPostMethod(urlFullPath, this.configDeviceModel).subscribe({
        next: async (data) => {

          if (data.status == 200) {
            const toast = await this.ToastController.create({
              message: 'Datos Ingresados Satisfactoriamente',
              duration: 2000,
              position: 'bottom',
              color: 'dark'
            });
            toast.present();
            this.loading.dismiss();
            this.AddConnectionScheduleForm.reset();
            this.router.navigateByUrl('/connection-one-schedule');

          }
        },
        error: async (error) => {
          logger.level = 'ERROR';
          logger.route = '';
          logger.action = 'validateLoggedUser';
          logger.timeStamp = new Date();
          logger.userName = '';
          logger.logError = error;
          await this.logDevice(logger);
          const toast = await this.ToastController.create({
            message: 'Ha ocurrido un error',
            duration: 2000,
            position: 'bottom',
            color: 'dark'
          });
          toast.present();
          this.loading.dismiss();
          return;
        },
        complete: () => {
          this.loading.dismiss();
        }
      });
    }
  }

}
