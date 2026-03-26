import { Router } from "express";
import {
  criarCategoria,
  listarCategorias,
} from "../models/categoria.model";
import { listarDrinksPorCategoria } from "../models/drink.model";

const router = Router();

router.get("/categorias", async (_req, res) => {
  try {
    const categorias = await listarCategorias();
    res.json(categorias);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.get("/categorias/:id/drinks", async (req, res) => {
  try {
    const categoriaId = Number(req.params.id);

    if (Number.isNaN(categoriaId)) {
      return res.status(400).json({ erro: "Id da categoria invalido" });
    }

    const drinks = await listarDrinksPorCategoria(categoriaId);
    res.json(drinks);
  } catch (error) {
    console.error("Erro ao listar drinks da categoria:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

router.post("/categorias", async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "Nome e obrigatorio" });
    }

    const id = await criarCategoria(nome);

    res.status(201).json({
      id,
      nome,
    });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
  }
});

export default router;
