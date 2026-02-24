import { Router } from 'express';
import { drinks } from '../data/drinks';

interface CarrinhoItem {
  drinkId: string;
  quantidade: number;
}

const carrinho: CarrinhoItem[] = [];
const router = Router();

function montarCarrinho() {
  const itens = carrinho
    .map((item) => {
      const drink = drinks.find((d) => d.id === item.drinkId);

      if (!drink) {
        return null;
      }

      const subtotal = Number((drink.preco * item.quantidade).toFixed(2));

      return {
        id: drink.id,
        nome: drink.nome,
        preco: drink.preco,
        quantidade: item.quantidade,
        subtotal,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const total = Number(
    itens
      .reduce((acumulado, item) => acumulado + item.subtotal, 0)
      .toFixed(2)
  );

  return {
    itens,
    total,
  };
}

router.get('/carrinho', (_req, res) => {
  res.json(montarCarrinho());
});

router.post('/carrinho/itens', (req, res) => {
  const { drinkId, quantidade = 1 } = req.body;

  if (!drinkId || typeof drinkId !== 'string') {
    return res.status(400).json({ erro: 'drinkId e obrigatorio' });
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return res.status(400).json({ erro: 'quantidade deve ser um inteiro maior que zero' });
  }

  const drinkExiste = drinks.some((drink) => drink.id === drinkId);

  if (!drinkExiste) {
    return res.status(404).json({ erro: 'Drink nao encontrado' });
  }

  const itemExistente = carrinho.find((item) => item.drinkId === drinkId);

  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({ drinkId, quantidade });
  }

  return res.status(201).json(montarCarrinho());
});

router.patch('/carrinho/itens/:drinkId', (req, res) => {
  const { drinkId } = req.params;
  const { quantidade } = req.body;

  if (!Number.isInteger(quantidade) || quantidade < 0) {
    return res.status(400).json({ erro: 'quantidade deve ser um inteiro maior ou igual a zero' });
  }

  const index = carrinho.findIndex((item) => item.drinkId === drinkId);

  if (index === -1) {
    return res.status(404).json({ erro: 'Item nao encontrado no carrinho' });
  }

  if (quantidade === 0) {
    carrinho.splice(index, 1);
  } else {
    carrinho[index].quantidade = quantidade;
  }

  return res.json(montarCarrinho());
});

router.delete('/carrinho/itens/:drinkId', (req, res) => {
  const { drinkId } = req.params;
  const index = carrinho.findIndex((item) => item.drinkId === drinkId);

  if (index === -1) {
    return res.status(404).json({ erro: 'Item nao encontrado no carrinho' });
  }

  carrinho.splice(index, 1);

  return res.status(204).send();
});

router.delete('/carrinho', (_req, res) => {
  carrinho.length = 0;
  return res.status(204).send();
});

export default router;
