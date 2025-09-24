export interface Group {
  id: string;
  name: string;
  ownerId: string;
  adminIds: string[];
  memberIds: string[];
  channelIds: string[];
}
