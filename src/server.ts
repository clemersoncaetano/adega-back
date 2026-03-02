import express from 'express';
import dotenv from 'dotenv';
import pedidosRoutes from './routes/pedidos.routes';
import carrinhoRoutes from './routes/carrinho.routes';
import categoriasRoutes from "./routes/categoria.routes";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


// Testar conexao
import { connectDB } from "../src/database/data-source";

async function startServer() {
  await connectDB();
  
}

startServer();

app.use("/api/categorias", categoriasRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', carrinhoRoutes);
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});



