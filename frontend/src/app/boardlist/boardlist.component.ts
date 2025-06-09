import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatCard, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-mi-app',
  imports: [
    NgOptimizedImage,
    RouterLink,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatCard,
    NgForOf,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    NgIf,
    MatAnchor,
    MatToolbar
  ],
  templateUrl: './boardlist.component.html',
  styleUrl: './boardlist.component.scss'
})
export class BoardListComponent implements OnInit {
  boards: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = this.authService.currentUser;

    if (!email) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<any[]>(`http://localhost:8080/api/boards/user/${email}`).subscribe({
      next: (boards) => {
        this.boards = boards || [];
      },
      error: (err) => {
        this.boards = [];
      }
    });
  }
}
