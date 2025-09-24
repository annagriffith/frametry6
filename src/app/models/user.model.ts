export interface User {
  id: string;
  username: string;
  email: string;
  role: 'superAdmin' | 'groupAdmin' | 'user';
  groups: string[];
// User model: Represents a user in the chat app
}
