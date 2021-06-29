import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import {  Chart} from 'chart.js';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { environment } from 'src/environments/environment';
import 'chartjs-adapter-moment';
import { LogModel } from 'src/app/models/log-model';
@Component({
  selector: 'app-connexion1',
  templateUrl: './connexion1.page.html',
  styleUrls: ['./connexion1.page.scss'],
})
export class Connexion1Page implements OnInit{
  @ViewChild('barChart') barChart;
  loading: any;
  selected_time: any;
  colorArray: any;
  gaugeType = 'semi';
  gaugeValue = 21000;
  bars: any;
  public healthy = 0;
  showKlhw = false;
  showKlwChekedchek = false;
  gaugeLabel = 'Amperaje de la instalacion';
  totalConsumptionInWatts = '';
  totalConsumptionInKhw = '';
  totalConsumptionInAmps = '';
  thresholdConfig = {
    0: {color: 'green'},
    40: {color: 'orange'},
    75.5: {color: 'red'}
  };
  connectionName:any;

  gaugeAppendText = 'Watts';
  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
              public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController,
              public messageService: MessageService, public alertController: AlertController,
              public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController, public actionSheetController: ActionSheetController,public actrouter:ActivatedRoute) { }


      /**  This method is launched when  the page is entered*/
    async ionViewDidEnter(){

    }
    async dismissModal(){

    }
    ngOnInit(): void {
      this.connectionName = this.messageService.getConnectionName();
      debugger;
    }
    async logDevice(log: LogModel){
      const url = environment.LoggerEndPoints.ULR;
      const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
      const urlFullPath = `${url}` + `${loggerPath}`;
      await this.DynamoDBService.genericLogMethod(urlFullPath, log).then(() => {
      });
    }
    async options(url?: string){
      this.router.navigate([url]);
    }
    goBack(){
      this.router.navigate(['/home-tabs/tabs/tab3']);
    }
    async selectTime(){
      const actionSheet = await this.actionSheetController.create({
        header: 'Seleccionar Lapso Temporal',
        buttons: [
          {
            text: 'Este Año', handler: () => {
              this.showDetailChartInCurrentYear();
              this.selected_time = 'Este Año';
            }
          },
          {
            text: 'Este Mes', handler: () => {
              this.showDetailChartInCurrentMonth();
              this.selected_time = 'Este Mes';
            }
          },
          {
            text: 'Esta Semana', handler: () => {
              this.showDetailedChartInCurrentWeek();
              this.selected_time = 'Esta Semana';
            }
          }
        ]
      });
      await actionSheet.present();
    }
    logScroll(event: any){

    }
    doRefresh(event: any){

    }
    changeKhw(event: any){
      console.log(this.showKlhw);
      console.log(event.target);
      if (this.showKlhw == true && this.selected_time == 'Este Año') {
        this.showDetailChartInCurrentYearInKiloWatts();
      }
      if (this.showKlhw == false && this.selected_time == 'Este Año') {
        this.showDetailChartInCurrentYear();
      }
      // este mes
      if (this.showKlhw === true  && this.selected_time == 'Este Mes') {
        this.showDetailChartInCurrentMonthKilowatts();
      }
      if (this.showKlhw == false && this.selected_time == 'Este Mes') {
        this.showDetailChartInCurrentMonth();
      }
      if (this.showKlhw === true  && this.selected_time == 'Esta Semana') {
        this.showDetailChartInCurrentWeekKilowatts();
      }
      if (this.showKlhw == false && this.selected_time == 'Esta Semana') {
        this.showDetailedChartInCurrentWeek();
      }
    }

    async presentLoading(){
      this.loading = await this.loadingIndicator.create({
        message: 'Cargando ...',
        spinner: 'dots'
      });
      await this.loading.present();
    }
  async  showDetailedChartInCurrentWeek(Connection?: any){
 
      const urlRoot = environment.DynamoBDEndPoints.ULR;
     const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionReadingsCurrentWeek;
     const ConnectionName = 'Conexion 1';
     let curr = new Date; // get current date
     let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
     let last = first + 6; // last day is the first day + 6

     let firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0);

     let lastday = new Date(curr.setDate(last));
      lastday.setHours(24, 59, 59);


     const initialDateEpoch = Math.floor(firstday.getTime() / 1000);
     const finalDateEpoch = Math.floor(lastday.getTime() / 1000);
     const fullUrl = urlRoot + urlEndpoint + `/${initialDateEpoch}/${finalDateEpoch}/${ConnectionName}`;
     const finalData = [];
     const ampsData = [];
      let mondayData = 0;
      let tuesdayData = 0;
      let thursdayData = 0;
      let wednesdayData = 0;
      let fridayData = 0;
      let saturdayData = 0;
      let sundayData = 0;
      let mondayDataAmps = 0;
      let tuesdayDataAmps = 0;
      let thursdayDataAmps = 0;
      let wednesdayDataAmps = 0;
      let fridayDataAmps = 0;
      let saturdayDataAmps = 0;
      let sundayDataAmps = 0;
      const logger = new LogModel();
      logger.level = 'INFO';
      logger.route = fullUrl;
      logger.action = 'showDetailedChartInCurrentWeek';
      logger.timeStamp = new Date();
      logger.userName = '';
      await this.logDevice(logger);
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
       next: async (response) => {
        mondayData = response.usage[0].lunes.watts || 0;
        tuesdayData = response.usage[0].martes.watts || 0;
        wednesdayData = response.usage[0].miercoles.watts || 0;
        thursdayData = response.usage[0].jueves.watts || 0;
        fridayData = response.usage[0].viernes.watts || 0;
        saturdayData = response.usage[0].sabado.watts || 0;
        sundayData = response.usage[0].domingo.watts || 0;
        finalData.push(mondayData, tuesdayData, wednesdayData, thursdayData, fridayData, saturdayData, sundayData);
        mondayDataAmps = response.usage[0].lunes.amperios || 0;
        tuesdayDataAmps = response.usage[0].martes.amperios || 0;
        thursdayDataAmps = response.usage[0].miercoles.amperios || 0;
        wednesdayDataAmps = response.usage[0].jueves.amperios || 0;
        fridayDataAmps = response.usage[0].viernes.amperios || 0;
        saturdayDataAmps = response.usage[0].sabado.amperios || 0;
        sundayDataAmps = response.usage[0].domingo.amperios || 0;
        ampsData.push(mondayDataAmps, tuesdayDataAmps, wednesdayDataAmps, thursdayDataAmps, fridayDataAmps, saturdayDataAmps, sundayDataAmps);
        const ctx = this.barChart.nativeElement;
        ctx.height = 200;
        ctx.width = 250;
        this.totalConsumptionInAmps = response.usage[0].totalAmps;
        this.totalConsumptionInKhw = response.usage[0].totalKhw || 0;
        this.totalConsumptionInWatts = response.usage[0].totalWatts;
        this.bars = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
            datasets: [{
              label: 'Cantidad Consumida en Watts',
              data: finalData,
              backgroundColor: 'rgba(0,0,0,0)', // array should have same number of elements as number of dataset
              borderColor: 'rgb(38, 194, 129)', // array should have same number of elements as number of dataset
              borderWidth: 3,
              fill: false
            },
          {
            label: 'Cantidad Consumida en Amperios',
            data: ampsData,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#dd1144',
            borderWidth: 3

          }]

          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                },

              }],
              xAxes: [{
                barPercentage: 0.9
              }]
            }
          }
        });
       }
     });

    }
    async ionViewWillEnter(){
      this.showDetailedChartInCurrentWeek();
    }
    async showDetailChartInCurrentMonth(){
      const urlRoot = environment.DynamoBDEndPoints.ULR;
     const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionsGetAllDeviceReadingsByGivenMonth;
     const ConnectionName = 'Conexion 1';
     let curr = new Date;
      let firstsOfMonth = new Date(curr.getFullYear(), curr.getMonth(), 1);
      let lastOfMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      lastOfMonth.setHours(24, 59, 59);
      firstsOfMonth.setHours(0, 0, 0);
      const initialDateEpoch = Math.floor(firstsOfMonth.getTime() / 1000);
      const fullUrl = urlRoot + urlEndpoint + `/${initialDateEpoch}/${ConnectionName}`;
      const logger = new LogModel();
      logger.level = 'INFO';
      logger.route = fullUrl;
      logger.action = 'showDetailChartInCurrentMonth';
      logger.timeStamp = new Date();
      logger.userName = '';
      await this.logDevice(logger);
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
        next: (data) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          const dataset  =  data.usage[0].detail.MonthDetails.TimeStamp;
          this.totalConsumptionInWatts = data.usage[0].detail.allMonthWatts;
          this.totalConsumptionInAmps = data.usage[0].detail.allMonthAmps;
          this.totalConsumptionInKhw = data.usage[0].detail.allMonthKiloWatts;
          const month = new Date();

          month.toLocaleDateString('es-Es');
          this.bars = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [''],
              datasets: [{
                label: 'Valor en watts',
                  data: dataset,
                fill: true,

              }]
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: 'Consumo durante este mes'
              }
            },
            scales: {
              xAxes: [{
                type: 'time',
                display: true,
                distribution: 'series',
                time: {
                    unit:'year',
                    displayFormats: {year: 'YYYY'},
                    min: '1970' ,
                    max: '2022',
                }
              }]
            }

          });
        }
      });
    }
    /**
     *
     */
    async showDetailChartInCurrentYear(){
        const urlRoot = environment.DynamoBDEndPoints.ULR;
       const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionsGetConnectionYearly;
       const ConnectionName = 'Conexion 1';
       const fullUrl = urlRoot + urlEndpoint + `/${ConnectionName}`;
       const logger = new LogModel();
       logger.level = 'INFO';
       logger.route = fullUrl;
       logger.action = 'showDetailChartInCurrentYear';
       logger.timeStamp = new Date();
       logger.userName = '';
       await this.logDevice(logger);
        this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
        next: async (response) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          this.totalConsumptionInKhw = response.usage[0].totalKwh;
          this.totalConsumptionInAmps = response.usage[0].totalAmps;
          this.totalConsumptionInWatts = response.usage[0].totalWatts;
          this.bars = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [''],
              datasets: [{
                label: 'Valor en watts',
                  data: response.usage[0].timeStamp,
                fill: true,

              }]
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: 'Consumo durante este año'
              }
            },
            scales: {
              xAxes: [{
                type: 'time',
                display: true,
                distribution: 'series',
                time: {
                    unit:'year',
                    displayFormats: {year: 'YYYY'},
                    min: '1970' ,
                    max: '2022',
                }
              }]
            }

          });
         }
       });

    }
    /**
     *
     * @param ConnectionN ConnectionName
     */
    showDetailChartInCurrentYearInKiloWatts(ConnectionN?){
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionsGetConnectionYearly;
      const ConnectionName = 'Conexion 1';
      const fullUrl = urlRoot + urlEndpoint + `/${ConnectionName}`;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
       next: async (response) => {
         const ctx = this.barChart.nativeElement;
         ctx.height = 200;
         ctx.width = 250;
         this.totalConsumptionInKhw = response.usage[0].totalKwh;
         this.totalConsumptionInAmps = response.usage[0].totalAmps;
         this.totalConsumptionInWatts = response.usage[0].totalWatts;
         this.bars = new Chart(ctx, {
           type: 'line',
           data: {
             labels: [''],
             datasets: [{
               label: 'Valor en Kilowatts',
                 data: response.usage[0].KiloWattsTimeStamp,
               fill: true,

             }]
           },
           options: {
             responsive: true,
             title: {
               display: true,
               text: 'Consumo durante este año'
             }
           },
           scales: {
             xAxes: [{
               type: 'time',
               display: true,
               distribution: 'series',
               time: {
                   unit:'year',
                   displayFormats: {year: 'YYYY'},
                   min: '1970' ,
                   max: '2022',
               }
             }]
           }

         });
        }
      });
    }

    showDetailChartInCurrentMonthKilowatts(Connection?){
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionsGetAllDeviceReadingsByGivenMonth;
      const ConnectionName = 'Conexion 1';
      let curr = new Date;
      var firstsOfMonth = new Date(curr.getFullYear(), curr.getMonth(), 1);
      var lastOfMonth = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
      lastOfMonth.setHours(24, 59, 59);
      firstsOfMonth.setHours(0, 0, 0);
      let initialDateEpoch = Math.floor(firstsOfMonth.getTime() / 1000);
      let fullUrl = urlRoot + urlEndpoint + `/${initialDateEpoch}/${ConnectionName}`;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
         next: (data) => {
           const ctx = this.barChart.nativeElement;
           ctx.height = 200;
           ctx.width = 250;
           const dataset  =  data.usage[0].detail.MonthDetails.kwhTimesTamp;
           this.totalConsumptionInWatts = data.usage[0].detail.allMonthWatts;
           this.totalConsumptionInAmps = data.usage[0].detail.allMonthAmps;
           this.totalConsumptionInKhw = data.usage[0].detail.allMonthKiloWatts;
           const month = new Date();

           month.toLocaleDateString('es-Es');
           this.bars = new Chart(ctx, {
             type: 'line',
             data: {
               labels: [''],
               datasets: [{
                 label: 'Valor en Kilowatts',
                   data: dataset,
                 fill: true,

               }]
             },
             options: {
               responsive: true,
               title: {
                 display: true,
                 text: 'Consumo durante este mes'
               }
             },
             scales: {
               xAxes: [{
                 type: 'time',
                 display: true,
                 distribution: 'series',
                 time: {
                     unit:'year',
                     displayFormats: {year: 'YYYY'},
                     min: '1970' ,
                     max: '2022',
                 }
               }]
             }

           });
         }
       });
    }
    showDetailChartInCurrentWeekKilowatts(Connection?){
      const urlRoot = environment.DynamoBDEndPoints.ULR;
      const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionReadingsCurrentWeek;
      const ConnectionName = 'Conexion 1';
      let curr = new Date; // get current date
      let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      let last = first + 6; // last day is the first day + 6

      let firstday = new Date(curr.setDate(first));
      firstday.setHours(0, 0, 0);

      let lastday = new Date(curr.setDate(last));
      lastday.setHours(24, 59, 59);


      const initialDateEpoch = Math.floor(firstday.getTime() / 1000);
      const finalDateEpoch = Math.floor(lastday.getTime() / 1000);
      const fullUrl = urlRoot + urlEndpoint + `/${initialDateEpoch}/${finalDateEpoch}/${ConnectionName}`;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
        next: (data) => {
          const ctx = this.barChart.nativeElement;
          ctx.height = 200;
          ctx.width = 250;
          const dataset  =  data.usage[0].Timestamp;
          this.totalConsumptionInAmps = data.usage[0].totalAmps;
          this.totalConsumptionInKhw = data.usage[0].totalKhw || 0;
          this.totalConsumptionInWatts = data.usage[0].totalWatts;
          const month = new Date();
          if (dataset == []) {
            dataset.push({t: new Date().toISOString(), y: 0});
          }
          month.toLocaleDateString('es-Es');
          this.bars = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [''],
              datasets: [{
                label: 'Valor en Kilowatts',
                  data: dataset,
                fill: true,

              }]
            },
            options: {
              responsive: true,
              title: {
                display: true,
                text: 'Consumo durante esta semana'
              }
            },
            scales: {
              xAxes: [{
                type: 'time',
                display: true,
                distribution: 'series',
                time: {
                    unit:'year',
                    displayFormats: {year: 'YYYY'},
                    min: '1970' ,
                    max: '2022',
                }
              }]
            }

          });
        }
      });
    }



}
