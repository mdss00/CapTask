import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput, MatLabel, MatError} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatButton,
    NgIf,
    FormsModule,
    MatInput,
    NgOptimizedImage,
    RouterLink,
    MatError,
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  )
  {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordMatchValidator() });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;

      const user = {
        nombre,
        email,
        password
      };

      this.http.post('http://localhost:8080/api/users', user).subscribe({
        next: (res: any) => {
          alert('Usuario creado con éxito');
          this.authService.login(res);
          this.router.navigate(['/boardlist']);
        },
        error: (err) => {
          if (err.status === 409 && err.error?.error === 'El email ya está en uso') {
            alert('El email ya está en uso, por favor usa otro');
          } else {
            alert('Error al crear el usuario');
            console.error(err);
          }
        }
      });
    }
  }

  hasPasswordMismatchError(): boolean {
    if (!this.registerForm) return false;

    const form = this.registerForm;
    const passwordTouched = form.get('password')?.touched ?? false;
    const confirmPasswordTouched = form.get('confirmPassword')?.touched ?? false;

    return form.hasError('passwordMismatch') && (passwordTouched || confirmPasswordTouched);
  }


}
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  };

}

