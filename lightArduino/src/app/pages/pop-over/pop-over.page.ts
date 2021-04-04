import { PopoverController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pop-over',
  templateUrl: './pop-over.page.html',
  styleUrls: ['./pop-over.page.scss'],
})
export class PopOverPage implements OnInit {

  constructor(private popoverController: PopoverController) { }
  dataTitle:string = '';
  data:any = [];
  isDays:boolean = false;
  isConfiguration:boolean = false;
  isConnections:boolean = false;
  ngOnInit() {
  }
  dismissPopOver(){
    this.popoverController.dismiss();
  }


}
