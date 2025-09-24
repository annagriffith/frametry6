import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const raw = localStorage.getItem('currentUser');
  // RoleGuard: Restricts access to routes based on user roles
    if (!raw) {
      this.router.navigate(['/login']);
      return false;
    }
    const role = JSON.parse(raw).role as string;
    const allowed: string[] = route.data?.['roles'] ?? [];
    const ok = role ? allowed.includes(role) : false;
    if (!ok) this.router.navigate(['/login']);
    return ok;
  }
}
