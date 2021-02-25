import { Collection, Message } from 'discord.js';
import { Service } from 'typedi';
import type { Command } from '../commands';
import { CommandHandler } from '../commands/types';

@Service()
export class CommandService {
  commands: Collection<Command, CommandHandler> = new Collection();
}
