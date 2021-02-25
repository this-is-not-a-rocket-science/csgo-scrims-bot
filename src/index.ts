import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Bot } from './bot';
import Container from 'typedi';

dotenv.config();

async function start() {
  const bot = Container.get(Bot);
  await bot.start();
}

start();
