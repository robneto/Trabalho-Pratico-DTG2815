const Editora = require('./editora-schema');
const banco = require('./conexao');

const obterEditoras = async () => {
  return await Editora.find({});
};

const incluir = async (livro) => {
  return await Editora.create(livro);
};

const excluir = async (codigo) => {
  return await Editora.deleteOne({ _id: codigo });
};

const atualizar = async (codigo, dados) => {
  const payload = { ...dados };
  if (payload._id) delete payload._id;

  let filtro = { _id: codigo };
  if (/^\d+$/.test(String(codigo))) {
    filtro = { codEditora: Number(codigo) };
  } else if (banco.Types.ObjectId.isValid(String(codigo))) {
    filtro = { _id: codigo };
  } else {
    filtro = { _id: codigo };
  }

  return await Editora.updateOne(filtro, { $set: payload });
};

const obterEditoraPorId = async (codigo) => {
  let filtro = { _id: codigo };
  if (/^\d+$/.test(String(codigo))) {
    filtro = { codEditora: Number(codigo) };
  } else if (banco.Types.ObjectId.isValid(String(codigo))) {
    filtro = { _id: codigo };
  } else {
    filtro = { _id: codigo };
  }

  return await Editora.findOne(filtro);
};

module.exports = {
  obterEditoras,
  incluir,
  excluir,
  obterEditoraPorId,
  atualizar
};