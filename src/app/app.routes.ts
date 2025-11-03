import { Routes } from '@angular/router';
import { Login } from './user/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Registration } from './user/registration/registration';
import { Parts } from './parts/parts';
import { Order } from './order/order';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Registration,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'parts',
    component: Parts,
  },
  {
    path: 'orders',
    component: Order,
  },
];
