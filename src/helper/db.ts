import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const executeQuery = async (
  query: string,
  params: any[] = []
): Promise<any[]> => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Database query failed : ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

export const closePool = async () => {
  try {
    await pool.end();
    console.log("Database pool - status closed");
  } catch (error: any) {
    console.error("Error in closing pool - status failed ", error.message);
  }
};
