import * as dotenv from 'dotenv';
import { Client } from 'discord.js';

dotenv.config();

async function start() {
  const client = new Client();

  client.on('message', (message) => {
    if (message.content === 'ping') {
      message.reply('pong');
    }
  });

  try {
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.error(e);
  }
}

start();
