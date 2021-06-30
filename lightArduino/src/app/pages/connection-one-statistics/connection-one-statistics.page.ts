import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-one-statistics',
  templateUrl: './connection-one-statistics.page.html',
  styleUrls: ['./connection-one-statistics.page.scss'],
})
export class ConnectionOneStatisticsPage implements OnInit {

  constructor(private router: Router) { }
  components: Array<any> = [
    {
      name: 'Consumos anuales,mensuales y semanales'
    },
    {
      name: ''
    },
    {
      name: ''
    }
  ];

  ngOnInit() {
  }
  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  /**
   *
   * @param url the url that will need to be set
   */
  go(url: string){
  this.router.navigate([url]) ;
  }

}
