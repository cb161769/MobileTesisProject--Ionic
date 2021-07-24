import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dates',
  templateUrl: './dates.page.html',
  styleUrls: ['./dates.page.scss'],
})
export class DatesPage implements OnInit {
  initialDate:Date;
  finalDate:Date;
  constructor() { }

  ngOnInit() {
  }
  sendDates(initialDate:Date,finalDate:Date){
    
  }

}
