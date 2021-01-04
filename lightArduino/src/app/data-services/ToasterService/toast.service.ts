import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public ToastController : ToastController) { }
  /**
   * This Method Presents a Toaster Message
   * @param message the toaster Message
   */
  async PresentToast(message:any){
    const toast = await this.ToastController.create({
      message:message,
      duration:2000,
    });
    toast.present();
  }
}
