const Livro = require('./livro-schema');
const banco = require('./conexao');

const obterLivros = async () => {
  return await Livro.find({});
};

const incluir = async (livro) => {
  return await Livro.create(livro);
};

const excluir = async (codigo) => {
  return await Livro.deleteOne({ _id: codigo });
};

const obterLivroPorId = async (codigo) => {
  let filtro = { _id: codigo };
  if (/^\d+$/.test(String(codigo))) {
    filtro = { codEditora: Number(codigo) };
  } else if (banco.Types.ObjectId.isValid(String(codigo))) {
    filtro = { _id: codigo };
  } else {
    filtro = { _id: codigo };
  }

  return await Livro.findOne(filtro);
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

  return await Livro.updateOne(filtro, { $set: payload });
};

module.exports = {
  obterLivros,
  incluir,
  excluir,
  obterLivroPorId,
  atualizar
};