import { readFileSync } from 'fs';
import pg from 'pg';

import { DatabaseError } from '../../errors/database-error';
import { config, getLogger } from '../../utils';

const { Pool } = pg;
const pool = new Pool({
  database: config.DB_NAME,
  port: config.DB_PORT,
  host: config.DB_HOST,
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  ssl: config.DB_CERT_FILE
    ? {
        ca: readFileSync(config.DB_CERT_FILE).toString(),
      }
    : undefined,
});

// The pg module relies on "any" types for queries, both their params and the
// data returned for them. Use this "type" as a utility to avoid repeated overrides.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export type QueryParams = Any[];

type QueryFunc = (
  text: string,
  params?: QueryParams,
) => Promise<pg.QueryResult<Any>>;

export interface Queryable {
  query: QueryFunc;
}

export async function query(
  text: string,
  params: QueryParams,
  client: Queryable = pool,
) {
  const logger = getLogger({
    layer: 'database',
    function: 'query',
    query: text,
  });

  let result: pg.QueryResult<Any>;

  try {
    logger.trace('Executing query...');
    // TODO: consider enabling logging for the operation here.
    // It might be useful to know the details around the row count, etc.
    result = await client.query(text, params);
  } catch (err) {
    // TODO: check out DatabaseError type from pg, see if there's any useful
    // data to be parsed from it.
    logger.error(err, 'Failed to perform query against database');
    throw new DatabaseError();
  }

  logger.trace('Successfully executed query');
  return result;
}

type TransactionCallback = (client: pg.PoolClient) => Promise<void>;
export async function transaction(cb: TransactionCallback) {
  const logger = getLogger({
    layer: 'database',
    function: 'transaction',
  });

  logger.trace('Connecting to client instance within pool...');
  const client = await pool.connect();

  try {
    logger.trace('Beginning transaction...');
    await client.query('BEGIN');

    // Execute the queries within the callback.
    logger.trace('Executing queries...');
    await cb(client);

    logger.trace('Committing transaction queries...');
    await client.query('COMMIT');
    logger.trace('Successfully committed all transaction queries');
  } catch (err) {
    logger.error(err, 'Failed to perform transaction against database');
    logger.trace('Rolling back changes...');
    await client.query('ROLLBACK');
    logger.trace('Successfully rolled back all changes');
    throw err instanceof DatabaseError ? err : new DatabaseError();
  } finally {
    logger.trace('Releasing client back to pool');
    client.release();
  }
}
