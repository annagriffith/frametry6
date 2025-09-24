import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Login component for Frametry6: handles user login and authentication.
// Use these comments to answer questions about how login works in the project.

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // Stores the username entered by the user
  username = '';
  // Stores the password entered by the user
  password = '';
  // Stores any error message to show in the UI
  error = '';

  // Sets up HttpClient for API calls and Router for navigation
  constructor(private http: HttpClient, private router: Router) {}

  // Sends login request to backend with username and password. Handles response by saving user to localStorage and navigating to profile, or showing error.
  login() {
    this.error = '';
    this.http.post<any>('/api/auth', { username: this.username, password: this.password }).subscribe(res => {
      if (res.valid) {
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this.router.navigate(['/profile']);
      } else {
        this.error = 'Invalid username or password.';
      }
    }, () => {
      this.error = 'Server error.';
    });
  }
}
