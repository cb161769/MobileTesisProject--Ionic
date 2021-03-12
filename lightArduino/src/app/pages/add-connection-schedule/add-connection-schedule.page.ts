import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-connection-schedule',
  templateUrl: './add-connection-schedule.page.html',
  styleUrls: ['./add-connection-schedule.page.scss'],
})
export class AddConnectionSchedulePage implements OnInit {
  AddConnectionSchedule:FormGroup;


  constructor() { }

  ngOnInit() {
  }
  doRefresh(event:any){

  }

}
