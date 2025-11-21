'use client';

import React, { useState, useEffect } from 'react';
import AutoBreadcrumbs from '../../components/AutoBreadcrumbs';
import { useRouter, useSearchParams } from 'next/navigation';
import ControleEditoras from '../../controle/ControleEditoras';
import ControleLivros from '../../controle/ControleLivros';
import Livro from '../../model/Livro';
import Editora from '../../model/Editora';

const controleEditora = new ControleEditoras();
const controleLivro = new ControleLivros();

export default function LivroDados() {
    const navigate = useRouter();
    const params = useSearchParams();
    const id = params?.get('id');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [titulo, setTitulo] = useState('');
    const [resumo, setResumo] = useState('');
    const [codEditora, setCodEditora] = useState<number | string>(0);
    const [editoras, setEditoras] = useState<Editora[]>([])
    const [autores, setAutores] = useState('');
    const [codigoInterno, setCodigoInterno] = useState('');

    useEffect(() => {
        controleEditora.obterEditoras()
            .then(listaEditoras => {
                setEditoras(listaEditoras);
                if (listaEditoras.length > 0) {
                    setCodEditora(listaEditoras[0].codEditora);
                }
            })
            .catch(error => console.error("Erro ao obter editoras:", error));
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            setLoadError(null);
            controleLivro.obter(id)
                .then(l => {
                    if (l) {
                        setIsEdit(true);
                        setCodigoInterno(l.codigo || '');
                        setTitulo(l.titulo);
                        setResumo(l.resumo);
                        setCodEditora(l.codEditora);
                        setAutores((l.autores || []).join('\n'));
                    } else {
                        setLoadError('Livro não encontrado.');
                    }
                })
                .catch(err => {
                    console.error('Erro ao carregar livro:', err);
                    setLoadError('Erro ao carregar livro. Veja o console.');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const incluir = (event: React.FormEvent) => {
        event.preventDefault();
        
        const codEditoraNumber = Number(codEditora);
        
        const novoLivro = new Livro(
            "",
            codEditoraNumber,
            titulo,
            resumo,
            autores.split('\n').map(autor => autor.trim()).filter(Boolean)
        );

        controleLivro.incluir(novoLivro)
            .then(() => {
                navigate.push('/pages/LivroLista');
            })
            .catch(error => console.error("Erro ao incluir livro:", error));
    };

    const salvar = (event: React.FormEvent) => {
        event.preventDefault();
        const codEditoraNumber = Number(codEditora);
        const livroAtual = new Livro(codigoInterno, codEditoraNumber, titulo, resumo, autores.split('\n').map(a => a.trim()).filter(Boolean));
        controleLivro.atualizar(livroAtual)
            .then(() => navigate.push('/pages/LivroLista'))
            .catch(err => console.error('Erro ao atualizar livro:', err));
    };

    return (
        <main className="container mt-4">
            <AutoBreadcrumbs />
            <h1>{isEdit ? 'Edição de Livro' : 'Inclusão de Livro'}</h1>
            {id && loading ? (
                <p>Carregando livro...</p>
            ) : id && loadError ? (
                <div className="alert alert-warning">{loadError}</div>
            ) : (
                <form onSubmit={isEdit ? salvar : incluir}>
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input type="text" className="form-control" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="resumo" className="form-label">Resumo</label>
                    <textarea className="form-control" id="resumo" rows={3} value={resumo} onChange={(e) => setResumo(e.target.value)} required></textarea>
                </div>

                <div className="mb-3">
                    <label htmlFor="codEditora" className="form-label">Editora</label>
                    <select
                        className="form-select"
                        id="codEditora"
                        value={codEditora}
                        onChange={(e) => setCodEditora(e.target.value)}
                        required
                    >
                        {editoras.map((editora) => (
                            <option key={editora.codEditora} value={editora.codEditora}>
                                {editora.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="autores" className="form-label">Autores (um por linha)</label>
                    <textarea className="form-control" id="autores" rows={3} value={autores} onChange={(e) => setAutores(e.target.value)} required></textarea>
                </div>

                    <button type="submit" className="btn btn-primary">{isEdit ? 'Salvar Alterações' : 'Incluir Livro'}</button>
                </form>
            )}
        </main>
    );
}