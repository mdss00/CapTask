import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
