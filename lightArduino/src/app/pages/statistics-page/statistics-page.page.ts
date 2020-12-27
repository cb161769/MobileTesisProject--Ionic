import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.page.html',
  styleUrls: ['./statistics-page.page.scss'],
})
export class StatisticsPagePage implements OnInit {

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

}
