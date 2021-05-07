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
  connectionSelect:any;
  totalAmps:any = 0;
  totalWatts:any = 0;
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
    }).catch(() =>{

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
   async Seacrh(){
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
      for (let index = 0; index <= this.arrayModel.length; index++) {
        var elemento = this.arrayModel[index];

        if (this.arrayModel.length > 1) {
          searchOtherDevice = true;
          
        }
        if (criteria == "Mensual") {
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
          
          let urlFullPath = url + urlEndpoint + `${StartDateEpoch}/${FinalDateEpoch}`;

          let ur2l = environment.DynamoBDEndPoints.ULR;
          let urlEndpoint2 = environment.DynamoBDEndPoints.API_PATHS.ConnectionsCriteria.Monthly.getAllDeviceReadingsByGivenParametersMonthly;
          let startDate2 = this.ConnectionConsumptionsModel.StartDate;
          let finalDate2 = this.ConnectionConsumptionsModel.FinalDate;
          let start2= new Date(startDate);
          let end2 = new Date(finalDate);
          let first2 =  start.getTime();
          let last2 = end.getTime();
          let StartDateEpoch2 =  Math.floor(first/1000);
          let FinalDateEpoch2= Math.floor(last/1000);
          let connectionName2 = elemento;
          let urlFullPath2 = ur2l + urlEndpoint2 + `${StartDateEpoch}/${FinalDateEpoch}/`;
          (await this.dynamoDBService.multipleGenericGetMethods(this.arrayModel,this.deviceName,urlFullPath,urlFullPath2)).subscribe({
            next: async (data ) =>{
              let ctx = this.ConnectionChart.nativeElement;
              ctx.height = 200;
              ctx.width = 250;

              const dataset = data;
              this.chart = new Chart(ctx,
                {
                  type:this.ConnectionConsumptionsModel.GraphType,
                  data:{
                    labels:this.arrayModel,
                    datasets:[{
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
                });
                for (let index = 0; index <= dataset.length; index++) {
                  const element:any = dataset[index];
                  if (element === undefined) {
                    break;
                  }
                  this.totalAmps += element.usage[0].totalAmpsProm;
                  this.totalWatts += element.usage[0].totalWattsProm;
                  this.chart.data.datasets.push(
                    {
                      label: element.usage[0].ConnectionName || '',
                      data:element.usage[0].wattsTimeStamp,
                      fill: true,
                      lineTension: 0.2,
                      borderColor: "rgba(75, 75, 75, 0.7)",
                      pointBorderColor: "rgba(75, 75, 75, 0.7)",
                      pointHoverBackgroundColor: "rgba(75, 75, 75, 0.7)",
                    }
                  )
                  
                }
                this.chart.update();

            }
          });
          
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
    addData(chart,label,color,data, type?) {
      chart.config.type = type;
      chart.data.datasets.push({
        label: label,
        backgroundColor:color,
        data:data
      });
      chart.update();
    }
     getDevices(userEmail:any):Array<any>{
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
    getDataset(index,data){
      return { 
        label: 'Label '+ index, 
        fillColor: 'rgba(220,220,220,0.2)', 
        strokeColor: 'rgba(220,220,220,1)', 
        pointColor: 'rgba(220,220,220,1)', 
        pointStrokeColor: '#fff', 
        pointHighlightFill: '#fff', 
        pointHighlightStroke: 'rgba(220,220,220,1)', 
        data: data 
        }; 
    }

}
