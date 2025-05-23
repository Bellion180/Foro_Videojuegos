import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ForumService } from "../../../core/services/forum.service";
import { ThreadService } from "../../../core/services/thread.service";
import { NotificationService } from "../../../core/services/notification.service";
import { Forum } from "../../../core/models/forum.model";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-thread-create",
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="create-thread-container">
      <header class="page-header">
        <h1>Crear Nuevo Hilo</h1>
        <p>Inicia una nueva discusión en la comunidad</p>
      </header>

      <div class="thread-form">
        <div class="form-group">
          <label for="forum">Foro</label>
          <select id="forum" [(ngModel)]="forumId" required>
            <option value="">Selecciona un foro</option>
            @for (forum of forums; track forum.id) {
              <option [value]="forum.id">{{ forum.name }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="title">Título</label>
          <input type="text" id="title" [(ngModel)]="title" placeholder="Introduce un título descriptivo" required>
        </div>

        <div class="form-group">
          <label for="content">Contenido</label>
          <textarea id="content" [(ngModel)]="content" rows="10" placeholder="Escribe tu mensaje aquí..." required></textarea>
        </div>

        <div class="form-group">
          <label for="tags">Etiquetas (opcional)</label>
          <input type="text" id="tags" [(ngModel)]="tagsInput" placeholder="Introduce etiquetas separadas por comas">
          <div class="tags-preview" *ngIf="tagsArray.length > 0">
            @for (tag of tagsArray; track tag) {
              <span class="tag">{{ tag }} <button (click)="removeTag(tag)" class="remove-tag">×</button></span>
            }
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="cancel()">Cancelar</button>
          <button class="btn primary" [disabled]="!isFormValid()" (click)="createThread()">Crear Hilo</button>
        </div>
      </div>
    </div>

    @if (showConfirmDialog) {
      <div class="dialog-overlay">
        <div class="dialog">
          <h2>¡Hilo creado exitosamente!</h2>
          <p>¿Qué te gustaría hacer ahora?</p>
          <div class="dialog-actions">
            <button class="btn secondary" (click)="createAnotherThread()">Crear otro hilo</button>
            <button class="btn primary" (click)="viewCreatedThread()">Ver el hilo creado</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
    .create-thread-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .page-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    .page-header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .page-header p {
      color: #666;
    }
    .thread-form {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: inherit;
    }
    .form-group textarea {
      resize: vertical;
    }
    .tags-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .tag {
      background-color: #e6f7ff;
      color: #0072b1;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
    }
    .remove-tag {
      background: none;
      border: none;
      color: #0072b1;
      margin-left: 0.25rem;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
    }
    .primary {
      background-color: #ff9f1c;
      color: #1a1a2e;
    }
    .primary:hover {
      background-color: #f08c00;
    }
    .primary:disabled {
      background-color: #ffd699;
      cursor: not-allowed;
    }
    .secondary {
      background-color: #1a1a2e;
      color: white;
    }
    .secondary:hover {
      background-color: #2a2a4e;
    }
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .dialog {
      background-color: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      text-align: center;
    }
    .dialog h2 {
      color: #1a1a2e;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    .dialog p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  `,
  ],
})
export class ThreadCreateComponent implements OnInit {
  forums: Forum[] = [];
  forumId: number | string = "";
  title = "";
  content = "";
  tagsInput = "";
  showConfirmDialog = false;
  private newThreadId: number | null = null;

  constructor(
    private forumService: ForumService,
    private threadService: ThreadService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.loadForums()
    this.route.queryParams.subscribe((params) => {
      if (params["forumId"]) {
        this.forumId = Number(params["forumId"])
      }
    })
  }

  loadForums(): void {
    this.forumService.getForums().subscribe((forums) => {
      this.forums = forums
    })
  }

  get tagsArray(): string[] {
    if (!this.tagsInput) return []
    return this.tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  removeTag(tagToRemove: string): void {
    const tags = this.tagsArray.filter((tag) => tag !== tagToRemove)
    this.tagsInput = tags.join(", ")
  }

  isFormValid(): boolean {
    return !!this.forumId && !!this.title.trim() && !!this.content.trim()
  }

  createThread(): void {
    if (!this.isFormValid()) return;

    const newThread = {
      title: this.title,
      content: this.content,
      forumId: Number(this.forumId),
      tags: this.tagsArray,
    };

    console.log('Enviando datos del nuevo thread:', newThread);

    this.threadService.createThread(newThread).subscribe({
      next: (thread) => {
        console.log('Thread creado:', thread);
        
        if (!thread || !thread.id) {
          console.error('No se pudo obtener el ID del hilo:', thread);
          this.notificationService.error('Error: No se pudo obtener el ID del hilo creado');
          return;
        }

        this.newThreadId = thread.id;
        console.log('ID del nuevo thread:', this.newThreadId);
        
        this.notificationService.success('¡Hilo creado exitosamente!');
        this.showConfirmDialog = true;
      },
      error: (error) => {
        console.error('Error al crear el hilo:', error);
        this.notificationService.error('Error al crear el hilo: ' + (error.message || 'Error desconocido'));
      }
    });
  }

  createAnotherThread(): void {
    this.showConfirmDialog = false;
    this.newThreadId = null;
    this.title = '';
    this.content = '';
    this.tagsInput = '';
  }

  viewCreatedThread(): void {
    console.log('Intentando navegar al thread con ID:', this.newThreadId);
    
    if (!this.newThreadId) {
      console.error('No se encontró el ID del thread');
      this.notificationService.error('Error: No se puede navegar al hilo');
      return;
    }

    this.showConfirmDialog = false;
    
    // Usar una promesa para asegurar que la navegación ocurra después de que el diálogo se cierre
    Promise.resolve().then(() => {
      console.log('Navegando a:', `/threads/${this.newThreadId}`);
      this.router.navigate(['/threads', this.newThreadId])
        .then(success => {
          if (!success) {
            console.error('Fallo en la navegación');
            this.notificationService.error('Error al navegar al hilo creado');
          }
        })
        .catch(error => {
          console.error('Error durante la navegación:', error);
          this.notificationService.error('Error al navegar al hilo creado');
        });
    });
  }

  cancel(): void {
    this.router.navigate(["/forums"])
  }
}
