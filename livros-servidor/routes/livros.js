const { obterLivros, incluir, excluir, atualizar } = require('../modelo/livro-dao');

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const livros = await obterLivros();
    res.json(livros);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao obter livros", erro: err.message });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const livro = await obterLivros ? await obterLivros() : null; 
    const { obterLivroPorId } = require('../modelo/livro-dao');
    const resultado = await obterLivroPorId(codigo);
    if (!resultado) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao obter livro", erro: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const livro = req.body;
    await incluir(livro);
    res.json({ mensagem: "Livro incluído com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao incluir livro", erro: err.message });
  }
});

router.delete('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const resultado = await excluir(codigo);
    
    if (resultado.deletedCount > 0) {
      res.json({ mensagem: "Livro excluído com sucesso", _id: codigo });
    } else {
      res.status(404).json({ mensagem: "Livro não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao excluir livro", erro: err.message });
  }
});

router.put('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const dados = req.body;
    console.log('PUT /livros/%s chamada. body:', codigo, JSON.stringify(dados));

    if (!dados || Object.keys(dados).length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum dado informado para atualização' });
    }

    const resultado = await atualizar(codigo, dados);
    const matched = resultado.matchedCount ?? resultado.n ?? 0;
    const modified = resultado.modifiedCount ?? resultado.nModified ?? 0;

    if (matched === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }

    if (modified > 0) {
      res.json({ mensagem: 'Livro atualizado com sucesso', _id: codigo });
    } else {
      res.json({ mensagem: 'Nenhuma alteração necessária', _id: codigo });
    }
  } catch (err) {
    console.error('Erro em PUT /livros/:codigo', err);
    res.status(500).json({ mensagem: 'Erro ao atualizar livro', erro: err.message });
  }
});

module.exports = router;