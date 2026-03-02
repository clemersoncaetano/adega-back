import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB(): Promise<Connection> {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  return db;
}