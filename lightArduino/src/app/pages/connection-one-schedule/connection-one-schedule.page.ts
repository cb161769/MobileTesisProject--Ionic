import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, NavController, ActionSheetController,ToastController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { Observable, of } from "rxjs";
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';
@Component({
  selector: 'app-connection-one-schedule',
  templateUrl: './connection-one-schedule.page.html',
  styleUrls: ['./connection-one-schedule.page.scss'],
})
export class ConnectionOneSchedulePage implements OnInit {

  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
    public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController, 
    public messageService: MessageService, public alertController: AlertController,
    public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController,public actionSheetController: ActionSheetController) { }
  public test = [];
  public tests: Observable<any[]>;

  ngOnInit() {
    
   this.addArray();
  }
  addConfiguration(){

  }
  addArray(){
    this.test.push({
      configurationTitle:'Configuracion de la Manana',
      InitialTime:'07:00am',
      FinalTime:'11:00am',
      isActive:true,
      days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
      maximumKilowattPerDay:'500'
      },
      {
        configurationTitle:'Configuracion de la Tarde',
        InitialTime:'07:00am',
        FinalTime:'12:00am',
        isActive:true,
        days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
        maximumKilowattPerDay:'500'
        },
        {
          configurationTitle:'Configuracion de la Noche',
          InitialTime:'12:01pm',
          FinalTime:'11:00am',
          isActive:true,
          days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
          maximumKilowattPerDay:'700'
        },
        {
          configurationTitle:'Configuracion Por defecto',
          InitialTime:'12:01pm',
          FinalTime:'11:00am',
          isActive:true,
          days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
          maximumKilowattPerDay:'700'
        })
    this.tests = of([{
      configurationTitle:'Configuracion de la Manana',
      InitialTime:'07:00am',
      FinalTime:'11:00am',
      isActive:true,
      days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
      maximumKilowattPerDay:'500'
      },
      {
        configurationTitle:'Configuracion de la Tarde',
        InitialTime:'07:00am',
        FinalTime:'12:00am',
        isActive:true,
        days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
        maximumKilowattPerDay:'500'
        },
        {
          configurationTitle:'Configuracion de la Noche',
          InitialTime:'12:01pm',
          FinalTime:'11:00am',
          isActive:true,
          days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
          maximumKilowattPerDay:'700'
        },
        {
          configurationTitle:'Configuracion Por defecto',
          InitialTime:'12:01pm',
          FinalTime:'11:00am',
          isActive:true,
          days:['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
          maximumKilowattPerDay:'700'
        }])
  }
  edit(){
    this.router.navigate(['edit-connection-schedule']);
  }
  


}
