import { Component, OnInit } from '@angular/core';
import {  Chart} from 'chart.js';
@Component({
  selector: 'app-home-device-page',
  templateUrl: './home-device-page.page.html',
  styleUrls: ['./home-device-page.page.scss'],
})
export class HomeDevicePagePage implements OnInit {
  now = Date.now();
  private lineChart:Chart;
  gaugeType = "semi";
  gaugeValue = 28.3;
  gaugeLabel = "Speed";
  gaugeAppendText = "km/hr";

  constructor() { }

  ngOnInit() {
    this.showDetailedChart();
  }
  singOut():void{
    
  }
  /**
   * 
   * @param event evento para refrescar la pantalla
   */
  doRefresh(event) {
    
    
    setTimeout(() => {
      
      event.target.complete();
    }, 2000);
  }
  showDetailedChart():void{
    var ctx = (<any>document.getElementById('lineCanvas')).getContext('2d');
    this.lineChart = new Chart(ctx, {
      type:'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
    });
    
  }

}
