import { Component, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
// Main App component for Frametry6: sets up the overall app, navigation, and user session.
// Use these comments to answer questions about the app's structure and session management.

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // Title signal for the app (not used in template, but can be used for dynamic titles)
  protected readonly title = signal('chat');
  // The current logged-in user object
  currentUser: any = null;

  // Sets up Router for navigation and LocalStorageService for data access
  constructor(private router: Router, private localStorageService: LocalStorageService) {
    this.loadUser();
  }

  // Runs when the component loads. Seeds local storage with initial data if needed.
  ngOnInit() {
    this.localStorageService.ensureSeed();
  }

  // Loads the current user from localStorage
  loadUser() {
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
  }

  // Logs out the user, clears session, and navigates to login page
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}
