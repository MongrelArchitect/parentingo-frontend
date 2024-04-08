export default interface PostInterface {
  id: string;
  author: string; // id of user
  timestamp: Date;
  text: string;
  title: string;
  group: string; // id of group
  image?: string;
  likes: string[]; // array of user ids
}

export interface PostList {
  [key: string]: PostInterface;
}

export interface NewPostForm {
  image: {
    file: null | File;
    valid: boolean;
    value: string | null;
  };
  text: {
    valid: boolean;
    value: string;
  };
  title: {
    valid: boolean;
    value: string;
  };
}
