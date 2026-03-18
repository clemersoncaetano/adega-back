import express from 'express';
import dotenv from 'dotenv';
import pedidosRoutes from './routes/pedidos.routes';
import carrinhoRoutes from './routes/carrinho.routes';
import cors from "cors";
import drinkRoutes from "./routes/drink.routes";
import categoriaRoutes from "./routes/categoria.routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



import { connectDB } from "../src/database/data-source";

async function startServer() {
  await connectDB();
  
}

startServer();
app.use("/api/drinks", drinkRoutes);
app.use("/api", pedidosRoutes);
app.use("/api", carrinhoRoutes);
app.use("/api", categoriaRoutes);
app.listen(3000, () => { 
  console.log('Servidor rodando na porta 3000');
});

