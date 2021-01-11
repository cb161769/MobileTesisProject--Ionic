import { LoadingController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { IOTDevice } from './../../models/iotdevice';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(public awsAmplifyService:AwsAmplifyService,
              public loadingIndicator:LoadingController,
              public router:Router) 
              {
                this.registerDeviceForm  = new FormGroup({
                  'deviceName': new FormControl(this.iotDeviceModel.deviceName,[Validators.required]),
                  'deviceIpAddress': new FormControl(this.iotDeviceModel.deviceIp,[Validators.required,Validators.pattern('^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$')]),
                  
                });
               }

  ngOnInit() {
  }
  

}
