"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const express_1 = require("express");
const mercadopago_1 = require("mercadopago");
const mercadopago_2 = require("../config/mercadopago");
const drink_model_1 = require("../models/drink.model");
const pedido_model_1 = require("../models/pedido.model");
const router = (0, express_1.Router)();
function normalizarItensPedido(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
        throw new Error("Itens invalidos");
    }
    return itens.map((item) => {
        if (typeof item !== "object" || item === null) {
            throw new Error("Item invalido");
        }
        const checkoutItem = item;
        const drinkId = checkoutItem.drinkId ?? checkoutItem.id;
        if (!drinkId || !Number.isInteger(Number(drinkId))) {
            throw new Error("drinkId invalido");
        }
        if (!Number.isInteger(checkoutItem.quantidade) ||
            checkoutItem.quantidade <= 0) {
            throw new Error("quantidade invalida");
        }
        return {
            id: Number(drinkId),
            quantidade: checkoutItem.quantidade,
        };
    });
}
function montarBackUrls() {
    const success = process.env.MP_SUCCESS_URL;
    const pending = process.env.MP_PENDING_URL;
    const failure = process.env.MP_FAILURE_URL;
    if (!success && !pending && !failure) {
        return undefined;
    }
    return {
        success,
        pending,
        failure,
    };
}
router.post("/pagamentos/preferencia", async (req, res) => {
    try {
        const { nome, email, itens } = req.body;
        if (!nome || !email) {
            return res.status(400).json({ erro: "nome e email sao obrigatorios" });
        }
        const itensNormalizados = normalizarItensPedido(itens);
        const drinks = (await (0, drink_model_1.listarDrinks)());
        const itensPedido = [];
        const itensMercadoPago = itensNormalizados.map((item) => {
            const drink = drinks.find((drinkAtual) => drinkAtual.id === item.id);
            if (!drink) {
                throw new Error(`Drink ${item.id} nao encontrado`);
            }
            const preco = Number(drink.preco);
            itensPedido.push({
                nome: drink.nome,
                quantidade: item.quantidade,
                preco,
            });
            return {
                id: String(drink.id),
                title: drink.nome,
                description: drink.descricao || undefined,
                picture_url: drink.imagem || undefined,
                category_id: drink.categoria_id ? String(drink.categoria_id) : undefined,
                quantity: item.quantidade,
                currency_id: "BRL",
                unit_price: preco,
            };
        });
        const client = (0, mercadopago_2.getMercadoPagoClient)();
        const preference = new mercadopago_1.Preference(client);
        const externalReference = `pedido-${(0, crypto_1.randomUUID)()}`;
        const notificationUrl = process.env.MP_NOTIFICATION_URL;
        const backUrls = montarBackUrls();
        const preferenceResponse = await preference.create({
            body: {
                items: itensMercadoPago,
                payer: {
                    name: nome,
                    email,
                },
                external_reference: externalReference,
                notification_url: notificationUrl,
                back_urls: backUrls,
                auto_return: backUrls?.success ? "approved" : undefined,
            },
            requestOptions: {
                idempotencyKey: (0, crypto_1.randomUUID)(),
            },
        });
        const { pedidoId, total } = await (0, pedido_model_1.criarPedido)({
            nome,
            email,
            itens: itensPedido,
        });
        res.status(201).json({
            pedidoId,
            total,
            preferenceId: preferenceResponse.id,
            initPoint: preferenceResponse.init_point,
            sandboxInitPoint: preferenceResponse.sandbox_init_point,
            externalReference,
        });
    }
    catch (error) {
        console.error("Erro ao criar preferencia de pagamento:", error);
        const message = error instanceof Error ? error.message : "Erro ao iniciar pagamento";
        const statusCode = message === "MP_ACCESS_TOKEN nao configurado"
            ? 503
            : message.includes("inval")
                ? 400
                : message.includes("nao encontrado")
                    ? 404
                    : 500;
        res.status(statusCode).json({ erro: message });
    }
});
router.post("/pagamentos/webhook", async (req, res) => {
    try {
        const topic = String(req.query.topic || req.body?.type || "");
        const paymentId = req.query["data.id"] ||
            req.body?.data?.id ||
            req.body?.resource?.id ||
            req.body?.id;
        if (topic !== "payment" || !paymentId) {
            return res.status(200).json({ recebido: true });
        }
        const client = (0, mercadopago_2.getMercadoPagoClient)();
        const payment = new mercadopago_1.Payment(client);
        const paymentResponse = await payment.get({ id: String(paymentId) });
        console.log("Pagamento recebido no webhook:", {
            id: paymentResponse.id,
            status: paymentResponse.status,
            externalReference: paymentResponse.external_reference,
        });
        res.status(200).json({
            recebido: true,
            paymentId: paymentResponse.id,
            status: paymentResponse.status,
        });
    }
    catch (error) {
        console.error("Erro ao processar webhook de pagamento:", error);
        res.status(500).json({ erro: "Erro ao processar webhook" });
    }
});
exports.default = router;
