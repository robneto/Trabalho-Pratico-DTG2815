"use client";

import React, { useState, useEffect } from 'react';
import AutoBreadcrumbs from '../../components/AutoBreadcrumbs';
import { useRouter, useSearchParams } from 'next/navigation';
import ControleEditoras from '../../controle/ControleEditoras'; 
import Editora from '../../model/Editora';

const controleEditoras = new ControleEditoras();

export default function EditoraDados() {
    const navigate = useRouter(); 
    const params = useSearchParams();
    const id = params?.get('id');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [codEditora, setCodEditora] = useState('');
    const [nome, setNome] = useState('');
    const [codigoInterno, setCodigoInterno] = useState('');
    
    const incluir = (event: React.FormEvent) => {
        event.preventDefault();

        const novaEditora = new Editora(
            "", 
            Number(codEditora), 
            nome 
        );

        controleEditoras.incluir(novaEditora)
            .then(() => {
                navigate.push('/pages/EditoraLista');
            })
            .catch(error => console.error("Erro ao incluir editora:", error));
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            setLoadError(null);

            controleEditoras.obter(id)
                .then(e => {
                    if (e) {
                        setIsEdit(true);
                        setCodigoInterno(e.codigo || '');
                        setCodEditora(String(e.codEditora));
                        setNome(e.nome);
                    } else {
                        setLoadError('Editora não encontrada.');
                    }
                })
                .catch(err => {
                    console.error('Erro ao carregar editora:', err);
                    setLoadError('Erro ao carregar editora. Veja o console.');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const salvar = (event: React.FormEvent) => {
        event.preventDefault();
        const editoraAtual = new Editora(
            codigoInterno,
            Number(codEditora),
            nome
        );
        controleEditoras.atualizar(editoraAtual)
            .then(() => navigate.push('/pages/EditoraLista'))
            .catch(err => console.error('Erro ao atualizar editora:', err));
    };

    return (
        <main className="container mt-4">
            <AutoBreadcrumbs />
            <h1>{isEdit ? 'Edição de Editora' : 'Inclusão de Editora'}</h1>
            {id && loading ? (
                <p>Carregando editora...</p>
            ) : id && loadError ? (
                <div className="alert alert-warning">{loadError}</div>
            ) : (
                <form onSubmit={isEdit ? salvar : incluir}>
                <div className="mb-3">
                    <label htmlFor="codEditora" className="form-label">Código</label>
                    <input type="text" className="form-control" id="codEditora" value={codEditora} onChange={(e) => setCodEditora(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>

                    <button type="submit" className="btn btn-primary">{isEdit ? 'Salvar Alterações' : 'Incluir Editora'}</button>
                </form>
            )}
        </main>
    );
}