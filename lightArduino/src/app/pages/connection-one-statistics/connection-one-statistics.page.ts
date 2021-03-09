import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-one-statistics',
  templateUrl: './connection-one-statistics.page.html',
  styleUrls: ['./connection-one-statistics.page.scss'],
})
export class ConnectionOneStatisticsPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  go(url:string){
  this.router.navigate([url]) ;   
  }

}
