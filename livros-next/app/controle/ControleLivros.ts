import Livro from '../model/Livro';

const baseURL = "http://localhost:3030/livros";

class ControleLivros {
    async obterLivros(): Promise<Livro[]> {
        const response = await fetch(baseURL);
        const data = await response.json();

        return data.map((item: any) => new Livro(
            item._id,
            item.codEditora ?? item.cod_editora ?? item.cod ?? 0,
            item.titulo ?? item.title ?? '',
            item.resumo ?? item.summary ?? '',
            item.autores ?? item.authorList ?? []
        ));
    }

    async excluir(codigo: number | string): Promise<boolean> {
        const response = await fetch(`${baseURL}/${codigo}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data.ok;
    }

    async incluir(livro: Livro): Promise<boolean> {
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

    async obter(codigo: string | number): Promise<Livro | null> {
        try {
            const response = await fetch(`${baseURL}/${codigo}`);
            if (response.ok) {
                const payload = await response.json();
                let item: any = payload;
                if (payload && typeof payload === 'object') {
                    if (payload.data) item = payload.data;
                    else if (payload.result) item = payload.result;
                }
                if (Array.isArray(item)) item = item[0];
                if (!item) {
                    console.warn('ControleLivros.obter: resposta inesperada', payload);
                    return null;
                }
                const id = item._id ?? item.id ?? item.codigo ?? '';
                const titulo = item.titulo ?? item.title ?? '';
                const autor = item.autor ?? item.author ?? '';
                const codEditora = item.codEditora ?? item.cod_editora ?? item.cod ?? 0;
                return new Livro(id, codEditora, titulo, item.resumo ?? item.summary ?? '', item.autores ?? item.authorList ?? []);
            }

            if (response.status === 404) {
                const all = await this.obterLivros();
                const found = all.find(l => String(l.codigo) === String(codigo));
                if (found) return found;
                return null;
            }

            console.warn(`ControleLivros.obter: GET ${baseURL}/${codigo} returned status ${response.status}`);
            return null;
        } catch (err) {
            console.error('Erro em ControleLivros.obter:', err);
            return null;
        }
    }

    async atualizar(livro: Livro): Promise<boolean> {
        const livroMongo = {
            _id: livro.codigo,
            codEditora: livro.codEditora,
            titulo: livro.titulo,
            resumo: livro.resumo,
            autores: livro.autores
        };

        // Try PUT /livros/:id
        try {
            const response = await fetch(`${baseURL}/${livro.codigo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(livroMongo),
            });

            if (response.ok) {
                try {
                    const data = await response.json();
                    return !!data.ok;
                } catch (jsonErr) {
                    const text = await response.text();
                    console.warn('ControleLivros.atualizar: resposta não-JSON ao PUT:', text.slice(0, 200));
                    return response.status >= 200 && response.status < 300;
                }
            }

            if (response.status === 404) {
                console.warn(`ControleLivros.atualizar: PUT returned 404 for ${livro.codigo}, trying POST upsert`);
                const resp2 = await fetch(baseURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(livroMongo),
                });
                if (resp2.ok) {
                    try {
                        const d2 = await resp2.json();
                        return !!d2.ok;
                    } catch (e2) {
                        const t2 = await resp2.text();
                        console.warn('ControleLivros.atualizar: resposta não-JSON ao POST fallback:', t2.slice(0, 200));
                        return resp2.status >= 200 && resp2.status < 300;
                    }
                }
                console.warn(`ControleLivros.atualizar: POST fallback returned status ${resp2.status}`);
                return false;
            }

            const body = await response.text();
            console.warn(`ControleLivros.atualizar: PUT ${baseURL}/${livro.codigo} returned ${response.status}:`, body.slice(0, 500));
            return false;
        } catch (err) {
            console.error('Erro em ControleLivros.atualizar:', err);
            return false;
        }
    }
}

export default ControleLivros;