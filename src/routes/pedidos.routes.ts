import { Payment } from 'mercadopago';
import client from '../config/mercadopago';
import { Router } from 'express';
import { db } from '../database/data-source';

const router = Router();

router.post('/pedidos', async (req, res) => {
  const { nome, email, itens } = req.body;

  try {
 
    let total = 0;

    for (const item of itens) {
      total += item.preco * item.quantidade;
    }


    const pedido = await db.query(
      `
      INSERT INTO pedidos (cliente_nome, cliente_email, total)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [nome, email, total]
    );

    const pedidoId = pedido.rows[0].id;

    for (const item of itens) {
      await db.query(
        `
        INSERT INTO pedido_itens
        (pedido_id, drink_nome, quantidade, preco_unitario)
        VALUES ($1, $2, $3, $4)
        `,
        [
          pedidoId,
          item.nome,
          item.quantidade,
          item.preco
        ]
      );
    }

    res.status(201).json({
      mensagem: 'Pedido criado com sucesso',
      pedidoId
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: 'Erro ao criar pedido'
    });
  }
});
router.get('/pedidos', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM pedidos ORDER BY criado_em DESC'
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
});

export default router;
