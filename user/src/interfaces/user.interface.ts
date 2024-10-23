
export interface IUser {
  id?: string;
  email: string;
  password: string;
  is_confirmed: boolean;
  compareEncryptedPassword: (password: string) => boolean;
  getEncryptedPassword: (password: string) => string;
}
