import { CommandHandler } from '../types';
import { commandFailureHandler } from '../utils';

export const add: CommandHandler = async (message, args) => {
  try {
    if (!args || (args && !args.length)) {
      return;
    }

    const [steamUrl] = args;
    await message.channel.send(`\`TODO: steamUrl=${steamUrl}\``);
  } catch (e) {
    await commandFailureHandler({ message });
  }
};
