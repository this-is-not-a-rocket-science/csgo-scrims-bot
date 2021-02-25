import { Collection, Message } from 'discord.js';
import { Service } from 'typedi';
import type { Command } from '../commands';

@Service()
export class CommandService {
  commands: Collection<
    Command,
    (message: Message, args: string[]) => void
  > = new Collection();
}
