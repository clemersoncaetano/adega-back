import { Router } from "express";
import {
  criarDrink,
  listarDrinks,
  listarDrinksPorCategoria,
  atualizarDrink,
  deletarDrink,
} from "../models/drink.model";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { categoria_id } = req.query;
    const categoriaId = categoria_id ? Number(categoria_id) : undefined;

    if (categoria_id && Number.isNaN(categoriaId)) {
      return res.status(400).json({ erro: "categoria_id invalido" });
    }

    const drinks = categoriaId !== undefined
      ? await listarDrinksPorCategoria(categoriaId)
      : await listarDrinks();

    res.json(drinks);
  } catch (error) {
    console.error("Erro ao listar drinks:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.post("/", async (req, res) => {
  try {
    const id = await criarDrink(req.body);
    res.status(201).json({ id });
  } catch (error) {
    console.error("Erro ao criar drink:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await atualizarDrink(Number(req.params.id), req.body);
    res.sendStatus(204);
  } catch (error) {
    console.error("Erro ao atualizar drink:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deletarDrink(Number(req.params.id));
    res.sendStatus(204);
  } catch (error) {
    console.error("Erro ao deletar drink:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

export default router;
