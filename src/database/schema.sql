CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_nome VARCHAR(120) NOT NULL,
  cliente_email VARCHAR(160) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  drink_nome VARCHAR(120) NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario NUMERIC(10,2) NOT NULL
);
CREATE TABLE drinks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem VARCHAR(255),
  categoria_id INT,

  FOREIGN KEY (categoria_id)
  REFERENCES categorias(id)
);