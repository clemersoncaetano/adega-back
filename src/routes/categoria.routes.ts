import { Router } from "express";
import {
  criarCategoria,listarCategorias} from "../models/categoria.model";

const router = Router();

// GET categorias
router.get("/", async (req, res) => {
  const categorias = await listarCategorias();
  res.json(categorias);
});

// POST categoria
router.post("/", async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ error: "Nome é obrigatório" });
  }

  const id = await criarCategoria(nome);

  res.status(201).json({
    id,
    nome
  });
});

export default router;