import { ConfigDeviceModel } from './../../models/config-device-model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController,ToastController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';

@Component({
  selector: 'app-config-device',
  templateUrl: './config-device.page.html',
  styleUrls: ['./config-device.page.scss'],
})
export class ConfigDevicePage implements OnInit {
  configDeviceForm: FormGroup;
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();

  constructor(
    public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController, public router:Router, public messageService:MessageService
  ) { 
    this.configDeviceForm = new FormGroup({
      'configurationName': new FormControl(this.ConfigDeviceModel.configurationName,[Validators.required]),
      'configurationDays': new FormControl(this.ConfigDeviceModel.configurationDays,[Validators.required]),
      'configurationMaximumKilowattsPerDay': new FormControl(this.ConfigDeviceModel.configurationMaximumKilowattsPerDay,[Validators.required]),
    })

  }

  ngOnInit() {
  }
  goBack():void{

  }
  configDevice(){
    
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

}
