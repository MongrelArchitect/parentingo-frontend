import GroupInterface from "./Groups";

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

