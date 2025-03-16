import { UserWithToken } from '../../types';
import { query, Queryable } from '../db';
import { tableToUser, UserTable, UserTableName } from '../tables/users';

export async function selectUser(
  id: string,
  client?: Queryable,
): Promise<UserWithToken | undefined> {
  const selectQuery = `
    SELECT * FROM ${UserTableName}
    WHERE id = $1
  `;

  const rows: UserTable[] = (await query(selectQuery, [id], client)).rows;
  if (!rows.length) {
    return;
  }

  return tableToUser(rows[0]);
}

export async function insertUser(user: UserWithToken, client?: Queryable) {
  const { id, name, token, isAdmin, createdAt } = user;

  const insertQuery = `
    INSERT INTO ${UserTableName} (
      id,
      name,
      token,
      is_admin,
      created_at
    ) VALUES (
      $1, $2, $3, $4, $5
    )`;

  await query(insertQuery, [id, name, token, isAdmin, createdAt], client);
}
