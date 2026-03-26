"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const pedidos_routes_1 = __importDefault(require("./routes/pedidos.routes"));
const carrinho_routes_1 = __importDefault(require("./routes/carrinho.routes"));
const cors_1 = __importDefault(require("cors"));
const drink_routes_1 = __importDefault(require("./routes/drink.routes"));
const categoria_routes_1 = __importDefault(require("./routes/categoria.routes"));
const pagamento_routes_1 = __importDefault(require("./routes/pagamento.routes"));
const data_source_1 = require("./database/data-source");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
async function startServer() {
    try {
        await (0, data_source_1.testDBConnection)();
        console.log("Banco de dados conectado com sucesso");
    }
    catch (error) {
        console.error("Falha ao conectar ao banco de dados:", error);
    }
}
startServer();
app.use("/api/drinks", drink_routes_1.default);
app.use("/api", pedidos_routes_1.default);
app.use("/api", carrinho_routes_1.default);
app.use("/api", categoria_routes_1.default);
app.use("/api", pagamento_routes_1.default);
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
