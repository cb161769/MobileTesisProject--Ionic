import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, AlertController,ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';
import { ConnectionConsumptions } from 'src/app/models/connection-consumptions';
import { environment } from 'src/environments/environment';
import {  Chart} from 'chart.js';
import 'chartjs-adapter-moment';
@Component({
  selector: 'app-connection-one-consumptions',
  templateUrl: './connection-one-consumptions.page.html',
  styleUrls: ['./connection-one-consumptions.page.scss'],
})
export class ConnectionOneConsumptionsPage implements OnInit {
  deviceName:string = '';
  loading:any;
  showCard:boolean = false;
  chart:any;
  arrayModel:Array<any> = [];
  @ViewChild('barchart') ConnectionChart;
  constructor( public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController,public alertController:AlertController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService) { }

 async  ngOnInit() {
  await this.validateLoggedUser();
  }
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  AvailableCharts =[ 
    {
      name:'bar'
    },
    {
      name:'line'
    },
    {
      name:'pie' 
    }
    ];
    AvailableCriteria = [
      {
        name:'Mensual'
      },
      {
        name:'Semanal'
      },
      {
        name:'Anual'
      }
    ];
    ConnectionConsumptionsModel:ConnectionConsumptions = new ConnectionConsumptions();
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
    this.awsAmplifyService.getCurrentUser().then(async (result)=>{
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

      // this.redirectToLoginPage(); 
        
      }
    }).catch((error) =>{

    }).finally(() =>{
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
        message:'Cargando ...',
        spinner:'dots'
      });
      await this.loading.present();
  
    }
    /**
     * @description This Function gets the Device Name
     * @param username 
     * @returns String
     */
    getDeviceName(username:string):string{
      let url = environment.DynamoBDEndPoints.ULR;
      let url_path = environment.DynamoBDEndPoints.API_PATHS.getDeviceConfiguration;
      let deviceName;
      const urlFullPath = `${url}` + `${url_path}` + `/${username}`;
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next: (response) => {
          deviceName = response.configuration[0].deviceName;
          this.deviceName = deviceName;
          this.GetDeviceConfiguration(deviceName);
          let object = [{name: deviceName},{name:'Conexion 1'}];
          this.ConnectionConsumptionsModel.Devices= object;    
          return deviceName;
        },
        error: async (response) => {
          const alert = await this.alertController.create({
            header:'Error',
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
    async GetDeviceConfiguration(username:any){
      var url = environment.DynamoBDEndPoints.ULR;
      var urlPath = environment.DynamoBDEndPoints.API_PATHS.getArduinoDeviceConfiguration;
      const urlFullPath = `${url}` + `${urlPath}`+`/${username}`;
      this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
        next:async (response) => {
          if (response.status === 200) {
            this.ConfigDeviceModel.configurationId = response.deviceConfiguration[0].configurationId;
            this.ConfigDeviceModel.configurationMaximumKilowattsPerDay = response.deviceConfiguration[0].configurationMaximumKilowattsPerDay;
            this.ConfigDeviceModel.configurationDays = response.deviceConfiguration[0].configurationDays;
            this.ConfigDeviceModel.deviceId = response.deviceConfiguration[0].deviceId;
            this.ConfigDeviceModel.status = response.deviceConfiguration[0].status;
            this.ConfigDeviceModel.connectionsConfigurations = response.deviceConfiguration[0].connectionsConfigurations;
            this.ConfigDeviceModel.configurationName = response.deviceConfiguration[0].configurationName;
          } else {
            const alert = await this.alertController.create({
              header:'Error',
              message: 'ha ocurrido un error, intentelo nuevamente',
            });
            await alert.present();
            return;
          }
  
        },
        error: async(error) => {
          const alert = await this.alertController.create({
            header:'Error',
            message: error,
          });
          await alert.present();
        }
      })
    }
    Seacrh(){
      let searchOtherDevice:boolean = false;
      let criteria;
      this.showCard = true;
      for (let index = 0; index < this.AvailableCriteria.length; index++) {

        let element = this.AvailableCriteria[index];
        criteria = element.name;
        break;

        

      }
      let chartType;
      for (let index = 0; index < this.AvailableCharts.length; index++) {
        let element = this.AvailableCharts[index];
        chartType = element.name;
        break;

      }
      for (let index = 0; index < this.ConnectionConsumptionsModel.Devices.length; index++) {
        const element = this.ConnectionConsumptionsModel.Devices[index];
        if (this.arrayModel.length > 1) {
          searchOtherDevice = true;
          
        }
        if (element.name === this.deviceName) {
          if (criteria === "Mensual") {
            let url = environment.DynamoBDEndPoints.ULR;
            let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.DeviceCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
            let startDate = this.ConnectionConsumptionsModel.StartDate;
            let finalDate = this.ConnectionConsumptionsModel.FinalDate;
            let start = new Date(startDate);
            let end = new Date(finalDate);

            let first =  start.getTime();
            let last = end.getTime();
            let StartDateEpoch =  Math.floor(first/1000);
            let FinalDateEpoch = Math.floor(last/1000);
            
            let urlFullPath = url + urlEndpoint + `${StartDateEpoch}/${FinalDateEpoch}` 
            this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
              next:(data) => {
                let ctx = this.ConnectionChart.nativeElement;
                ctx.height = 200;
                ctx.width = 250;
                const dataset = data.usage[0].wattsTimeStamp;
                this.chart = new Chart(ctx,
                  {
                    type:chartType,
                    data:{
                      labels:[''],
                      datasets:[{
                        label:'',
                        data: dataset,
                        fill:true
                      }]
                    },
                    options:{
                      responsive:true,
                      title:{
                        display:true,
                        text:'Consumo watts'
                      }
                    },
                    scales:{
                      xAxes:[{
                        type: 'time',
                        display: true,
                        distribution: 'series',
                        time: {
                            unit:"year",
                            displayFormats:{year:'YYYY'},
                            min:'1970' ,
                            max:'2022',
                        }
                      }]
                    }
                  })
              }
            });
            
          }

        }else if (element.name =! null && element.name != this.deviceName){
          if (criteria ==="Mensual" && searchOtherDevice == true) {

            let url = environment.DynamoBDEndPoints.ULR;
            let urlEndpoint = environment.DynamoBDEndPoints.API_PATHS.ConnectionsCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
            let startDate = this.ConnectionConsumptionsModel.StartDate;
            let finalDate = this.ConnectionConsumptionsModel.FinalDate;
            let start = new Date(startDate);
            let end = new Date(finalDate);
            let first =  start.getTime();
            let last = end.getTime();
            let StartDateEpoch =  Math.floor(first/1000);
            let FinalDateEpoch = Math.floor(last/1000);
            let connectionName = 'Conexion 1';
            let urlFullPath = url + urlEndpoint + `${StartDateEpoch}/${FinalDateEpoch}/${connectionName}`;
            
            this.dynamoDBService.genericGetMethods(urlFullPath).subscribe({
              next:(data) => {
                debugger;
                this.addData(this.chart,'','',data.usage[0].timeStamp);
              }
            })


            
          }
        }

      }
    }
    /**
     * 
     * @param chart a chart
     * @param label label
     * @param color color
     * @param data data
     */
    addData(chart,label,color,data) {
      debugger;
      chart.data.datasets.push({
        label: label,
        backgroundColor:color,
        data:data
      });
      chart.update();
    }

}
