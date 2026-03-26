"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const drink_model_1 = require("../models/drink.model");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    try {
        const { categoria_id } = req.query;
        const categoriaId = categoria_id ? Number(categoria_id) : undefined;
        if (categoria_id && Number.isNaN(categoriaId)) {
            return res.status(400).json({ erro: "categoria_id invalido" });
        }
        const drinks = categoriaId !== undefined
            ? await (0, drink_model_1.listarDrinksPorCategoria)(categoriaId)
            : await (0, drink_model_1.listarDrinks)();
        res.json(drinks);
    }
    catch (error) {
        console.error("Erro ao listar drinks:", error);
        res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
    }
});
router.post("/", async (req, res) => {
    try {
        const id = await (0, drink_model_1.criarDrink)(req.body);
        res.status(201).json({ id });
    }
    catch (error) {
        console.error("Erro ao criar drink:", error);
        res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        await (0, drink_model_1.atualizarDrink)(Number(req.params.id), req.body);
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Erro ao atualizar drink:", error);
        res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await (0, drink_model_1.deletarDrink)(Number(req.params.id));
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Erro ao deletar drink:", error);
        res.status(503).json({ erro: "Nao foi possivel conectar ao banco de dados" });
    }
});
exports.default = router;
