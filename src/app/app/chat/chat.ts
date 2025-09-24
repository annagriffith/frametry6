import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Chat component for Frametry6: handles chat UI, message display, and sending messages.
// Use these comments to answer questions about how chat works in the project.

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {
  // Stores the current channel ID from the URL
  channelId: string = '';
  // Array of messages for the current channel
  messages: any[] = [];
  // The message text the user is typing
  newMessage: string = '';
  // The current logged-in user object
  user: any = null;

  // Sets up router and route for navigation and reading channel ID from URL
  constructor(private router: Router, private route: ActivatedRoute) {}

  // Runs when the component loads. Checks if user is logged in, gets channel ID from URL, and loads messages for that channel.
  ngOnInit() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userStr);
    this.route.queryParams.subscribe(params => {
      this.channelId = params['channel'] || '';
      this.loadMessages();
    });
  }

  // Loads all messages for the current channel from localStorage and updates the messages array.
  loadMessages() {
    if (!this.channelId) return;
    const key = `messages-${this.channelId}`;
    const msgs = localStorage.getItem(key);
    this.messages = msgs ? JSON.parse(msgs) : [];
  }

  // Adds a new message to the messages array and saves it to localStorage. Called when the user sends a message.
  sendMessage() {
    if (!this.newMessage.trim()) return;
    const key = `messages-${this.channelId}`;
    const msg = {
      user: this.user.username,
      text: this.newMessage,
      time: new Date().toLocaleString()
    };
    this.messages.push(msg);
    localStorage.setItem(key, JSON.stringify(this.messages));
    this.newMessage = '';
  }
}
