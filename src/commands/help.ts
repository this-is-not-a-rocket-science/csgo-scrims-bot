import { Message } from 'discord.js';
import Container from 'typedi';
import { CommandService } from './CommandService';

export const help = (message: Message) => {
  const { commands } = Container.get(CommandService);
  try {
    const availableCommands = commands
      .keyArray()
      .map((c) => `${this.prefix}${c}`);

    await message.channel.send(
      `Here's a list of all available commands: \`${availableCommands.join(
        ', '
      )}\``
    );
  } catch (e) {
    await this.commandFailureHandler({ message });
  }
};
