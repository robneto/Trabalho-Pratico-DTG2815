const { obterEditoras, incluir, excluir, atualizar } = require('../modelo/editora-dao');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const editoras = await obterEditoras();
    res.json(editoras);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao obter editoras", erro: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const editora = req.body;
    await incluir(editora);
    res.json({ mensagem: "Editora incluído com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao incluir Editora", erro: err.message });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const { obterEditoraPorId } = require('../modelo/editora-dao');
    const resultado = await obterEditoraPorId(codigo);
    if (!resultado) {
      return res.status(404).json({ mensagem: 'Editora não encontrado' });
    }
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao obter editora", erro: err.message });
  }
});

router.delete('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const resultado = await excluir(codigo);
    
    if (resultado.deletedCount > 0) {
      res.json({ mensagem: "Editora excluído com sucesso", _id: codigo });
    } else {
      res.status(404).json({ mensagem: "Editora não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ mensagem: "Erro ao excluir editora", erro: err.message });
  }
});

router.put('/:codigo', async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const dados = req.body;
    console.log('PUT /editoras/%s chamada. body:', codigo, JSON.stringify(dados));

    if (!dados || Object.keys(dados).length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum dado informado para atualização' });
    }

    const resultado = await atualizar(codigo, dados);

    const matched = resultado.matchedCount ?? resultado.n ?? 0;
    const modified = resultado.modifiedCount ?? resultado.nModified ?? 0;

    if (matched === 0) {
      return res.status(404).json({ mensagem: 'Editora não encontrado' });
    }

    if (modified > 0) {
      res.json({ mensagem: 'Editora atualizado com sucesso', _id: codigo });
    } else {
      res.json({ mensagem: 'Nenhuma alteração necessária', _id: codigo });
    }
  } catch (err) {
    console.error('Erro em PUT /editoras/:codigo', err);
    res.status(500).json({ mensagem: 'Erro ao atualizar editora', erro: err.message });
  }
});

module.exports = router;