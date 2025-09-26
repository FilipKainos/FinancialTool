import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

/**
 * Database connection configuration and utilities
 * Provides a robust, reusable database connection manager for SQLite
 */

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database | null = null;
  private readonly dbPath: string;

  private constructor() {
    // Set database path relative to the project root
    this.dbPath = path.join(process.cwd(), 'database', 'financial_tool.db');
  }

  /**
   * Get singleton instance of DatabaseManager
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Initialize database connection and create tables if they don't exist
   */
  public async initialize(): Promise<void> {
    try {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Open database connection
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      // Enable foreign key constraints
      await this.db.exec('PRAGMA foreign_keys = ON;');

      // Create tables from schema file
      await this.createTables();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  /**
   * Create database tables from schema file
   */
  private async createTables(): Promise<void> {
    try {
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await this.db!.exec(schema);
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw new Error('Table creation failed');
    }
  }

  /**
   * Get database connection instance
   */
  public getConnection(): Database {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Execute a query with parameters
   */
  public async query(sql: string, params?: any[]): Promise<any[]> {
    try {
      const db = this.getConnection();
      return await db.all(sql, params);
    } catch (error) {
      console.error('Query failed:', error);
      throw new Error(`Database query failed: ${error}`);
    }
  }

  /**
   * Execute a single row query
   */
  public async queryOne(sql: string, params?: any[]): Promise<any> {
    try {
      const db = this.getConnection();
      return await db.get(sql, params);
    } catch (error) {
      console.error('Query failed:', error);
      throw new Error(`Database query failed: ${error}`);
    }
  }

  /**
   * Execute an insert, update, or delete query
   */
  public async execute(sql: string, params?: any[]): Promise<{ lastID?: number; changes: number }> {
    try {
      const db = this.getConnection();
      return await db.run(sql, params);
    } catch (error) {
      console.error('Execute failed:', error);
      throw new Error(`Database execute failed: ${error}`);
    }
  }

  /**
   * Begin a transaction
   */
  public async beginTransaction(): Promise<void> {
    await this.execute('BEGIN TRANSACTION');
  }

  /**
   * Commit a transaction
   */
  public async commit(): Promise<void> {
    await this.execute('COMMIT');
  }

  /**
   * Rollback a transaction
   */
  public async rollback(): Promise<void> {
    await this.execute('ROLLBACK');
  }

  /**
   * Close database connection
   */
  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();