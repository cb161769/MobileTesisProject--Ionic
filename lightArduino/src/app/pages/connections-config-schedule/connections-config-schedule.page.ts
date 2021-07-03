import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { ConnectionsSchedule } from 'src/app/models/connections-schedule';
import { LogModel } from 'src/app/models/log-model';
import { environment } from 'src/environments/environment';

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
  userDevice = '';
  constructor(
    // tslint:disable-next-line: max-line-length
    public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public navController: NavController, public toast: ToastService,
    // tslint:disable-next-line: max-line-length
    public ToastController: ToastController, public alertController: AlertController, public router: Router, public messageService: MessageService, public dynamoDBService: DynamoDBAPIService
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

  ngOnInit() {
  }
  ionViewDidEnter(){

  }
  /**
   *
   * @param connection
   */
  async validateConnectionConfiguration(connection?): Promise<any>{
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
  async addConnectionConfiguration(connectionModel?){
    const validation = await this.validateConnectionConfiguration(connectionModel);
    if (validation) {
      let url = environment.DynamoBDEndPoints.ULR;
      let urlPath = environment.DynamoBDEndPoints.API_PATHS.addDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}`;
      const logger = new LogModel();
      logger.level = 'INFO';
      logger.route = urlFullPath;
      logger.action = 'addConfiguration';
      logger.timeStamp = new Date();
      logger.userName = '';
      logger.timeStamp.toDateString();
      await this.logDevice(logger);
      this.dynamoDBService.genericPostMethod(urlFullPath, connectionModel).subscribe({
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
