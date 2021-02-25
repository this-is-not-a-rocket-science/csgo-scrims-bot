import { Message } from 'discord.js';

export const commandFailureHandler = async ({
  message,
  reply,
}: {
  message: Message;
  reply?: string;
}) => {
  await message.react(`❓`);
  if (reply) {
    await message.reply(reply);
  }
};
