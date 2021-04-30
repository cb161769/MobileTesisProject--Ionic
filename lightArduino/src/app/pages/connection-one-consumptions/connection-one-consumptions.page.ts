import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connection-one-consumptions',
  templateUrl: './connection-one-consumptions.page.html',
  styleUrls: ['./connection-one-consumptions.page.scss'],
})
export class ConnectionOneConsumptionsPage implements OnInit {

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
