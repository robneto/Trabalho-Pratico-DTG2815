import Link from 'next/link'; // Usamos o componente Link do Next.js para navegação

export default function HomePage() {
  return (
    <main className="container mt-4">
      <h1>Catálogo de Livros</h1>
      <p>Navegue pelas opções:</p>
      
      <div className="list-group" style={{ maxWidth: '400px' }}>
        <Link href="/pages/LivroLista" className="list-group-item list-group-item-action">
          Listar Livros (Página Atual)
        </Link>
        <Link href="/pages/EditoraLista" className="list-group-item list-group-item-action">
          Listar Editoras
        </Link>
      </div>
    </main>
  );
}