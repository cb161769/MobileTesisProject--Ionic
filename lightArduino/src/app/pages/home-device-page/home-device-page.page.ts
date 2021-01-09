import { LoadingController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { Component, OnInit } from '@angular/core';
import {  Chart} from 'chart.js';
import { Router } from '@angular/router';
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

  constructor(public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public router:Router) { }

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
    this.awsAmplifyService.getCurrentUser().then((result) => {
      if (result != undefined) {
        this.showDetailedChart();
        
      } else {
        this.currentUserError = this.awsAmplifyService.getErrors();
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



}
