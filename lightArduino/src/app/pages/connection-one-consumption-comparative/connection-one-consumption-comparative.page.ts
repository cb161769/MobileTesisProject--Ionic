import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connection-one-consumption-comparative',
  templateUrl: './connection-one-consumption-comparative.page.html',
  styleUrls: ['./connection-one-consumption-comparative.page.scss'],
})
export class ConnectionOneConsumptionComparativePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
