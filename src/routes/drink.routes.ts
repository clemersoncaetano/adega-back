import { Router } from "express";
import {
  criarDrink,
  listarDrinks,
  atualizarDrink,
  deletarDrink
} from "../models/drink.model";

const router = Router();

/* LISTAR */
router.get("/", async (req, res) => {
  const drinks = await listarDrinks();
  res.json(drinks);
});

/* CRIAR */
router.post("/", async (req, res) => {
  const id = await criarDrink(req.body);
  res.status(201).json({ id });
});

/* ATUALIZAR */
router.put("/:id", async (req, res) => {
  await atualizarDrink(Number(req.params.id), req.body);
  res.sendStatus(204);
});

/* DELETAR */
router.delete("/:id", async (req, res) => {
  await deletarDrink(Number(req.params.id));
  res.sendStatus(204);
});

export default router;