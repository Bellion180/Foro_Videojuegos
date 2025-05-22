import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private nextId = 0;

  constructor() {}

  showNotification(
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info', 
    duration: number = 5000
  ): number {
    const id = this.nextId++;
    const notification: Notification = { id, message, type, duration };
    
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
    
    if (duration) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }
    
    return id;
  }

  removeNotification(id: number): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  // Helper methods for common notification types
  success(message: string, duration?: number): number {
    return this.showNotification(message, 'success', duration);
  }

  error(message: string, duration?: number): number {
    return this.showNotification(message, 'error', duration);
  }

  info(message: string, duration?: number): number {
    return this.showNotification(message, 'info', duration);
  }

  warning(message: string, duration?: number): number {
    return this.showNotification(message, 'warning', duration);
  }
}
