import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'lugares',
    loadComponent: () =>
      import('./components/lugares/lugares.page').then((m) => m.LugaresPage),
    canActivate: [authGuard],
  },
  {
    path: 'detalle/:id',
    loadComponent: () =>
      import('./components/detalle/detalle.page').then((m) => m.DetallePage),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.page').then((m) => m.RegisterPage),
  },
];
