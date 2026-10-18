import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
  ssl?: {
    rejectUnauthorized: boolean;
  };
  connectionLimit?: number;
  connectTimeout?: number;
}

let pool: mysql.Pool | null = null;
let isConnected = false;
let lastCheckTime = 0;
let connectionError: string | null = null;

export function getDatabaseConfig(): DatabaseConfig {
  const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10);
  const user = process.env.DB_USER || process.env.MYSQL_USER || '';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'u157314465_DEYSLA';
  const useSsl = process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true';
  // Allow configurable CA verification for managed hosting providers (default: true for secure transport)
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

  return {
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 10,
    connectTimeout: 5000,
    ...(useSsl ? { ssl: { rejectUnauthorized } } : {}),
  };
}

export function isMysqlConfigured(): boolean {
  const config = getDatabaseConfig();
  return Boolean(config.user && config.database);
}

export async function getMysqlPool(): Promise<mysql.Pool | null> {
  if (pool) return pool;

  if (!isMysqlConfigured()) {
    connectionError = 'Database credentials not configured in environment (DB_USER, DB_NAME required).';
    return null;
  }

  const config = getDatabaseConfig();

  try {
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: config.ssl,
      waitForConnections: true,
      connectionLimit: config.connectionLimit || 10,
      queueLimit: 0,
      connectTimeout: config.connectTimeout || 5000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });

    return pool;
  } catch (err: any) {
    connectionError = err?.message || 'Failed to initialize MySQL pool';
    console.warn(`[DEYSLA MySQL Pool Init Error] ${connectionError}`);
    pool = null;
    return null;
  }
}

export async function checkMysqlConnection(force = false): Promise<{ connected: boolean; error: string | null; dbName?: string }> {
  const now = Date.now();
  if (!force && lastCheckTime > 0 && now - lastCheckTime < 15000) {
    return { connected: isConnected, error: connectionError, dbName: process.env.DB_NAME || 'u157314465_DEYSLA' };
  }

  lastCheckTime = now;

  if (!isMysqlConfigured()) {
    isConnected = false;
    connectionError = 'MySQL credentials (DB_USER, DB_NAME) are not configured. Running in JSON fallback mode.';
    return { connected: false, error: connectionError };
  }

  try {
    const currentPool = await getMysqlPool();
    if (!currentPool) {
      isConnected = false;
      return { connected: false, error: connectionError || 'Could not create connection pool' };
    }

    const conn = await currentPool.getConnection();
    try {
      await conn.query('SELECT 1');
      isConnected = true;
      connectionError = null;
      return { connected: true, error: null, dbName: getDatabaseConfig().database };
    } finally {
      conn.release();
    }
  } catch (err: any) {
    isConnected = false;
    connectionError = err?.message || 'Unknown database connection error';
    return { connected: false, error: connectionError, dbName: getDatabaseConfig().database };
  }
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const currentPool = await getMysqlPool();
  if (!currentPool) {
    throw new Error('MySQL connection pool unavailable');
  }

  const [results] = await currentPool.query(sql, params);
  return results as T[];
}

export async function execute<T = any>(sql: string, params: any[] = []): Promise<T> {
  const currentPool = await getMysqlPool();
  if (!currentPool) {
    throw new Error('MySQL connection pool unavailable');
  }

  const [result] = await currentPool.execute(sql, params);
  return result as T;
}

export async function withTransaction<T>(callback: (conn: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const currentPool = await getMysqlPool();
  if (!currentPool) {
    throw new Error('MySQL connection pool unavailable');
  }

  const conn = await currentPool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
