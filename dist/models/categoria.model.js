"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarCategoria = criarCategoria;
exports.listarCategorias = listarCategorias;
const data_source_1 = require("../database/data-source");
async function criarCategoria(nome) {
    const db = await (0, data_source_1.connectDB)();
    const [result] = await db.query("INSERT INTO categorias (nome) VALUES (?)", [nome]);
    return result.insertId;
}
async function listarCategorias() {
    const db = await (0, data_source_1.connectDB)();
    const [rows] = await db.query("SELECT * FROM categorias");
    return rows;
}
