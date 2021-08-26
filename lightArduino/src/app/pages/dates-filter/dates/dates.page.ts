import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DynamoDBAPIService } from 'src/app/data-services/dynamo-db-api.service';

@Component({
  selector: 'app-dates',
  templateUrl: './dates.page.html',
  styleUrls: ['./dates.page.scss'],
})
export class DatesPage implements OnInit {

  url: string = 'https://u4jh03inyb.execute-api.us-west-2.amazonaws.com/dev/IotDevice/getAllDeviceReadingsByGivenParametersMonthly';
  data: any;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private dynamoApi: DynamoDBAPIService,
    private httpClient: HttpClient
  ) { }

  datesRangeForm = this.formBuilder.group({
    initDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  ngOnInit() {
  }

  sendDates(initialDate:Date,finalDate:Date){
    
  }

  async onSubmit(){
    try {
      console.log(this.datesRangeForm.value);
      // this.data = await this.dynamoApi.genericGet(`${this.url}/${this.datesRangeForm.value.initDate}/${this.datesRangeForm.value.endDate}`);
      this.data = await this.httpClient.get(`${this.url}/${this.datesRangeForm.value.initDate}/${this.datesRangeForm.value.endDate}`).toPromise();
      this.closeModal();
    } catch (error) {
      console.error('error consumiendo dynamo api');
    }
  }

  closeModal(){
    this.modalController.dismiss({
      'data': this.data
    })
  }

}
