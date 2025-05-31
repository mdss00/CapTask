import {Component, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatCard} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';

interface KanbanColumn {
  id: string;
  title: string;
  tasks: Task[]
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: 'Baja' | 'Media' | 'Alta' | 'Urgente';
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
    MatTooltip,
    MatCard,
    NgClass,
    FormsModule,
    NgIf,
    MatSidenavModule,
    MatButton,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  columns: KanbanColumn[] = [
    { id: 'todo', title: 'Por hacer', tasks: []},
    { id: 'in-progress', title: 'En progreso', tasks: [] },
    { id: 'done', title: 'Hecho', tasks: [] },
  ];

  addColumn() {
    const newId = 'col-' + Math.random().toString(36).substr(2, 9);
    this.columns.push({ id: newId, title: 'Nueva columna', tasks: [] });
  }

  deleteColumn(id: string): void {
    this.columns = this.columns.filter(col => col.id !== id);
  }

  addTask(column: KanbanColumn): void {
    const newTask: Task = {
      id: this.generateTaskId(),
      title: 'Nueva tarea',
      status: column.title,
      priority: "Media"
    };
    column.tasks.push(newTask);
  }

  generateTaskId(): string {
    return Date.now().toString();
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, targetColumn: KanbanColumn) {
    const prevContainer = event.previousContainer;
    const currContainer = event.container;

    if (prevContainer === currContainer) {
      moveItemInArray(targetColumn.tasks, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];

      // Actualizar el estado de la tarea (columna)
      movedTask.status = targetColumn.title;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Baja':
        return 'priority-baja';
      case 'Media':
        return 'priority-media';
      case 'Alta':
        return 'priority-alta';
      case 'Urgente':
        return 'priority-urgente';
      default:
        return '';
    }
  }

  selectedTask: Task | null = null;
  isSidenavOpen = false;

  openTask(task: Task) {
    this.selectedTask = task;
    this.isSidenavOpen = true;
  }

  closeSidenav() {
    this.selectedTask = null;
    this.isSidenavOpen = false;
  }

  @ViewChild('taskSidenav') taskSidenav!: MatSidenav;

  get connectedDropLists(): string[] {
    return this.columns.map(column => column.id);
  }
}
