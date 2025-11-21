const banco = require('mongoose');

const uri = 'mongodb://localhost:27017/livraria';

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

banco.connect(uri, options)
    .then(() => console.log('Conexão com o MongoDB estabelecida com sucesso.'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

module.exports = banco;