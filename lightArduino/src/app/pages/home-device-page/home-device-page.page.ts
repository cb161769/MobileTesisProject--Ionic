import { MQTTServiceService } from './../../data-services/MQTTService/mqttservice.service';
import { RealtimeData } from './../../models/realtime-data';
import { EnergyService } from './../../data-services/energyService/energy.service';
import { MessageService } from './../../data-services/messageService/message.service';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { AlertController, LoadingController, ToastController, NavController,ActionSheetController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {  Chart} from 'chart.js';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Apollo, gql } from 'apollo-angular';
import { interval, Subscription } from 'rxjs';
import { LogModel } from 'src/app/models/log-model';

@Component({
  selector: 'app-home-device-page',
  templateUrl: './home-device-page.page.html',
  styleUrls: ['./home-device-page.page.scss'],
})
export class HomeDevicePagePage implements OnInit, OnDestroy {
  now = Date.now();
  @ViewChild('barChart') barChart;
  bars: any;
  logClass: LogModel = new LogModel();
  colorArray: any;
  gaugeType = 'semi';
  gaugeValue = 21000;
  gaugeLabel = 'Amperaje de la instalacion';
  thresholdConfig = {
    0: {color: 'green'},
    40: {color: 'orange'},
    75.5: {color: 'red'}
  };
  gaugeAppendText = 'Watts';
  loading: any;
  currentUserError: any;
  private querySubscription: Subscription;
  subscription: Subscription;
  weeklySubscription: Subscription;

  public realtimeDataModel: RealtimeData = new RealtimeData();
  intervalId: number;
  Amps = 0;
  Watts = 0;
  selected_time: any;
  showKlhw:boolean = false;

