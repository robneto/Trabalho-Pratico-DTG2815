const banco = require('./conexao');

const EditoraSchema = new banco.Schema({
    _id: { type: banco.Schema.Types.ObjectId, default: () => new banco.Types.ObjectId() },
    codEditora: { type: Number },
    nome: { type: String }
});

const Editora = banco.model('Editora', EditoraSchema);

module.exports = Editora;