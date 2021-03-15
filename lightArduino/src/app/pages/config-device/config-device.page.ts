import { ConfigDeviceModel } from './../../models/config-device-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController,ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { environment } from 'src/environments/environment';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';

@Component({
  selector: 'app-config-device',
  templateUrl: './config-device.page.html',
  styleUrls: ['./config-device.page.scss'],
})
export class ConfigDevicePage implements OnInit {
  configDeviceForm: FormGroup;
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  loading:any;
  constructor(
    public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService
  ) { 
    this.configDeviceForm = new FormGroup({
      'configurationName': new FormControl(this.ConfigDeviceModel.configurationName,[Validators.required]),
      'configurationDays': new FormControl(this.ConfigDeviceModel.configurationDays,[Validators.required]),
      'configurationMaximumKilowattsPerDay': new FormControl(this.ConfigDeviceModel.configurationMaximumKilowattsPerDay,[Validators.required]),
    })

  }

  async ngOnInit() {
    try {
      await this.validateLoggedUser()
    } catch (error) {
      console.log(error);
    }

  }
  goBack():void{

  }
  async configDevice(){
    await this.PresentLoading();
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.addDeviceConfiguration
    const urlFullPath = `${url}` + `${urlPath}`;
    var day = {
      dayValue:1,
      dayName: 'Monday'
    }
    var array = [];
    array.push(day);
   //  this.ConfigDeviceModel.configurationName = 'Test';
    this.ConfigDeviceModel.deviceId = 'ArduinoDevice01';
    this.ConfigDeviceModel.status = true;
    this.ConfigDeviceModel.configurationDays = array;
    this.ConfigDeviceModel.connectionsConfigurations = [];
    this.dynamoDBService.genericPostMethod(urlFullPath,this.ConfigDeviceModel).subscribe(async (data) =>{
      if (data.status == 200) {
        const toast = await this.ToastController.create({
          message: 'Datos Ingresados Satisfactoriamente',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();
        this.loading.dismiss();
        this.configDeviceForm.reset();
      }
      else{
        const toast = await this.ToastController.create({
          message: 'Ha ocurrido un error, intentelo nuevamente',
          duration: 2000,
          position: 'bottom',
          color: 'dark'
        });
        toast.present();
      }
    })
  }
  /**
   * this method is for the user's Sing Out
   */
  singOut():void{

  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  redirectToLoginPage(){
    this.router.navigateByUrl('/login');

  }
  redirectToHomeDevicePage(){
    this.router.navigateByUrl('/home-device-page');

  }
  async validateLoggedUser(){
    await this.PresentLoading();
    this.awsAmplifyService.getCurrentUser().then(async (result)=>{
      if (result != undefined) {
        try {
        // await this.getAllFares();
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

       this.redirectToLoginPage(); 
        
      }
    }).catch((error) =>{

    }).finally(() =>{
      this.loading.dismiss();
    })
  }
  /**
   * this method is to present a loading Indicator
   */
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots'
    });
    await this.loading.present();

  }

}
