import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';

// Token ve API Key Tanımlamaları
const TELEGRAM_TOKEN = '8969523700:AAHIjbru2jO8EJ3Y7A56GicjVhxI28xB9y8';
const OPENROUTER_KEY = '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';

const bot = new Telegraf(TELEGRAM_TOKEN);

// Hafızada kullanıcı geçmişini tutmak için basit bir nesne (Her kullanıcı için ayrı geçmiş)
const userConversations = {};

// Sistem Talimatı (Net, pratik ve hızlı)
const SYSTEM_INSTRUCTION = `Sen pratik, zeki ve teknik bilgiye sahip bir asistansın. 
Gereksiz kibarlık veya uzatılmış giriş/sonuç cümleleri kullanma. 
İstenilen kodu, komutu veya bilgiyi doğrudan, en sade ve en optimize haliyle sun.`;

// /start komutu
bot.start((ctx) => {
    const userId = ctx.from.id;
    userConversations[userId] = []; // Geçmişi sıfırla
    ctx.reply('Merhaba! Ben OpenRouter tabanlı yapay zeka asistanın. Sorularını doğrudan sorabilirsin.');
});

// /clear komutu (Geçmişi temizlemek için)
bot.command('clear', (ctx) => {
    const userId = ctx.from.id;
    userConversations[userId] = [];
    ctx.reply('Konuşma geçmişimiz temizlendi.');
});

// Gelen tüm metin mesajlarını yakala
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userMessage = ctx.message.text;

    // Kullanıcının geçmişi yoksa oluştur
    if (!userConversations[userId]) {
        userConversations[userId] = [];
    }

    // Telegram'da işlem yapılıyor efekti göster (Yazıyor...)
    await ctx.sendChatAction('typing');

    // İstek geçmişini ve yeni mesajı OpenRouter formatına dönüştür
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
                model: 'openrouter/auto', // Otomatik model seçimi
                messages: messages,
                temperature: 0.6
            })
        });

        if (!response.ok) {
            throw new Error('OpenRouter API yanıt vermedi.');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Geçmişe ekle (Hafıza sınırı için son 10 mesajı tut)
        userConversations[userId].push({ role: 'user', content: userMessage });
        userConversations[userId].push({ role: 'assistant', content: aiResponse });
        if (userConversations[userId].length > 10) {
            userConversations[userId].splice(0, 2); // En eski soru-cevabı sil
        }

        // Telegram üzerinden kullanıcıya yanıtı gönder
        await ctx.reply(aiResponse);

    } catch (error) {
        console.error('Hata oluştu:', error);
        await ctx.reply('Üzgünüm, şu anda yanıt oluştururken bir hata meydana geldi.');
    }
});

// Botu başlat
bot.launch().then(() => {
    console.log('Telegram botu başarıyla çalıştırıldı!');
});

// Güvenli kapatma işlemleri
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
