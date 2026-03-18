import { connectDB } from "../database/data-source";

export interface Drink {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string;
  categoria_id: number;
}


export async function criarDrink(dados: any) {

  const db = await connectDB();

  const [cat]: any = await db.query(
    "SELECT id FROM categorias WHERE id = ?",
    [dados.categoria_id]
  );

  if (cat.length === 0) {
    throw new Error("Categoria inválida");
  }

 
  const [result]: any = await db.query(
    `
    INSERT INTO drinks
    (nome, descricao, preco, imagem, categoria_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      dados.nome,
      dados.descricao,
      dados.preco,
      dados.imagem,
      dados.categoria_id,
    ]
  );

  return result.insertId;
}
export async function listarDrinks() {
  const db = await connectDB();

  const [rows] = await db.query("SELECT * FROM drinks");

  return rows;
}


export async function atualizarDrink(id: number, drink: Drink) {
  const db = await connectDB();

  await db.query(
    `UPDATE drinks SET
      nome = ?,
      descricao = ?,
      preco = ?,
      imagem = ?,
      categoria_id = ?
     WHERE id = ?`,
    [
      drink.nome,
      drink.descricao,
      drink.preco,
      drink.imagem,
      drink.categoria_id,
      id
    ]
  );
}


export async function deletarDrink(id: number) {
  const db = await connectDB();

  await db.query("DELETE FROM drinks WHERE id = ?", [id]);
}