import { fromArray } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { help } from './help';
import { add } from './add';

export const commands = {
  help,
  add,
};

export type Command = keyof typeof commands;
