import { Component } from '@angular/core';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

interface KanbanColumn {
  id: string;
  title: string;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    NgForOf,
    MatToolbar,
    NgOptimizedImage,
    RouterLink,
    MatIconButton,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  columns: KanbanColumn[] = [
    { id: 'todo', title: 'Por hacer' },
    { id: 'in-progress', title: 'En progreso' },
    { id: 'done', title: 'Hecho' },
  ];

  addColumn() {
    const newId = 'col-' + Math.random().toString(36).substr(2, 9);
    this.columns.push({ id: newId, title: 'Nueva columna' });
  }

  deleteColumn(id: string): void {
    this.columns = this.columns.filter(col => col.id !== id);
  }
}
