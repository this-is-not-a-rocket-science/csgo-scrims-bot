import { Message } from 'discord.js';
import Container from 'typedi';
import { config } from '../../config';
import { CommandService } from '../../services/CommandService';
import { CommandHandler } from '../types';
import { commandFailureHandler } from '../utils';

export const help: CommandHandler = async (message: Message) => {
  const { prefix } = config;
  const { commands } = Container.get(CommandService);
  try {
    const availableCommands = commands.keyArray().map((c) => `${prefix}${c}`);

    await message.channel.send(
      `Here's a list of all available commands: \`${availableCommands.join(
        ', '
      )}\``
    );
  } catch (e) {
    await commandFailureHandler({ message });
  }
};
