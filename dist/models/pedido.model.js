"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarPedido = criarPedido;
exports.listarPedidos = listarPedidos;
const data_source_1 = require("../database/data-source");
async function criarPedido({ nome, email, itens, }) {
    const db = await (0, data_source_1.connectDB)();
    let total = 0;
    for (const item of itens) {
        total += item.preco * item.quantidade;
    }
    const [pedidoResult] = await db.query(`
    INSERT INTO pedidos
    (cliente_nome, cliente_email, total)
    VALUES (?, ?, ?)
    `, [nome, email, total]);
    const pedidoId = pedidoResult.insertId;
    for (const item of itens) {
        await db.query(`
      INSERT INTO pedido_itens
      (pedido_id, drink_nome, quantidade, preco_unitario)
      VALUES (?, ?, ?, ?)
      `, [pedidoId, item.nome, item.quantidade, item.preco]);
    }
    return {
        pedidoId,
        total: Number(total.toFixed(2)),
    };
}
async function listarPedidos() {
    const db = await (0, data_source_1.connectDB)();
    const [rows] = await db.query("SELECT * FROM pedidos ORDER BY criado_em DESC");
    return rows;
}
