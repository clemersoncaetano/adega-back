import { Router } from "express";
import { listarDrinks } from "../models/drink.model";

interface CarrinhoItem {
  drinkId: string;
  quantidade: number;
}

const carrinho: CarrinhoItem[] = [];
const router = Router();

async function montarCarrinho() {
  const drinks = (await listarDrinks()) as any[];

  const itens = carrinho
    .map((item) => {
      const drink = drinks.find((d) => d.id === Number(item.drinkId));

      if (!drink) return null;

      const subtotal = Number((drink.preco * item.quantidade).toFixed(2));

      return {
        id: drink.id,
        nome: drink.nome,
        preco: drink.preco,
        quantidade: item.quantidade,
        subtotal,
      };
    })
    .filter(Boolean);

  const total = Number(
    itens
      .reduce((acc, item: any) => acc + item.subtotal, 0)
      .toFixed(2)
  );

  return { itens, total };
}

router.get("/carrinho", async (_req, res) => {
  try {
    const carrinhoMontado = await montarCarrinho();
    res.json(carrinhoMontado);
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.post("/carrinho/itens", async (req, res) => {
  try {
    const { drinkId, quantidade = 1 } = req.body;

    if (!drinkId || typeof drinkId !== "string") {
      return res.status(400).json({ erro: "drinkId e obrigatorio" });
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({ erro: "quantidade invalida" });
    }

    const drinks = (await listarDrinks()) as any[];
    const drink = drinks.find((d) => d.id === Number(drinkId));

    if (!drink) {
      return res.status(404).json({ erro: "Drink nao encontrado" });
    }

    const itemExistente = carrinho.find((item) => item.drinkId === drinkId);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      carrinho.push({ drinkId, quantidade });
    }

    const carrinhoMontado = await montarCarrinho();
    res.status(201).json(carrinhoMontado);
  } catch (error) {
    console.error("Erro ao adicionar item no carrinho:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.patch("/carrinho/itens/:drinkId", async (req, res) => {
  try {
    const { drinkId } = req.params;
    const { quantidade } = req.body;

    if (!Number.isInteger(quantidade) || quantidade < 0) {
      return res.status(400).json({ erro: "quantidade invalida" });
    }

    const index = carrinho.findIndex((item) => item.drinkId === drinkId);

    if (index === -1) {
      return res.status(404).json({ erro: "Item nao encontrado" });
    }

    if (quantidade === 0) {
      carrinho.splice(index, 1);
    } else {
      carrinho[index].quantidade = quantidade;
    }

    const carrinhoMontado = await montarCarrinho();
    res.json(carrinhoMontado);
  } catch (error) {
    console.error("Erro ao atualizar item do carrinho:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.delete("/carrinho/itens/:drinkId", async (req, res) => {
  try {
    const { drinkId } = req.params;

    const index = carrinho.findIndex((item) => item.drinkId === drinkId);

    if (index === -1) {
      return res.status(404).json({ erro: "Item nao encontrado" });
    }

    carrinho.splice(index, 1);

    const carrinhoMontado = await montarCarrinho();
    res.json(carrinhoMontado);
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.delete("/carrinho", (_req, res) => {
  carrinho.length = 0;
  res.sendStatus(204);
});

export default router;
