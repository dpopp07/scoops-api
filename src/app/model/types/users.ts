export interface UserPrototype {
  name: string;
  isAdmin: boolean;
}

export interface User extends UserPrototype {
  id: string;
  createdAt: string;
}

export interface UserWithToken extends User {
  token: string;
}
