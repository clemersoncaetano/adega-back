import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

export async function connectDB() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      port: Number(process.env.DB_PORT)|| 3306,

      // ✅ SSL (OBRIGATÓRIO NO ALWAYS)
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log("✅ Banco conectado com sucesso!");
    return db;

  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    throw error;
  }
}