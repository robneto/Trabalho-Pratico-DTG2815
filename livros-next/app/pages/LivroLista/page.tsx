'use client';

import React, { useState, useEffect } from 'react';
import AutoBreadcrumbs from '../../components/AutoBreadcrumbs';
import Link from 'next/link';
import ConfirmModal from '../../components/ConfirmModal';
import { useRouter } from 'next/navigation';
import ControleEditoras from '../../controle/ControleEditoras';
import ControleLivros from '../../controle/ControleLivros';
import 'bootstrap/dist/css/bootstrap.min.css';
import Editora from '../../model/Editora';
import Livro from '../../model/Livro';

const controleEditora = new ControleEditoras();
const controleLivro = new ControleLivros();

type LinhaLivroProps = {
    livro: Livro;
    obterNomeEditora: (codEditora: number) => string;
    excluir: (codigo: string) => void;
};

const LinhaLivro: React.FC<LinhaLivroProps> = ({ livro, obterNomeEditora, excluir }) => {
    const router = useRouter();
    return (
        <tr>
            <td>{livro.titulo}</td>
            <td>{livro.resumo}</td>
            <td>{obterNomeEditora(livro.codEditora)}</td>
            <td>
                <ul>
                    {livro.autores.map((autor, index) => (
                        <li key={index}>{autor}</li>
                    ))}
                </ul>
            </td>
            <td className="actions-col text-end">
                <button onClick={() => router.push(`/pages/LivroDados?id=${livro.codigo}`)} className="btn btn-secondary btn-sm btn-icon me-1" title="Editar" aria-label={`Editar ${livro.titulo}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" focusable="false">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button onClick={() => excluir(livro.codigo)} className="btn btn-danger btn-sm btn-icon" aria-label={`Excluir ${livro.titulo}`} title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M3 6h18v2H3V6zm2 3h14l-1 11H6L5 9zm3-6h8l1 1h4v2H2V4h4l1-1z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default function LivroLista() {
    const [livros, setLivros] = useState<Livro[]>([]);
    const [editoras, setEditoras] = useState<Editora[]>([]);
    const [carregado, setCarregado] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<string>('');

    const obterNomeEditora = (codEditora: number) => {
        const editoraEncontrada = editoras.find(e => e.codEditora === codEditora);
        return editoraEncontrada ? editoraEncontrada.nome : 'Desconhecida';
    };

    useEffect(() => {
        if (!carregado) {
            Promise.all([
                controleLivro.obterLivros(),
                controleEditora.obterEditoras()
            ])
                .then(([novosLivros, novasEditoras]) => {
                    setLivros(novosLivros);
                    setEditoras(novasEditoras); 
                    setCarregado(true);
                })
                .catch(error =>
                    console.error("Erro ao carregar dados:", error));
        }
    }, [carregado]);

    const excluir = (codigoLivro: string, titulo?: string) => {
        setSelectedId(codigoLivro);
        setSelectedLabel(titulo || '');
        setShowConfirm(true);
    };

    const performDelete = () => {
        if (selectedId === null) return;
        controleLivro.excluir(selectedId.toString())
            .then(() => {
                setShowConfirm(false);
                setSelectedId(null);
                setCarregado(false);
            })
            .catch(error => console.error("Erro ao excluir livro:", error));
    };

    return (
        <section className="card-section mt-4">
            <AutoBreadcrumbs />
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="page-title mb-0">Catálogo de Livros</h1>
                <Link href="/pages/LivroDados" className="btn btn-primary btn-sm btn-icon" title="Adicionar novo livro" aria-label="Adicionar novo livro">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" focusable="false">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Resumo</th>
                        <th>Editora</th>
                        <th className="col-autores">Autores</th>
                        <th className="actions-col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro) => (
                        <LinhaLivro key={livro.codigo}
                            livro={livro}
                            obterNomeEditora={obterNomeEditora}
                            excluir={(codigo) => excluir(codigo, livro.titulo)} />
                    ))}
                </tbody>
                </table>
            </div>
            <ConfirmModal open={showConfirm} title="Excluir Livro" message={`Confirma exclusão do livro "${selectedLabel}"?`} onConfirm={performDelete} onCancel={() => setShowConfirm(false)} />
        </section>
    );
}