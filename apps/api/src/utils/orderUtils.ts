
import { v4 as uuidv4 } from 'uuid';

export function generateOrderCode(): string {
  return `ORDER-${uuidv4().toUpperCase()}`;
}
