import GroupInterface from "./Groups";
import { PublicUserInfo } from "./Users";
import { PostList } from "./Posts";

export default interface Response {
  status: number;
  message: string;
  error?: string | unknown;
  errors?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export interface GroupResponse extends Response {
  group?: GroupInterface | null;
}

export interface PostListResponse extends Response {
  posts: null | PostList;
}

export interface UserResponse extends Response {
  user: null | PublicUserInfo;
}

