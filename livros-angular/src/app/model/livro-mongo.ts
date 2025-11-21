export interface LivroMongo {
  _id: string | null;
  codEditora: number;
  titulo: string;
  resumo: string;
  autores: string[];
}

export const baseURL = "http://localhost:3030/livros";