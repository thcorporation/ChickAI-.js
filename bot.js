const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// Set up OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set up Discord bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!chat')) return;

    const prompt = message.content.replace('!chat', '').trim();
    if (!prompt) {
        message.reply('Please provide a prompt after `!chat`.');
        return;
    }

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
        });

        const reply = response.data.choices[0].text.trim();
        message.reply(reply || "I'm not sure how to respond to that!");
    } catch (error) {
        console.error(error);
        message.reply('Something went wrong while connecting to OpenAI.');
    }
});

// Log in to Discord
client.login(process.env.DISCORD_TOKEN);
