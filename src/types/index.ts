export interface Drink {
  id: string;
  nome: string;
  preco: number;
  descricao: string;
}

export interface ItemPedido {
  id: string;
  quantidade: number;
}

export type FormaPagamento = "pix" | "credito" | "debito" | "dinheiro";

export type StatusPagamento = "pendente" | "aprovado" | "recusado" | "cancelado";

export interface PagamentoPedido {
  forma: FormaPagamento;
  status: StatusPagamento;
  valor: number;
  trocoPara?: number;
  codigoPix?: string;
  transacaoId?: string;
}

export interface Pedido {
  id: string;
  itens: ItemPedido[];
  pagamento: PagamentoPedido;
  total: number;
  status: string;
  criadoEm: Date;
}
