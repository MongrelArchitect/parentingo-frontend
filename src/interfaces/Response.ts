export default interface Response {
  status: number;
  message: string;
  error?: string;
  errors?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}
