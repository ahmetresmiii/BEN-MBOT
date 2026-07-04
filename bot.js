import { Telegraf } from 'telegraf';
import express from 'express';
import fetch from 'node-fetch';

const TELEGRAM_TOKEN = '8969523700:AAHIjbru2jO8EJ3Y7A56GicjVhxI28xB9y8';
const OPENROUTER_KEY = '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';

const bot = new Telegraf(TELEGRAM_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

// Render'ın sana vereceği "https://projeniz.onrender.com" şeklindeki url
const RENDER_URL = process.env.RENDER_EXTERNAL_URL; 

const userConversations = {};
const SYSTEM_INSTRUCTION = `Sen pratik, zeki ve teknik bilgiye sahip bir asistansın. 
Gereksiz kibarlık veya uzatılmış giriş/sonuç cümleleri kullanma. 
İstenilen kodu, komutu veya bilgiyi doğrudan, en sade ve en optimize haliyle sun.`;

bot.start((ctx) => {
    userConversations[ctx.from.id] = [];
    ctx.reply('Merhaba! Render üzerinde kesintisiz çalışan yapay zeka asistanın aktif. Sorularını sorabilirsin.');
});

bot.command('clear', (ctx) => {
    userConversations[ctx.from.id] = [];
    ctx.reply('Konuşma geçmişimiz temizlendi.');
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
                temperature: 0.6
            })
        });

        if (!response.ok) throw new Error('OpenRouter API hatası.');

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        userConversations[userId].push({ role: 'user', content: userMessage });
        userConversations[userId].push({ role: 'assistant', content: aiResponse });
        if (userConversations[userId].length > 10) userConversations[userId].splice(0, 2);

        await ctx.reply(aiResponse);
    } catch (error) {
        console.error(error);
        await ctx.reply('Şu anda yanıt oluşturulamadı, lütfen tekrar dene.');
    }
});

// Render Sağlık Kontrolü Endpoint'i
app.get('/', (req, res) => res.send('Bot Status: Active'));

// Webhook Ayarı ve Sunucu Başlatma
if (RENDER_URL) {
    app.use(bot.webhookCallback(`/bot${TELEGRAM_TOKEN}`));
    bot.telegram.setWebhook(`${RENDER_URL}/bot${TELEGRAM_TOKEN}`)
        .then(() => console.log('Webhook başarıyla ayarlandı:', RENDER_URL))
        .catch((err) => console.error('Webhook ayarlanırken hata:', err));
} else {
    // Yerelde test ederken polling kullanır
    bot.launch();
    console.log('Yerel modda çalışıyor (Polling)...');
}

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda dinleniyor.`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
