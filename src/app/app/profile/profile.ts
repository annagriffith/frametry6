
// Profile page component for Frametry6: displays user info, groups, and channels.
// Use these comments to answer questions about how the profile page works in the project.
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';
import { Group } from '../../models/group.model';
import { Channel } from '../../models/channel.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  // The current logged-in user object
  // ...existing code...
  // Array of groups the user belongs to
  // ...existing code...
  // Object mapping group IDs to arrays of channels
  // ...existing code...
  // Stores the new channel name input by the user
  // ...existing code...
  // Stores any error message for channel creation
  // ...existing code...
  // Current logged-in user
  user: any = null;
  // Groups the user belongs to
  groups: Group[] = [];
  // Channels organized by group
  channelsByGroup: { [groupId: string]: Channel[] } = {};
  // New channel name input
  newChannelName = '';
  // Error message for channel creation
  channelError = '';
  // New group name input
  newGroupName = '';
  // Error message for group creation
  groupError = '';
  // Success message for group creation
  groupSuccess = '';
  // Creates a new group (for group/super admins)
  createGroup(): void {
    this.groupError = '';
    this.groupSuccess = '';
    const name = this.newGroupName.trim();
    if (!name) {
      this.groupError = 'Group name required.';
      return;
    }
    this.http.post('/api/groups', {
      requester: this.user.username,
      name,
      adminIds: [this.user.username]
    }).subscribe({
      next: () => {
        this.newGroupName = '';
        this.groupSuccess = 'Group created successfully!';
        this.ngOnInit();
      },
      error: (err: any) => {
        this.groupError = err.error?.error || 'Error creating group.';
      }
    });
  }

  // Sets up Router for navigation and LocalStorageService for data access
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private http: HttpClient
  ) {}

  // Runs when the component loads. Checks if user is logged in, loads groups and channels for the user.
  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userStr);
    // Fetch groups and channels from backend
    this.http.get<Group[]>('/api/groups').subscribe(allGroups => {
      this.groups = allGroups.filter(g => g.memberIds.includes(this.user.username));
      this.http.get<Channel[]>('/api/channels').subscribe(allChannels => {
        this.channelsByGroup = {};
        for (const group of this.groups) {
          this.channelsByGroup[group.id] = allChannels.filter(c => c.groupId === group.id);
        }
      });
    });
  }

  // Creates a new channel in the specified group. Checks for valid name and duplicates, then adds the channel.
  createChannel(groupId: string) {
    this.channelError = '';
    const name = this.newChannelName.trim();
    if (!name) {
      this.channelError = 'Channel name required.';
      return;
    }
    // Check for duplicate name in group (from backend channels)
    this.http.get<Channel[]>('/api/channels').subscribe(allChannels => {
      if (allChannels.filter(c => c.groupId === groupId).some(c => c.name === name)) {
        this.channelError = 'Channel name already exists.';
        return;
      }
      // Send create request to backend
      this.http.post('/api/channels', {
        requester: this.user.username,
        groupId,
        name
      }).subscribe({
        next: () => {
          this.newChannelName = '';
          this.ngOnInit();
        },
        error: err => {
          this.channelError = err.error?.error || 'Error creating channel.';
        }
      });
    });
  }
}
