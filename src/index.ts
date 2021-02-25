import 'reflect-metadata';
import * as dotenv from 'dotenv';
import Container from 'typedi';
import { BotService } from './services/BotService';

dotenv.config();

async function start() {
  try {
    await Container.get(BotService).start();
  } catch (e) {
    console.error('start: failed to start the bot', e);
  }
}

start();
