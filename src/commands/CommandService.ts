import { Collection, Message } from 'discord.js';
import { Service } from 'typedi';
import { Command } from './types/Command';

@Service()
export class CommandService {
  commands: Collection<
    Command,
    (message: Message, args: string[]) => void
  > = new Collection();
}
