import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ControleEditoras from './controle/ControleEditoras';
import ControleLivros from './controle/ControleLivros';
import Livro from './model/Livro';

const controleEditora = new ControleEditoras();
const controleLivro = new ControleLivros();

export default function LivroDados() {
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState('');
    const [resumo, setResumo] = useState('');
    const [codEditora, setCodEditora] = useState(0);
    const [editoras, setEditoras] = useState([])
    const [autores, setAutores] = useState('');

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

    const incluir = (event) => {
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
                navigate('/livroLista');
            })
            .catch(error => console.error("Erro ao incluir livro:", error));
    };

    return (
        <main className="container mt-4">
            <h1>Inclusão de Livro</h1>
            <form onSubmit={incluir}>
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

                <button type="submit" className="btn btn-primary">Incluir Livro</button>
            </form>
        </main>
    );
}