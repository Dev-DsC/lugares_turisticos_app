export type UserRole = 'user' | 'admin';

export interface Usuario {
  _id: string;
  email: string;
  role: UserRole;
}
