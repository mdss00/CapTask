import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from '@angular/router';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';

export interface Board {
  titulo: string;
  bitacora: string;
  email: string;
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
    MatCard,
    NgForOf,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    NgIf,
    MatAnchor,
    MatToolbar,
    MatIconButton
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
    const email = typeof this.authService.currentUser === 'string'
      ? this.authService.currentUser
      : this.authService.currentUser?.email;

    if (!email || email == '') {
      this.router.navigate(['/login']);
      return;
    }

    console.log('Usuario autenticado:', email);

    this.http.get<any[]>(`http://localhost:8080/api/boards/user/${email}`).subscribe({
      next: (boards) => {
        this.boards = boards || [];
      },
      error: (err) => {
        this.boards = [];
      }
    });
  }

  crearBoardPorDefecto() {
    const user = this.authService.currentUser;
    const email = user?.email;

    const nuevoBoard = {
      titulo: 'Nuevo tablero',
      bitacora: '',
      email: email
    };

    this.http.post<Board>('http://localhost:8080/api/boards', nuevoBoard).subscribe({
      next: (board) => {
        this.boards.push(board);
      },
      error: (err) => {
      }
    });
  }

  eliminarBoard(id: number) {
    const email = this.authService.currentUser?.email || this.authService.currentUser;
    if (!email) return;

    this.http.delete(`http://localhost:8080/api/boards/${id}?email=${email}`).subscribe({
      next: () => {
        this.boards = this.boards.filter(board => board.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar tablero:', err);
      }
    });
  }

  updateTitulo(event: FocusEvent, board: any) {
    const nuevoTitulo = (event.target as HTMLElement).innerText.trim();

    if (nuevoTitulo && nuevoTitulo !== board.titulo) {
      this.http.put<Board>(`http://localhost:8080/api/boards/${board.id}`, nuevoTitulo, {
        headers: { 'Content-Type': 'text/plain' }
      }).subscribe({
        next: (updatedBoard) => {
          board.titulo = updatedBoard.titulo; // actualizar en UI
          console.log('Título actualizado');
        },
        error: (err) => {
          console.error('Error actualizando título', err);
        }
      });
    }
  }

  goToBoard(id: number) {
    console.log('board-' + id)
    this.router.navigate(['/board',id]);
  }
}
