import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Bot } from './bot';

dotenv.config();

async function start() {
  const bot = new Bot();
  await bot.start();
}

start();
