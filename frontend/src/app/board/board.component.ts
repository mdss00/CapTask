import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatCard} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatFormField, MatInput} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';

export interface Board {
  id: number;
  titulo: string;
  bitacora: string;
  columns: BoardColumn[];
}

interface BoardColumn {
  id: number;
  title: string;
  tasks: Task[]
}

interface Task {
  id: number;
  title: string;
  status: string;
  description: string;
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
export class BoardComponent implements OnInit{

  constructor(private snackBar: MatSnackBar,private route: ActivatedRoute, private http: HttpClient) {}
  board!: Board;

  ngOnInit(): void {
    const boardId = this.route.snapshot.paramMap.get('id');

    if (boardId) {
      this.http.get<any>(`http://localhost:8080/api/boards/${boardId}`)
        .subscribe({
          next: (board) => this.board = board,
          error: (err) => console.error('Error al cargar el tablero:', err)
        });
    }
}

  addColumn() {
    const baseTitle = 'Nueva columna';
    let newTitle = baseTitle;
    let suffix = 0;//
    // Incrementa el sufijo mientras exista ese título en las columnas (ignorando mayúsculas)
    while (this.board.columns.some(col => col.title.toLowerCase() === newTitle.toLowerCase())) {
      suffix++;
      newTitle = `${baseTitle} ${suffix}`;
    }
    const nuevaColumna = {
      title: newTitle,
      boardId: this.board.id
    };

    this.http.post<any>('http://localhost:8080/api/columns', nuevaColumna).subscribe({
      next: (columnaCreada) => {
        this.board.columns.push(columnaCreada);
        const timestamp = new Date().toLocaleString();
        this.board.bitacora += `[${timestamp}] Se ha creado la columna ( ${columnaCreada} )"\n\n`;
      },
      error: (err) => {
        console.error('Error al crear la columna:', err);
      }
    });
  }

  deleteColumn(columnId: number, titulo: string) {
    this.http.delete(`http://localhost:8080/api/columns/${columnId}`).subscribe({
      next: () => {
        // Filtramos la columna eliminada del array local
        this.board.columns = this.board.columns.filter((col: any) => col.id !== columnId);
        const timestamp = new Date().toLocaleString();
        this.board.bitacora += `[${timestamp}] Se ha borrado la columna ( ${titulo} )"\n\n`;
        this.closeSidenav();
      },
      error: (error) => {
        console.error('Error al eliminar la columna:', error);
      }
    });
  }

