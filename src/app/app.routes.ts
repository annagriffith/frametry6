// This file defines the main routes for the Frametry6 chat app.
// It maps URLs to components and sets up guards for authentication and roles.
// Use these comments to answer questions about navigation and access control in the project.
import { Routes } from '@angular/router'; // Angular routing types
import { Home } from './app/home/home'; // Home page component
import { Login } from './app/login/login'; // Login page component
import { ProfileComponent } from './app/profile/profile'; // User profile page component
import { Chat } from './app/chat/chat'; // Chat page component
import { AuthGuard } from './guards/auth.guard'; // Guard: only allow logged-in users
import { RoleGuard } from './guards/role.guard'; // Guard: restrict by user role
import { GroupAdmin } from './app/group-admin/group-admin'; // Group admin dashboard
import { Admin } from './app/admin/admin'; // Super admin dashboard

// Main route definitions for the app
export const routes: Routes = [
  { path: '', component: Home }, // Home page
  { path: 'login', component: Login }, // Login page
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }, // Profile page, only for logged-in users
  { path: 'chat', component: Chat, canActivate: [AuthGuard] }, // Chat page, only for logged-in users
  { path: 'group-admin', component: GroupAdmin, canActivate: [AuthGuard, RoleGuard], data: { roles: ['groupAdmin','superAdmin'] } }, // Group admin dashboard, only for group/super admins
  { path: 'admin', component: Admin, canActivate: [AuthGuard, RoleGuard], data: { roles: ['superAdmin'] } }, // Super admin dashboard, only for super admins
  { path: '**', redirectTo: '' } // Wildcard: redirect unknown routes to home
];
