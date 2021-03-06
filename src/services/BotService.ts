import { Message, Client } from 'discord.js';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Service } from 'typedi';
import * as yargs from 'yargs';
import { CommandService } from './CommandService';
import { Command, commands } from '../commands';
import { help } from '../commands/help';
import { config } from '../config';
import { commandFailureHandler } from '../commands/utils';

@Service()
export class BotService {
  client: Client;

  constructor(public commandService: CommandService) {
    this.client = new Client();
  }

  async start() {
    try {
      this.registerCommands();

      this.client.on('message', this.onMessage);

      await this.client.login(process.env.DISCORD_TOKEN);
    } catch (e) {
      console.error('Failed to start the bot', e);
    }
  }

  registerCommands() {
    Object.entries(commands).forEach(([name, handler]) => {
      this.commandService.commands.set(name as Command, handler);
    });
  }

  onMessage = (message: Message) => {
    if (
      !message.content.toLowerCase().startsWith(config.prefix.toLowerCase())
    ) {
      return;
    }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    if (!args.length) {
      console.error(
        `extracting arguments: Failed to extract arguments from message: "${message}"`
      );

      return;
    }

    const commandO = O.fromNullable(args.shift()?.toLowerCase() as Command);

    pipe(
      commandO,
      O.fold(
        () => {
          console.error('Failed to extract the command from the message');
        },
        async (command) => {
          if (!this.commandService.commands.has(command)) {
            console.error(
              `called "cs!${command}": command "${command}" is not defined or not registered`
            );

            await commandFailureHandler({
              message,
              reply: `Unknown command \`${config.prefix}${command}\` Send \`cs!help\` to get the list of all available commands`,
            });
          }

          const run = this.commandService.commands.get(command);
          if (run) {
            run(message, args);
          }
        }
      )
    );
  };
}
