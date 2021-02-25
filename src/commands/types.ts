import { Message } from 'discord.js';

export type CommandHandler = (message: Message, args?: string[]) => void;
