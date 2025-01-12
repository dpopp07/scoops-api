export interface UserPrototype {
  name: string;
  isAdmin: boolean;
}

export interface User extends UserPrototype {
  id: string;
}

export interface UserWithToken extends User {
  token: string;
}
