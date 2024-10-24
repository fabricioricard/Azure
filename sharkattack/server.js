// server.js

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // Para receber dados em formato JSON

// Rota inicial
app.get('/', (req, res) => {
    res.send('Bem-vindo ao aplicativo de cartão de crédito cripto!');
});

// Rota para converter Nano para moeda fiduciária (exemplo)
app.post('/converter', (req, res) => {
    const { quantidadeNano } = req.body;
    // Lógica de conversão fictícia
    const taxaDeConversao = 1.5; // Exemplo de taxa
    const valorEmMoedaFiduciária = quantidadeNano * taxaDeConversao;
    res.json({ valor: valorEmMoedaFiduciária });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
