import Editora from '../model/Editora';

const baseURL = "http://localhost:3030/editoras";

class ControleEditoras {
    async obterEditoras(): Promise<Editora[]> {
        const response = await fetch(baseURL);
        const data = await response.json();
        
        return data.map((item: any) => new Editora(
            item._id,       
            item.codEditora,
            item.nome
        ));
    }

    async excluir(codigo: number | string): Promise<boolean> {
        const response = await fetch(`${baseURL}/${codigo}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        return data.ok; 
    }

    async incluir(editora: Editora): Promise<boolean> {
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

    async obter(codigo: string | number): Promise<Editora | null> {
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
                    console.warn('ControleEditoras.obter: resposta inesperada', payload);
                    return null;
                }
                const id = item._id ?? item.id ?? item.codigo ?? '';
                const codEditora = item.codEditora ?? item.cod_editora ?? item.cod ?? 0;
                const nome = item.nome ?? item.name ?? '';
                return new Editora(id, codEditora, nome);
            }

            if (response.status === 404) {
                const all = await this.obterEditoras();
                const found = all.find(e => String(e.codigo) === String(codigo) || String(e.codEditora) === String(codigo));
                if (found) return found;
                return null;
            }

            console.warn(`ControleEditoras.obter: GET ${baseURL}/${codigo} returned status ${response.status}`);
            return null;
        } catch (err) {
            console.error('Erro em ControleEditoras.obter:', err);
            return null;
        }
    }

    async atualizar(editora: Editora): Promise<boolean> {
        const editoraMongo = {
            _id: editora.codigo,
            codEditora: editora.codEditora,
            nome: editora.nome,
        };

        try {
            const response = await fetch(`${baseURL}/${editora.codigo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editoraMongo),
            });

            if (response.ok) {
                try {
                    const data = await response.json();
                    return !!data.ok;
                } catch (jsonErr) {
                    const text = await response.text();
                    console.warn('ControleEditoras.atualizar: resposta não-JSON ao PUT:', text.slice(0, 200));
                    return response.status >= 200 && response.status < 300;
                }
            }

            if (response.status === 404) {
                console.warn(`ControleEditoras.atualizar: PUT returned 404 for ${editora.codigo}, trying POST upsert`);
                const resp2 = await fetch(baseURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editoraMongo),
                });
                if (resp2.ok) {
                    try {
                        const d2 = await resp2.json();
                        return !!d2.ok;
                    } catch (e2) {
                        const t2 = await resp2.text();
                        console.warn('ControleEditoras.atualizar: resposta não-JSON ao POST fallback:', t2.slice(0, 200));
                        return resp2.status >= 200 && resp2.status < 300;
                    }
                }
                console.warn(`ControleEditoras.atualizar: POST fallback returned status ${resp2.status}`);
                return false;
            }

            const body = await response.text();
            console.warn(`ControleEditoras.atualizar: PUT ${baseURL}/${editora.codigo} returned ${response.status}:`, body.slice(0, 500));
            return false;
        } catch (err) {
            console.error('Erro em ControleEditoras.atualizar:', err);
            return false;
        }
    }
}

export default ControleEditoras;