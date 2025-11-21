import Editora from '../model/Editora';

const baseURL = "http://localhost:3030/editoras";

class ControleEditoras {
    async obterEditoras() {
        const response = await fetch(baseURL);
        const data = await response.json();
        
        return data.map(item => new Editora(
            item._id,       
            item.codEditora,
            item.nome
        ));
    }

    async excluir(codigo) {
        const response = await fetch(`${baseURL}/${codigo}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data.ok; 
    }

    async incluir(editora) {
        const editoraMongo = {
            _id: null, 
            codEditora: editora.codEditora,
            nome: editora.nome,
        };

        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editoraMongo)
        });
        const data = await response.json();
        return data.ok;
    }
}

export default ControleEditoras;