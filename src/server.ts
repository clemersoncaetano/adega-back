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
import { connectDB } from "./database/data-source";

async function startServer() {
  await connectDB();

  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
  
}

startServer();


app.use("/api/categorias", categoriasRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', carrinhoRoutes);
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});



