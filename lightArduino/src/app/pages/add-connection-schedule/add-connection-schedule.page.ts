import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController,NavController, AlertController } from '@ionic/angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
import { ToastService } from 'src/app/data-services/ToasterService/toast.service';
import { ConfigConnections } from 'src/app/models/config-connections';
import { ConfigDaysModel } from 'src/app/models/config-days-model';
import { ConfigDeviceModel } from 'src/app/models/config-device-model';

@Component({
  selector: 'app-add-connection-schedule',
  templateUrl: './add-connection-schedule.page.html',
  styleUrls: ['./add-connection-schedule.page.scss'],
})
export class AddConnectionSchedulePage implements OnInit {
  AddConnectionScheduleForm:FormGroup;
  ConfigDeviceModel:ConfigDeviceModel = new ConfigDeviceModel();
  configConnectionModel:ConfigConnections = new ConfigConnections();
  daysModel:ConfigDaysModel[] = [];
  allDays:ConfigDaysModel[] = [];

  constructor(
    public awsAmplifyService:AwsAmplifyService,public loadingIndicator:LoadingController, public navController:NavController,public toast:ToastService,
    public ToastController : ToastController,public alertController: AlertController, public router:Router, public messageService:MessageService, public dynamoDBService: DynamoDBAPIService
  ) { 
    this.AddConnectionScheduleForm = new FormGroup({
      'configurationTitle': new FormControl(this.configConnectionModel.configurationTitle,[Validators.required]),
      'InitialTime': new FormControl(this.configConnectionModel.InitialTime,[Validators.required]),
      'FinalTime': new FormControl(this.configConnectionModel.FinalTime,[Validators.required]),
      'isActive': new FormControl(this.configConnectionModel.isActive,[Validators.required]),
      'maximumKilowattPerDay': new FormControl(this.configConnectionModel.maximumKilowattPerDay,[Validators.required]),
      'configurationDays': new FormControl(this.configConnectionModel.days,[Validators.required]),
    })

  }

  ngOnInit() {
    this.loadDays();
  }
  doRefresh(event:any){

  }
  loadDays(){
    let days = [
      {
      dayValue:'1'||1,
      dayName:'Lunes'
      },
      {
      dayValue:'2' || 2,
      dayName:'Martes'
      },
      {
      dayValue:'3' || 3,
      dayName:'Miercoles'
      },
      {
      dayValue:'4'|| 4,
      dayName:'Jueves'
      },
      {
      dayValue:'5' || 5,
      dayName:'Viernes'
      },
      {
      dayValue:'6' || 6,
      dayName:'Sabado'
      },
      {
      dayValue:'7'|| 7,
      dayName:'Domingo'
      }
      
  ];
    days.forEach(day => {
      this.allDays.push(day as ConfigDaysModel)
    });
  }
  async addConfiguration(){

  }

}
