import { help } from './help';

export const commands = {
  help,
};

export type Command = keyof typeof commands;
