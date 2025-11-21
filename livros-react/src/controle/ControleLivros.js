import Livro from '../model/Livro';

const baseURL = "http://localhost:3030/livros";

class ControleLivros {
    async obterLivros() {
        const response = await fetch(baseURL);
        const data = await response.json();
        
        return data.map(item => new Livro(
            item._id,       
            item.codEditora,
            item.titulo,
            item.resumo,
            item.autores
        ));
    }

    async excluir(codigo) {
        const response = await fetch(`${baseURL}/${codigo}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data.ok; 
    }

    async incluir(livro) {
        const livroMongo = {
            _id: null, 
            codEditora: livro.codEditora,
            titulo: livro.titulo,
            resumo: livro.resumo,
            autores: livro.autores
        };

        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livroMongo)
        });
        const data = await response.json();
        return data.ok;
    }
}

export default ControleLivros;