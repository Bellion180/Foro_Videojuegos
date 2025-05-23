import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private notificationService: NotificationService) {}

  /**
   * Muestra una notificación al usuario sobre el envío de email
   * @param email Email del usuario
   * @param username Nombre de usuario
   */
  showEmailSentNotification(email: string, username: string): void {
    // Oculta parte del email para mostrar en la notificación por privacidad
    const maskedEmail = this.maskEmail(email);
    
    this.notificationService.success(
      `¡Bienvenido ${username}! Hemos enviado un mensaje de bienvenida a ${maskedEmail}`
    );
  }

  /**
   * Oculta parte del email para mostrar en notificaciones
   * @param email Email completo
   * @returns Email parcialmente oculto
   */
  private maskEmail(email: string): string {
    if (!email) return '';
    
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    
    const username = parts[0];
    const domain = parts[1];
    
    // Si el nombre de usuario es demasiado corto, mostramos al menos 1 caracter
    const visibleLength = Math.max(Math.min(username.length - 2, 3), 1);
    const hiddenUsername = username.substring(0, visibleLength) + 
                        '*'.repeat(username.length - visibleLength);
    
    return `${hiddenUsername}@${domain}`;
  }
}
