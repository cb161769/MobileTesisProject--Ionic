import { MessageService } from './../../data-services/messageService/message.service';
import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { IOTDevice } from './../../models/iotdevice';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register-device',
  templateUrl: './register-device.page.html',
  styleUrls: ['./register-device.page.scss'],
})
export class RegisterDevicePage implements OnInit {
  registerDeviceForm: FormGroup;
  iotDeviceModel:IOTDevice = new IOTDevice();
  loading:any;
  registerDeviceError:any;
  userName;


  constructor(public awsAmplifyService:AwsAmplifyService,
              public loadingIndicator:LoadingController,
              public router:Router, public dynamoDBService: DynamoDBAPIService,
              public messageService: MessageService,
              public ToastController:ToastController) 
              {
                this.registerDeviceForm  = new FormGroup({
                  'deviceName': new FormControl(this.iotDeviceModel.deviceName,[Validators.required]),
                  'deviceIpAddress': new FormControl(this.iotDeviceModel.deviceIp,[Validators.required,Validators.pattern('^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$')]),
                });

              }

  ngOnInit() {
    

  }
  /**
   * this method register a Device
   */

  async registerDevice(){
    await this.PresentLoading();
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.createDevice;
    const urlFullPath = `${url}` + `${urlPath}`;
    this.iotDeviceModel.userName= 'claudioraulmercedes@gmail.com';
    this.awsAmplifyService.getCurrentUser().then(async (result) =>{
        if (result != null || result !=undefined) {
          var userName = result.attributes.email;
          this.iotDeviceModel.userName = userName;
          await this.dynamoDBService.genericPostMethod(urlFullPath,this.iotDeviceModel).subscribe(async (data) => {
            if (data.status == 200) {
              const toast = await this.ToastController.create({
                message: 'Datos Ingresados Satisfactoriamente',
                duration: 2000,
                position: 'bottom',
                color: 'dark'
              });
              toast.present();
              this.redirectToConfigureDevicePage();




              
            }
            else{
              this.loading.dismiss();
              const toast = await this.ToastController.create({
                message: 'Ha ocurrido un error, ingrese nuevamente al sistema',
                duration: 2000,
                position: 'bottom',
                color: 'dark'
              });
              toast.present();
      
            }
          });

          
        }
      

    }).catch((error) =>{

    }).finally(() =>{
      this.registerDeviceForm.reset();
      this.loading.dismiss();

    })
    
    
    
    

  }
  /**
   * this method Presents a loading Screen
   */
  async PresentLoading(){
    this.loading = await this.loadingIndicator.create({
      message:'Cargando ...',
      spinner:'dots',
    });
    await this.loading.present();
  }

  /**
   * this method redirects to the Device configuration page
   */
  redirectToConfigureDevicePage(){
    this.router.navigateByUrl('/configure-device');

  }
  

}
