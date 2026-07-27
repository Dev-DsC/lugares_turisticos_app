import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastController: ToastController) {}

  async show(
    message: string,
    color: 'primary' | 'success' | 'warning' | 'danger' | 'dark' = 'primary',
    duration = 2000,
  ) {
    const t = await this.toastController.create({
      message,
      color,
      duration,
      position: 'top',
    });
    await t.present();
  }
}
