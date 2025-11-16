import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(private router: Router) {}

  logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.clear();
    }
    this.router.navigate(['/auth/login']); // redirection vers login
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
