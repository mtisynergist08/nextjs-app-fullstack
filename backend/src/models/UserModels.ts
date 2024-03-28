export interface UserModel {
  id?: string;
  name: string;
  email: string;
  password: string;
  confPassword: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
