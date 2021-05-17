import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, AlertController, ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { ConnectionConsumptions } from 'src/app/models/connection-consumptions';
import { environment } from 'src/environments/environment';
import {  Chart} from 'chart.js';
import 'chartjs-adapter-moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-connection-one-consumptions',
  templateUrl: './connection-one-consumptions.page.html',
  styleUrls: ['./connection-one-consumptions.page.scss'],
})
export class ConnectionOneConsumptionsPage implements OnInit {
  deviceName: string = '';
  loading: any;
  showCard: boolean = false;
  chart: any;
  arrayModel: Array<any> = [];
  connectionSelect: any;
  totalAmps: any = 0;
  totalWatts: any = 0;
  conclusionValues: any = 0;
  ConnectionOneConsumptionsForm : FormGroup;
  devicesAnalyzed: any = 0;
  devicesList: string = "";
  deviceResume: any = {
    connectionName: '',
    minorConnectionName: '',
    connectionAmpsProm: '',
    elapsedTime: {},
    dayConsumption: {
      Day: {
        amps: 0,
        watts: 0,
        khw: 0
      }
    },
    nightConsumption: {
      Night: {
        amps: 0,
        watts: 0,
        khw: 0
      }
    },
    wattsProm: 0,
    biggestMonthConsumption: '',
    mostCommonDay: ''
  };
  deviceResume2: any = {
    minorConnectionName: '',
    connectionAmpsProm: '',
    elapsedTime: {},
    Biggest: {
        connectionName: '',
        dayConsumption: {
      Day: {
        amps: 0,
        watts: 0,
        khw: 0
      }
    },
        nightConsumption: {
        Night: {
          amps: 0,
          watts: 0,
          khw: 0
        }
      }
    },
    Lowest: {
        LowestconnectionName: '',
        dayConsumption: {
        Day:
        {
            amps: 0,
            watts: 0,
            khw: 0
        }
    },
    nightConsumption: {
        Night: {
          amps: 0,
          watts: 0,
          khw: 0
        }
      }},
      Equal: {
        EqualconnectionName: '',
        dayConsumption: {
      Day: {
        amps: 0,
        watts: 0,
        khw: 0
      }
    },
    nightConsumption: {
        Night: {
          amps: 0,
          watts: 0,
          khw: 0
        }
      }},

    wattsProm: 0,
    biggestMonthConsumption: '',
    mostCommonDay: ''
  };
  deviceResumeList: Array<any> = [];
  @ViewChild('barchart') ConnectionChart;
  constructor( public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public navController: NavController, public toast: ToastService,
               public ToastController : ToastController, public alertController: AlertController, public router: Router, public messageService: MessageService, public dynamoDBService: DynamoDBAPIService)
    {
      this.ConnectionOneConsumptionsForm = new FormGroup({
        'Devices': new FormControl(this.ConnectionConsumptionsModel.Devices, [Validators.required, Validators.minLength(1)]),
        'StartDate': new FormControl(this.ConnectionConsumptionsModel.StartDate, [Validators.required]),
        'FinalDate': new FormControl(this.ConnectionConsumptionsModel.FinalDate, [Validators.required]),
        'GraphType': new FormControl(this.ConnectionConsumptionsModel.GraphType, [Validators.required]),
        'SearchCriteria': new FormControl(this.ConnectionConsumptionsModel.SearchCriteria, [Validators.required])
      });
     }

