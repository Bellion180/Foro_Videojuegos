import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  // Tiempo de gracia (en segundos) antes de que un token se considere expirado
  // Esto ayuda a prevenir problemas donde el token expira justo mientras se está usando
  private readonly TOKEN_EXPIRY_GRACE_PERIOD = 60; // 1 minuto
  
  /**
   * Decodifica un token JWT sin verificar su firma
   * @param token El token JWT a decodificar
   * @returns El payload decodificado o null si no es válido
   */
  decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Token JWT inválido: debe tener 3 partes');
        return null;
      }
      
      // Decodificar la parte del payload (segunda parte)
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = atob(base64);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }
  
  /**
   * Verifica si un token ha expirado
   * @param token El token JWT a verificar
   * @returns true si el token ha expirado, false en caso contrario
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      console.warn('Token sin fecha de expiración o inválido');
      return true;
    }
    
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
    
    // Restar el periodo de gracia para anticipar la expiración
    const now = new Date();
    const effectiveExpirationTime = expirationDate.getTime() - (this.TOKEN_EXPIRY_GRACE_PERIOD * 1000);
    
    const isExpired = now.getTime() > effectiveExpirationTime;
    if (isExpired) {
      console.warn(`Token expirado. Expiración: ${expirationDate.toISOString()}, Ahora: ${now.toISOString()}`);
    }
    
    return isExpired;
  }
  
  /**
   * Calcula el tiempo restante hasta la expiración del token en segundos
   * @param token El token JWT a verificar
   * @returns Tiempo en segundos hasta la expiración, o -1 si no se puede determinar
   */
  getTimeToExpiration(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return -1;
    }
    
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);
    
    const now = new Date();
    const timeToExpiry = Math.floor((expirationDate.valueOf() - now.valueOf()) / 1000);
    
    return timeToExpiry;
  }
  
  /**
   * Obtiene información detallada del token
   * @param token El token JWT a analizar
   * @returns Un objeto con información del token
   */
  getTokenInfo(token: string): any {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }
    
    const timeToExpiry = this.getTimeToExpiration(token);
    const isExpired = this.isTokenExpired(token);
    
    return {
      ...decoded,
      timeToExpiry,
      isExpired,
      expiryDate: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
    };
  }

  /**
   * Verifica si un token está a punto de expirar y necesita renovación
   * @param token El token JWT a verificar
   * @param thresholdMinutes Minutos antes de la expiración para considerar renovación
   * @returns true si el token necesita ser renovado, false en caso contrario
   */
  needsRefresh(token: string, thresholdMinutes: number = 30): boolean {
    const timeToExpiry = this.getTimeToExpiration(token);
    // Si el token expira en menos de los minutos especificados, necesita renovación
    return timeToExpiry > 0 && timeToExpiry < (thresholdMinutes * 60);
  }
}
