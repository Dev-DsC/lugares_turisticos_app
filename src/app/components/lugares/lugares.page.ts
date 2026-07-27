import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonBadge,
} from '@ionic/angular/standalone';
import { LugaresService } from 'src/app/services/lugares.service';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, locationOutline, logOut } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { LugarApi } from 'src/app/models/lugar-api';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.page.html',
  styleUrls: ['./lugares.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButtons,
    IonButton,
    IonBadge,
    IonFabButton,
    IonFab,
    IonLabel,
    IonAvatar,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class LugaresPage implements OnInit {
  lugares: LugarApi[] = [];

  constructor(
    private lugaresService: LugaresService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    private toast: ToastService,
  ) {
    addIcons({ add, locationOutline, logOut });
  }

  ngOnInit(): void {
    this.cargar();
    this.route.queryParams.subscribe((params) => {
      if (params['refresh']) {
        this.cargar();
      }
    });
  }

  cargar(): void {
    this.lugaresService.getLugares().subscribe({
      next: (data) => {
        this.lugares = data;
      },
      error: (err) => {
        console.error('Error al cargar lugares', err);
      },
    });
  }

  async agregarLugar(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Agregar Lugar',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del lugar' },
        { name: 'imagen', type: 'text', placeholder: 'URL de la imagen' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Agregar',
          handler: (data) => {
            const nuevoLugar = {
              nombre: data.nombre,
              imagen: data.imagen,
            };
            // crear y navegar al detalle del nuevo lugar
            this.lugaresService.agregarLugar(nuevoLugar).subscribe({
              next: (created) => {
                this.cargar();
                this.toast.show('Lugar creado', 'success', 1400);
                if (created && created._id) {
                  this.router.navigate(['/detalle', created._id]);
                }
              },
              error: async (err) => {
                console.error('Error al agregar lugar', err);
                if (err?.status === 401) {
                  const a = await this.alertController.create({
                    header: 'No autorizado',
                    message: 'Debes iniciar sesión para agregar un lugar.',
                    buttons: [
                      {
                        text: 'Ir a login',
                        handler: () => this.router.navigate(['/login']),
                      },
                    ],
                  });
                  await a.present();
                  return;
                }

                const a = await this.alertController.create({
                  header: 'Error',
                  message: err?.error?.mensaje || 'Error al agregar lugar',
                  buttons: ['OK'],
                });
                await a.present();
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  logout(): void {
    this.auth.logout();
    this.toast.show('Sesión cerrada', 'warning', 1400);
    this.router.navigate(['/login']);
  }

  verDetalle(lugar: LugarApi): void {
    this.router.navigate(['/detalle', lugar._id]);
  }

  ionViewWillEnter(): void {
    this.cargar();
  }
}