 async  ngOnInit() {
  await this.validateLoggedUser();
  }
  ConfigDeviceModel: ConfigDeviceModel = new ConfigDeviceModel();
  // tslint:disable-next-line: member-ordering
  AvailableCharts = [
    {
      name: 'bar'
    },
    {
      name: 'line'
    },
    {
      name: 'pie'
    }
    ];
    AvailableCriteria = [
      {
        name: 'Mensual'
      },
      {
        name: 'Semanal'
      },
      {
        name: 'Anual'
      }
    ];
    ConnectionConsumptionsModel: ConnectionConsumptions = new ConnectionConsumptions();
  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  onChange(event){
    console.log(event.target.value);
    this.arrayModel = [];
    this.arrayModel = event.target.value;

  }
  async validateLoggedUser(){
    await this.PresentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        try {
        this.getDeviceName(result.attributes.email);
      } catch (error) {
        console.log(error);

      }

      } else {
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, ingrese nuevamente al sistema',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();



      }
    }).catch(() => {

    }).finally(() => {
      this.loading.dismiss();
    })
  }
    /**
   * this method is to present a loading Indicator
   * @method PresentLoading
   * @type Promise
   */
     async PresentLoading(){
      this.loading = await this.loadingIndicator.create({
        message: 'Cargando ...',
        spinner: 'dots'
      });
      await this.loading.present();

    }
    /**
     * @description This Function gets the Device Name
     * @param username
     * @returns String
     */
    getDeviceName(username: string): string{
      let Connections = this.getDevices(username);
      let url = environment.DynamoBDEndPoints.ULR;
      let url_path = environment.DynamoBDEndPoints.API_PATHS.getDeviceConfiguration;
      let deviceName;
      const urlFullPath = `${url}` + `${url_path}` + `/${username}`;
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next: (response) => {
          deviceName = response.configuration[0].deviceName;
          this.deviceName = deviceName;
          this.GetDeviceConfiguration(deviceName);
          const object = [{name: deviceName}];
          for (let index = 0; index < Connections.length; index++) {
            const element = Connections[index];
            object.push(element);

          }
          this.ConnectionConsumptionsModel.Devices = object;
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
      })
      return deviceName;
    }
    async GetDeviceConfiguration(username: any){
      var url = environment.DynamoBDEndPoints.ULR;
      var urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}` + `/${username}`;
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next: async (response) => {
          if (response.status === 200) {
            this.ConfigDeviceModel.configurationId = response.deviceConfiguration[0].configurationId;
            // tslint:disable-next-line: max-line-length
            this.ConfigDeviceModel.configurationMaximumKilowattsPerDay = response.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
            this.ConfigDeviceModel.configurationDays = response.deviceConfiguration[0].configurationDays;
            this.ConfigDeviceModel.deviceId = response.deviceConfiguration[0].deviceId;
            this.ConfigDeviceModel.status = response.deviceConfiguration[0].status;
            this.ConfigDeviceModel.connectionsConfigurations = response.deviceConfiguration[0].connectionsConfigurations;
            this.ConfigDeviceModel.configurationName = response.deviceConfiguration[0].configurationName;
          } else {
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'ha ocurrido un error, intentelo nuevamente',
            });
            await alert.present();
            return;
          }

        },
        error: async(error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: error,
          });
          await alert.present();
        }
      })
    }
   async Seacrh(){
      let searchOtherDevice: boolean = false;
      let criteria;
      
      this.showCard = true;
      for (let index = 0; index < this.AvailableCriteria.length; index++) {
        let element = this.AvailableCriteria[index];
        criteria = element.name;
        break;
      }
      for (let index = 0; index <= this.arrayModel.length; index++) {
        this.devicesList = this.arrayModel.join();
        if (this.arrayModel.length > 1) {
          searchOtherDevice = true;


        }
        if (this.ConnectionConsumptionsModel.SearchCriteria == "Mensual") {
          let url = environment.DynamoBDEndPoints.ULR;
          let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.DeviceCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
          let startDate = this.ConnectionConsumptionsModel.StartDate;
          let finalDate = this.ConnectionConsumptionsModel.FinalDate;
          let start = new Date(startDate);
          let end = new Date(finalDate);

          let first =  start.getTime();
          let last = end.getTime();
          let StartDateEpoch =  Math.floor(first / 1000);
          let FinalDateEpoch = Math.floor(last / 1000);

          let urlFullPath = url + urlEndpoint + `${StartDateEpoch}/${FinalDateEpoch}`;

          let ur2l = environment.DynamoBDEndPoints.ULR;
          // tslint:disable-next-line: max-line-length
          let urlEndpoint2 = environment.DynamoBDEndPoints.API_PATHS.ConnectionsCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
          let urlFullPath2 = ur2l + urlEndpoint2 + `${StartDateEpoch}/${FinalDateEpoch}/`;
          (await this.dynamoDBService.multipleGenericGetMethods(this.arrayModel, this.deviceName, urlFullPath, urlFullPath2)).subscribe({
              next: async (data: any) => {
                
                let ctx = this.ConnectionChart.nativeElement;
                ctx.height = 200;
                ctx.width = 250;
                const dataset = data;
                this.chart = new Chart(ctx,
                          {
                          type: this.ConnectionConsumptionsModel.GraphType,
                          data: {
                              labels: this.arrayModel,
                              datasets: []
                          },
                          options: {
                              response: true,
                              title: {
                                  display: true,
                                  text: 'Consumo watts'
                              }
                          },
                          scales: {
                              xAxes: [{
                                  type: 'time',
                                  display: true,
                                  time: {
                                      unit: 'week'
                                  }
                              }]
                          }
                      });
                if (dataset.length > 1){
                       this.devicesAnalyzed = dataset.length;

                       for (let index = 0; index <= dataset.length; index++) {
            const element: any = dataset[index];
            const secondElement: any = dataset[index + 1];
            if (element === undefined) {
              break;
            }
            if (secondElement === undefined) {
              break;

            }


            if (element.totalWattsProm > secondElement.totalWattsProm) {

              this.deviceResume2.Biggest.connectionName = element.ConnectionName;
              this.deviceResume2.Biggest.elapsedTime = element.elapsedTime;
              this.deviceResume2.Biggest.dayConsumption.Day.amps = element.DayTotalAmpsProm.toFixed(3);
              this.deviceResume2.Biggest.dayConsumption.Day.watts = element.DayTotalWattsProm.toFixed(3);
              this.deviceResume2.Biggest.nightConsumption.Night.amps = element.NightTotalAmpsProm.toFixed(3);
              this.deviceResume2.Biggest.nightConsumption.Night.watts = element.NightTotalWattsProm.toFixed(3);
              this.deviceResumeList.push(this.deviceResume2.Biggest);
            }
            else if (element.totalWattsProm < secondElement.totalWattsProm){
              this.deviceResume2.Lowest.LowestconnectionName = element.ConnectionName;
              this.deviceResume2.Lowest.elapsedTime = secondElement.elapsedTime;
              this.deviceResume2.Lowest.dayConsumption.Day.amps = secondElement.DayTotalAmpsProm.toFixed(3);
              this.deviceResume2.Lowest.dayConsumption.Day.watts = secondElement.DayTotalWattsProm.toFixed(3);
              this.deviceResume2.Lowest.nightConsumption.Night.amps = secondElement.NightTotalAmpsProm.toFixed(3);
              this.deviceResume2.Lowest.nightConsumption.Night.watts = secondElement.NightTotalWattsProm.toFixed(3);
              this.deviceResumeList.push(this.deviceResume2.Lowest);

            }
            else if (element.totalWattsProm == secondElement.totalWattsProm){
              this.deviceResume2.Equal.EqualconnectionName = element.ConnectionName;
              this.deviceResume2.Equal.elapsedTime = element.elapsedTime;
              this.deviceResume2.Equal.dayConsumption.Day.amps = element.DayTotalAmpsProm.toFixed(3);
              this.deviceResume2.Equal.dayConsumption.Day.watts = element.DayTotalWattsProm.toFixed(3);
              this.deviceResume2.Equal.nightConsumption.Night.amps = element.NightTotalAmpsProm.toFixed(3);
              this.deviceResume2.Equal.nightConsumption.Night.watts = element.NightTotalWattsProm.toFixed(3);
              this.deviceResumeList.push(this.deviceResume2.Equal);

            }
            console.log(this.deviceResumeList);
            
            this.totalAmps += element.totalAmpsProm;
            this.totalWatts += element.totalWattsProm;


          
          }
                       this.chart.update();

          }
          else{
            this.chart.data.datasets = [];
            this.chart.data.datasets.push(
              {
                label: data[0].usage[0].ConnectionName,
                data: data[0].usage[0].wattsTimeStamp,
                fill: true,
                lineTension: 0.2,
                borderColor: "rgba(75, 75, 75, 0.7)",
                pointBorderColor: "rgba(75, 75, 75, 0.7)",
                pointHoverBackgroundColor: "rgba(75, 75, 75, 0.7)",
              }
            );
            this.chart.update();
          }


              }
          });


        }
        if (this.ConnectionConsumptionsModel.SearchCriteria == "Semanal"){
            let url = environment.DynamoBDEndPoints.ULR;
            let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.DeviceCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
            let startDate = this.ConnectionConsumptionsModel.StartDate;
            let finalDate = this.ConnectionConsumptionsModel.FinalDate;
            let start = new Date(startDate);
            let end = new Date(finalDate);

            let first =  start.getTime();
            let last = end.getTime();
            let StartDateEpoch =  Math.floor(first / 1000);
            let FinalDateEpoch = Math.floor(last / 1000);

            let urlFullPath = url + urlEndpoint + `${StartDateEpoch}/${FinalDateEpoch}`;

            let ur2l = environment.DynamoBDEndPoints.ULR;
            // tslint:disable-next-line: max-line-length
            let urlEndpoint2 = environment.DynamoBDEndPoints.API_PATHS.ConnectionsCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
            let urlFullPath2 = ur2l + urlEndpoint2 + `${StartDateEpoch}/${FinalDateEpoch}/`;
            (await this.dynamoDBService.multipleGenericGetMethods(this.arrayModel, this.deviceName, urlFullPath, urlFullPath2)).subscribe({
                next: async (data) => {
                  
                  let ctx = this.ConnectionChart.nativeElement;
                  ctx.height = 200;
                  ctx.width = 250;
                  const dataset = data;
                  this.chart = new Chart(ctx,
                            {
                            type: this.ConnectionConsumptionsModel.GraphType,
                            data: {
                                labels: this.arrayModel,
                                datasets: []
                            },
                            options: {
                                response: true,
                                title: {
                                    display: true,
                                    text: 'Consumo watts'
                                }
                            },
                            scales: {
                                xAxes: [{
                                    type: 'time',
                                    display: true,
                                    time: {
                                        unit: 'week'
                                    }
                                }]
                            }
                        });
                  if (dataset.length > 1){
                         this.devicesAnalyzed = dataset.length;

                         for (let index = 0; index <= dataset.length; index++) {
              const element: any = dataset[index];
              const secondElement: any = dataset[index + 1];
              if (element === undefined) {
                break;
              }
              if (secondElement === undefined) {
                break;

              }


              if (element.totalWattsProm > secondElement.totalWattsProm) {

                this.deviceResume2.Biggest.connectionName = element.ConnectionName;
                this.deviceResume2.Biggest.elapsedTime = element.elapsedTime;
                this.deviceResume2.Biggest.dayConsumption.Day.amps = element.DayTotalAmpsProm.toFixed(3);
                this.deviceResume2.Biggest.dayConsumption.Day.watts = element.DayTotalWattsProm.toFixed(3);
                this.deviceResume2.Biggest.nightConsumption.Night.amps = element.NightTotalAmpsProm.toFixed(3);
                this.deviceResume2.Biggest.nightConsumption.Night.watts = element.NightTotalWattsProm.toFixed(3);
                this.deviceResumeList.push(this.deviceResume2.Biggest);
              }
              else if (element.totalWattsProm < secondElement.totalWattsProm){
                this.deviceResume2.Lowest.LowestconnectionName = element.ConnectionName;
                this.deviceResume2.Lowest.elapsedTime = secondElement.elapsedTime;
                this.deviceResume2.Lowest.dayConsumption.Day.amps = secondElement.DayTotalAmpsProm.toFixed(3);
                this.deviceResume2.Lowest.dayConsumption.Day.watts = secondElement.DayTotalWattsProm.toFixed(3);
                this.deviceResume2.Lowest.nightConsumption.Night.amps = secondElement.NightTotalAmpsProm.toFixed(3);
                this.deviceResume2.Lowest.nightConsumption.Night.watts = secondElement.NightTotalWattsProm.toFixed(3);
                this.deviceResumeList.push(this.deviceResume2.Lowest);

              }
              else if (element.totalWattsProm == secondElement.totalWattsProm){
                this.deviceResume2.Equal.EqualconnectionName = element.ConnectionName;
                this.deviceResume2.Equal.elapsedTime = element.elapsedTime;
                this.deviceResume2.Equal.dayConsumption.Day.amps = element.DayTotalAmpsProm.toFixed(3);
                this.deviceResume2.Equal.dayConsumption.Day.watts = element.DayTotalWattsProm.toFixed(3);
                this.deviceResume2.Equal.nightConsumption.Night.amps = element.NightTotalAmpsProm.toFixed(3);
                this.deviceResume2.Equal.nightConsumption.Night.watts = element.NightTotalWattsProm.toFixed(3);
                this.deviceResumeList.push(this.deviceResume2.Equal);

              }
              console.log(this.deviceResumeList);
              
              this.totalAmps += element.totalAmpsProm;
              this.totalWatts += element.totalWattsProm;


            
            }
                         this.chart.update();

            }
            else{
              
            }


                }
            });

        }
        if (this.ConnectionConsumptionsModel.SearchCriteria == "Anual") {
          
          let url = environment.DynamoBDEndPoints.ULR;
          let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.DeviceCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
          let startDate = this.ConnectionConsumptionsModel.StartDate;
          let finalDate = this.ConnectionConsumptionsModel.FinalDate;
          let start = new Date(startDate);
          let end = new Date(finalDate);

          let first =  start.getTime();
          let last = end.getTime();
          let StartDateEpoch =  Math.floor(first / 1000);
          let FinalDateEpoch = Math.floor(last / 1000);

          let urlFullPath = url + urlEndpoint + `${StartDateEpoch}/${FinalDateEpoch}`;

          let ur2l = environment.DynamoBDEndPoints.ULR;
            // tslint:disable-next-line: max-line-length
          let urlEndpoint2 = environment.DynamoBDEndPoints.API_PATHS.ConnectionsCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
          let urlFullPath2 = ur2l + urlEndpoint2 + `${StartDateEpoch}/${FinalDateEpoch}/`;
          (await this.dynamoDBService.multipleGenericGetMethods(this.arrayModel, this.deviceName, urlFullPath, urlFullPath2)).subscribe({
                next: async (data: any) => {
                    
                    let ctx = this.ConnectionChart.nativeElement;
                    ctx.height = 200;
                    ctx.width = 250;
                    const dataset = data;
                    this.chart = new Chart(ctx,
                            {
                            type: this.ConnectionConsumptionsModel.GraphType,
                            data: {
                                labels: this.arrayModel,
                                datasets: [],
                            },
                            options: {
                                response: true,
                                title: {
                                    display: true,
                                    text: 'Consumo watts'
                                }
                            },
                            scales: {
                                xAxes: [{
                                    type: 'time',
                                    display: true,
                                    time: {
                                        displayFormats: {

                                            'year': 'MMM DD',
                                         }
                                    }
                                }]
                            }
                        });
                    if (dataset.length > 1){
                         this.devicesAnalyzed = dataset.length;

                         for (let index = 0; index <= dataset.length; index++) {
                        const element: any = dataset[index];
                        const secondElement: any = dataset[index + 1];
                        if (element === undefined) {
                          break;
                        }
                        if (secondElement === undefined) {
                          break;

                        }


                        if (element.totalWattsProm > secondElement.totalWattsProm) {

                this.deviceResume2.Biggest.connectionName = element.ConnectionName;
                this.deviceResume2.Biggest.elapsedTime = element.elapsedTime;
                this.deviceResume2.Biggest.dayConsumption.Day.amps = element.DayTotalAmpsProm.toFixed(3);
                this.deviceResume2.Biggest.dayConsumption.Day.watts = element.DayTotalWattsProm.toFixed(3);
                this.deviceResume2.Biggest.nightConsumption.Night.amps = element.NightTotalAmpsProm.toFixed(3);
                this.deviceResume2.Biggest.nightConsumption.Night.watts = element.NightTotalWattsProm.toFixed(3);
                this.deviceResumeList.push(this.deviceResume2.Biggest);
              }
              else if (element.totalWattsProm < secondElement.totalWattsProm){
                this.deviceResume2.Lowest.LowestconnectionName = element.ConnectionName;
                this.deviceResume2.Lowest.elapsedTime = secondElement.elapsedTime;
                this.deviceResume2.Lowest.dayConsumption.Day.amps = secondElement.DayTotalAmpsProm.toFixed(3);
                this.deviceResume2.Lowest.dayConsumption.Day.watts = secondElement.DayTotalWattsProm.toFixed(3);
                this.deviceResume2.Lowest.nightConsumption.Night.amps = secondElement.NightTotalAmpsProm.toFixed(3);
                this.deviceResume2.Lowest.nightConsumption.Night.watts = secondElement.NightTotalWattsProm.toFixed(3);
                this.deviceResumeList.push(this.deviceResume2.Lowest);

              }
              else if (element.totalWattsProm == secondElement.totalWattsProm){
                this.deviceResume2.Equal.EqualconnectionName = element.ConnectionName;
                this.deviceResume2.Equal.elapsedTime = element.elapsedTime;
                this.deviceResume2.Equal.dayConsumption.Day.amps = element.DayTotalAmpsProm.toFixed(3);
                this.deviceResume2.Equal.dayConsumption.Day.watts = element.DayTotalWattsProm.toFixed(3);
                this.deviceResume2.Equal.nightConsumption.Night.amps = element.NightTotalAmpsProm.toFixed(3);
                this.deviceResume2.Equal.nightConsumption.Night.watts = element.NightTotalWattsProm.toFixed(3);
                this.deviceResumeList.push(this.deviceResume2.Equal);

              }
                        
                        this.totalAmps += element.totalAmpsProm;
                        this.totalWatts += element.totalWattsProm;


              }
                         this.chart.update();

            }else{
              
              this.chart.data.datasets = [];
              this.chart.data.datasets.push(
                {
                  label: data[0].usage[0].ConnectionName,
                  data: data[0].usage[0].wattsTimeStamp,
                  fill: true,
                  lineTension: 0.2,
                  borderColor: "rgba(75, 75, 75, 0.7)",
                  pointBorderColor: "rgba(75, 75, 75, 0.7)",
                  pointHoverBackgroundColor: "rgba(75, 75, 75, 0.7)",
                }
              );
              this.chart.update();

            }


                }
            });
        }

      }





  }

  getDevices(userEmail: any): Array<any>{
      var url = environment.DynamoBDEndPoints.ULR;
      var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceRelays;
      const urlFullPath = `${url}` + `${urlPath}` + `${userEmail}`;
      let devicesArray = []
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
      next: (data) => {
        if (data.data.length > 0) {
          for (let index = 0; index < data.data.length; index++) {
           devicesArray.push({name: data.data[index].Name});
          }
          return devicesArray;
        }else {
          return [];
        }

      },
      error: async () => {

      }
    })
      return devicesArray;
    }


}
