import { Router } from "express";
import { criarPedido, listarPedidos } from "../models/pedido.model";

const router = Router();

router.post("/pedidos", async (req, res) => {

  const { nome, email, itens } = req.body;

  if (!nome || !email || !Array.isArray(itens)) {
    return res.status(400).json({
      erro: "Dados inválidos",
    });
  }

  try {
    const { pedidoId } = await criarPedido({ nome, email, itens });

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
    const rows = await listarPedidos();
    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao buscar pedidos",
    });
  }
});

export default router;
