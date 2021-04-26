import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController, ToastController, ActionSheetController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import {  Chart} from 'chart.js';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-connexion1',
  templateUrl: './connexion1.page.html',
  styleUrls: ['./connexion1.page.scss'],
})
export class Connexion1Page {
  @ViewChild('barChart') barChart;
  loading:any;
  selected_time:any;
  colorArray: any;
  gaugeType = "semi";
  gaugeValue = 21000;
  bars: any;
  public healthy: number = 0;
  gaugeLabel = "Amperaje de la instalacion";
  thresholdConfig = {
    '0': {color: 'green'},
    '40': {color: 'orange'},
    '75.5': {color: 'red'}
  };
  gaugeAppendText = "Watts";
  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
              public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController, 
              public messageService: MessageService, public alertController: AlertController,
              public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController,public actionSheetController: ActionSheetController) { }


      /**  This method is launched when  the page is entered*/        
    async ionViewDidEnter(){
      
    }
    async dismissModal(){

    }
    async options(url?:string){
      this.router.navigate([url]);
    }
    async selectTime(){
      const actionSheet = await this.actionSheetController.create({
        header:'Seleccionar Lapso Temporal',
        buttons:[
          {
            text:'Anual',handler:() =>{

            }
          },
          {
            text:'Trimestral',handler:() =>{
              
            }
          },
          {
            text:'Este Mes',handler:() =>{
              
            }
          },
          {
            text:'Esta Semana',handler:() =>{
              this.showDetailedChartInCurrentWeek();
            }
          }
        ]
      });
      await actionSheet.present();
    }
    logScroll(event:any){

    }
    doRefresh(event:any){

    }


    async presentLoading(){
      this.loading = await this.loadingIndicator.create({
        message: 'Cargando ...',
        spinner: 'dots'
      });
      await this.loading.present();
    }
    showDetailedChartInCurrentWeek(Connection?:any){
      let urlRoot = environment.DynamoBDEndPoints.ULR;
     let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.Connections.ConnectionReadingsCurrentWeek;
     let ConnectionName = 'Conexion 1';
     var curr = new Date; // get current date
     var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
     var last = first + 6; // last day is the first day + 6
 
     var firstday = new Date(curr.setDate(first));
     firstday.setHours(0,0,0);
 
     var lastday = new Date(curr.setDate(last));
     lastday.setHours(24,59,59);
     
     
     let initialDateEpoch = Math.floor(firstday.getTime()/1000);
     let finalDateEpoch = Math.floor(lastday.getTime()/1000);
     let fullUrl = urlRoot + urlEndpoint + `/${initialDateEpoch}/${finalDateEpoch}/${ConnectionName}`;
     let finalData = [];
     let ampsData = [];
     let mondayData =0;
     let tuesdayData = 0;
     let thursdayData = 0;
     let wednesdayData = 0;
     let fridayData = 0;
     let saturdayData = 0;
     let sundayData = 0;
     let mondayDataAmps =0;
     let tuesdayDataAmps = 0;
     let thursdayDataAmps = 0;
     let wednesdayDataAmps = 0;
     let fridayDataAmps = 0;
     let saturdayDataAmps = 0;
     let sundayDataAmps = 0;
     this.DynamoDBService.genericGetMethods(fullUrl).subscribe({
       next: async (response) =>{
        mondayData = response.usage[0].lunes.watts || 0;
        tuesdayData = response.usage[0].martes.watts || 0;
        wednesdayData = response.usage[0].miercoles.watts || 0;
         thursdayData = response.usage[0].jueves.watts || 0;
        fridayData = response.usage[0].viernes.watts || 0;
        saturdayData = response.usage[0].sabado.watts || 0;
        sundayData = response.usage[0].domingo.watts || 0;
        finalData.push(mondayData,tuesdayData,wednesdayData,thursdayData,fridayData,saturdayData,sundayData);
        mondayDataAmps = response.usage[0].lunes.amperios || 0;
        tuesdayDataAmps = response.usage[0].martes.amperios || 0;
        thursdayDataAmps = response.usage[0].miercoles.amperios || 0;
        wednesdayDataAmps = response.usage[0].jueves.amperios || 0;
        fridayDataAmps = response.usage[0].viernes.amperios || 0;
        saturdayDataAmps = response.usage[0].sabado.amperios || 0;
        sundayDataAmps = response.usage[0].domingo.amperios || 0;
        ampsData.push(mondayDataAmps,tuesdayDataAmps,wednesdayDataAmps,thursdayDataAmps,fridayDataAmps,saturdayDataAmps,sundayDataAmps);
        let ctx = this.barChart.nativeElement;
        ctx.height = 200;
        ctx.width = 250;
        this.bars = new Chart(ctx,{
          type:'line',
          data:{
            labels:['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'],
            datasets:[{
              label:'Cantidad Consumida en Watts',
              data:finalData,
              backgroundColor: 'rgba(0,0,0,0)', // array should have same number of elements as number of dataset
              borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
              borderWidth: 3,
              fill:false
            },
          {
            label:'Cantidad Consumida en Amperios',
            data:ampsData,
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: '#dd1144',
            borderWidth: 3

          }]

          },
          options:{
            scales:{
              yAxes:[{
                ticks:{
                  beginAtZero:true
                },
                
              }],
              xAxes:[{
                barPercentage:0.9
              }]
            }
          }
        })
       }
     })

    }
    async ionViewWillEnter(){
      this.showDetailedChartInCurrentWeek();
    }
    showDetailChartInCurrentMonth(){
      
    }



}
