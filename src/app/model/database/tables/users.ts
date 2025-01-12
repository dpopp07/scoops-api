import { UserWithToken } from '../../types';

export const UserTableName = 'users';

export interface UserTable {
  id: string;
  name: string;
  token: string;
  is_admin: boolean;
}

export function tableToUser(user: UserTable): UserWithToken {
  const { id, name, token, is_admin } = user;

  return { id, name, token, isAdmin: is_admin };
}
