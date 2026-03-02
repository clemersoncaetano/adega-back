import { Router } from "express";
import { categorias, categoria } from "../data/categoria";

const router = Router();


router.get("/", (req, res) => {
  res.json(categorias);
});


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
    nome: String(nome) 
  };

  categorias.push(novaCategoria);

  res.status(201).json(novaCategoria); 
});

export default router;
