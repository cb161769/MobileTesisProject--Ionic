import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connection-one-consumption-evolution',
  templateUrl: './connection-one-consumption-evolution.page.html',
  styleUrls: ['./connection-one-consumption-evolution.page.scss'],
})
export class ConnectionOneConsumptionEvolutionPage implements OnInit {

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
