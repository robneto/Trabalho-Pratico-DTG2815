"use client";

import React, { useState, useEffect } from "react";
import AutoBreadcrumbs from '../../components/AutoBreadcrumbs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ControleEditoras from "../../controle/ControleEditoras";
import Editora from "../../model/Editora";
import ConfirmModal from '../../components/ConfirmModal';

const controleEditora = new ControleEditoras();

type LinhaEditoraProps = {
    editora: Editora;
    excluir: (codigo: number | string) => void;
};

const LinhaEditora: React.FC<LinhaEditoraProps> = ({ editora, excluir }) => {
    const router = useRouter();
    return (
        <tr>
            <td>{editora.codEditora}</td>
            <td>{editora.nome}</td>
            <td className="text-end">
                <button onClick={() => router.push(`/pages/EditoraDados?id=${editora.codigo}`)} className="btn btn-secondary btn-sm btn-icon me-1" title="Editar" aria-label={`Editar ${editora.nome}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" focusable="false">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <button
                    onClick={() => excluir(editora.codigo)}
                    className="btn btn-danger btn-sm btn-icon"
                    aria-label={`Excluir ${editora.nome}`} title="Excluir"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                        <path d="M3 6h18v2H3V6zm2 3h14l-1 11H6L5 9zm3-6h8l1 1h4v2H2V4h4l1-1z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default function EditoraLista() {
    const [editoras, setEditoras] = useState<Editora[]>([]);
    const [carregado, setCarregado] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<string>('');

    useEffect(() => {
        controleEditora.obterEditoras()
            .then(novasEditoras => {
                setEditoras(novasEditoras);
                setCarregado(true);
            })
            .catch(error => console.error("Erro ao obter editoras:", error));

    }, [carregado]);

    const excluir = (codigoEditora: number | string, nome?: string) => {
        // Open confirmation modal
        setSelectedId(codigoEditora);
        setSelectedLabel(nome || '');
        setShowConfirm(true);
    };

    const performDelete = () => {
        if (selectedId === null) return;
        controleEditora.excluir(selectedId)
            .then(() => {
                setShowConfirm(false);
                setSelectedId(null);
                setCarregado(false);
            })
            .catch(error => console.error("Erro ao excluir editora:", error));
    };

    return (
        <section className="card-section mt-4">
            <AutoBreadcrumbs />
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1 className="page-title mb-0">Catálogo de Editoras</h1>
                <Link href="/pages/EditoraDados" className="btn btn-primary btn-sm btn-icon" title="Adicionar nova editora" aria-label="Adicionar nova editora">
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
                        <th>Código</th>
                        <th>Nome</th>
                        <th className="actions-col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {editoras.map((editora) => (
                        <LinhaEditora key={editora.codEditora} editora={editora} excluir={(codigo) => excluir(codigo, editora.nome)} />
                    ))}
                </tbody>
                </table>
            </div>
            <ConfirmModal open={showConfirm} title="Excluir Editora" message={`Confirma exclusão da editora "${selectedLabel}"?`} onConfirm={performDelete} onCancel={() => setShowConfirm(false)} />
        </section>
    );
}