import { connectDB } from "../database/data-source";


export async function criarCategoria(nome: string) {
  const db = await connectDB();

  const [result] = await db.query(
    "INSERT INTO categorias (nome) VALUES (?)",
    [nome]
  );

  return (result as any).insertId;
}


export async function listarCategorias() {
  const db = await connectDB();

  const [rows] = await db.query("SELECT * FROM categorias");

  return rows;
} 