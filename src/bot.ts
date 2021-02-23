import { Message, Client, Collection } from 'discord.js';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { cons } from 'fp-ts/lib/ReadonlyArray';

type Command = 'help' | 'test' | 'add-user' | 'list-users';

interface User {
  name: string;
  steamUsername: string;
  steamUrl: string;
  id: string; // ?
}

export class Bot {
  client: Client;
  prefix: string = 'cs!';
  commands: Collection<
    Command,
    (message: Message, args: string[]) => void
  > = new Collection();
  users: User[] = [
    {
      name: 'test user',
      steamUsername: 'username',
      steamUrl: 'www.ru',
      id: '123123',
    },
  ];

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

  test = async (message: Message, args: string[]) => {
    message.reply('test');
  };

  addUser = async (message: Message, args: string[]) => {
    const [name, steamUrl] = args;
    this.users.push({
      name,
      steamUrl,
      steamUsername: steamUrl, // to extract
      id: steamUrl, // to extract
    });
  };

  listUsers = async (message: Message, args: string[]) => {
    message.channel.send(
      `
    \`\`\`json
      ${JSON.stringify(this.users, null, '  ')}
    \`\`\`
    `.trim()
    );
  };

  help = async (message: Message, args: string[]) => {
    try {
      const availableCommands = this.commands
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

  registerCommands() {
    this.commands.set('help', this.help);

    this.commands.set('test', this.test);
    this.commands.set('list-users', this.listUsers);
    this.commands.set('add-user', this.addUser);
  }

  onMessage = (message: Message) => {
    console.log(message.content, message.content.startsWith(this.prefix));

    if (!message.content.toLowerCase().startsWith(this.prefix.toLowerCase())) {
      return;
    }

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
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
          if (!this.commands.has(command)) {
            console.error(
              `called "cs!${command}": command "${command}" is not defined or not registered`
            );

            await this.commandFailureHandler({
              message,
              reply: `Unknown command \`${this.prefix}${command}\` Send \`cs!help\` to get the list of all available commands`,
            });
          }

          const run = this.commands.get(command);
          if (run) {
            run(message, args);
          }
        }
      )
    );
  };

  private async commandFailureHandler({
    message,
    reply,
  }: {
    message: Message;
    reply?: string;
  }) {
    await message.react(`❓`);
    if (reply) {
      await message.reply(reply);
    }
  }
}
