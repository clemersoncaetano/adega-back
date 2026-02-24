import { Router } from "express";
import { categorias, categoria } from "../data/categoria";

const router = Router();

/* Listar categorias */
router.get("/", (req, res) => {
  res.json(categorias);
});

/* Criar categoria */
router.post("/", (req, res) => {
  console.log("BODY:", req.body);

  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      erro: "Nome é obrigatório"
    });
  }

  const novaCategoria: categoria = {
    id: Date.now(),
    nome: String(nome) // garante string
  };

  categorias.push(novaCategoria);

  res.status(201).json(novaCategoria); // retorna completo
});

export default router;
