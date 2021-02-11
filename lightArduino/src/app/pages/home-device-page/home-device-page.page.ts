import { RealtimeData } from './../../models/realtime-data';
import { EnergyService } from './../../data-services/energyService/energy.service';
import { MessageService } from './../../data-services/messageService/message.service';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { AlertController, LoadingController, ToastController, NavController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { Component, OnInit,OnDestroy } from '@angular/core';
import {  Chart} from 'chart.js';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Apollo,gql } from 'apollo-angular';
import { interval, Subscription } from 'rxjs';
import Highcharts from 'highcharts';
// import * as Highcharts from "highcharts/highstock";
// import { Options } from "highcharts/highstock";


// import IndicatorsCore from "highcharts/indicators/indicators";
// import IndicatorZigzag from "highcharts/indicators/zigzag";
// IndicatorsCore(Highcharts);
@Component({
  selector: 'app-home-device-page',
  templateUrl: './home-device-page.page.html',
  styleUrls: ['./home-device-page.page.scss'],
})
export class HomeDevicePagePage implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  data:any = [];
  chartOptions: Highcharts.Options = {
    chart:{
      borderWidth: 1,
      plotBackgroundColor: 'rgba(255, 255, 255, .9)',
      plotBorderWidth: 1
    },
    
    series: [
      
      {
        type: 'line',
        data: this.data
      }
    ],
    
  };
  now = Date.now();
  private lineChart:Chart;
  gaugeType = "semi";
  gaugeValue = 21000;
  gaugeLabel = "Amperaje de la instalacion";
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };
  gaugeAppendText = "Watts";
  loading:any;
  currentUserError:any;
  private querySubscription: Subscription;
  subscription: Subscription;
  public realtimeDataModel : RealtimeData = new RealtimeData();
  intervalId:number;


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

  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public router:Router, public DynamoDBService: DynamoDBAPIService, 
              public ToastController : ToastController, public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo, public navController:NavController) { }

  async ngOnInit() {
    try {
      this.validateLoggedUser();
      // const data = await this.energyService.getReadingsStatistics();
      // console.log('DATA' + data);
        // const source = interval(1000);
        // this.subscription = source.subscribe(val => this.refreshDeviceReadings());
       
    } catch (error) {
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
    }).catch((error) => {

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
  


  async showDetailedChart(){
    let urlRoot = environment.DynamoBDEndPoints.ULR;
    let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.getDeviceWeekly;

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first));
    firstday.setHours(0,0,0);

    var lastday = new Date(curr.setDate(last));
    lastday.setHours(24,59,59);
    
    
    let initialDateEpoch = Math.floor(firstday.getTime()/1000);
    let finalDateEpoch = Math.floor(lastday.getTime()/1000);
    let fullUrl = urlRoot + urlEndpoint + `${initialDateEpoch}/${finalDateEpoch}`;
    try {
      let finalData = [];
      let mondayData =0;
      let tuesdayData = 0;
      let thursdayData = 0;
      let wednesdayData = 0;
      let fridayData = 0;
      let saturdayData = 0;
      let sundayData = 0;
      this.DynamoDBService.genericGetMethods(fullUrl).subscribe((response) => {
        // this.data = response.usage[0];
        console.log(response);
        mondayData = response.usage[0].lunes.watts;
        tuesdayData = response.usage[0].martes.watts;
        wednesdayData = response.usage[0].miercoles.watts;
        // thursdayData = response.usage[0].jueves.watts;
        thursdayData = 100;
        fridayData = response.usage[0].viernes.watts;
        saturdayData = response.usage[0].sabado.watts;
        sundayData = response.usage[0].domingo.watts;
        finalData.push(mondayData,tuesdayData,wednesdayData,thursdayData,fridayData,saturdayData,sundayData);
        console.log(finalData);
        this.chartOptions.series[0] = {
          type: 'line',
          data: finalData
        }
        this.updateFlag = true;

      })
      
    } catch (error) {
      console.log(error);
    }
    
    
    
  }
  async ionViewDidEnter(){
    //  console.log('cargandooo..');
     const source = interval(1000);
     this.subscription = source.subscribe(val => this.refreshDeviceReadings());
    this.showDetailedChart();
  }
  /**
   * this method validates if the user is loggedIn
   * if not, then gets redirected to the LoginPage
   */
  async  validateLoggedUser(){
    await this.presentLoading();
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

    }).catch((error) => {
      console.log(error);

    }).finally(() => {
      this.loading.dismiss();

    });
    
      
  }
  public async  refreshDeviceReadings(){
   // let data =  this.energyService.getReadingsStatistics();
   // console.log(data);
    // date.setHours(date.getHours() - 6);
    // let since;
    // since = date.getTime();
    // console.log(since / 1000);
    let beginning = Math.floor(Date.now()/1000 );
    // console.log(beginning);
    

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
      .subscribe(async ({data,loading}) =>{
        if (!loading) 
        {
          // console.log(data);
          if ( Object.keys(data).length >0) {
            if (data.device.wifi_strength == 0 || data.device.wifi_strength == null ||data.device.wifi_strength == undefined  ) {
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
          else{
          //   console.log(data);
          //   this.realtimeDataModel.device_amps = data.device.device_amps;
          //   this.realtimeDataModel.device_name = data.device.device_name;
          //   this.realtimeDataModel.device_UserName = data.device.device_UserName;
          //   this.realtimeDataModel.device_watts = Math.abs(data.device.device_watts);
          //   this.realtimeDataModel.wifi_Ip = data.device.wifi_IP;
          //   this.realtimeDataModel.wifi_Name = data.device.wifi_name;
          //   this.realtimeDataModel.wifi_strength = data.device.wifi_strength;
          //  // this.realtimeDataModel = new RealtimeData();
          }
          
         // console.log(this.realtimeDataModel);
        }

      })
      } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.querySubscription.unsubscribe();
    this.subscription && this.subscription.unsubscribe();
    
  }
  async ionViewWillEnter(){
   this.refreshDeviceReadings();
  }
  async presentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();

  }
  redirectToLoginPage(){
    this.navController.navigateBack('/login');

  }
  async validateUserDevice(userEmail:any){
    // let userEmail:string = this.messageService.getUserEmail();
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;
    const urlFullPath = `${url}` + `${urlPath}` + `/${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe(async (data) =>{
      if (data != null || data != undefined || data.readings ==undefined) {
      
        if (data.readings.Count > 0) {
          
          
        }
        else{
          const alert = await this.alertController.create({
            header:'Advertencia',
            subHeader:'no tiene dispositivos registrados',
            message:'es necesario que registre un dispositivo para acceder a esta pagina',
            buttons: [
              {
                text:'Aceptar',
                handler: () => {
                  this.redirectToRegisterDevicePage();

                }
              }
            ]
          });
          await alert.present();

        }
        
      } else {
        
        
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
