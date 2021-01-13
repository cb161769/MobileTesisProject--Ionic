import { MessageService } from './../../data-services/messageService/message.service';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { Component, OnInit } from '@angular/core';
import {  Chart} from 'chart.js';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home-device-page',
  templateUrl: './home-device-page.page.html',
  styleUrls: ['./home-device-page.page.scss'],
})
export class HomeDevicePagePage implements OnInit {
  now = Date.now();
  private lineChart:Chart;
  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";
  loading:any;
  currentUserError:any;

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
              public ToastController : ToastController, public messageService:MessageService, public alertController: AlertController) { }

  ngOnInit() {
    
    this.validateLoggedUser();
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
    const urlFullPath = `${url}` + `${urlPath}` + `/${userEmail}2`;
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
