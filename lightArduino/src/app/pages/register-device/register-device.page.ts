import { DynamoDBAPIService } from './../../data-services/dynamo-db-api.service';
import { LoadingController } from '@ionic/angular';
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

  constructor(public awsAmplifyService:AwsAmplifyService,
              public loadingIndicator:LoadingController,
              public router:Router, public dynamoDBService: DynamoDBAPIService) 
              {
                this.registerDeviceForm  = new FormGroup({
                  'deviceName': new FormControl(this.iotDeviceModel.deviceName,[Validators.required]),
                  'deviceIpAddress': new FormControl(this.iotDeviceModel.deviceIp,[Validators.required,Validators.pattern('^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$')]),
                });
              }

  ngOnInit() {
  }

  async registerDevice(){
    await this.PresentLoading();
    var url = environment.DynamoBDEndPoints.ULR;
    var urlPath = environment.DynamoBDEndPoints.API_PATHS.createDevice;
    const urlFullPath = `${url}` + `${urlPath}`;
    
    this.dynamoDBService.genericPostMethod(urlFullPath,this.iotDeviceModel).subscribe((data) => {
      if (data != undefined || data != null) {
        console.log(data);
        this.registerDeviceForm.reset();
        this.loading.dismiss();
      }
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
  

}
