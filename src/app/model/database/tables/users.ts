import { UserWithToken } from '../../types';

export const UserTableName = 'users';

export interface UserTable {
  id: string;
  name: string;
  token: string;
  is_admin: boolean;
  created_at: string;
}

export function tableToUser(user: UserTable): UserWithToken {
  const { id, name, token, is_admin, created_at } = user;

  return { id, name, token, isAdmin: is_admin, createdAt: created_at };
}
