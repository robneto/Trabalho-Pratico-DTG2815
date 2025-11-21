export class Editora {
    codigo: string;
    codEditora: number;
    nome: string;

    constructor(codigo: string = '', codEditora: number = 0, nome: string = '') {
        this.codigo = codigo;
        this.codEditora = codEditora;
        this.nome = nome;
    }
}
