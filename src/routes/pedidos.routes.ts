import { Router } from "express";
import { connectDB } from "../database/data-source";

const router = Router();

router.post("/pedidos", async (req, res) => {

  const { nome, email, itens } = req.body;

  if (!nome || !email || !Array.isArray(itens)) {
    return res.status(400).json({
      erro: "Dados inválidos",
    });
  }

  try {

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
        [
          pedidoId,
          item.nome,
          item.quantidade,
          item.preco,
        ]
      );
    }

    res.status(201).json({
      mensagem: "Pedido criado com sucesso",
      pedidoId,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao criar pedido",
    });
  }
});


router.get("/pedidos", async (_req, res) => {

  try {

    const db = await connectDB(); 

    const [rows] = await db.query(
      "SELECT * FROM pedidos ORDER BY criado_em DESC"
    );

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao buscar pedidos",
    });
  }
});

export default router;