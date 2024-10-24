const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

// Array para armazenar as carteiras
const carteiras = [];

// Rota para criar uma nova carteira
app.post('/criar-carteira', (req, res) => {
  const { nome } = req.body;
  const novaCarteira = {
    id: String(carteiras.length + 1), // ID baseado na quantidade de carteiras
    saldo: 0,
    nome: nome,
  };
  carteiras.push(novaCarteira);
  res.send(novaCarteira);
});

// Rota para consultar o saldo da carteira
app.get('/consulta-saldo/:id', (req, res) => {
  const { id } = req.params;
  const carteira = carteiras.find(c => c.id === id);
  
  if (!carteira) {
    return res.status(404).send({ error: 'Carteira não encontrada' });
  }

  res.send({ saldo: carteira.saldo });
});

// Rota para transferir saldo entre carteiras
app.post('/transferir', (req, res) => {
  const { idOrigem, idDestino, valor } = req.body;

  const carteiraOrigem = carteiras.find(c => c.id === idOrigem);
  const carteiraDestino = carteiras.find(c => c.id === idDestino);

  if (!carteiraOrigem || !carteiraDestino) {
    return res.status(404).send({ error: 'Carteira de origem ou destino não encontrada' });
  }

  if (carteiraOrigem.saldo < valor) {
    return res.status(400).send({ error: 'Saldo insuficiente na carteira de origem' });
  }

  // Realiza a transferência
  carteiraOrigem.saldo -= valor;
  carteiraDestino.saldo += valor;

  res.send({ mensagem: 'Transferência realizada com sucesso' });
});

// Rota para depositar saldo na carteira
app.post('/depositar', (req, res) => {
  const { id, valor } = req.body; // Extrai o ID e o valor do corpo da requisição

  // Verifica se o valor é um número positivo
  if (typeof valor !== 'number' || valor <= 0) {
    return res.status(400).send({ error: 'Valor deve ser um número positivo' });
  }

  // Busca a carteira pelo ID
  const carteira = carteiras.find(c => c.id === id);

  // Verifica se a carteira existe
  if (!carteira) {
    return res.status(404).send({ error: 'Carteira não encontrada' });
  }

  // Adiciona o saldo
  carteira.saldo += valor;

  // Retorna a resposta com o novo saldo
  res.send({
    mensagem: 'Depósito realizado com sucesso',
    carteira: {
      id: carteira.id,
      saldo: carteira.saldo,
    },
  });
});

// Rota GET para listar todas as carteiras (opcional, para debug)
app.get('/carteiras', (req, res) => {
  res.send(carteiras);
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
