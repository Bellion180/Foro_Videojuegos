import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, type Notification } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      @for (notification of notifications; track notification.id) {
        <div 
          class="notification" 
          [ngClass]="notification.type"
          [@notificationAnimation]
        >
          <div class="notification-content">
            <span class="notification-message">{{ notification.message }}</span>
          </div>
          <button 
            class="notification-close" 
            (click)="removeNotification(notification.id)"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .notification {
      display: flex;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      align-items: center;
    }
    
    .notification-content {
      flex-grow: 1;
      margin-right: 8px;
    }
    
    .notification-message {
      font-size: 0.9rem;
    }
    
    .notification-close {
      background: transparent;
      border: none;
      color: inherit;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      opacity: 0.7;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
    
    .success {
      background-color: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }
    
    .error {
      background-color: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }
    
    .info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }
    
    .warning {
      background-color: #fff3cd;
      color: #856404;
      border-left: 4px solid #ffc107;
    }
  `],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }
  
  removeNotification(id: number): void {
    this.notificationService.removeNotification(id);
  }
}
