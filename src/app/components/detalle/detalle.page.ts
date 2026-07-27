import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonBadge,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from 'src/app/services/lugares.service';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import {
  chatbubblesOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { AlertController } from '@ionic/angular';
import { ComentarioApi, LugarApi } from 'src/app/models/lugar-api';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonButtons,
    IonButton,
    IonBadge,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonFabButton,
    IonFab,
    IonLabel,
    IonItem,
    IonList,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class DetallePage implements OnInit {
  lugar: LugarApi | undefined;
  lugarId: string = '';

  constructor(
    private route: ActivatedRoute,
    private lugaresService: LugaresService,
    private router: Router,
    private alertController: AlertController,
    public auth: AuthService,
  ) {
    addIcons({ trashOutline, createOutline, chatbubblesOutline });
  }

  ngOnInit() {
    this.lugarId = this.route.snapshot.paramMap.get('id') || '';
    if (this.lugarId) {
      this.cargarDetalle();
    }
  }

  cargarDetalle() {
    this.lugaresService.getLugar(this.lugarId).subscribe({
      next: (data) => {
        this.lugar = data;
      },
      error: (err) => {
        console.error('Error al cargar detalle', err);
      },
    });
  }

  async agregarComentario() {
    if (!this.auth.isLogged()) {
      const alert = await this.alertController.create({
        header: 'No autorizado',
        message: 'Debes iniciar sesión para dejar un comentario.',
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Agregar Comentario',
      inputs: [
        {
          name: 'comentario',
          type: 'textarea',
          placeholder: 'Escribe tu comentario',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.comentario.trim() && this.lugar) {
              this.lugaresService
                .agregarComentario(this.lugarId, data.comentario)
                .subscribe({
                  next: () => {
                    this.cargarDetalle();
                  },
                  error: (err) => {
                    console.error('Error al agregar comentario', err);
                  },
                });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private getComentarioAutorId(comentario: ComentarioApi): string | null {
    if (!comentario.autor) {
      return null;
    }

    return typeof comentario.autor === 'string'
      ? comentario.autor
      : comentario.autor._id;
  }

  esPropioComentario(comentario: ComentarioApi): boolean {
    const currentUserId = this.auth.getUser()?._id;
    return (
      !!currentUserId && this.getComentarioAutorId(comentario) === currentUserId
    );
  }

  puedeModificarComentario(comentario: ComentarioApi): boolean {
    return this.auth.isAdmin() || this.esPropioComentario(comentario);
  }

  getComentarioAutorEmail(comentario: ComentarioApi): string {
    if (!comentario.autor) {
      return 'Usuario anónimo';
    }

    if (typeof comentario.autor === 'string') {
      return 'Usuario anónimo';
    }

    return comentario.autor.email || 'Usuario anónimo';
  }

  async editarComentario(comentario: ComentarioApi) {
    if (!this.lugar || !comentario._id) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Editar comentario',
      inputs: [
        {
          name: 'comentario',
          type: 'textarea',
          placeholder: 'Actualiza tu comentario',
          value: comentario.texto,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            const texto = data.comentario?.trim();
            if (texto) {
              this.lugaresService
                .modificarComentario(this.lugarId, comentario._id!, texto)
                .subscribe({
                  next: () => {
                    this.cargarDetalle();
                  },
                  error: (err) => {
                    console.error('Error al editar comentario', err);
                  },
                });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarComentario(comentario: ComentarioApi) {
    if (!comentario._id) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Eliminar comentario',
      message: '¿Estás seguro que deseas eliminar este comentario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.lugaresService
              .eliminarComentario(this.lugarId, comentario._id!)
              .subscribe({
                next: () => {
                  this.cargarDetalle();
                },
                error: (err) => {
                  console.error('Error al eliminar comentario', err);
                },
              });
          },
        },
      ],
    });

    await alert.present();
  }

  async modificarLugar() {
    const alert = await this.alertController.create({
      header: 'Modificar Lugar',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del lugar',
          value: this.lugar?.nombre,
        },
        {
          name: 'imagen',
          type: 'text',
          placeholder: 'URL de la imagen',
          value: this.lugar?.imagen,
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Modificar',
          handler: (data) => {
            if (this.lugar) {
              this.lugaresService
                .modificarLugar(this.lugarId, {
                  nombre: data.nombre,
                  imagen: data.imagen,
                })
                .subscribe({
                  next: () => {
                    this.cargarDetalle();
                  },
                  error: (err) => {
                    console.error('Error al modificar lugar', err);
                  },
                });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminarLugar() {
    if (this.lugar) {
      const alert = await this.alertController.create({
        header: 'Eliminar lugar',
        message:
          '¿Quieres eliminar este lugar, una vez confirmado no podras restaurarlo?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: () => {
              this.lugaresService.eliminarLugar(this.lugarId).subscribe({
                next: () => {
                  this.router.navigate(['/lugares'], {
                    queryParams: { refresh: true },
                  });
                },
                error: (err) => {
                  console.error('Error al eliminar lugar', err);
                },
              });
            },
          },
        ],
      });

      await alert.present();
    }
  }
}
