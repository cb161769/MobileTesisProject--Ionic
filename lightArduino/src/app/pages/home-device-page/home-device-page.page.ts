import { RealtimeData } from './../../models/realtime-data';
import { EnergyService } from './../../data-services/energyService/energy.service';
import { MessageService } from './../../data-services/messageService/message.service';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { Component, OnInit,OnDestroy } from '@angular/core';
import {  Chart} from 'chart.js';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Apollo,gql } from 'apollo-angular';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-home-device-page',
  templateUrl: './home-device-page.page.html',
  styleUrls: ['./home-device-page.page.scss'],
})
export class HomeDevicePagePage implements OnInit, OnDestroy {
  now = Date.now();
  private lineChart:Chart;
  gaugeType = "semi";
  gaugeValue = 21000;
  gaugeLabel = "Amperaje de la instalacion";
  thresholdConfig = {
    '0': {color: 'orange'},
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
              public ToastController : ToastController, public messageService:MessageService, public alertController: AlertController, public energyService:EnergyService,private apolloClient: Apollo) { }

  async ngOnInit() {
    try {
      this.validateLoggedUser();
      // const data = await this.energyService.getReadingsStatistics();
      // console.log('DATA' + data);
        const source = interval(1000);
        this.subscription = source.subscribe(val => this.refreshDeviceReadings());
       
    } catch (error) {
      console.log(error);
    }
    
    // this.validateLoggedUser();
  }
  async singOut(){
    await this.presentLoading();
    this.awsAmplifyService.singOut().then((result) => {
      if (result != undefined) {
        this.redirectToLoginPage();
        
      }else{
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
    setTimeout(() => {
      
      event.target.complete();
    }, 2000);
  }
  /**
   * this method shows a Detailed Chart
   */
  showDetailedChart():void{
    var ctx = (<any>document.getElementById('lineCanvas')).getContext('2d');
    this.lineChart = new Chart(ctx, {
      type:'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    });
    
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
    let beginning = Math.floor(Date.now() );
    

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
      .subscribe(({data,loading}) =>{
        if (!loading) 
        {
          console.log(data);
          if ( Object.keys(data).length >0) {
          this.realtimeDataModel.device_amps = data.device.device_amps;
          this.realtimeDataModel.device_name = data.device.device_name;
          this.realtimeDataModel.device_UserName = data.device.device_UserName;
          this.realtimeDataModel.device_watts = Math.abs(data.device.device_watts);
          this.realtimeDataModel.wifi_Ip = data.device.wifi_IP;
          this.realtimeDataModel.wifi_Name = data.device.wifi_name;
          this.realtimeDataModel.wifi_strength = data.device.wifi_strength;
          }
          else{
           // this.realtimeDataModel = new RealtimeData();
          }
          
          console.log(this.realtimeDataModel);
        }
        console.log(loading);
        console.log(data);
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
  async presentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();

  }
  redirectToLoginPage(){
    this.router.navigateByUrl('/login');

  }
  async validateUserDevice(userEmail:any){
    // let userEmail:string = this.messageService.getUserEmail();
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getDeviceReadings;
    const urlFullPath = `${url}` + `${urlPath}` + `/${userEmail}`;
    this.DynamoDBService.genericGetMethods(urlFullPath).subscribe(async (data) =>{
      if (data != null || data != undefined) {
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
    this.router.navigateByUrl('/register-device');
  }

  



}
