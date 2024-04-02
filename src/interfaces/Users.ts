export default interface UserInterface {
  avatar?: string;
  bio?: string;
  created: Date;
  email: string; // unique, 255 chars max
  id: string;
  followers: string[];
  following: string[];
  lastLogin: Date;
  name: string; // 255 chars max
  username: string; // unique, between 3-20 characters
}

export interface PublicUserInfo {
  avatar?: string;
  bio?: string;
  created: Date;
  name: string;
  username: string;
  followers: string[];
  following: string[];
}
