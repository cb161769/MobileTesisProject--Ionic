import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AwsAmplifyService } from './../../data-services/aws-amplify.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { IOTDevice } from 'src/app/models/iotdevice';

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
             public toastController:ToastController ) 
             {
              this.configureDeviceForm = new FormGroup({
                'deviceTarifConfig': new FormControl(this.iotDeviceModel.configuration.deviceTarifConfiguration,[Validators.required]),
                'startingDay': new FormControl(this.iotDeviceModel.configuration.facturationStarterDat,[Validators.required]),
                'endFacturationDay':new FormControl(this.iotDeviceModel.configuration.facturationEndDay,[Validators.required]),
                'facturationLimitPayDay':new FormControl(this.iotDeviceModel.configuration.facturationLimitPayDay,[Validators.required])
              });
              
            }

  ngOnInit() {
  }
  async deviceConfiguration(){

  }

}
