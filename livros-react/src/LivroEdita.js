import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ControleEditoras from './controle/ControleEditoras';
import ControleLivros from './controle/ControleLivros';

const controleEditora = new ControleEditoras();
const controleLivro = new ControleLivros();

export default function LivroEdita() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [titulo, setTitulo] = useState('');
    const [resumo, setResumo] = useState('');
    const [codEditora, setCodEditora] = useState(0);
    const [editoras, setEditoras] = useState([])
    const [autores, setAutores] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                // Carregar editoras
                const listaEditoras = await controleEditora.obterEditoras();
                setEditoras(listaEditoras);

                // Carregar livro existente
                const livros = await controleLivro.obterLivros();
                const livroExistente = livros.find(livro => livro.codigo === id);
                
                if (livroExistente) {
                    setTitulo(livroExistente.titulo);
                    setResumo(livroExistente.resumo);
                    setCodEditora(livroExistente.codEditora);
                    setAutores(livroExistente.autores.join('\n'));
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
        
        const codEditoraNumber = Number(codEditora);
        
        const livroAtualizado = {
            codigo: id,
            titulo: titulo,
            resumo: resumo,
            codEditora: codEditoraNumber,
            autores: autores.split('\n').map(autor => autor.trim()).filter(Boolean)
        };

        controleLivro.excluir(id)
            .then(() => {
                const novoLivro = {
                    titulo: titulo,
                    resumo: resumo,
                    codEditora: codEditoraNumber,
                    autores: autores.split('\n').map(autor => autor.trim()).filter(Boolean)
                };
                return controleLivro.incluir(novoLivro);
            })
            .then(() => {
                navigate('/livroLista');
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
            <h1>Edição de Livro</h1>
            <form onSubmit={salvarAlteracoes}>
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="titulo" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)} 
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="resumo" className="form-label">Resumo</label>
                    <textarea 
                        className="form-control" 
                        id="resumo" 
                        rows={3} 
                        value={resumo} 
                        onChange={(e) => setResumo(e.target.value)} 
                        required
                    ></textarea>
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
                    <textarea 
                        className="form-control" 
                        id="autores" 
                        rows={3} 
                        value={autores} 
                        onChange={(e) => setAutores(e.target.value)} 
                        required
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Salvar Alteração</button>
            </form>
        </main>
    );
}