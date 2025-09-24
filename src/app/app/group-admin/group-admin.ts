import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// GroupAdmin component for Frametry6: lets group admins manage groups, channels, and members.
// Use these comments to answer questions about how group/channel management works in the project.

@Component({
  selector: 'app-group-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-admin.html',
  styleUrls: ['./group-admin.css']
})
export class GroupAdmin implements OnInit {
  // Array of groups the current user can manage
  groups: any[] = [];
  // Array of all users in the system
  users: any[] = [];
  // Array of channels in the selected group
  channels: any[] = [];
  // The current logged-in user object
  currentUser: any = null;
  // ID of the currently selected group
  selectedGroupId: string = '';
  // Name for creating a new group
  newGroupName: string = '';
  // Name for creating a new channel
  newChannelName: string = '';
  // Username to add as a member to a group
  memberToAdd: string = '';
  // Error message to display in the UI
  error: string = '';
  // Success message to display in the UI
  success: string = '';

  // Loads the current user from localStorage
  constructor(private http: HttpClient) {
    const userStr = localStorage.getItem('currentUser');
    this.currentUser = userStr ? JSON.parse(userStr) : null;
  }

  // Runs when the component loads. Loads users and groups for the current user.
  ngOnInit() {
    this.loadUsers();
    this.loadGroups();
  }

  // Loads all users from the backend and updates the users array.
  loadUsers() {
    this.http.get<any[]>('/api/users').subscribe(users => {
      this.users = users;
    });
  }

  // Loads groups where the current user is owner or admin
  loadGroups() {
    this.http.get<any[]>('/api/groups').subscribe(groups => {
      this.groups = groups.filter(g => g.ownerId === this.currentUser.username || g.adminIds.includes(this.currentUser.username));
    });
  }

  // Selects a group and loads its channels
  selectGroup(groupId: string) {
    this.selectedGroupId = groupId;
    this.loadChannels(groupId);
  }

  // Loads channels for the selected group from the backend
  loadChannels(groupId: string) {
    this.http.get<any[]>(`/api/channels?groupId=${groupId}`).subscribe(channels => {
      this.channels = channels;
    });
  }

  // Creates a new group with the current user as owner and admin
  createGroup() {
    if (!this.newGroupName.trim()) {
      this.error = 'Group name required.';
      this.success = '';
      return;
    }
    this.http.post('/api/groups', {
      requester: this.currentUser.username,
      name: this.newGroupName,
      adminIds: [this.currentUser.username]
    }).subscribe({
      next: () => {
        this.newGroupName = '';
        this.error = '';
        this.success = 'Group created successfully!';
        this.loadGroups();
      },
      error: err => {
        alert(err.error?.error || 'Error creating group.');
        this.error = err.error?.error || 'Error creating group.';
        this.success = '';
      }
    });
  }

  // Creates a new channel in the selected group
  createChannel() {
    if (!this.newChannelName.trim() || !this.selectedGroupId) {
      this.error = 'Channel name and group required.';
      this.success = '';
      return;
    }
    const id = 'c-' + Math.random().toString(36).substring(2, 8);
    this.http.post('/api/channels', {
      id,
      groupId: this.selectedGroupId,
      name: this.newChannelName,
      memberUsernames: [this.currentUser.username]
    }).subscribe({
      next: () => {
        this.newChannelName = '';
        this.error = '';
        this.success = 'Channel created successfully!';
        this.loadChannels(this.selectedGroupId);
      },
      error: err => {
        alert(err.error?.error || 'Error creating channel.');
        this.error = err.error?.error || 'Error creating channel.';
        this.success = '';
      }
    });
  }

  // Adds a member to the selected group
  addMember() {
    if (!this.memberToAdd.trim() || !this.selectedGroupId) {
      this.error = 'Member and group required.';
      return;
    }
    this.http.patch(`/api/groups/${this.selectedGroupId}/members`, { add: this.memberToAdd }).subscribe({
      next: () => {
        this.memberToAdd = '';
        this.error = '';
        this.loadGroups();
      },
      error: err => {
        this.error = err.error?.error || 'Error adding member.';
      }
    });
  }

  // Removes a member from the selected group
  removeMember(username: string) {
    if (!this.selectedGroupId) return;
    this.http.patch(`/api/groups/${this.selectedGroupId}/members`, { remove: username }).subscribe(() => {
      this.loadGroups();
    });
  }

  // Deletes a channel from the backend and reloads channels
  deleteChannel(channelId: string) {
    this.http.delete(`/api/channels/${channelId}`).subscribe(() => {
      this.loadChannels(this.selectedGroupId);
    });
  }

  // Deletes a group from the backend and reloads groups
  deleteGroup(groupId: string) {
    this.http.delete(`/api/groups/${groupId}`).subscribe(() => {
      this.selectedGroupId = '';
      this.loadGroups();
      this.channels = [];
    });
  }
}
