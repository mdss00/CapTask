import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-mi-app',
  imports: [
    NgOptimizedImage,
    RouterLink,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
