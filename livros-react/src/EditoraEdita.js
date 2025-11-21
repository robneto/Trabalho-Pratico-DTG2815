import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ControleEditoras from './controle/ControleEditoras';

const controleEditoras = new ControleEditoras();

export default function EditoraEdita() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [codEditora, setCodEditora] = useState('');
    const [nome, setNome] = useState('');
    const [carregando, setCarregando] = useState(true);
    
    useEffect(() => {
        const carregarDados = async () => {
            try {
                // Carregar editoras existentes
                const editoras = await controleEditoras.obterEditoras();
                
                // Encontrar a editora específica pelo código
                const editoraExistente = editoras.find(editora => editora.codigo === id);
                
                if (editoraExistente) {
                    setCodEditora(editoraExistente.codEditora);
                    setNome(editoraExistente.nome);
                }
                
                setCarregando(false);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setCarregando(false);
            }
        };

        carregarDados();
    }, [id]);

    const salvarAlteracoes = (event) => {
        event.preventDefault();
        
        controleEditoras.excluir(id)
            .then(() => {
                const novaEditora = {
                    codEditora: codEditora,
                    nome: nome
                };
                return controleEditoras.incluir(novaEditora);
            })
            .then(() => {
                navigate('/editoraLista');
            })
            .catch(error => console.error("Erro ao salvar alterações:", error));
    };

    if (carregando) {
        return (
            <main className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mt-4">
            <h1>Edição de Editora</h1>
            <form onSubmit={salvarAlteracoes}>
                <div className="mb-3">
                    <label htmlFor="codEditora" className="form-label">Código</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="codEditora" 
                        value={codEditora} 
                        onChange={(e) => setCodEditora(e.target.value)} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="nome" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="btn btn-primary">Salvar Alteração</button>
            </form>
        </main>
    );
}