  addTask(): void {
    const newTask = {
      title: 'Nueva tarea',
      status: this.board.columns[0].title,
      priority: 'Media',
      column: this.board.columns[0].id
    };

    this.http.post<any>('http://localhost:8080/api/tasks', newTask).subscribe({
      next: (createdTask) => {
        if (!this.board.columns[0].tasks) {
          this.board.columns[0].tasks = [];
        }
        this.board.columns[0].tasks.push(createdTask);
        const timestamp = new Date().toLocaleString();
        this.board.bitacora += `[${timestamp}] Se ha añadido la tarea ( ${createdTask.title} )"\n\n`;
        this.snackBar.open('Tarea creada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al crear tarea:', error);
        this.snackBar.open('Error al crear tarea', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, targetColumn: BoardColumn) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex];
      const previousColumnTasks = event.previousContainer.data;
      const newColumnTasks = event.container.data;

      // Actualizar UI: eliminar de la lista vieja
      previousColumnTasks.splice(event.previousIndex, 1);

      // Añadir a la lista nueva en la posición actual
      newColumnTasks.splice(event.currentIndex, 0, movedTask);

      // Llamar al backend para actualizar la columna
      this.http.put<Task>(`http://localhost:8080/api/tasks/${movedTask.id}/column`, { columnId: targetColumn.id })
        .subscribe({
          next: (updatedTask) => {
            this.snackBar.open('Tarea movida correctamente', 'Cerrar', { duration: 2000 });
            // Actualizar la propiedad local de la tarea (status)
            movedTask.status = targetColumn.title;
            const timestamp = new Date().toLocaleString();
            this.board.bitacora += `[${timestamp}] Se ha actualizado el estado de la tarea "${movedTask.title}"\n\n`;
          },
          error: () => {
            this.snackBar.open('Error al mover tarea', 'Cerrar', { duration: 3000 });
            // Revertir cambios en UI si falla la petición

            // Quitar tarea de la lista nueva
            newColumnTasks.splice(event.currentIndex, 1);
            // Volver a añadir la tarea a la lista vieja
            previousColumnTasks.splice(event.previousIndex, 0, movedTask);
          }
        });
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

  get connectedDropLists(): string[] {
    return this.board.columns.map(column => 'column-' + column.id);
  }

  onStatusChange(newStatus: string) {
    if (!this.selectedTask) return;

    // Encuentra la columna actual y remueve la tarea
    const currentColumn = this.board.columns.find(col =>
      col.tasks.some(task => task.id === this.selectedTask?.id)
    );

    if (currentColumn) {
      currentColumn.tasks = currentColumn.tasks.filter(task => task.id !== this.selectedTask!.id);
    }

    // Actualiza el estado localmente
    this.selectedTask.status = newStatus;

    // Encuentra la nueva columna y agrega la tarea
    const newColumn = this.board.columns.find(col => col.title === newStatus);
    newColumn?.tasks.push(this.selectedTask);

    // Llama al backend para persistir el cambio
    this.http.put(`http://localhost:8080/api/tasks/${this.selectedTask.id}`, this.selectedTask)
      .subscribe({
        next: () => {
          this.snackBar.open('Estado de la tarea actualizado', 'Cerrar', { duration: 2000 });
          const timestamp = new Date().toLocaleString();
          this.board.bitacora += `[${timestamp}] Se ha actualizado la tarea "${this.selectedTask?.title}"\n\n`;
        },
        error: () => {
          this.snackBar.open('Error al actualizar la tarea', 'Cerrar', { duration: 3000 });

          // Si falla, revierte los cambios visuales
          newColumn!.tasks = newColumn!.tasks.filter(task => task.id !== this.selectedTask!.id);
          if (currentColumn) {
            currentColumn.tasks.push(this.selectedTask!);
          }
        }
      });
  }

  onColumnTitleEdit(column: BoardColumn, event: FocusEvent) {
    const element = event.target as HTMLElement;
    const newTitle = element.innerText.trim();

    if (!newTitle) {
      this.snackBar.open('El título no puede estar vacío', 'Cerrar', {duration: 3000});
      element.innerText = column.title;
      return;
    }

    const isDuplicate = this.board.columns.some(col =>
      col.id !== column.id && col.title.trim().toLowerCase() === newTitle.toLowerCase()
    );

    if (isDuplicate) {
      this.snackBar.open('Ya existe una columna con ese título', 'Cerrar', {duration: 3000});
      element.innerText = column.title;
      return;
    }

    const oldTitle = column.title;

    if (newTitle !== oldTitle) {
      // Asignar nuevo valor localmente
      column.title = newTitle;

      this.http.put(`http://localhost:8080/api/columns/${column.id}`, column).subscribe({
        next: () => {
          this.snackBar.open('Título actualizado correctamente', 'Cerrar', {duration: 3000});

          const timestamp = new Date().toLocaleString();
          this.board.bitacora += `[${timestamp}] Se ha cambiado el título de la columna de "${oldTitle}" a "${newTitle}"\n\n`;
        },
        error: (error) => {
          console.error('Error al actualizar el título:', error);
          this.snackBar.open('Error al guardar el título en la base de datos', 'Cerrar', {duration: 3000});

          column.title = oldTitle;
          element.innerText = oldTitle;
        }
      });
    }
  }
  showLog() {
    const dto = { bitacora: this.board.bitacora };

    this.http.put(`http://localhost:8080/api/boards/${this.board.id}/bitacora`, dto)
      .subscribe({
        next: () => {
          this.snackBar.open('Bitácora actualizada', 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Error al actualizar la bitácora', 'Cerrar', { duration: 3000 });
        }
      });
    this.isLogOpen = true;
    this.scrollLogToBottom();
  }

  closeSidenavStart() {
    this.isLogOpen = false;
  }

  updateTask(): void {
    if (!this.selectedTask || !this.selectedTask.status) {
      this.snackBar.open('No se puede actualizar la columna: tarea o estado no válidos', 'Cerrar', { duration: 3000 });
      return;
    }
    // @ts-ignore
    const column = this.board.columns.find(col => col.title === this.selectedTask.status);
    const columnId = column?.id;

    const updatedTask = {
      title: this.selectedTask.title,
      status: this.selectedTask.status,
      priority: this.selectedTask.priority,
      description: this.selectedTask.description,
      column:undefined
    };

    this.http.put(`http://localhost:8080/api/tasks/${this.selectedTask.id}/update`, updatedTask)
      .subscribe({
        next: () => {
          this.snackBar.open('Tarea actualizada correctamente', 'Cerrar', {
            duration: 3000,
          });
          const timestamp = new Date().toLocaleString();
          this.board.bitacora += `[${timestamp}] Se ha actualizado la tarea "${this.selectedTask?.title}"\n\n`;
        },
        error: () => {
          this.snackBar.open('Error al actualizar la tarea', 'Cerrar', {
            duration: 3000,
          });
        }
      });

    this.http.put(`http://localhost:8080/api/tasks/${this.selectedTask.id}/column`, {
      columnId: columnId
    }).subscribe({
      next: () => {
        this.snackBar.open('Columna actualizada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al actualizar la columna', 'Cerrar', { duration: 3000 });
      }
    });
  }

  addLogEntry() {
    if (this.newLogEntry.trim()) {
      const dto = { bitacora: this.board.bitacora };
      const timestamp = new Date().toLocaleString();
      this.board.bitacora += `[${timestamp}] ${this.newLogEntry}\n\n`
      this.http.put(`http://localhost:8080/api/boards/${this.board.id}/bitacora`, dto)
        .subscribe({
          next: () => {
            this.snackBar.open('Bitácora actualizada', 'Cerrar', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Error al actualizar la bitácora', 'Cerrar', { duration: 3000 });
          }
        });
      this.newLogEntry = "";
      this.scrollLogToBottom();
    }
  }

  @ViewChild('logTextArea') logTextArea!: ElementRef<HTMLTextAreaElement>;
  newLogEntry: string = "";

  scrollLogToBottom(): void {
    setTimeout(() => {
      const el = this.logTextArea?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  deleteTask(task: Task, column: BoardColumn): void {
    this.http.delete(`http://localhost:8080/api/tasks/${task.id}`)
      .subscribe({
        next: () => {
          // Eliminar tarea de la lista local de la columna
          const timestamp = new Date().toLocaleString();
          this.board.bitacora += `[${timestamp}] Se ha borrado la tarea "${task.title}"\n\n`;
          column.tasks = column.tasks.filter(t => t.id !== task.id);
          this.snackBar.open('Tarea eliminada correctamente', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Error al eliminar la tarea', 'Cerrar', { duration: 3000 });
        }
      });
  }
}
