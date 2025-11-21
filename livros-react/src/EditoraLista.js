import React, { useState, useEffect } from 'react';
import ControleEditoras from './controle/ControleEditoras';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

const controleEditora = new ControleEditoras();

export default function EditoraLista() {
    const [editoras, setEditoras] = useState([]);
    const [carregado, setCarregado] = useState(false);

    useEffect(() => {
        controleEditora.obterEditoras()
            .then(novasEditoras => {
                setEditoras(novasEditoras);
                setCarregado(true);
            })
            .catch(error => console.error("Erro ao obter editoras:", error));

    }, [carregado]);

    const excluir = (codigoEditora) => {
        controleEditora.excluir(codigoEditora)
            .then(() => {
                setCarregado(false);
            })
            .catch(error => console.error("Erro ao excluir editora:", error));
    };

    const editar = (codigoEditora) => {
        // Redirecionar para página de edição
        window.location.href = `/editoraEdita/${codigoEditora}`;
    };

    const LinhaEditora = ({ editora, excluir, editar }) => {
        return (
            <tr>
                <td>{editora.codEditora}</td>
                <td>{editora.nome}</td>
                <td>
                    <div className="d-flex gap-1">
                        <button onClick={() => editar(editora.codigo)} className="btn btn-primary btn-sm" title="Editar">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => excluir(editora.codigo)} className="btn btn-danger btn-sm" title="Excluir">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <main className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Catálogo de Editoras</h1>
                <Link to="/editoraDados" className="btn btn-success" title="Nova Editora">
                    <PlusCircle size={20} />
                </Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {editoras.map((editora, index) => (
                        <LinhaEditora key={index} editora={editora} excluir={excluir} editar={editar} />
                    ))}
                </tbody>
            </table>
        </main>
    );
}