import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// Admin component for Frametry6: lets super admins manage users in the system.
// Use these comments to answer questions about how user management works in the project.

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  // Array of all users in the system
  users: any[] = [];
  // Object for creating a new user
  newUser = { username: '', email: '', role: 'user', password: '123' };
  // The current logged-in user object
  currentUser: any = null;
  // Stores any error message to show in the UI
  error: string = '';

  // Sets up HttpClient for API calls and loads current user from localStorage
  constructor(private http: HttpClient) {
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
  }

  // Runs when the component loads. Loads all users from the backend.
  ngOnInit() {
    this.loadUsers();
  }

  // Loads all users from the backend and updates the users array.
  loadUsers() {
    this.http.get<any[]>('/api/users').subscribe(users => {
      this.users = users;
    });
  }

  // Adds a new user to the system. Checks for required fields, then sends to backend.
  addUser() {
    if (!this.newUser.username || !this.newUser.email) {
      this.error = 'Username and email required.';
      return;
    }
    // Send requester (super admin username) in the request
    const payload = { ...this.newUser, requester: this.currentUser?.username };
    this.http.post('/api/users', payload).subscribe({
      next: (res: any) => {
        this.newUser = { username: '', email: '', role: 'user', password: '123' };
        this.error = '';
        this.loadUsers();
      },
      error: err => {
        this.error = err.error?.error || 'Error creating user.';
      }
    });
  }

  // Updates a user's role (promote/demote)
  updateUserRole(username: string, newRole: string) {
    if (username === this.currentUser.username) return;
    
    const payload = { 
      requester: this.currentUser?.username,
      role: newRole
    };
    
    this.http.put(`/api/users/${username}`, payload).subscribe({
      next: () => {
        this.error = '';
        this.loadUsers();
      },
      error: err => {
        this.error = err.error?.error || 'Error updating user role.';
      }
    });
  }

  // Deletes a user from the system (cannot delete self)
  deleteUser(username: string) {
    if (username === this.currentUser.username) return;
    // Send requester (super admin username) in the request body
    this.http.request('delete', `/api/users/${username}`, {
      body: { requester: this.currentUser?.username }
    }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: err => {
        this.error = err.error?.error || 'Error deleting user.';
      }
    });
  }
}
