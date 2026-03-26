import express from "express";
import dotenv from "dotenv";
import pedidosRoutes from "./routes/pedidos.routes";
import carrinhoRoutes from "./routes/carrinho.routes";
import cors from "cors";
import drinkRoutes from "./routes/drink.routes";
import categoriaRoutes from "./routes/categoria.routes";
import pagamentoRoutes from "./routes/pagamento.routes";
import { testDBConnection } from "./database/data-source";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

async function startServer() {
  try {
    await testDBConnection();
    console.log("Banco de dados conectado com sucesso");
  } catch (error) {
    console.error("Falha ao conectar ao banco de dados:", error);
  }
}

startServer();
app.use("/api/drinks", drinkRoutes);
app.use("/api", pedidosRoutes);
app.use("/api", carrinhoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", pagamentoRoutes);
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
