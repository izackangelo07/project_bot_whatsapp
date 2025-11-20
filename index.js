const express = require('express');
const app = express();
app.use(express.json());

// Defina seu token de verificação
const VERIFY_TOKEN = 'meu_token_secreto';

// Rota GET para validação do webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK VERIFICADO');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// Rota POST para receber mensagens do WhatsApp
app.post('/webhook', (req, res) => {
    console.log('Evento recebido:', JSON.stringify(req.body, null, 2));
    
    // Aqui você pode processar a mensagem, por exemplo:
    // const message = req.body.entry[0].changes[0].value.messages[0];
    // console.log('Mensagem de:', message.from, 'Conteúdo:', message.text.body);

    res.sendStatus(200);
});

// Porta dinâmica para Render ou fallback 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