  /**
   * this is the Home - device page Constructor
   * @param awsAmplifyService
   * @param loadingIndicator
   * @param router
   * @param DynamoDBService
   * @param ToastController
   * @param messageService message service
   * @param alertController alert' controller class
   */

  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router, public DynamoDBService: DynamoDBAPIService,
              public ToastController: ToastController, public actionSheetController: ActionSheetController,public messageService: MessageService, public alertController: AlertController, public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController, public MQTTServiceService: MQTTServiceService) { }

  async ngOnInit() {
    try {
      this.validateLoggedUser();

    } catch (error) {
      const logger = new LogModel();
      logger.level = 'ERROR';
      logger.route = '';
      logger.action = 'ngOnInit';
      logger.timeStamp = new Date();
      logger.userName = '';
      logger.logError = error;
      await this.logDevice(logger);
      console.log(error);
    }

    // this.validateLoggedUser();
  }
  async singOut(){
    await this.presentLoading();
    this.awsAmplifyService.singOut().then((result) => {
      if (result != undefined) {
        this.subscription && this.subscription.unsubscribe();
        this.querySubscription.unsubscribe();
        this.redirectToLoginPage();

      }else{
        this.subscription && this.subscription.unsubscribe();
        this.querySubscription.unsubscribe();
        this.redirectToLoginPage();
      }
    }).catch(async (error) => {
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error`,
        duration: 2000,
        position: 'bottom',
        color: 'dark'
      });
      toast.present();
    }).finally(() => {
      this.loading.dismiss();
    });

  }

  /**
   *
   * @param event evento para refrescar la pantalla
   */
  doRefresh(event) {

    this.refreshDeviceReadings();
    this.showDetailedChart();
    setTimeout(() => {

      event.target.complete();
    }, 2000);
  }
  async TurnOffDemo(){
    await this.MQTTServiceService.PublishToTopic(environment.AWSIOTEndPoints.AWSIoTTopics.turnOffDeviceOne).then(() => {
      console.log('done');
    }).catch((error) => {
      console.log(error);
    });

  }
  /**
   * 
   * @param log log model
   */
  async logDevice(log:LogModel){
    const url = environment.LoggerEndPoints.ULR;
    const loggerPath = environment.LoggerEndPoints.DatabaseLogger;
    const urlFullPath = `${url}` + `${loggerPath}`;
    await this.DynamoDBService.genericLogMethod(urlFullPath, log).then(() =>{
    });
  }


/**
 * 
 */
  async showDetailedChart(){
    const urlRoot = environment.DynamoBDEndPoints.ULR;
    const urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.getDeviceWeekly;

    let curr = new Date; // get current date
    let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstday = new Date(curr.setDate(first));
    firstday.setHours(0, 0, 0);

    let lastday = new Date(curr.setDate(last));
    lastday.setHours(24, 59, 59);


    const initialDateEpoch = Math.floor(firstday.getTime() / 1000);
    const finalDateEpoch = Math.floor(lastday.getTime() / 1000);
    const fullUrl = urlRoot + urlEndpoint + `${initialDateEpoch}/${finalDateEpoch}`;
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = fullUrl;
    logger.action = 'GET';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);

    try {
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
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe((response) => {

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
        // tslint:disable-next-line: max-line-length
        ampsData.push(mondayDataAmps, tuesdayDataAmps, wednesdayDataAmps, thursdayDataAmps, fridayDataAmps, saturdayDataAmps, sundayDataAmps);

        this.Watts = parseInt(response.usage[0].totalWatts || 0);
        this.Amps = response.usage[0].totalAmps;
        const ctx = this.barChart.nativeElement;
        ctx.height = 200;
        ctx.width = 200;
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
      });

    } catch (error) {

      const logger = new LogModel();
      logger.level = 'ERROR';
      logger.route = fullUrl;
      logger.action = 'GET';
      logger.timeStamp = new Date();
      logger.userName = '';
      logger.logError = error;
      await this.logDevice(logger);
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error`,
        duration: 2000,
        position: 'bottom',
        color: 'dark'
      });
      toast.present();
    }



  }
  /**
   * this method is called one when the view is entered
   */
  async ionViewDidEnter(){
     const source = interval(1000);
     this.subscription = source.subscribe(() => this.refreshDeviceReadings());
     const cond = interval(10000);
     this.weeklySubscription = cond.subscribe(() => this.showDetailedChart());
   // this.showDetailedChart();
  }
  /**
   * this method is called once when the view is gone
   */
  async ionViewDidLeave(){
    this.querySubscription.unsubscribe();
    this.subscription && this.subscription.unsubscribe();
    this.weeklySubscription && this.weeklySubscription.unsubscribe();
  }
  /**
   * this method validates if the user is loggedIn
   * if not, then gets redirected to the LoginPage
   */
  async  validateLoggedUser(){
    await this.presentLoading();
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = '';
    logger.action = 'validateLoggedUser';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);
    // await this.validateUserDevice();
    this.awsAmplifyService.getCurrentUser().then(async (result) => {
      if (result != undefined) {
        this.showDetailedChart();
        this.validateUserDevice(result.attributes.email);

      } else {
        this.currentUserError = this.awsAmplifyService.getErrors();
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, ingrese nuevamente al sistema',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();

        this.redirectToLoginPage();
      }
      this.awsAmplifyService.getCurrentCredentials().then((credentials) => {
      });

    }).catch( async (error) => {
      logger.level = 'ERROR';
      logger.route = '';
      logger.action = 'validateLoggedUser';
      logger.timeStamp = new Date();
      logger.userName = '';
      logger.logError = error;
      await this.logDevice(logger);
      const toast = await this.ToastController.create({
        message: `Ha ocurrido un error`,
        duration: 2000,
        position: 'bottom',
        color: 'dark'
      });
      toast.present();

    }).finally(() => {
      this.loading.dismiss();

    });


  }
  /**
   * @method selectTime
   */
  async selectTime(){
    debugger;
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
        },
        {
          text: 'Rango de fechas custom', handler: () => {
            this.showModal();
            this.selected_time = 'Modal';
          }
        },
       
      ]
    });
    await actionSheet.present();
  }
  /**
   *@function showDetailChartInCurrentYear
   */
  showDetailChartInCurrentYear(){

  }
  /**
   *@function showDetailChartInCurrentMonth
   */
  showDetailChartInCurrentMonth(){

  }
  /**
   *@function showDetailedChartInCurrentWeek
   */
  showDetailedChartInCurrentWeek(){

  }
  showModal(){

  }
  changeKhw(event: any){
    if (this.showKlhw == true && this.selected_time == 'Este Año') {
     // this.showDetailChartInCurrentYearInKiloWatts();
    }
    if (this.showKlhw == false && this.selected_time == 'Este Año') {
      this.showDetailChartInCurrentYear();
    }
    // este mes
    if (this.showKlhw === true  && this.selected_time == 'Este Mes') {
//this.showDetailChartInCurrentMonthKilowatts();
    }
    if (this.showKlhw == false && this.selected_time == 'Este Mes') {
      this.showDetailChartInCurrentMonth();
    }
    if (this.showKlhw === true  && this.selected_time == 'Esta Semana') {
      //this.showDetailChartInCurrentWeekKilowatts();
    }
    if (this.showKlhw == false && this.selected_time == 'Esta Semana') {
      this.showDetailedChartInCurrentWeek();
    }
  }

  /**
   * this method syncs the device readings
   */
  public async  refreshDeviceReadings(){
    const beginning = Math.floor(Date.now() / 1000 );
    try {
      this.querySubscription =  this.apolloClient.watchQuery<any>({
        query: gql`
        {
          device(timeStamp:${beginning}){
            device_amps,
            device_name,
            device_UserName,
            device_watts,
            wifi_IP,
            wifi_name,
            wifi_strength
          }
        },

        `
      }).valueChanges
      .subscribe(async ({data, loading}) => {
        if (!loading)
        {
          if ( Object.keys(data).length > 0) {
            if (data.device.wifi_strength == 0 || data.device.wifi_strength == null || data.device.wifi_strength == undefined  ) {
              const toast = await this.ToastController.create({
                message: 'Dispositivo No Conectado',
                duration: 2000,
                position: 'bottom',
                color: 'dark'
              });
              toast.present();
              this.subscription.unsubscribe();
              // this.querySubscription.unsubscribe();

            }
            this.realtimeDataModel.device_amps = data.device.device_amps;
            this.realtimeDataModel.device_name = data.device.device_name;
            this.realtimeDataModel.device_UserName = data.device.device_UserName;
            this.realtimeDataModel.device_watts = Math.abs(data.device.device_watts);
            this.realtimeDataModel.wifi_Ip = data.device.wifi_IP;
            this.realtimeDataModel.wifi_Name = data.device.wifi_name;
            this.realtimeDataModel.wifi_strength = data.device.wifi_strength;
          }
        }

      });
      } catch (error) {
        const logger = new LogModel();
        logger.level = 'ERROR';
        logger.route = '';
        logger.action = 'refreshDeviceReadings';
        logger.timeStamp = new Date();
        logger.userName = '';
        logger.logError = error;
        await this.logDevice(logger);
        const toast = await this.ToastController.create({
          message: `Ha ocurrido un error`,
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();
    }
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.querySubscription.unsubscribe();
    this.subscription && this.subscription.unsubscribe();
    this.weeklySubscription && this.weeklySubscription.unsubscribe();

  }
  async ionViewWillEnter(){
   this.refreshDeviceReadings();
   this.showDetailedChart();
  }
  async presentLoading(){
    this.loading = await this.loadingIndicator.create({
      message: 'Cargando ...',
      spinner: 'dots',
    });
    await this.loading.present();

  }
  redirectToLoginPage(){
    this.navController.navigateBack('/login');

  }
  async validateUserDevice(userEmail: any){
    const logger = new LogModel();
    logger.level = 'INFO';
    logger.route = '';
    logger.action = 'validateUserDevice';
    logger.timeStamp = new Date();
    logger.userName = '';
    await this.logDevice(logger);
    // let userEmail:string = this.messageService.getUserEmail();
    let url = environment.DynamoBDEndPoints.ULR;
    let urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;
    const urlFullPath = `${url}` + `${urlPath}` + `/${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe(async (data) => {
      if (data != null || data != undefined || data.readings == undefined) {

        if (data.readings.Count > 0) {


        }
        else{
          const alert = await this.alertController.create({
            header: 'Advertencia',
            subHeader: 'no tiene dispositivos registrados',
            message: 'es necesario que registre un dispositivo para acceder a esta pagina',
            buttons: [
              {
                text: 'Aceptar',
                handler: () => {
                  this.redirectToRegisterDevicePage();

                }
              }
            ]
          });
          await alert.present();

        }

      }
    });


  }
  /**
   * this method redirects to the Register-Device page
   */
  redirectToRegisterDevicePage(){
    this.navController.navigateBack('/register-device');
  }





}
