import { Message, Client, Collection } from 'discord.js';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

type Command = 'help' | 'test';

export class Bot {
  client: Client;
  prefix: string = 'cs!';
  commands: Collection<Command, (message: Message, args: any) => void> = new Collection();

  constructor() {
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

  test = async (message: Message, args: any) => {
    message.reply('test')
  }

  help = async (message: Message, args: any) => {
    const availableCommands = this.commands.keyArray().map(c => `${this.prefix}${c}`);
    await message.channel.send(`Here's a list of all available commands: \`${availableCommands.join(', ')}\``);
  }

  registerCommands() {
    this.commands.set('test', this.test);
    this.commands.set('help', this.help);
  }

  onMessage = (message: Message) => {
    console.log(message.content, message.content.startsWith(this.prefix));

    if (!message.content.startsWith(this.prefix)) {
      return;
    }

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);

    const commandO = O.fromNullable(args.shift()?.toLowerCase() as Command);

    pipe(
      commandO,
      O.fold(
        () => {
          console.error('Failed to extract the command from the message')
        },
        (command) => {
          if (!this.commands.has(command)) {
            console.error(`called "cs!${command}": command "${command}" is not defined or not registered`);
            message.react(`❓`);
            message.reply("send `cs!help` to get the list of all available commands");
          }

          const run = this.commands.get(command);
          if (run) {
            run(message, args);
          }
        }
      ))
  }
}
