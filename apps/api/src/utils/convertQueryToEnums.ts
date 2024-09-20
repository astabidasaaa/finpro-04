import { State } from '@prisma/client';
import type { ParsedQs } from 'qs';

export const convertQueryToEnum = (
  stateQuery: string | ParsedQs | string[] | ParsedQs[] | undefined,
): State | null => {
  if (typeof stateQuery !== 'string') {
    return null;
  }

  if (Object.values(State).includes(stateQuery as State)) {
    return stateQuery as State;
  }

  return null;
};
