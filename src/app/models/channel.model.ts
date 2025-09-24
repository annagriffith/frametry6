export interface Channel {
  id: string;
// Channel model: Represents a chat channel within a group
  groupId: string;
  name: string;
  memberIds: string[];
}
