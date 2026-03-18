import { Router } from "express";
import { listarCategorias } from "../models/categoria.model";

const router = Router();


router.get("/categorias", async (req, res) => {
  const categorias = await listarCategorias();
  res.json(categorias);
});


router.post("/categorias", async (req, res) => {
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

function criarCategoria(nome: any) {
  throw new Error("Function not implemented.");
}
