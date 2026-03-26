"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarDrink = criarDrink;
exports.listarDrinks = listarDrinks;
exports.listarDrinksPorCategoria = listarDrinksPorCategoria;
exports.atualizarDrink = atualizarDrink;
exports.deletarDrink = deletarDrink;
const data_source_1 = require("../database/data-source");
async function criarDrink(dados) {
    const db = await (0, data_source_1.connectDB)();
    const [cat] = await db.query("SELECT id FROM categorias WHERE id = ?", [dados.categoria_id]);
    if (cat.length === 0) {
        throw new Error("Categoria inválida");
    }
    const [result] = await db.query(`
    INSERT INTO drinks
    (nome, descricao, preco, imagem, categoria_id)
    VALUES (?, ?, ?, ?, ?)
    `, [
        dados.nome,
        dados.descricao,
        dados.preco,
        dados.imagem,
        dados.categoria_id,
    ]);
    return result.insertId;
}
async function listarDrinks() {
    const db = await (0, data_source_1.connectDB)();
    const [rows] = await db.query("SELECT * FROM drinks");
    return rows;
}
async function listarDrinksPorCategoria(categoriaId) {
    const db = await (0, data_source_1.connectDB)();
    const [rows] = await db.query("SELECT * FROM drinks WHERE categoria_id = ?", [categoriaId]);
    return rows;
}
async function atualizarDrink(id, drink) {
    const db = await (0, data_source_1.connectDB)();
    await db.query(`UPDATE drinks SET
      nome = ?,
      descricao = ?,
      preco = ?,
      imagem = ?,
      categoria_id = ?
     WHERE id = ?`, [
        drink.nome,
        drink.descricao,
        drink.preco,
        drink.imagem,
        drink.categoria_id,
        id
    ]);
}
async function deletarDrink(id) {
    const db = await (0, data_source_1.connectDB)();
    await db.query("DELETE FROM drinks WHERE id = ?", [id]);
}
