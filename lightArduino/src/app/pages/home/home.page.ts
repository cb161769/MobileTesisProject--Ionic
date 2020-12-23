import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  slides = [
    {
      img:'../../../assets/icon/save-energy.svg',
      title:'Bienvenido a la aplicación Móvil <br> he aquí ciertos beneficios de la Aplicación:'
    },
    {
      img: '../../../assets/icon/budget.svg',
      title:'Seguimiento del consumo eléctrico <br> a través de Distintos Gráficos'
    },
    {
      img: '../../../assets/icon/save-energy2.svg',
      title:'Conocimiento del costo aproximado de su <br> consumo eléctrico'
    },
    {
      img: '../../../assets/icon/iot.svg',
      title:'Constantes actualizaciones sobre su comsumo a traves <br> del IOT'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
