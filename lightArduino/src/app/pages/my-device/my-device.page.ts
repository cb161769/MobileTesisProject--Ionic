import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-device',
  templateUrl: './my-device.page.html',
  styleUrls: ['./my-device.page.scss'],
})
export class MyDevicePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  singOut():void{

  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  configDevice():void{
    
  }

}
