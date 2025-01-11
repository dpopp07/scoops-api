import pg from 'pg';

// TODO: hardcoding values for now, need
// to add some kind of congiguration.
const { Pool } = pg; 
const pool = new Pool({
  // user: 'dbuser',
  // password: 'secretpassword',
  // host: 'database.server.com',
  port: 5432,
  database: 'scoopsdb',
});
 
export const query = async (text, params) => {
  // TODO: consider enabling logging here.
  return await pool.query(text, params);
}
