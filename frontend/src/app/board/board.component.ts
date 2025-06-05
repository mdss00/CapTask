import {Component, ElementRef, ViewChild} from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatFormField, MatInput} from '@angular/material/input';

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
    CdkDrag,
    MatInput,
    MatFormField,
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  constructor(private snackBar: MatSnackBar) {}

  columns: KanbanColumn[] = [
    { id: 'todo', title: 'Por hacer', tasks: []},
    { id: 'in-progress', title: 'En progreso', tasks: [] },
    { id: 'done', title: 'Hecho', tasks: [] },
  ];

  addColumn() {
    const baseTitle = 'Nueva columna';
    let newTitle = baseTitle;
    let suffix = 0;

    // Incrementa el sufijo mientras exista ese título en las columnas (ignorando mayúsculas)
    while (this.columns.some(col => col.title.toLowerCase() === newTitle.toLowerCase())) {
      suffix++;
      newTitle = `${baseTitle} ${suffix}`;
    }

    const newId = 'col-' + Math.random().toString(36).substr(2, 9);
    this.columns.push({ id: newId, title: newTitle, tasks: [] });
  }

  deleteColumn(columnId: string) {
    this.columns = this.columns.filter(col => col.id !== columnId);
    this.closeSidenav()
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

  isLogOpen = false
  logText: string = "";
  newLogEntry: string = "";

  get connectedDropLists(): string[] {
    return this.columns.map(column => column.id);
  }

  onStatusChange(newStatus: string) {
    if (!this.selectedTask) return;

    // Encuentra la columna actual comparando por título
    const currentColumn = this.columns.find(col =>
      col.tasks.some(task => task === this.selectedTask)
    );

    // Elimina la tarea de la columna actual
    if (currentColumn) {
      currentColumn.tasks = currentColumn.tasks.filter(
        task => task !== this.selectedTask
      );
    }

    // Actualiza el estado de la tarea
    this.selectedTask.status = newStatus;

    // Encuentra la nueva columna por título (no debería haber duplicados)
    const newColumn = this.columns.find(col => col.title === newStatus);

    // Agrega la tarea a la nueva columna
    newColumn?.tasks.push(this.selectedTask);
  }

  onColumnTitleEdit(column: KanbanColumn, event: FocusEvent) {
    const element = event.target as HTMLElement;
    const newTitle = element.innerText.trim();

    if (!newTitle) {
      this.snackBar.open('El título no puede estar vacío', 'Cerrar', { duration: 3000 });
      element.innerText = column.title;
      return;
    }

    const exists = this.columns.some(col =>
      col.title.toLowerCase() === newTitle.toLowerCase() && col.id !== column.id
    );

    if (exists) {
      this.snackBar.open('Ya existe una columna con ese nombre', 'Cerrar', { duration: 3000 });
      element.innerText = column.title;
      return;
    }
    let oldTitle = column.title
    column.title = newTitle;

    if (oldTitle != newTitle){
      this.newLogEntry = `Se ha cambiado el título de la columna de "${oldTitle}" a "${newTitle}"`;
      if (this.newLogEntry.trim()) {
      const timestamp = new Date().toLocaleString();
      this.logText += `[${timestamp}] ${this.newLogEntry}\n\n`;
      this.newLogEntry = "";
      }
    }
  }

  showLog() {
    this.isLogOpen = true;
    this.scrollLogToBottom();
  }

  closeSidenavStart() {
    this.isLogOpen = false;
  }

  addLogEntry() {
    if (this.newLogEntry.trim()) {
      const timestamp = new Date().toLocaleString();
      this.logText += `[${timestamp}] ${this.newLogEntry}\n\n`;
      this.newLogEntry = "";
      this.scrollLogToBottom();
    }
  }

  @ViewChild('logTextArea') logTextArea!: ElementRef<HTMLTextAreaElement>;

  scrollLogToBottom(): void {
    setTimeout(() => {
      const el = this.logTextArea?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
