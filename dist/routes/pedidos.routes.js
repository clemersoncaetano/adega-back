"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedido_model_1 = require("../models/pedido.model");
const router = (0, express_1.Router)();
router.post("/pedidos", async (req, res) => {
    const { nome, email, itens } = req.body;
    if (!nome || !email || !Array.isArray(itens)) {
        return res.status(400).json({
            erro: "Dados inválidos",
        });
    }
    try {
        const { pedidoId } = await (0, pedido_model_1.criarPedido)({ nome, email, itens });
        res.status(201).json({
            mensagem: "Pedido criado com sucesso",
            pedidoId,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            erro: "Erro ao criar pedido",
        });
    }
});
router.get("/pedidos", async (_req, res) => {
    try {
        const rows = await (0, pedido_model_1.listarPedidos)();
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            erro: "Erro ao buscar pedidos",
        });
    }
});
exports.default = router;
