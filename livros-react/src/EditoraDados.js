import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import ControleEditoras from './controle/ControleEditoras'; 
import Editora from './model/Editora'; 

const controleEditoras = new ControleEditoras();

export default function EditoraDados() {
    const navigate = useNavigate(); 

    const [codEditora, setCodEditora] = useState('');
    const [nome, setNome] = useState('');
    
    const incluir = (event) => {
        event.preventDefault();

        const novaEditora = new Editora(
            "", 
            Number(codEditora), 
            nome 
        );

        controleEditoras.incluir(novaEditora)
            .then(() => {
                navigate('/editoraLista');
            })
            .catch(error => console.error("Erro ao incluir editora:", error));
    };

    return (
        <main className="container mt-4">
            <h1>Inclusão de Editora</h1>
            <form onSubmit={incluir}>
                <div className="mb-3">
                    <label htmlFor="codEditora" className="form-label">Código</label>
                    <input type="text" className="form-control" id="codEditora" value={codEditora} onChange={(e) => setCodEditora(e.target.value)} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary">Incluir Editora</button>
            </form>
        </main>
    );
}