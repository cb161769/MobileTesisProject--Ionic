import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AwsAmplifyService } from './../../data-services/aws-amplify.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { IOTDevice } from 'src/app/models/iotdevice';
import { environment } from 'src/environments/environment';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-configure-device',
  templateUrl: './configure-device.page.html',
  styleUrls: ['./configure-device.page.scss'],
})
export class ConfigureDevicePage implements OnInit {
  configureDeviceForm: FormGroup;
  loading:any;
  configureDeviceError:any;
  iotDeviceModel: IOTDevice = new IOTDevice();
  listOfFares :any[];
  /**
   * 
   * @param router the Ionic Router
   * @param AwsAmplifyService the AWS Amplify Service
   * @param loadingIndicator Loading Indicator of the device
   * @param NavController Navigation Controls
   * @param toastController 
   */

  

  constructor(public router: Router, public AwsAmplifyService:AwsAmplifyService,
             public loadingIndicator:LoadingController, public NavController:NavController,
             public toastController:ToastController, public dynamoDBService: DynamoDBAPIService ) 
             {
              this.configureDeviceForm = new FormGroup({
                'deviceTarifConfig': new FormControl(this.iotDeviceModel.configuration.deviceTarifConfiguration.fareId,[Validators.required]),
                'startingDay': new FormControl(this.iotDeviceModel.configuration.facturationStarterDat,[Validators.required]),
                'endFacturationDay':new FormControl(this.iotDeviceModel.configuration.facturationEndDay,[Validators.required]),
                'facturationLimitPayDay':new FormControl(this.iotDeviceModel.configuration.facturationLimitPayDay,[Validators.required])
              });
              
            }

  async ngOnInit() {
    this.configureDeviceForm.reset();
    await this.validateLoggedUser();

    
  }
  async deviceConfiguration(){
    await this.PresentLoading();
    this.AwsAmplifyService.getCurrentUser().then(async(result) =>{
      if (result != undefined) {
        this.iotDeviceModel.userName = result.attributes.email;
        this.iotDeviceModel.deviceIp = '192.168.1.1';
        this.iotDeviceModel.deviceName = 'un device';
        var url = environment.DynamoBDEndPoints.ULR;
        var urlPath = environment.DynamoBDEndPoints.API_PATHS.configureDevice;
        const urlFullPath = `${url}` + `${urlPath}`;
      this.dynamoDBService.genericPostMethod(urlFullPath,this.iotDeviceModel).subscribe(async (data) =>{
        if (data.status == 200) {
          const toast = await this.toastController.create({
            message: 'Datos Ingresados Satisfactoriamente',
            duration: 2000,
            position: 'bottom',
            color: 'dark'
          });
          toast.present();
          this.redirectToHomeDevicePage();

          
        } else {
          const toast = await this.toastController.create({
            message: 'Ha ocurrido un error, intentelo nuevamente',
            duration: 2000,
            position: 'bottom',
            color: 'dark'
          });
          toast.present();
          
        }
      })
        

      } else {
        
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
  /**
   * this method gets all fares supplied 
   * from EDEEs
   */
  async getAllFares(){
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.getAllFares;
    const urlFullPath = `${url}` + `${urlPath}`;
    
    await this.dynamoDBService.genericGetMethods(urlFullPath).subscribe(async (data) => {
      if (data.readings.Count != null || data.readings.Count != undefined) {
        this.loading.dismiss();
        if (data.readings.Count >= 1) {
          this.listOfFares = data.readings.Items;
        }
        
      } else {
        this.loading.dismiss();
        const toast = await this.toastController.create({
          message:'No hay tarifas registradas en la base de datos',
          duration:2000,
          position:'bottom',
          color:'dark'
        });
        toast.present();
      }
    });
    

  }
  async validateLoggedUser(){
    await this.PresentLoading();
    this.AwsAmplifyService.getCurrentUser().then(async (result)=>{
      if (result != undefined) {
        try {
        await this.getAllFares();
      } catch (error) {
        console.log(error);
        
      }
        
      } else {
        const toast = await this.toastController.create({
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
  redirectToLoginPage(){
    this.router.navigateByUrl('/login');

  }
  redirectToHomeDevicePage(){
    this.router.navigateByUrl('/home-device-page');

  }

}
