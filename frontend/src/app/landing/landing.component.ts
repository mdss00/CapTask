import {Component, OnInit} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {MatAnchor, MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatToolbarModule, NgOptimizedImage, MatButton, RouterLink, MatAnchor, NgIf],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit{

  isLogged: boolean = true;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = typeof this.authService.currentUser === 'string'
      ? this.authService.currentUser
      : this.authService.currentUser?.email;

    if (!email || email == '') {
      this.isLogged = false
      return;
    }
  }

  scrollToSection() {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
    this.isLogged = false
  }
}
