import GroupInterface from "./Groups";
import { PublicUserInfo } from "./Users";

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

export interface UserResponse extends Response {
  user: null | PublicUserInfo;
}

