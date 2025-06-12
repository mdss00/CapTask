import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services/auth.service';


export interface LoginRequestDto {
  email: string;
  password: string;
}

@Component({
  selector: 'app-mi-app',
  imports: [
    NgOptimizedImage,
    RouterLink,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  )
  {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
       });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const dto: LoginRequestDto = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post<any>('http://localhost:8080/api/users/login', dto).subscribe({
      next: (res) => {
        this.authService.login({ email: dto.email });
        this.router.navigate(['/boardlist']);
      },
      error: (err) => {
        this.errorMessage = err.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'Error del servidor. Intenta de nuevo.';
        this.loginForm.reset();
      }
    });
  }
}
