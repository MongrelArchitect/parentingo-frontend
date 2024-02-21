export default interface UserInterface {
  avatar?: string;
  email: string; // unique, 255 chars max
  followers: string[];
  following: string[];
  lastLogin: Date;
  name: string; // 255 chars max
  username: string; // unique, between 3-20 characters
}
