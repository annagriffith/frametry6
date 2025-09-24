import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
  // AuthGuard: Prevents access to routes for unauthenticated users
    const user = localStorage.getItem('currentUser');
    if (!user) { this.router.navigate(['/login']); return false; }
    return true;
  }
}
