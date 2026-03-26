"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMercadoPagoClient = getMercadoPagoClient;
const mercadopago_1 = require("mercadopago");
function getMercadoPagoClient() {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error("MP_ACCESS_TOKEN nao configurado");
    }
    return new mercadopago_1.MercadoPagoConfig({
        accessToken,
    });
}
