import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-device',
  templateUrl: './config-device.page.html',
  styleUrls: ['./config-device.page.scss'],
})
export class ConfigDevicePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  goBack():void{

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
