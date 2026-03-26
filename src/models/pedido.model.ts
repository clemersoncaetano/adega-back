import { connectDB } from "../database/data-source";

export interface PedidoItemInput {
  nome: string;
  quantidade: number;
  preco: number;
}

interface CriarPedidoInput {
  nome: string;
  email: string;
  itens: PedidoItemInput[];
}

export async function criarPedido({
  nome,
  email,
  itens,
}: CriarPedidoInput) {
  const db = await connectDB();

  let total = 0;

  for (const item of itens) {
    total += item.preco * item.quantidade;
  }

  const [pedidoResult]: any = await db.query(
    `
    INSERT INTO pedidos
    (cliente_nome, cliente_email, total)
    VALUES (?, ?, ?)
    `,
    [nome, email, total]
  );

  const pedidoId = pedidoResult.insertId;

  for (const item of itens) {
    await db.query(
      `
      INSERT INTO pedido_itens
      (pedido_id, drink_nome, quantidade, preco_unitario)
      VALUES (?, ?, ?, ?)
      `,
      [pedidoId, item.nome, item.quantidade, item.preco]
    );
  }

  return {
    pedidoId,
    total: Number(total.toFixed(2)),
  };
}

export async function listarPedidos() {
  const db = await connectDB();

  const [rows] = await db.query(
    "SELECT * FROM pedidos ORDER BY criado_em DESC"
  );

  return rows;
}
