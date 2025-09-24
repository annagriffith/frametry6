import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { Channel } from '../models/channel.model';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  get<T>(key: string): T | undefined {
    const value = localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : undefined;
    } catch {
      return undefined;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  ensureArrays(): void {
    if (!localStorage.getItem('groups')) this.set<Group[]>('groups', []);
    if (!localStorage.getItem('channels')) this.set<Channel[]>('channels', []);
  }

  ensureSeed(): void {
    this.ensureArrays();
    const groups = this.get<Group[]>('groups');
    const channels = this.get<Channel[]>('channels');
    if (!groups || groups.length === 0) {
      const g1: Group = {
        id: 'g1',
        name: 'General',
        ownerId: 'group',
        adminIds: ['group'],
        memberIds: ['super', 'group', 'user'],
        channelIds: ['c1', 'c2']
      };
      this.set<Group[]>('groups', [g1]);
    }
    if (!channels || channels.length === 0) {
      const c1: Channel = { id: 'c1', groupId: 'g1', name: 'general-chat', memberIds: ['super', 'group', 'user'] };
      const c2: Channel = { id: 'c2', groupId: 'g1', name: 'announcements', memberIds: ['super', 'group', 'user'] };
      this.set<Channel[]>('channels', [c1, c2]);
    }
    // Initialize empty messages arrays
    if (!localStorage.getItem(this.channelKey('c1'))) this.set<Message[]>(this.channelKey('c1'), []);
    if (!localStorage.getItem(this.channelKey('c2'))) this.set<Message[]>(this.channelKey('c2'), []);
  }

  listGroupsFor(username: string): Group[] {
    const groups = this.get<Group[]>('groups') || [];
    return groups.filter(g => g.memberIds.includes(username));
  }

  listChannels(groupId: string): Channel[] {
    const channels = this.get<Channel[]>('channels') || [];
    return channels.filter(c => c.groupId === groupId);
  }

  listMessages(channelId: string): Message[] {
    return this.get<Message[]>(this.channelKey(channelId)) || [];
  }

  addMessage(channelId: string, msg: Message): void {
    const msgs = this.listMessages(channelId);
    msgs.push(msg);
    this.set<Message[]>(this.channelKey(channelId), msgs);
  }

  channelKey(channelId: string): string {
    return `messages:${channelId}`;
  }
}
