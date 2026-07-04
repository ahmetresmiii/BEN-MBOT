 import { Telegraf } from 'telegraf';
import express from 'express';
import fetch from 'node-fetch';

const TELEGRAM_TOKEN = '8969523700:AAHIjbru2jO8EJ3Y7A56GicjVhxI28xB9y8';
const OPENROUTER_KEY = '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';

const bot = new Telegraf(TELEGRAM_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;
const RENDER_URL = process.env.RENDER_EXTERNAL_URL; 

const userConversations = {};

// TAM SENİN TARZIN: Net, hızlı, lafı uzatmayan sistem komutu
const SYSTEM_INSTRUCTION = `Sen pratik, zeki ve teknik bilgiye sahip net bir asistansın. 
Gereksiz nezaket cümleleri, giriş veya sonuç paragrafları kullanma. 
İstenilen bilgiyi veya kodu doğrudan, en sade ve en hızlı şekilde ver. Lafı uzatma.`;

bot.start((ctx) => {
    userConversations[ctx.from.id] = [];
    ctx.reply('Bot aktif. Doğrudan sorunu yaz, hızlıca yanıtlayayım.');
});

bot.command('clear', (ctx) => {
    userConversations[ctx.from.id] = [];
    ctx.reply('Geçmiş temizlendi.');
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userMessage = ctx.message.text;

    if (!userConversations[userId]) userConversations[userId] = [];
    await ctx.sendChatAction('typing');

    const messages = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...userConversations[userId],
        { role: 'user', content: userMessage }
    ];

    try {
        const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com',
                'X-Title': 'Telegram Assistant Bot'
            },
            body: JSON.stringify({
                model: 'openrouter/auto',
                messages: messages,
                temperature: 0.5
            })
        });

        const data = await response.json();

        // Eğer OpenRouter API hata döndüyse detayını yakala
        if (!response.ok || data.error) {
            const errorMsg = data.error?.message || 'Bilinmeyen API Hatası';
            throw new Error(`OpenRouter Hatası: ${errorMsg}`);
        }

        const aiResponse = data.choices[0].message.content;

        userConversations[userId].push({ role: 'user', content: userMessage });
        userConversations[userId].push({ role: 'assistant', content: aiResponse });
        if (userConversations[userId].length > 10) userConversations[userId].splice(0, 2);

        await ctx.reply(aiResponse);
    } catch (error) {
        console.error(error);
        // Hatayı doğrudan Telegram'a basıyoruz ki sorunu gör
        await ctx.reply(`Hata Oluştu: ${error.message}`);
    }
});

app.get('/', (req, res) => res.send('Bot Status: Active'));

if (RENDER_URL) {
    app.use(bot.webhookCallback(`/bot${TELEGRAM_TOKEN}`));
    bot.telegram.setWebhook(`${RENDER_URL}/bot${TELEGRAM_TOKEN}`)
        .then(() => console.log('Webhook başarıyla ayarlandı:', RENDER_URL))
        .catch((err) => console.error('Webhook ayarlanırken hata:', err));
} else {
    bot.launch();
    console.log('Yerel modda çalışıyor...');
}

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda.`));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
