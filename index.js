const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Token de verificação do webhook (variável de ambiente)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Access Token e Phone Number ID do WhatsApp Cloud API (variáveis de ambiente)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// GET webhook para validação
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

// POST webhook para receber mensagens
app.post('/webhook', async (req, res) => {
    res.sendStatus(200); // responder rápido ao WhatsApp

    if (req.body.entry) {
        try {
            const changes = req.body.entry[0].changes[0];
            const message = changes.value.messages?.[0];
            const from = message?.from;
            const text = message?.text?.body;

            if (from && text && WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
                console.log(`Mensagem recebida de ${from}: ${text}`);

                // Comandos simples
                let reply = 'Desculpe, não entendi.';
                if (text.toLowerCase() === 'oi') reply = 'Olá! Tudo bem?';
                if (text.toLowerCase() === 'ajuda') reply = 'Envie OI para cumprimentar ou AJUDA para instruções.';

                // Enviar resposta
                await axios.post(
                    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
                    {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: { body: reply }
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
        } catch (err) {
            console.error('Erro ao processar mensagem:', err.message);
        }
    }
});

// Porta dinâmica para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
