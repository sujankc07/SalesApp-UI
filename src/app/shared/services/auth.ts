import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'jwt';
  private route = inject(Router);

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('logged out');
    this.route.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // getDecodedToken(): any {
  //   const token = this.getToken();
  //   if (!token) return null;

  //   const payload = token.split('.')[1];
  //   return JSON.parse(atob(payload));
  // }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload:' + payload);

      const expiry = payload.exp;
      console.log('expiry: ' + expiry);

      const now = Math.floor(Date.now() / 1000);
      console.log('now: ' + now);

      return expiry < now;
    } catch (e) {
      return true;
    }
  }
}
