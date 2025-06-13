import { Routes } from '@angular/router';
import {LandingComponent} from './landing/landing.component';
import {LoginComponent} from './login/login.component';
import {BoardComponent} from './board/board.component';
import {RegisterComponent} from './register/register.component';
import {BoardListComponent} from './boardlist/boardlist.component';

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
  {
    path: 'board/:id',
    component: BoardComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'boardlist',
    component: BoardListComponent,
  },
];
