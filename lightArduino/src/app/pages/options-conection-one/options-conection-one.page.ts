import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController,ToastController } from '@ionic/angular';
import { Apollo } from 'apollo-angular';
import { AwsAmplifyService } from 'src/app/data-services/aws-amplify.service';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';
import { EnergyService } from 'src/app/data-services/energyService/energy.service';
import { MessageService } from 'src/app/data-services/messageService/message.service';

@Component({
  selector: 'app-options-conection-one',
  templateUrl: './options-conection-one.page.html',
  styleUrls: ['./options-conection-one.page.scss'],
})
export class OptionsConectionOnePage implements OnInit {

  constructor(public awsAmplifyService: AwsAmplifyService, public loadingIndicator: LoadingController, public router: Router,
    public DynamoDBService: DynamoDBAPIService, public ToastController: ToastController, 
    public messageService: MessageService, public alertController: AlertController,
    public energyService: EnergyService, private apolloClient: Apollo, public navController: NavController) { }

  ngOnInit() {
  }
  goTo(url: string){
    console.log(url)
    this.router.navigate([url]);
  }

}
